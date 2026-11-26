// getStaticPaths helper for the per-segment tool routes (src/pages/tool/<segment>/[slug].astro).
//
// Each segment owns its own route file so that route's `import.meta.glob` only reaches its own
// segment's widgets — see the comment in src/components/tool/ToolPage.astro for why that matters
// for the render-blocking CSS budget. This helper keeps the path-building itself in one place so
// the generated route files stay trivial.

import { tools } from '@data/registry';
import { categories } from '@data/categories';
import type { Tool, Category } from '@data/types';
import { LOCALIZED_LOCALES, type LocaleCode } from '@data/locales';
import { getLocalizedToolPack, localizeTool } from '@lib/i18n/registry';
import { localizeCategory } from '@data/i18n/index';
import type { LocalizedToolPack } from '@lib/i18n/types';

export interface ToolPathEntry {
  params: { slug: string };
  props: { tool: Tool; category: Category };
}

export interface LocalizedToolPathEntry {
  params: { lang: LocaleCode; slug: string };
  props: { tool: Tool; category: Category; lang: LocaleCode; pack: LocalizedToolPack };
}

/** Every tool whose category maps to `segment`, as Astro getStaticPaths entries. */
export function toolPathsForSegment(segment: string): ToolPathEntry[] {
  const entries: ToolPathEntry[] = [];
  for (const tool of tools) {
    const category = categories.find(c => c.slug === tool.categorySlug);
    if (!category) throw new Error(`Category "${tool.categorySlug}" not found for tool "${tool.slug}"`);
    if (category.segment !== segment) continue;
    entries.push({ params: { slug: tool.slug }, props: { tool, category } });
  }
  return entries;
}

/** Every localized tool in `segment` that has an authored i18n pack, per active locale. */
export function localizedToolPathsForSegment(segment: string): LocalizedToolPathEntry[] {
  const entries: LocalizedToolPathEntry[] = [];
  for (const tool of tools) {
    const category = categories.find(c => c.slug === tool.categorySlug);
    if (!category) throw new Error(`Category "${tool.categorySlug}" not found for tool "${tool.slug}"`);
    if (category.segment !== segment) continue;
    for (const lang of LOCALIZED_LOCALES) {
      const pack = getLocalizedToolPack(tool.slug, lang);
      if (!pack) continue;
      entries.push({
        params: { lang, slug: tool.slug },
        props: {
          tool: localizeTool(tool, lang),
          category: localizeCategory(category, lang),
          lang,
          pack,
        },
      });
    }
  }
  return entries;
}
