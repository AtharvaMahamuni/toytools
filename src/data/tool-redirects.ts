// Tool URL redirects — SEO migration shim.
//
// Every entry is a public tool URL that once existed and no longer does. Each one serves a
// redirect stub (meta-refresh + canonical → the current tool page) instead of a 404, which is
// what preserves link equity: GitHub Pages answers an unmatched path with the noindex 404.html,
// and that is what Search Console reports as "noindex detected in robots meta tag".
//
// Two migrations are recorded here.
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
// Adding an entry is how a URL is allowed to change. Never delete an old URL silently.
// These stubs are intentionally noindex and in no sitemap.

export interface ToolRedirect {
  /** Historical path under /tool/, e.g. 'developer/url-encoder-decoder'. */
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
// treatment. (The other three categories kept their slugs.)
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
];
