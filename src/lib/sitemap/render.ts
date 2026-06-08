// Sitemap rendering — pure XML builders for the registry-driven sitemap. Endpoints
// (src/pages/sitemap-index.xml.ts + src/pages/sitemaps/*.xml.ts) feed these the content
// manifest; nothing here is maintained by hand. Lastmod is intentionally omitted: tool
// dates are ISO-ish but guide dates are display strings ("Jun 2026"), so emitting them
// would produce invalid <lastmod> values. Route coverage (not freshness) is what matters.

import type { ContentEntry } from '@lib/content/manifest';

const URLSET_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Resolve a site-relative (base-prefixed) path to an absolute URL. */
export function absoluteUrl(path: string, site: string): string {
  return new URL(path, site).href;
}

/** A <urlset> document listing one <loc> per content entry. */
export function renderUrlset(entries: ContentEntry[], site: string): string {
  const urls = entries
    .map(e => `  <url>\n    <loc>${escapeXml(absoluteUrl(e.url, site))}</loc>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${URLSET_NS}">\n${urls}\n</urlset>\n`;
}

/** A <sitemapindex> document referencing each bucket sitemap by absolute URL. */
export function renderSitemapIndex(bucketPaths: string[], site: string): string {
  const items = bucketPaths
    .map(p => `  <sitemap>\n    <loc>${escapeXml(absoluteUrl(p, site))}</loc>\n  </sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="${URLSET_NS}">\n${items}\n</sitemapindex>\n`;
}
