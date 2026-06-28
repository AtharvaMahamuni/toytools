// check-indexing — automated "which pages are indexed?" report, no Search Console UI required.
//
// Reads the canonical URL list from dist/indexnow-urls.json (the same manifest-derived set the
// sitemap + IndexNow use — run `npm run build` first), inspects each via an ExternalSignalProvider
// (Google Search Console today), and writes a bucketed coverage report plus a historical snapshot
// so indexing lag/regressions are trackable over time.
//
// Usage (from repo root):
//   npm run build && npm run check:indexing            # live run (needs GSC creds; see docs/indexing.md)
//   npm run check:indexing -- --dry-run                # validate URL list + provider config, no API calls
//   npm run check:indexing -- --limit 20               # inspect only the first N URLs (quota-friendly)

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  type CoverageBucket,
  type ExternalSignalProvider,
  type IndexationRecord,
} from '../providers/external-signals.js';
import { GoogleSearchConsoleProvider } from '../providers/google-search-console.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const reportsDir = join(repoRoot, 'quality-guardian', 'reports', 'indexing');
const urlListPath = join(repoRoot, 'dist', 'indexnow-urls.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = args.find(a => a.startsWith('--limit'));
const limit = limitArg ? Number(limitArg.split(/[=\s]/)[1] ?? args[args.indexOf(limitArg) + 1]) : Infinity;

const CONCURRENCY = 4;
const CHUNK_PAUSE_MS = 700; // ~343 req/min — safely under the 600/min GSC limit
const HISTORY_CAP = 52;     // ~1 year of weekly snapshots per URL

const BUCKETS: CoverageBucket[] = [
  'indexed', 'crawled-not-indexed', 'discovered-not-indexed', 'excluded-noindex', 'unknown', 'error',
];

interface UrlHistory {
  url: string;
  firstDiscovered: string;
  firstIndexed?: string;
  lastIndexed?: string;
  lastCrawlTime?: string;
  lastBucket: CoverageBucket;
  lastCheckedAt: string;
  history: { date: string; bucket: CoverageBucket }[];
}

function loadUrls(): string[] {
  if (!existsSync(urlListPath)) {
    console.error(`[check-indexing] ${urlListPath} not found — run \`npm run build\` first.`);
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(urlListPath, 'utf-8')) as { urls?: string[] };
  const urls = parsed.urls ?? [];
  if (urls.length === 0) {
    console.error('[check-indexing] URL list is empty.');
    process.exit(1);
  }
  return urls.slice(0, limit);
}

function pickProvider(): ExternalSignalProvider {
  // Provider registry — extend here (Bing, IndexNow status, …) as the seam grows.
  return new GoogleSearchConsoleProvider();
}

async function runChunked(urls: string[], provider: ExternalSignalProvider): Promise<IndexationRecord[]> {
  const out: IndexationRecord[] = [];
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    const chunk = urls.slice(i, i + CONCURRENCY);
    out.push(...(await Promise.all(chunk.map(u => provider.inspect(u)))));
    process.stdout.write(`\r[check-indexing] inspected ${out.length}/${urls.length}`);
    if (i + CONCURRENCY < urls.length) await new Promise(r => setTimeout(r, CHUNK_PAUSE_MS));
  }
  process.stdout.write('\n');
  return out;
}

function mergeHistory(records: IndexationRecord[], date: string): UrlHistory[] {
  const prevPath = join(reportsDir, 'latest.json');
  const prev: Record<string, UrlHistory> = {};
  if (existsSync(prevPath)) {
    try {
      const data = JSON.parse(readFileSync(prevPath, 'utf-8')) as { history?: UrlHistory[] };
      for (const h of data.history ?? []) prev[h.url] = h;
    } catch { /* ignore corrupt prior snapshot */ }
  }
  return records.map(r => {
    const prior = prev[r.url];
    const indexedNow = r.bucket === 'indexed';
    const history = [...(prior?.history ?? []), { date, bucket: r.bucket }].slice(-HISTORY_CAP);
    return {
      url: r.url,
      firstDiscovered: prior?.firstDiscovered ?? date,
      firstIndexed: prior?.firstIndexed ?? (indexedNow ? date : undefined),
      lastIndexed: indexedNow ? date : prior?.lastIndexed,
      lastCrawlTime: r.lastCrawlTime ?? prior?.lastCrawlTime,
      lastBucket: r.bucket,
      lastCheckedAt: r.checkedAt,
      history,
    };
  });
}

function renderMarkdown(counts: Record<CoverageBucket, number>, total: number, date: string, records: IndexationRecord[]): string {
  const pct = (n: number) => (total ? ((n / total) * 100).toFixed(1) : '0.0');
  const lines = [
    `# Indexing Coverage — ${date}`,
    '',
    `Source: Google Search Console URL Inspection · ${total} URLs · ${counts.indexed} indexed (${pct(counts.indexed)}%)`,
    '',
    '| Bucket | Count | % |',
    '|---|---|---|',
    ...BUCKETS.map(b => `| ${b} | ${counts[b]} | ${pct(counts[b])}% |`),
    '',
  ];
  const notIndexed = records.filter(r => r.bucket !== 'indexed');
  if (notIndexed.length) {
    lines.push('## Not indexed', '', '| URL | Bucket | Coverage state |', '|---|---|---|');
    for (const r of notIndexed) {
      lines.push(`| ${r.url} | ${r.bucket} | ${r.coverageState ?? r.error ?? '—'} |`);
    }
  }
  return lines.join('\n') + '\n';
}

async function main(): Promise<void> {
  const urls = loadUrls();
  const provider = pickProvider();
  const date = new Date().toISOString().slice(0, 10);

  console.log(`[check-indexing] ${urls.length} URLs · provider: ${provider.name} · configured: ${provider.isConfigured()}`);

  if (dryRun) {
    console.log('[check-indexing] --dry-run: not calling the API. Sample URLs:');
    urls.slice(0, 5).forEach(u => console.log(`  • ${u}`));
    if (!provider.isConfigured()) console.log(`[check-indexing] provider not configured — ${provider.configHint()}`);
    else console.log('[check-indexing] provider IS configured; a live run would inspect every URL above.');
    return;
  }

  if (!provider.isConfigured()) {
    console.error(`[check-indexing] ${provider.name} is not configured. ${provider.configHint()}`);
    process.exit(1);
  }

  const records = await runChunked(urls, provider);

  const counts = Object.fromEntries(BUCKETS.map(b => [b, 0])) as Record<CoverageBucket, number>;
  for (const r of records) counts[r.bucket]++;

  mkdirSync(reportsDir, { recursive: true });
  const history = mergeHistory(records, date);
  const summary = { generatedAt: new Date().toISOString(), siteUrl: process.env.GSC_SITE_URL, provider: provider.name, total: urls.length, counts };

  writeFileSync(join(reportsDir, 'latest.json'), JSON.stringify({ ...summary, records, history }, null, 2));
  writeFileSync(join(reportsDir, `coverage-${date}.json`), JSON.stringify({ ...summary, records }, null, 2));
  writeFileSync(join(repoRoot, 'quality-guardian', 'reports', 'indexing-coverage.md'), renderMarkdown(counts, urls.length, date, records));

  console.log(`[check-indexing] ${counts.indexed}/${urls.length} indexed. Buckets:`, counts);
  console.log(`[check-indexing] reports → quality-guardian/reports/indexing/ + indexing-coverage.md`);
}

main().catch(e => { console.error('[check-indexing] fatal:', e); process.exit(1); });
