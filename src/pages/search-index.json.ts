// Build-time artifact: dist/search-index.json — the compact catalog the nav palette, /search/ and
// /404/ fetch on first interaction. Registry-derived (same pattern as the sitemaps and
// indexnow-urls.json), so it can never drift from the tool catalog.
//
// This is deliberately NOT inlined into any page: at 114 tools it is several kilobytes, and the
// worst tool page has roughly 4K of gzipped JS headroom. Fetching it on interaction keeps every
// page's critical path untouched. Its size is capped by scripts/check-budget.ts.

import type { APIRoute } from 'astro';
import { buildClientIndex } from '@lib/search';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(buildClientIndex()), {
    headers: { 'Content-Type': 'application/json' },
  });
};
