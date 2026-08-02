// Per-page critical-path budget — the standing performance contract for every page on the site.
//
// Runs on dist/ after `astro build` (it is the last step of `npm run build`). It reports what each
// page actually costs a visitor and fails the build when any page exceeds its budget, so a new tool
// cannot quietly reintroduce the two regressions documented in
// docs/analysis/2026-07-31-critical-path-performance.md:
//
//   1. render-blocking CSS creeping back up (a route-level glob hoisting other tools' stylesheets),
//   2. the JS bundle growing back into an every-page monolith (a static engine import in the runtime).
//
// Accuracy note: this resolves the LAZY engine chunk a page really fetches, rather than assuming
// either "none" or "all". The runtime's loader map compiles to
// `"<engineId>":()=>o(()=>import("./<chunk>.js"), __vite__mapDeps([...]))`, so the engine ids in a
// page's <meta name="tt-engines"> pick out exactly the chunks (and their dep lists) that page pulls.
// Anything else reachable only through a different engine's import() is correctly NOT counted.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(repoRoot, 'dist');

/** Budgets in gzipped KB — what a visitor actually downloads. */
interface Budget {
  /** Render-blocking <link rel="stylesheet"> count. */
  sheets: number;
  /** Render-blocking CSS, gzipped KB. */
  cssKb: number;
  /** All JS the page fetches on load (entry + static deps + its engine chunk), gzipped KB. */
  jsKb: number;
  /** HTML document, gzipped KB. */
  htmlKb: number;
  /** Everything above. */
  totalKb: number;
}

// Headroom over the 2026-07-31 measurements is deliberate but not generous: enough that ordinary
// content growth does not trip it, tight enough that a structural regression does. Raising a number
// here is a decision to spend a visitor's bandwidth — justify it in the PR, do not nudge it.
//
// Worst observed at the time these were set (gzipped): tool 51.0K total / 19.9K JS / 11.2K CSS /
// 25.9K HTML (tool HTML median 18.6K), guide 28.4K, category 19.0K.
const BUDGETS: Record<string, Budget> = {
  tool: { sheets: 6, cssKb: 16, jsKb: 24, htmlKb: 34, totalKb: 60 },
  guide: { sheets: 4, cssKb: 13, jsKb: 8, htmlKb: 26, totalKb: 42 },
  category: { sheets: 4, cssKb: 12, jsKb: 8, htmlKb: 26, totalKb: 40 },
  page: { sheets: 4, cssKb: 12, jsKb: 12, htmlKb: 30, totalKb: 48 },
};

// Named exceptions. A page lands here only when its weight is inherent to what it is, never to
// silence a regression — and it still gets a ceiling so it cannot grow unbounded.
const EXCEPTIONS: Record<string, { budget: Budget; why: string }> = {
  architecture: {
    // KNOWN DEBT, tracked in docs/analysis/2026-07-31-critical-path-performance.md: the interactive
    // Mermaid map pulls mermaid + cytoscape (~145 KB gz). It is one internal diagnostic page, so it
    // was left alone rather than widening the site-wide budget. The fix, if it ever matters, is to
    // lazy-load the renderer on viewport/interaction instead of at load.
    budget: { sheets: 4, cssKb: 12, jsKb: 160, htmlKb: 30, totalKb: 190 },
    why: 'renders the interactive Mermaid architecture map (mermaid + cytoscape)',
  },
};

