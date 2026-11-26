import type { APIRoute } from 'astro';
import { siteUrl } from '@config/site';
import { categories } from '@data/categories';
import { LOCALIZED_LOCALES } from '@data/locales';
import { tools } from '@data/registry';
import { categoryHreflangLinks, pageHreflangLinks } from '@lib/i18n/registry';
import { categoryPath, pagePath } from '@lib/paths';
import { renderHreflangUrlset, type HreflangUrlEntry } from '@lib/sitemap/render';

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const latestToolDate = tools
    .map(t => t.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  const entries: HreflangUrlEntry[] = [];

  const homeAlternates = pageHreflangLinks('/', base);
  for (const loc of LOCALIZED_LOCALES) {
    entries.push({
      loc: pagePath('/', loc),
      updatedAt: latestToolDate,
      alternates: homeAlternates,
    });
  }

  for (const cat of categories) {
    const alternates = categoryHreflangLinks(cat, base);
    const catLastmod = tools
      .filter(t => t.categorySlug === cat.slug)
      .map(t => t.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    for (const loc of LOCALIZED_LOCALES) {
      entries.push({
        loc: categoryPath({ slug: cat.slug }, loc),
        updatedAt: catLastmod ?? latestToolDate,
        alternates,
      });
    }
  }

  return new Response(renderHreflangUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
