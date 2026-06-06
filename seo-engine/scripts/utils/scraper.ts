import { chromium, type Browser, type Page } from 'playwright';
import { load } from 'cheerio';
import { getCached, setCached, getCachedData, setCachedData } from './cache.js';
import { TOP_PAGES } from './config.js';
import type { SearchResult } from '../../types/index.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(): Promise<void> {
  return sleep(800 + Math.floor(Math.random() * 700));
}

/**
 * Lazily-opened singleton browser, shared across every SERP search and page
 * fetch in a run. Entry scripts must call `closeBrowser()` in a `finally`.
 */
let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true });
  }
  return browserPromise;
}

export async function closeBrowser(): Promise<void> {
  if (browserPromise) {
    const browser = await browserPromise;
    await browser.close();
    browserPromise = null;
  }
}

type SerpEngine = { name: string; search: (page: Page, query: string) => Promise<SearchResult[]> };

/**
 * DuckDuckGo HTML endpoint via a direct GET (`?q=`), avoiding the search form —
 * the form-fill step is what trips DDG's bot challenge.
 */
async function searchDuckDuckGo(page: Page, query: string): Promise<SearchResult[]> {
  await page.goto(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
    waitUntil: 'domcontentloaded', timeout: 30000,
  });
  await randomDelay();
  const $ = load(await page.content());
  const results: SearchResult[] = [];

  $('.result__body, .result').each((_, el) => {
    const titleEl = $(el).find('.result__title a, .result__a');
    const rawUrl = $(el).find('a.result__url, .result__a').attr('href') ?? titleEl.attr('href') ?? '';
    const title = titleEl.text().trim();
    const description = $(el).find('.result__snippet').text().trim();

    // DuckDuckGo redirect URLs look like //duckduckgo.com/l/?uddg=https%3A%2F%2F...
    let url = rawUrl;
    try {
      const parsed = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl);
      const uddg = parsed.searchParams.get('uddg');
      if (uddg) url = decodeURIComponent(uddg);
    } catch { /* use raw url as-is */ }

    if (url && title && !url.includes('duckduckgo.com')) results.push({ url, title, description });
  });
  return results;
}

/** Bing HTML results — a fallback when DuckDuckGo returns nothing. */
async function searchBing(page: Page, query: string): Promise<SearchResult[]> {
  await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=en`, {
    waitUntil: 'domcontentloaded', timeout: 30000,
  });
  await randomDelay();
  const $ = load(await page.content());
  const results: SearchResult[] = [];

  $('li.b_algo').each((_, el) => {
    const a = $(el).find('h2 a').first();
    const url = a.attr('href') ?? '';
    const title = a.text().trim();
    const description = $(el).find('.b_caption p, p').first().text().trim();
    if (url && title && /^https?:\/\//.test(url) && !url.includes('bing.com')) {
      results.push({ url, title, description });
    }
  });
  return results;
}

const SERP_ENGINES: SerpEngine[] = [
  { name: 'duckduckgo', search: searchDuckDuckGo },
  { name: 'bing', search: searchBing },
];

/**
 * Fetches SERP results, trying each engine in order until one yields results.
 * Cache-first (keyed by `serp:<query>`); empty result sets are not cached so a
 * blocked run doesn't poison the cache. Returns up to TOP_PAGES organic results.
 */
export async function fetchSerpResults(query: string): Promise<SearchResult[]> {
  const cacheKey = `serp:${query}`;
  const cached = getCachedData<SearchResult[]>(cacheKey);
  if (cached) {
    console.log(`  [cache] serp "${query}"`);
    return cached;
  }

  const browser = await getBrowser();
  let results: SearchResult[] = [];

  for (const engine of SERP_ENGINES) {
    const context = await browser.newContext({ userAgent: UA });
    const page = await context.newPage();
    try {
      results = await engine.search(page, query);
      if (results.length > 0) {
        console.log(`  [${engine.name}] ${results.length} results`);
        break;
      }
      console.log(`  [${engine.name}] 0 results — trying next engine`);
    } catch (err) {
      console.warn(`  [${engine.name}] failed: ${(err as Error).message}`);
    } finally {
      await context.close();
    }
  }

  const top = results.slice(0, TOP_PAGES);
  if (top.length > 0) setCachedData(cacheKey, top);
  return top;
}

/**
 * Fetches a URL that returns JSON (e.g. Reddit's `*.json` endpoints) and parses
 * it. Navigates via the shared browser so it shares the same UA/network path as
 * page fetches. Returns null on any failure (block, rate-limit, non-JSON) so
 * callers can fall back gracefully. Not cached here — callers cache the parsed,
 * normalized result.
 */
export async function fetchJson<T = unknown>(url: string): Promise<T | null> {
  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: UA });
  const page = await context.newPage();

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await randomDelay();
    if (!response || !response.ok()) {
      console.warn(`  [warn] JSON fetch ${url}: HTTP ${response?.status() ?? 'no response'}`);
      return null;
    }
    // Read the raw response body rather than document text — Reddit returns the
    // JSON as the page body, which the browser may wrap in <pre>.
    const text = await response.text();
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn(`  [warn] JSON fetch ${url}: ${(err as Error).message}`);
    return null;
  } finally {
    await context.close();
  }
}

/**
 * Fetches a page's HTML. Checks cache first; if miss, fetches via the shared
 * browser and caches.
 */
export async function fetchPage(url: string): Promise<string> {
  const cached = getCached(url);
  if (cached) {
    console.log(`  [cache] ${url}`);
    return cached.html;
  }

  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: UA });
  const page = await context.newPage();

  let html = '';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await randomDelay();
    html = await page.content();
    setCached(url, html);
    console.log(`  [fetch] ${url}`);
  } catch (err) {
    console.warn(`  [warn] Failed to fetch ${url}: ${(err as Error).message}`);
  } finally {
    await context.close();
  }

  return html;
}
