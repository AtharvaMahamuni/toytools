// The one URL builder. Every internal link, canonical and sitemap <loc> for a tool, a category or
// a guide is made here, so the shape of a ToyTools URL is written down exactly once:
//
//   tool      /tool/<segment>/<slug>/
//   category  /category/<slug>/
//   guide     /guide/<categorySlug>/<slug>/
//
// Three layers, smallest first:
//   • toolRoute / categoryRoute / guideRoute: the site route, root-relative, no base path. Only
//     for places that store or compare routes as data (the knowledge graph's node urls, redirect
//     tables) and apply the base themselves, or not at all.
//   • toolPath / categoryPath / guidePath: the href. The route through withBase(). This is what
//     markup and client code link to.
//   • urlFor(entity) / canonicalFor(entity, site): the same two answers keyed by an entity. Today
//     urlFor is the same-origin path and canonicalFor is that path on this build's site. They are
//     the seam a later multi-site change would fill in (an entity owned by another site would
//     come back absolute); no such logic exists yet, on purpose.
//
// This module ships in client bundles (engine chunks link to sibling tools through it, and
// withBase is on every page), so it imports nothing but the site identity's constants and stays a
// handful of bytes. Anything that needs the registry to find a segment does that lookup at the
// call site, at build time.

import { siteUrl } from '@config/site';

export function withBase(path: string): string {
  // import.meta.env is provided by Vite/Astro; under plain tsx (scripts) it is undefined,
  // so fall back to an empty base — callers there resolve absolute URLs against Astro.site.
  const base = (import.meta.env?.BASE_URL ?? '').replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}

/** What a tool URL is made of: its slug and its category's URL segment. */
export interface ToolRef {
  slug: string;
  segment: string;
}

/** What a category URL is made of. */
export interface CategoryRef {
  slug: string;
}

/** What a guide URL is made of: the guide's own slug and its declared first segment. */
export interface GuideRef {
  slug: string;
  categorySlug: string;
}

export type Entity =
  | ({ kind: 'tool' } & ToolRef)
  | ({ kind: 'category' } & CategoryRef)
  | ({ kind: 'guide' } & GuideRef);

export const toolRoute = (tool: ToolRef): string => `/tool/${tool.segment}/${tool.slug}/`;
export const categoryRoute = (category: CategoryRef): string => `/category/${category.slug}/`;
export const guideRoute = (guide: GuideRef): string => `/guide/${guide.categorySlug}/${guide.slug}/`;

/** The href of a tool page. */
export const toolPath = (tool: ToolRef): string => withBase(toolRoute(tool));
/** The href of a category page. */
export const categoryPath = (category: CategoryRef): string => withBase(categoryRoute(category));
/** The href of a guide page. */
export const guidePath = (guide: GuideRef): string => withBase(guideRoute(guide));

/** The link to an entity from a page on this site. Today: always the same-origin path. */
export function urlFor(entity: Entity): string {
  switch (entity.kind) {
    case 'tool': return toolPath(entity);
    case 'category': return categoryPath(entity);
    case 'guide': return guidePath(entity);
  }
}

/**
 * The canonical, absolute URL of an entity: its path on this build's site (`Astro.site`, or the
 * production origin when a build sets none). Today every entity is owned by this site.
 */
export function canonicalFor(entity: Entity, site?: URL | string | null): string {
  return new URL(urlFor(entity), siteUrl(site)).href;
}
