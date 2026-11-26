import type { APIRoute } from 'astro';
import { siteUrl } from '@config/site';
import { categories } from '@data/categories';
import { LOCALIZED_LOCALES } from '@data/locales';
import { tools } from '@data/registry';
import { hasLocalizedTool, toolHreflangLinks } from '@lib/i18n/registry';
import { toolPath } from '@lib/paths';
import { renderHreflangUrlset, type HreflangUrlEntry } from '@lib/sitemap/render';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const entries: HreflangUrlEntry[] = [];

  for (const tool of tools) {
    const category = categories.find(c => c.slug === tool.categorySlug);
    if (!category) continue;
    const alternates = toolHreflangLinks(tool, category, base);
    if (alternates.length === 0) continue;

    for (const loc of LOCALIZED_LOCALES) {
      if (!hasLocalizedTool(tool.slug, loc)) continue;
      entries.push({
        loc: toolPath({ slug: tool.slug, segment: category.segment }, loc),
        updatedAt: tool.updatedAt,
        alternates,
      });
    }
  }

  return new Response(renderHreflangUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
