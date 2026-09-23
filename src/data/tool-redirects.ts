// Tool URL redirects — SEO migration shim.
//
// Every entry is a public tool URL that once existed and no longer does. Each one serves a
// redirect stub (meta-refresh + canonical → the current tool page) instead of a 404, which is
// what preserves link equity: GitHub Pages answers an unmatched path with the noindex 404.html,
// and that is what Search Console reports as "noindex detected in robots meta tag".
//
// GitHub Pages cannot emit HTTP 301; these stubs are the permanent-redirect equivalent for
// crawl hygiene (meta-refresh 0 + rel=canonical + noindex, trailing slash always).
//
// Five migrations are recorded here.
//
// 1. Segment rename (commit 45f4f9f): the Developer category's URL segment became
//    `developer` → `developer-utilities`, moving every developer tool from
//    `/tool/developer/{slug}/` to `/tool/developer-utilities/{slug}/`. The list is exactly the
//    developer tools that existed at the time; tools added afterwards never had a
//    `/tool/developer/` URL and must NOT appear here.
//
// 2. Simulation slug intent rename (2026-08-04): the physics and applied-math simulators were
//    named after what they are (`*-simulator`, `*-explorer`) rather than what people search for,
//    so they were renamed to calculator/solver intent. The segment is unchanged; only the slug
//    moved. See docs/analysis/2026-08-03-text-cluster-ranking-factors.md, factor 1.
//
// 3. Case Converter deletion (commit 4f74abc, 2026-06-07): the tool was split into seven case
//    tools. `/tool/text/case-converter/` existed only from the `/tool/` rename that afternoon
//    until the split. Title Case Converter is the single best target (the old description was
//    "uppercase, lowercase, title case, and more").
//
// 4. Plural prefix. From 9525024 (2026-06-04) until 901fe85 (2026-06-07) the routes were
//    `/tools/{segment}/{slug}/` and `/categories/{slug}/`, and `@astrojs/sitemap` listed exactly
//    those prefixes. The rename to `/tool/` and `/category/` added no redirects. The first-day
//    single-segment `/tools/{slug}/` routes (b84252e, 2026-06-03) are in the same list.
//
// 5. Crawl hygiene (SEO Phase 0, 2026-09-23): every live tool also gets a `/tools/{segment}/{slug}/`
//    stub → its canonical `/tool/...` URL. There is no intentional dual tree; GSC still showed
//    keep-screen-awake and pomodoro under both prefixes, and niche winners must not split signals.
//    Historical extras (developer segment under plural, case-converter, first-day single-segment)
//    stay in the list alongside the derived live set.
//
// Adding an entry is how a URL is allowed to change. Never delete an old URL silently.
// These stubs are intentionally noindex and in no sitemap.

import { tools } from './registry';
import { categories } from './categories';

export interface ToolRedirect {
  /** Historical path under /tool/ or /tools/, e.g. 'developer/url-encoder-decoder'. */
  oldPath: string;
  /** Tool that now hosts the content at its current (renamed-segment) URL. */
  toolSlug: string;
}

export interface CategoryRedirect {
  /** Historical path under /category/, e.g. 'developer-tools'. */
  oldSlug: string;
  /** Current category slug the old URL should redirect to. */
  categorySlug: string;
}

// The same rename also changed the category slug `developer-tools` → `developer-utilities`,
// so the previously-indexed `/category/developer-tools/` URL now 404s. Same redirect-stub
// treatment. (The other three categories kept their slugs under /category/.)
// The plural `/categories/` URLs are a separate list further down: all four categories that
// the pre-2026-06-07 sitemap published, including the three whose slug did not change.
export const categoryRedirects: CategoryRedirect[] = [
  { oldSlug: 'developer-tools', categorySlug: 'developer-utilities' },
];