// Assets fetched on a USER INTERACTION, never at load. These are invisible to the per-page
// measurement above (they are not <script src> tags and not engine chunks named in tt-engines),
// so without this they would be an unmeasured way to add weight to the site. They are kept out of
// the per-page totals on purpose: counting a byte the page never fetches at load would make the
// critical-path table mean something else. They get their own ceiling instead.
//
// A missing asset is a failure, not a pass: a rename would otherwise silently disable the check.
const INTERACTION_ASSETS: { label: string; match: RegExp | string; maxKb: number; why: string }[] = [
  {
    // Measured 7.9K gz at 114 tools (2026-08-03). The ceiling leaves room for roughly 40 more
    // tools before it needs revisiting. Two payload experiments are already spent: interning
    // categories and segments saved 0.4K and is in; interning the search terms made it 2.3K
    // WORSE, because only 990 of 1191 terms are unique and integer ids defeat gzip's substring
    // matching. If this trips, shrink what each tool contributes before touching the number.
    label: 'search index',
    match: 'search-index.json',
    maxKb: 12,
    why: 'the catalog the palette, /search/ and /404/ fetch on first use',
  },
];

const kb = (bytes: number) => bytes / 1024;
const gz = (buf: Buffer) => gzipSync(buf).length;

/** Locate one interaction asset in dist/ (root for exact names, _assets/ for hashed chunks). */
function findAsset(match: RegExp | string): string | null {
  if (typeof match === 'string') {
    const direct = join(DIST, match);
    return existsSync(direct) ? direct : null;
  }
  const assetDir = join(DIST, '_assets');
  if (!existsSync(assetDir)) return null;
  const hit = readdirSync(assetDir).find((name) => match.test(name));
  return hit ? join(assetDir, hit) : null;
}

function pageKind(rel: string): keyof typeof BUDGETS | null {
  if (rel.startsWith('tool/')) return 'tool';
  if (rel.startsWith('guide/')) return 'guide';
  if (rel.startsWith('category/')) return 'category';
  // Language stubs, sitemaps and redirect shells are not part of the contract.
  if (/^[a-z]{2}(-[a-z]{2})?\//.test(rel)) return null;
  return 'page';
}

/** Every index.html under dist/, as dist-relative directory paths. */
function allPages(dir = DIST, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('~')) continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) allPages(abs, out);
    else if (entry.name === 'index.html') out.push(relative(DIST, dir) || '.');
  }
  return out;
}

