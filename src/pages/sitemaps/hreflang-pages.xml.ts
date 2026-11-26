import type { APIRoute } from 'astro';
import { siteUrl } from '@config/site';
import { LOCALIZED_LOCALES } from '@data/locales';
import { tools } from '@data/registry';
import { pageHreflangLinks } from '@lib/i18n/registry';
import { pagePath } from '@lib/paths';
import { renderHreflangUrlset, type HreflangUrlEntry } from '@lib/sitemap/render';

const LOCALIZED_PAGES = ['/about/', '/privacy/', '/terms/', '/platform/', '/feedback/'] as const;

export const GET: APIRoute = ({ site }) => {
  const base = siteUrl(site).href;
  const latestToolDate = tools
    .map(t => t.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  const entries: HreflangUrlEntry[] = [];

  for (const route of LOCALIZED_PAGES) {
    const alternates = pageHreflangLinks(route, base);
    for (const loc of LOCALIZED_LOCALES) {
      entries.push({
        loc: pagePath(route, loc),
        updatedAt: latestToolDate,
        alternates,
      });
    }
  }

  return new Response(renderHreflangUrlset(entries, base), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