export const toolRedirects: ToolRedirect[] = [
  { oldPath: 'developer/base64-encoder-decoder',      toolSlug: 'base64-encoder-decoder' },
  { oldPath: 'developer/html-entity-encoder-decoder', toolSlug: 'html-entity-encoder-decoder' },
  { oldPath: 'developer/json-formatter',              toolSlug: 'json-formatter' },
  { oldPath: 'developer/json-minifier',               toolSlug: 'json-minifier' },
  { oldPath: 'developer/json-validator',              toolSlug: 'json-validator' },
  { oldPath: 'developer/md5-hash-generator',          toolSlug: 'md5-hash-generator' },
  { oldPath: 'developer/sha1-hash-generator',         toolSlug: 'sha1-hash-generator' },
  { oldPath: 'developer/sha256-hash-generator',       toolSlug: 'sha256-hash-generator' },
  { oldPath: 'developer/url-encoder-decoder',         toolSlug: 'url-encoder-decoder' },

  // Simulation slug intent rename — same segment, new slug.
  { oldPath: 'physics/projectile-motion-simulator',  toolSlug: 'projectile-motion-calculator' },
  { oldPath: 'physics/wave-speed-simulator',         toolSlug: 'wave-speed-calculator' },
  { oldPath: 'physics/frequency-period-simulator',   toolSlug: 'frequency-period-calculator' },
  { oldPath: 'physics/pendulum-simulator',           toolSlug: 'pendulum-period-calculator' },
  { oldPath: 'physics/heat-transfer-simulator',      toolSlug: 'heat-transfer-calculator' },
  { oldPath: 'physics/ohms-law-simulator',           toolSlug: 'ohms-law-calculator' },
  { oldPath: 'physics/shm-spring-simulator',         toolSlug: 'simple-harmonic-motion-calculator' },
  { oldPath: 'physics/ideal-gas-law-simulator',      toolSlug: 'ideal-gas-law-calculator' },
  { oldPath: 'physics/momentum-collision-simulator', toolSlug: 'momentum-collision-calculator' },
  { oldPath: 'physics/inclined-plane-simulator',     toolSlug: 'inclined-plane-calculator' },
  { oldPath: 'physics/doppler-effect-simulator',     toolSlug: 'doppler-effect-calculator' },
  { oldPath: 'math/unit-circle-explorer',            toolSlug: 'unit-circle-calculator' },
  { oldPath: 'math/quadratic-equation-explorer',     toolSlug: 'quadratic-equation-solver' },
  { oldPath: 'math/probability-simulator',           toolSlug: 'probability-calculator' },

  // Case Converter split. See migration 3 above.
  { oldPath: 'text/case-converter',                  toolSlug: 'title-case-converter' },
];

// Historical `/tools/...` paths that are NOT `{liveSegment}/{liveSlug}` (segment rename,
// slug rename, or first-day single-segment). Live tools are merged in below.
const historicalToolsPrefixExtras: ToolRedirect[] = [
  // Developer segment under the plural prefix (same nine tools as migration 1).
  { oldPath: 'developer/base64-encoder-decoder',      toolSlug: 'base64-encoder-decoder' },
  { oldPath: 'developer/html-entity-encoder-decoder', toolSlug: 'html-entity-encoder-decoder' },
  { oldPath: 'developer/json-formatter',              toolSlug: 'json-formatter' },
  { oldPath: 'developer/json-minifier',               toolSlug: 'json-minifier' },
  { oldPath: 'developer/json-validator',              toolSlug: 'json-validator' },
  { oldPath: 'developer/md5-hash-generator',          toolSlug: 'md5-hash-generator' },
  { oldPath: 'developer/sha1-hash-generator',         toolSlug: 'sha1-hash-generator' },
  { oldPath: 'developer/sha256-hash-generator',       toolSlug: 'sha256-hash-generator' },
  { oldPath: 'developer/url-encoder-decoder',         toolSlug: 'url-encoder-decoder' },

  // Case Converter under plural prefix.
  { oldPath: 'text/case-converter', toolSlug: 'title-case-converter' },

  // First-day single-segment `/tools/{slug}/` routes.
  { oldPath: 'word-counter',           toolSlug: 'word-counter' },
  { oldPath: 'percentage-calculator',  toolSlug: 'percentage-calculator' },
  { oldPath: 'base64-encoder',         toolSlug: 'base64-encoder-decoder' },
  { oldPath: 'case-converter',         toolSlug: 'title-case-converter' },
];

function liveSegment(toolSlug: string): string {
  const tool = tools.find(t => t.slug === toolSlug);
  if (!tool) throw new Error(`tools-prefix-redirects: unknown tool slug "${toolSlug}"`);
  const category = categories.find(c => c.slug === tool.categorySlug);
  if (!category) throw new Error(`tools-prefix-redirects: unresolved category for "${toolSlug}"`);
  return category.segment;
}

/** Every live tool under `/tools/{segment}/{slug}/`, plus historical extras. Deduped by oldPath. */
export const toolsPrefixRedirects: ToolRedirect[] = (() => {
  const byOld = new Map<string, ToolRedirect>();
  for (const tool of tools) {
    const oldPath = `${liveSegment(tool.slug)}/${tool.slug}`;
    byOld.set(oldPath, { oldPath, toolSlug: tool.slug });
  }
  for (const extra of historicalToolsPrefixExtras) {
    byOld.set(extra.oldPath, extra);
  }
  return [...byOld.values()].sort((a, b) => a.oldPath.localeCompare(b.oldPath));
})();

// Plural `/categories/...` URLs from the same window. Served by
// src/pages/categories/[oldSlug].astro, not the /category/ stub.
export const categoriesPrefixRedirects: CategoryRedirect[] = [
  { oldSlug: 'text-utilities',   categorySlug: 'text-utilities' },
  { oldSlug: 'number-utilities', categorySlug: 'number-utilities' },
  { oldSlug: 'developer-tools',  categorySlug: 'developer-utilities' },
  { oldSlug: 'productivity',     categorySlug: 'productivity' },
];
