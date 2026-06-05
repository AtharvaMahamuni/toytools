import { chromium, type Browser } from 'playwright';
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

/**
 * Fetches SERP results from DuckDuckGo HTML endpoint (no JS bot detection).
 * Cache-first (keyed by `serp:<query>`). Returns up to TOP_PAGES organic results.
 */
export async function fetchSerpResults(query: string): Promise<SearchResult[]> {
  const cacheKey = `serp:${query}`;
  const cached = getCachedData<SearchResult[]>(cacheKey);
  if (cached) {
    console.log(`  [cache] serp "${query}"`);
    return cached;
  }

  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: UA });
  const page = await context.newPage();

  const results: SearchResult[] = [];

  try {
    // DuckDuckGo HTML endpoint — POST form with q= param
    await page.goto('https://html.duckduckgo.com/html/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.fill('input[name="q"]', query);
    await randomDelay();
    await page.keyboard.press('Enter');
    await page.waitForLoadState('domcontentloaded');
    await randomDelay();

    const html = await page.content();
    const $ = load(html);

    // DuckDuckGo HTML result selectors
    $('.result__body, .result').each((_, el) => {
      const titleEl = $(el).find('.result__title a, .result__a');
      const snippetEl = $(el).find('.result__snippet');
      const linkEl = $(el).find('a.result__url, .result__a');

      const rawUrl = linkEl.attr('href') ?? titleEl.attr('href') ?? '';
      const title = titleEl.text().trim();
      const description = snippetEl.text().trim();

      // DuckDuckGo redirect URLs look like //duckduckgo.com/l/?uddg=https%3A%2F%2F...
      let url = rawUrl;
      try {
        const parsed = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl);
        const uddg = parsed.searchParams.get('uddg');
        if (uddg) url = decodeURIComponent(uddg);
      } catch {
        // use raw url as-is
      }

      if (url && title && !url.includes('duckduckgo.com')) {
        results.push({ url, title, description });
      }
    });
  } finally {
    await context.close();
  }

  const top = results.slice(0, TOP_PAGES);
  setCachedData(cacheKey, top);
  return top;
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