const assetCache = new Map<string, Buffer | null>();
function asset(href: string): Buffer | null {
  const clean = href.split('?')[0]!;
  if (assetCache.has(clean)) return assetCache.get(clean)!;
  const abs = join(DIST, clean.replace(/^\//, ''));
  const buf = existsSync(abs) && statSync(abs).isFile() ? readFileSync(abs) : null;
  assetCache.set(clean, buf);
  return buf;
}

/**
 * Collect a JS chunk plus everything it pulls in eagerly: its static imports, and the lazy chunks
 * this page genuinely resolves at runtime, with their dep lists.
 *
 * `lazyKeys` are the map keys to follow — engine ids from <meta name="tt-engines"> for the runtime's
 * ENGINE_LOADERS, and "./simulations/<id>.ts" for SimulationWidget's import.meta.glob. Both compile
 * to the same shape, `<key>:()=>X(()=>import("./chunk.js"), __vite__mapDeps([...]))`, so one
 * resolver covers both. Chunks reachable only under a key this page did not ask for are correctly
 * left out.
 */
function collectJs(entryHrefs: string[], lazyKeys: string[]): Set<string> {
  const seen = new Set<string>();
  const walk = (href: string): void => {
    if (seen.has(href)) return;
    const buf = asset(href);
    if (!buf) return;
    seen.add(href);
    const src = buf.toString();
    const dir = dirname(href);
    const rel = (p: string) => resolve('/', dir, p).replace(/^\/+/, '/');

    // Static imports — always fetched with the chunk.
    for (const m of src.matchAll(/from\s*"(\.[^"]+\.js)"/g)) walk(rel(m[1]!));
    for (const m of src.matchAll(/import\s*"(\.[^"]+\.js)"/g)) walk(rel(m[1]!));

    // Vite's dep table, used to resolve __vite__mapDeps indices below.
    const fileDeps = [...src.matchAll(/const __vite__fileDeps=\[([^\]]*)\]/g)]
      .flatMap((m) => [...m[1]!.matchAll(/"([^"]+)"/g)].map((d) => d[1]!));

    // Lazy chunks: only under the keys this page actually resolves.
    for (const key of lazyKeys) {
      const pattern = new RegExp(
        `["']?${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}["']?\\s*:\\s*\\(\\)\\s*=>\\s*` +
        `\\w*\\(?\\s*\\(\\)\\s*=>\\s*import\\("([^"]+)"\\)\\s*,?\\s*` +
        `(?:__vite__mapDeps\\(\\[([\\d,\\s]*)\\]\\)|\\[\\])?`,
      );
      const hit = src.match(pattern);
      if (!hit) continue;
      walk(rel(hit[1]!));
      for (const idx of (hit[2] ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
        const dep = fileDeps[Number(idx)];
        if (dep) walk(rel(dep));
      }
    }
  };
  entryHrefs.forEach(walk);
  return seen;
}

interface Measured {
  rel: string;
  kind: keyof typeof BUDGETS;
  sheets: number;
  cssGz: number;
  jsGz: number;
  htmlGz: number;
  totalGz: number;
  engines: string[];
}

function measure(rel: string): Measured | null {
  const kind = pageKind(rel);
  if (!kind) return null;
  const htmlBuf = readFileSync(join(DIST, rel, 'index.html'));
  const html = htmlBuf.toString();
  // Redirect shells carry no widget and are not a real page load.
  if (/<meta http-equiv="refresh"/.test(html)) return null;

  const sheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]!);
  let cssGz = 0;
  for (const href of sheets) {
    const buf = asset(href);
    if (buf) cssGz += gz(buf);
  }

  const engines = (html.match(/<meta name="tt-engines" content="([^"]*)"/)?.[1] ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  // Simulation pages additionally lazy-load exactly one model, keyed by the widget's data attribute.
  const simIds = [...html.matchAll(/data-simulation-id="([^"]+)"/g)]
    .map((m) => `./simulations/${m[1]}.ts`);

  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]!);
  let jsGz = 0;
  for (const href of collectJs(scripts, [...engines, ...simIds])) {
    const buf = asset(href);
    if (buf) jsGz += gz(buf);
  }

  const htmlGz = gz(htmlBuf);
  return { rel, kind, sheets: sheets.length, cssGz, jsGz, htmlGz, totalGz: cssGz + jsGz + htmlGz, engines };
}

