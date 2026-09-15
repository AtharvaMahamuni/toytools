import type { APIRoute } from 'astro';
import { withBase } from '@lib/paths';
import { renderSitemapIndex } from '@lib/sitemap/render';

// Convenience alias for /sitemap.xml. robots.txt and Quality Guardian still require
// sitemap-index.xml; this route serves the same index XML so crawlers that probe the
// conventional path get application/xml 200 instead of the SPA 404 HTML shell.
const SITE_FALLBACK = 'https://toytoolsapp.com';
const BUCKETS = ['tools', 'guides', 'categories', 'pages'];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  const bucketPaths = BUCKETS.map(b => withBase(`/sitemaps/${b}.xml`));
  return new Response(renderSitemapIndex(bucketPaths, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
