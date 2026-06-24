// Build-time audit artifact: dist/indexnow-urls.json. Generated automatically by `astro build`
// (same registry-driven pattern as src/pages/sitemaps/*.xml.ts) so it stays deterministic with
// the sitemaps. Used for debugging/auditing and as the URL source the CLI reads in CI.

import type { APIRoute } from 'astro';
import { collectUrls } from '@lib/indexnow/collectUrls';
import { INDEXNOW_SITE } from '@config/indexnow';

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(INDEXNOW_SITE)).toString();
  const urls = collectUrls(base);
  return new Response(
    JSON.stringify({ generatedAt: new Date().toISOString(), count: urls.length, urls }, null, 2),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
