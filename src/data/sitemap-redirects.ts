// Retired sitemap filenames. Same stub contract as the HTML redirects: noindex,
// meta-refresh, canonical to the current index, never in a sitemap, never 404.html.
//
// These have to be endpoints (src/pages/sitemap-0.xml.ts and src/pages/sitemaps/*.xml.ts)
// rather than .astro pages. trailingSlash: 'always' would turn an .astro page into
// /sitemap-0.xml/index.html, which is not the URL Search Console has. The historical
// path is the file itself.
//
// /sitemap-0.xml was the @astrojs/sitemap child until e33274d (2026-06-09).
// /sitemaps/faqs.xml was deleted in 02311c0 (2026-06-11) when FAQs moved onto tool pages.
// /sitemaps/languages.xml was deleted in 02cf644 (2026-06-25).

import { withBase } from '@lib/paths';

export const SITEMAP_STUB_TARGET = '/sitemap-index.xml';

export interface SitemapRedirect {
  /** Historical path, leading slash, no trailing slash. */
  oldPath: string;
  title: string;
}

export const sitemapRedirects: SitemapRedirect[] = [
  { oldPath: '/sitemap-0.xml',         title: 'Sitemap' },
  { oldPath: '/sitemaps/faqs.xml',     title: 'FAQ sitemap' },
  { oldPath: '/sitemaps/languages.xml', title: 'Language sitemap' },
];

const SITE_FALLBACK = 'https://toytoolsapp.com';

/** The same shell as src/pages/tool/[...oldPath].astro, for a non-directory URL. */
export function sitemapStubHtml(entry: SitemapRedirect, site: URL | undefined): string {
  const origin = site ?? new URL(SITE_FALLBACK);
  const target = withBase(SITEMAP_STUB_TARGET);
  const canonical = new URL(target, origin).href;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${entry.title} — moved</title>
    <meta http-equiv="refresh" content="0; url=${target}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="noindex" />
  </head>
  <body>
    <p>This sitemap has moved. <a href="${target}">Continue to the sitemap index</a>.</p>
  </body>
</html>
`;
}
