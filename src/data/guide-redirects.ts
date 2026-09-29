// Guide URL redirects: SEO migration shim.
//
// Same contract as src/data/tool-redirects.ts: a retired public URL serves a noindex
// meta-refresh stub with canonical pointing at the page that replaced it. Intentionally
// not in any sitemap. GitHub Pages would otherwise answer these with the noindex 404.html.
//
// 1. Segment rename (commit 45f4f9f, 2026-06-13): guide categorySlug moved from `developer`
//    to `developer-utilities`. Tool URLs got stubs. These nine guide URLs did not. They had
//    been in the registry sitemap (e33274d, 2026-06-09) until the rename.
//
// 2. Case Converter guide (deleted with the tool in 4f74abc). No current guide replaces
//    `/guide/text/how-to-change-text-case/`. Title Case Converter is the single best target,
//    the same choice as the tool and FAQ stubs for that deletion.

import { guideRoute, toolRoute } from '@lib/paths';

export interface GuideRedirect {
  /** Historical path under /guide/, e.g. 'developer/what-is-base64'. */
  oldPath: string;
  /**
   * Current site route, leading and trailing slash, no base path (the stub applies it). Built
   * with guideRoute() / toolRoute() from src/lib/paths.ts. Must be a live tool or guide URL.
   */
  targetPath: string;
}

export const guideRedirects: GuideRedirect[] = [
  { oldPath: 'developer/what-is-base64',              targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-base64' }) },
  { oldPath: 'developer/what-is-html-entity-encoding', targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-html-entity-encoding' }) },
  { oldPath: 'developer/what-is-json-formatting',     targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-json-formatting' }) },
  { oldPath: 'developer/what-is-json-minification',   targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-json-minification' }) },
  { oldPath: 'developer/how-to-validate-json',        targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'how-to-validate-json' }) },
  { oldPath: 'developer/what-is-md5',                 targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-md5' }) },
  { oldPath: 'developer/what-is-sha1',                targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-sha1' }) },
  { oldPath: 'developer/what-is-sha256',              targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-sha256' }) },
  { oldPath: 'developer/what-is-url-encoding',        targetPath: guideRoute({ categorySlug: 'developer-utilities', slug: 'what-is-url-encoding' }) },
  { oldPath: 'text/how-to-change-text-case',          targetPath: toolRoute({ segment: 'text', slug: 'title-case-converter' }) },
];
