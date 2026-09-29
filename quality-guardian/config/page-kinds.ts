// Page classification for the tool-, category- and guide-specific rules.
//
// The live URL shapes are singular (CLAUDE.md, "URL structure"):
//   /tool/<segment>/<slug>/    /category/<slug>/    /guide/<segment>/<slug>/
//
// Until beta-v12.1.1 three validators and the weekly Lighthouse picker matched the plural
// `/tools/` and `/categories/` prefixes. Those paths exist only as noindex redirect stubs, so the
// tool-specific rules (SoftwareApplication JSON-LD, the tool page byte budget, the FAQ cross-link)
// ran against zero real pages, and Lighthouse audited meta-refresh stubs. Every one of them passed
// because it checked nothing.
//
// Two rules keep that from recurring:
//   1. The shape is matched exactly (prefix AND segment count), in one place, here.
//   2. Redirect stubs are excluded structurally, by the crawler's `isRedirectStub` flag (a
//      `<meta http-equiv="refresh">`), never by a list of paths. A renamed tool leaves a stub at
//      `/tool/<segment>/<old-slug>/`, which has the tool shape but is not a tool page.
//
// Pure module on purpose: no cheerio, no fs. The unit test in tests/page-kinds.test.ts imports it
// from the root vitest run, which executes before quality-guardian's own dependencies are installed.

export const TOOL_PREFIX = '/tool/';
export const CATEGORY_PREFIX = '/category/';
export const GUIDE_PREFIX = '/guide/';

export type PageKind = 'homepage' | 'tool' | 'category' | 'guide' | 'faq' | 'other';

/** The minimum a selector needs from a crawled page. `CrawledPage` satisfies it. */
export interface PageLike {
  urlPath: string;
  isRedirectStub: boolean;
}

/** Classify a URL path by its live shape. Plural legacy prefixes are 'other'. */
export function pageKind(urlPath: string): PageKind {
  if (urlPath === '/') return 'homepage';
  if (!urlPath.endsWith('/')) return 'other';
  const parts = urlPath.split('/').filter(Boolean);
  const [head] = parts;
  if (head === 'tool' && parts.length === 3) return 'tool';
  if (head === 'category' && parts.length === 2) return 'category';
  if (head === 'guide' && parts.length === 3) return 'guide';
  if (head === 'faq' && parts.length === 3) return 'faq';
  return 'other';
}

/** `/tool/<segment>/<slug>/` → { segment, slug }; anything else → null. */
export function toolPathParts(urlPath: string): { segment: string; slug: string } | null {
  if (pageKind(urlPath) !== 'tool') return null;
  const [, segment, slug] = urlPath.split('/').filter(Boolean);
  return { segment: segment!, slug: slug! };
}

/** Real (non-stub) pages of one kind, in input order. */
export function livePagesOfKind<T extends PageLike>(pages: readonly T[], kind: PageKind): T[] {
  return pages.filter(p => !p.isRedirectStub && pageKind(p.urlPath) === kind);
}
