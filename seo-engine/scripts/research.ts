/**
 * Step 1-3: Generate search queries, collect SERP results, fetch competitor HTML.
 * Usage: tsx scripts/research.ts <tool-slug>
 */

import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateQueries } from './utils/queries.js';
import { fetchSerpResults, fetchPage, closeBrowser } from './utils/scraper.js';
import { generateRedditQueries, collectRedditPosts } from './reddit.js';
import { TOP_PAGES } from './utils/config.js';
import type { SearchResult, RedditPost } from '../types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const toolSlug = process.argv[2];
if (!toolSlug) {
  console.error('Usage: tsx scripts/research.ts <tool-slug>');
  console.error('Example: tsx scripts/research.ts base64-encoder-decoder');
  process.exit(1);
}

console.log(`\n=== SEO Research: ${toolSlug} ===\n`);

// Step 1: Generate queries
const queries = generateQueries(toolSlug);
console.log(`[1/4] Generated ${queries.length} search queries:`);
queries.forEach(q => console.log(`  - "${q}"`));

// Step 2: Collect SERP results
console.log('\n[2/4] Collecting SERP results...');
const allResults: SearchResult[] = [];
const seenUrls = new Set<string>();

for (const query of queries) {
  console.log(`\n  Searching: "${query}"`);
  try {
    const results = await fetchSerpResults(query);
    console.log(`  Found ${results.length} results`);
    for (const r of results) {
      if (!seenUrls.has(r.url)) {
        seenUrls.add(r.url);
        allResults.push(r);
      }
    }
  } catch (err) {
    console.warn(`  [warn] SERP search failed for "${query}": ${(err as Error).message}`);
  }
}

console.log(`\n  Total unique URLs: ${allResults.length}`);

// Write search results
const rawDir = join(ROOT, 'research', 'raw', toolSlug);
mkdirSync(rawDir, { recursive: true });
writeFileSync(
  join(rawDir, 'search-results.json'),
  JSON.stringify({ tool: toolSlug, queries, results: allResults, collectedAt: new Date().toISOString() }, null, 2)
);
console.log(`  Wrote: research/raw/${toolSlug}/search-results.json`);

// Step 3: Fetch competitor pages (top 10)
console.log('\n[3/4] Fetching competitor pages...');
const topUrls = allResults.slice(0, TOP_PAGES);
let fetched = 0;

for (let i = 0; i < topUrls.length; i++) {
  const { url } = topUrls[i];
  console.log(`\n  [${i + 1}/${topUrls.length}] ${url}`);
  try {
    const html = await fetchPage(url);
    if (html) {
      const filename = `result-${i + 1}.html`;
      writeFileSync(join(rawDir, filename), html);
      console.log(`  Saved: research/raw/${toolSlug}/${filename}`);
      fetched++;
    }
  } catch (err) {
    console.warn(`  [warn] Failed: ${(err as Error).message}`);
  }
}

// Step 4: Reddit Intelligence — collect post titles for intent discovery.
// Non-fatal by design: a blocked/rate-limited Reddit run must never break
// competitor research. Signals are extracted later in seo:extract.
console.log('\n[4/4] Reddit intelligence (collecting posts)...');
let redditPosts: RedditPost[] = [];
let redditSource: 'json' | 'serp' = 'json';
const redditQueries = generateRedditQueries(toolSlug);
try {
  redditPosts = await collectRedditPosts(toolSlug);
  // SERP fallback leaves engagement undefined on every post; use that to label source.
  redditSource = redditPosts.length > 0 && redditPosts.every(p => p.score === undefined) ? 'serp' : 'json';
  const redditDir = join(ROOT, 'research', 'reddit');
  mkdirSync(redditDir, { recursive: true });
  writeFileSync(
    join(redditDir, `${toolSlug}-posts.json`),
    JSON.stringify(
      { tool: toolSlug, queries: redditQueries, source: redditSource, posts: redditPosts, collectedAt: new Date().toISOString() },
      null,
      2,
    ),
  );
  console.log(`  Collected ${redditPosts.length} posts (${redditSource}) → research/reddit/${toolSlug}-posts.json`);
} catch (err) {
  console.warn(`  [warn] Reddit collection failed (non-fatal): ${(err as Error).message}`);
}

await closeBrowser();

console.log(`\n=== Research complete ===`);
console.log(`  Queries: ${queries.length}`);
console.log(`  URLs found: ${allResults.length}`);
console.log(`  Pages fetched: ${fetched}`);
console.log(`  Reddit posts: ${redditPosts.length}`);
console.log(`  Output: research/raw/${toolSlug}/\n`);
