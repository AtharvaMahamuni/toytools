// Which pages the weekly Lighthouse run audits.
//
// Picked from the crawled pages, not the route manifest: the manifest lists every redirect stub
// too (the 180 plural /tools/ stubs, renamed-tool stubs under /tool/, the /faq/ stubs), and
// Lighthouse on a meta-refresh stub measures an empty page. Until beta-v12.1.1 this took the first
// two `/categories/` and `/tools/` routes and the first `/guide/` and `/faq/` route in manifest
// order: /categories/text-utilities/, /categories/number-utilities/, /tools/base64-encoder/,
// /tools/case-converter/, /guide/developer/what-is-base64/ and /faq/developer/base64-encoder-decoder/.
// All six are redirect stubs, so six of the seven weekly audits scored a page no visitor sees.
//
// Pure (no cheerio) so the root vitest run can import it.

import { livePagesOfKind, type PageLike } from '../config/page-kinds.js';

export const LIGHTHOUSE_PICKS = { category: 2, tool: 2, guide: 1 } as const;

function byPath(a: PageLike, b: PageLike): number {
  return a.urlPath.localeCompare(b.urlPath);
}

/** Homepage, then the first N real category, tool and guide pages in path order. */
export function selectLighthouseRoutes(pages: readonly PageLike[]): string[] {
  const pick = (kind: keyof typeof LIGHTHOUSE_PICKS) =>
    livePagesOfKind(pages, kind).sort(byPath).slice(0, LIGHTHOUSE_PICKS[kind]).map(p => p.urlPath);
  return ['/', ...pick('category'), ...pick('tool'), ...pick('guide')];
}
