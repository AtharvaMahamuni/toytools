import type { APIRoute } from 'astro';
import { withBase } from '@lib/paths';
import { renderSitemapIndex } from '@lib/sitemap/render';

// Sitemap index. Filename preserved as `sitemap-index.xml` so robots.txt, the astro.config
// seo-validator, and quality-guardian build-integrity all keep working unchanged.
const SITE_FALLBACK = 'https://toytoolsapp.com';
// No `languages` bucket: the /{lang}/ stubs are noindex and excluded from the manifest.
const BUCKETS = ['tools', 'guides', 'categories', 'pages'];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE_FALLBACK)).href;
  const bucketPaths = BUCKETS.map(b => withBase(`/sitemaps/${b}.xml`));
  return new Response(renderSitemapIndex(bucketPaths, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
