import type { APIRoute } from 'astro';
import { withBase } from '@lib/paths';
import { renderSitemapIndex } from '@lib/sitemap/render';
import { siteUrl } from '@config/site';

// Sitemap index. Filename preserved as `sitemap-index.xml` so robots.txt, the astro.config
// seo-validator, and quality-guardian build-integrity all keep working unchanged.
// No `languages` bucket: the /{lang}/ stubs are noindex and excluded from the manifest.
const BUCKETS = ['tools', 'guides', 'categories', 'pages'];

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const bucketPaths = BUCKETS.map(b => withBase(`/sitemaps/${b}.xml`));
  return new Response(renderSitemapIndex(bucketPaths, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
