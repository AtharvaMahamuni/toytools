// guide.categorySlug is the first path segment of a guide URL: /guide/<categorySlug>/<guide-slug>/.
//
// It was free text until beta-v12.1.1, validated against nothing. The catalog uses two
// vocabularies for it, both of them real: the category's `slug` (`text-utilities`, `health-fitness`)
// and its URL `segment` (`text`, `datetime`). Normalising one to the other would move indexed guide
// URLs and needs a redirect plan (report §29), so both stay legal. What is not legal is a value that
// names no category at all (a typo ships a live URL under a prefix nothing else uses), or one that
// names a DIFFERENT category from the tool's own (the guide would sit under the wrong subject).

import type { Category, Tool } from '@data/types';

type GuideTool = Pick<Tool, 'slug' | 'categorySlug' | 'guide'>;
type CategoryRef = Pick<Category, 'slug' | 'segment'>;

/** One error string per guide whose categorySlug is not its own category's slug or segment. */
export function guideCategorySlugErrors(tools: readonly GuideTool[], categories: readonly CategoryRef[]): string[] {
  const bySlug = new Map(categories.map(c => [c.slug, c]));
  const owners = new Map<string, string>();
  for (const c of categories) {
    owners.set(c.slug, c.slug);
    owners.set(c.segment, c.slug);
  }

  const errors: string[] = [];
  for (const tool of tools) {
    if (!tool.guide) continue;
    const value = tool.guide.categorySlug;
    const own = bySlug.get(tool.categorySlug);
    const allowed = own ? [own.slug, own.segment] : [tool.categorySlug];
    if (allowed.includes(value)) continue;

    const named = owners.get(value);
    errors.push(
      named
        ? `Tool "${tool.slug}" guide.categorySlug "${value}" names category "${named}", but the tool is in ` +
          `"${tool.categorySlug}". Use ${allowed.map(a => `"${a}"`).join(' or ')}.`
        : `Tool "${tool.slug}" guide.categorySlug "${value}" is not a category slug or segment in ` +
          `src/data/categories.ts. Use ${allowed.map(a => `"${a}"`).join(' or ')}.`,
    );
  }
  return errors;
}
