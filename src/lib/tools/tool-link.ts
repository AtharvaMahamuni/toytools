// Build-time link resolution by slug, for Astro frontmatter and markup (the guides first of all).
//
// A guide that links to a sibling tool names it by slug; this looks the tool up in the registry,
// finds its category's URL segment and hands both to toolPath() in src/lib/paths.ts, the one URL
// builder. So a guide never spells a segment, a moved tool's links follow it, and a typo'd or
// removed slug fails the build (getToolBySlug throws) instead of shipping a dead link.
//
// It imports the whole registry, so it is for server-side code only: frontmatter, component
// markup, endpoints. Never import it from a client <script>; paths.ts is the client-safe builder.

import { getToolBySlug } from '@data/registry';
import { categories } from '@data/categories';
import { toolPath, guidePath } from '@lib/paths';
import type { ToolConfig } from '@data/types';

/** The href of the tool with this slug, at its registry category's segment. */
export function toolPathBySlug(slug: string): string {
  const tool = getToolBySlug(slug);
  const category = categories.find((c) => c.slug === tool.categorySlug);
  if (!category) throw new Error(`[tool-link] Tool "${slug}" has unknown category "${tool.categorySlug}"`);
  return toolPath({ slug, segment: category.segment });
}

/**
 * The href of the guide that belongs to the tool with this slug. Guides link to each other by the
 * tool's slug, so a guide that is retired (its `guide:` removed from the tool's config) fails the
 * build here instead of leaving a dead link in every guide that pointed at it.
 */
export function guidePathBySlug(toolSlug: string): string {
  return guidePathOf(getToolBySlug(toolSlug));
}

/** The href of this tool's guide; throws when the tool has none. */
export function guidePathOf(tool: Pick<ToolConfig, 'slug' | 'guide'>): string {
  if (!tool.guide) throw new Error(`[tool-link] Tool "${tool.slug}" has no guide to link to`);
  return guidePath({ categorySlug: tool.guide.categorySlug, slug: tool.guide.slug });
}
