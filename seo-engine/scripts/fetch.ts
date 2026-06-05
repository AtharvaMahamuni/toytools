/**
 * Fetches competitor pages from an existing search-results.json, WITHOUT
 * re-running SERP discovery. Use this when discovery is blocked (or you want to
 * hand-curate the competitor set): drop a search-results.json with a `results`
 * array of `{ url }` into research/raw/<slug>/, then run this.
 *
 * Usage: tsx scripts/fetch.ts <tool-slug>
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { fetchPage, closeBrowser } from './utils/scraper.js';
import { TOP_PAGES } from './utils/config.js';
import type { SearchResult } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const toolSlug = process.argv[2];
if (!toolSlug) {
  console.error('Usage: tsx scripts/fetch.ts <tool-slug>');
  process.exit(1);
}

const rawDir = join(ROOT, 'research', 'raw', toolSlug);
const searchResultsPath = join(rawDir, 'search-results.json');
if (!existsSync(searchResultsPath)) {
  console.error(`No search-results.json at research/raw/${toolSlug}/.`);
  console.error('Create one with a "results" array of { url } objects, then re-run.');
  process.exit(1);
}

const sr = JSON.parse(readFileSync(searchResultsPath, 'utf-8')) as { results?: SearchResult[] };
const urls = (sr.results ?? []).slice(0, TOP_PAGES);
if (urls.length === 0) {
  console.error('search-results.json has no results to fetch.');
  process.exit(1);
}

console.log(`\n=== SEO Fetch: ${toolSlug} (${urls.length} curated URLs) ===\n`);

let fetched = 0;
try {
  for (let i = 0; i < urls.length; i++) {
    const { url } = urls[i];
    console.log(`  [${i + 1}/${urls.length}] ${url}`);
    try {
      const html = await fetchPage(url);
      if (html) {
        writeFileSync(join(rawDir, `result-${i + 1}.html`), html);
        fetched++;
      }
    } catch (err) {
      console.warn(`  [warn] ${(err as Error).message}`);
    }
  }
} finally {
  await closeBrowser();
}

console.log(`\n=== Fetch complete ===`);
console.log(`  Pages fetched: ${fetched}/${urls.length}`);
console.log(`  Next: npm run seo:extract -- ${toolSlug}\n`);
