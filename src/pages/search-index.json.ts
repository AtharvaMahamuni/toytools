// Build-time artifact: dist/search-index.json — slug, name, and interned ids. The nav palette,
// /search/ and /404/ fetch it on first interaction. Term lists are dist/search-terms.json.
// Registry-derived (same pattern as the sitemaps and indexnow-urls.json), so it can never drift
// from the tool catalog.
//
// This is deliberately NOT inlined into any page: at 114 tools it is several kilobytes, and the
// worst tool page has roughly 4K of gzipped JS headroom. Fetching it on interaction keeps every
// page's critical path untouched. Its size is capped by scripts/check-budget.ts.

import type { APIRoute } from 'astro';
import { buildCatalogWire } from '@lib/search';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(buildCatalogWire()), {
    headers: { 'Content-Type': 'application/json' },
  });
};