// ── Run ────────────────────────────────────────────────────────────────────────────────────────
if (!existsSync(DIST)) {
  console.error('[check-budget] dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const measured = allPages().map(measure).filter((m): m is Measured => m !== null);
const failures: string[] = [];

for (const m of measured) {
  const b = EXCEPTIONS[m.rel]?.budget ?? BUDGETS[m.kind]!;
  const over = (label: string, actual: number, limit: number, unit: string) =>
    failures.push(
      `/${m.rel}/ (${m.kind}) ${label} ${actual.toFixed(1)}${unit} exceeds ${limit}${unit}` +
      (m.engines.length ? ` [engines: ${m.engines.join(',')}]` : ''),
    );
  if (m.sheets > b.sheets) over('render-blocking stylesheets', m.sheets, b.sheets, '');
  if (kb(m.cssGz) > b.cssKb) over('CSS', kb(m.cssGz), b.cssKb, 'KB gz');
  if (kb(m.jsGz) > b.jsKb) over('JS', kb(m.jsGz), b.jsKb, 'KB gz');
  if (kb(m.htmlGz) > b.htmlKb) over('HTML', kb(m.htmlGz), b.htmlKb, 'KB gz');
  if (kb(m.totalGz) > b.totalKb) over('TOTAL', kb(m.totalGz), b.totalKb, 'KB gz');
}

// Interaction-loaded assets — measured separately, never folded into the per-page totals.
const interaction = INTERACTION_ASSETS.map((asset) => {
  const path = findAsset(asset.match);
  if (!path) {
    failures.push(
      `interaction asset "${asset.label}" not found in dist/ — it was renamed or is no longer built, ` +
      'so its ceiling is silently unenforced. Fix the matcher in INTERACTION_ASSETS.',
    );
    return { ...asset, gzBytes: null as number | null };
  }
  const gzBytes = gz(readFileSync(path));
  if (kb(gzBytes) > asset.maxKb) {
    failures.push(
      `interaction asset "${asset.label}" ${kb(gzBytes).toFixed(1)}KB gz exceeds ${asset.maxKb}KB gz`,
    );
  }
  return { ...asset, gzBytes };
});

// Worst page per kind — the number that matters, and the one to quote when changing a budget.
const kinds = [...new Set(measured.map((m) => m.kind))].sort();
console.log('\n[check-budget] worst page per kind (gzipped):\n');
console.log('  kind      n     sheets  css     js      html    TOTAL   budget  worst page');
for (const kind of kinds) {
  // Exceptions have their own ceiling; showing them here would hide the real worst normal page.
  const group = measured.filter((m) => m.kind === kind && !EXCEPTIONS[m.rel]);
  if (group.length === 0) continue;
  const worst = group.reduce((a, m) => (m.totalGz > a.totalGz ? m : a));
  const b = BUDGETS[kind]!;
  console.log(
    `  ${kind.padEnd(9)} ${String(group.length).padEnd(5)} ` +
    `${String(worst.sheets).padEnd(7)} ${(kb(worst.cssGz).toFixed(1) + 'K').padEnd(7)} ` +
    `${(kb(worst.jsGz).toFixed(1) + 'K').padEnd(7)} ${(kb(worst.htmlGz).toFixed(1) + 'K').padEnd(7)} ` +
    `${(kb(worst.totalGz).toFixed(1) + 'K').padEnd(7)} ${(b.totalKb + 'K').padEnd(7)} /${worst.rel}/`,
  );
}

if (interaction.length > 0) {
  console.log('\n  loaded on interaction (not on the critical path, capped separately):');
  for (const a of interaction) {
    const size = a.gzBytes === null ? 'MISSING' : `${kb(a.gzBytes).toFixed(1)}K of ${a.maxKb}K`;
    console.log(`    ${a.label.padEnd(16)} ${size.padEnd(16)} ${a.why}`);
  }
}

if (failures.length > 0) {
  console.error('\n[check-budget] Over budget:\n');
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  console.error(
    `\n${failures.length} budget violation(s). See docs/analysis/2026-07-31-critical-path-performance.md.\n` +
    'Usually this means a route pulled in stylesheets or an engine it does not use — fix the cause,\n' +
    'do not raise the budget without saying why in the PR.\n',
  );
  process.exit(1);
}

for (const [rel, ex] of Object.entries(EXCEPTIONS)) {
  const m = measured.find((x) => x.rel === rel);
  if (m) console.log(`  (exception) /${rel}/ ${kb(m.totalGz).toFixed(1)}K of ${ex.budget.totalKb}K — ${ex.why}`);
}

console.log(`\n[check-budget] OK — ${measured.length} pages within budget.\n`);

// `npx tsx scripts/check-budget.ts <path...>` prints just those pages — handy for cross-checking
// against a real browser trace when changing how chunks are resolved.
if (process.argv.length > 2) {
  console.log('\n[check-budget] requested pages:');
  for (const want of process.argv.slice(2)) {
    const m = measured.find((x) => x.rel === want.replace(/^\/|\/$/g, ''));
    if (!m) { console.log(`  ? ${want} not measured`); continue; }
    console.log(
      `  /${m.rel}/ sheets=${m.sheets} css=${kb(m.cssGz).toFixed(1)}K js=${kb(m.jsGz).toFixed(1)}K ` +
      `html=${kb(m.htmlGz).toFixed(1)}K total=${kb(m.totalGz).toFixed(1)}K engines=[${m.engines.join(',')}]`,
    );
  }
}
