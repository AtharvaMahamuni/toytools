// Sitemap rendering — pure XML builders for the registry-driven sitemap. Endpoints
// (src/pages/sitemap-index.xml.ts + src/pages/sitemaps/*.xml.ts) feed these the content
// manifest; nothing here is maintained by hand. <lastmod> is emitted only when an entry's
// updatedAt is a valid W3C date (YYYY-MM-DD). The manifest now supplies one for every surface:
// tools carry their own date, guides inherit their tool's date, and home/category derive the
// freshest date of the tools beneath them — so lastmod advances whenever content changes, giving
// Google a real recrawl signal without any hand-maintained dates.

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

/** True for a calendar-valid W3C date (YYYY-MM-DD) safe to emit as <lastmod>. */
export function isW3CDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(value));
}

/** Resolve a site-relative (base-prefixed) path to an absolute URL. */
export function absoluteUrl(path: string, site: string): string {
  return new URL(path, site).href;
}

/** A <urlset> document listing one <loc> (+ <lastmod> when available) per content entry. */
export function renderUrlset(entries: ContentEntry[], site: string): string {
  const urls = entries
    .map(e => {
      const loc = `    <loc>${escapeXml(absoluteUrl(e.url, site))}</loc>`;
      const lastmod = isW3CDate(e.updatedAt) ? `\n    <lastmod>${e.updatedAt}</lastmod>` : '';
      return `  <url>\n${loc}${lastmod}\n  </url>`;
    })
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
