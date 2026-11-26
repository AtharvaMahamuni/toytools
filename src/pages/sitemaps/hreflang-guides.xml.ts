import type { APIRoute } from 'astro';
import { siteUrl } from '@config/site';
import { LOCALIZED_LOCALES } from '@data/locales';
import { tools } from '@data/registry';
import { guideHreflangLinks, hasLocalizedGuide } from '@lib/i18n/registry';
import { guidePath } from '@lib/paths';
import { renderHreflangUrlset, type HreflangUrlEntry } from '@lib/sitemap/render';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const entries: HreflangUrlEntry[] = [];

  for (const tool of tools) {
    if (!tool.guide) continue;
    const alternates = guideHreflangLinks(tool, base);
    if (alternates.length === 0) continue;

    for (const loc of LOCALIZED_LOCALES) {
      if (!hasLocalizedGuide(tool.slug, loc)) continue;
      entries.push({
        loc: guidePath({ categorySlug: tool.guide.categorySlug, slug: tool.guide.slug }, loc),
        updatedAt: tool.guide.updatedAt,
        alternates,
      });
    }
  }

  return new Response(renderHreflangUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
