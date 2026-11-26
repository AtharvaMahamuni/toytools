import { siteUrl } from '@config/site';
import {
  DEFAULT_LOCALE,
  LOCALIZED_LOCALES,
  SUPPORTED_LOCALES,
  normalizeLocale,
  type LocaleCode,
} from '@data/locales';
import type { Category, FAQItem, Knowledge, Tool } from '@data/types';
import { localizedGuideKeys, localizedPacksByKey } from './registry.generated';
import type { HreflangLink, LocalizedLocale, LocalizedToolPack } from './types';
import { categoryPath, guidePath, pagePath, toolPath } from '@lib/paths';

const GUIDE_KEY_SET = new Set<string>(localizedGuideKeys);

export function packKey(locale: LocalizedLocale, slug: string): string {
  return `${locale}:${slug}`;
}

export function getLocalizedToolPack(slug: string, locale?: string): LocalizedToolPack | null {
  const code = normalizeLocale(locale);
  if (code === DEFAULT_LOCALE) return null;
  return localizedPacksByKey[packKey(code, slug)] ?? null;
}

export function hasLocalizedTool(slug: string, locale: LocaleCode): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return Boolean(localizedPacksByKey[packKey(locale, slug)]);
}

export function hasLocalizedGuide(toolSlug: string, locale: LocaleCode): boolean {
  if (locale === DEFAULT_LOCALE) return true;
  return Boolean(localizedPacksByKey[packKey(locale, toolSlug)]?.guide) && GUIDE_KEY_SET.has(packKey(locale, toolSlug));
}

export function availableLocalesForTool(slug: string): LocaleCode[] {
  const out: LocaleCode[] = [DEFAULT_LOCALE];
  for (const loc of LOCALIZED_LOCALES) {
    if (hasLocalizedTool(slug, loc)) out.push(loc);
  }
  return out;
}

export function availableLocalesForGuide(toolSlug: string): LocaleCode[] {
  const out: LocaleCode[] = [DEFAULT_LOCALE];
  for (const loc of LOCALIZED_LOCALES) {
    if (hasLocalizedGuide(toolSlug, loc)) out.push(loc);
  }
  return out;
}

/** Merge localized tool copy into a Tool object at build time. */
export function localizeTool(tool: Tool, locale?: string): Tool {
  const pack = getLocalizedToolPack(tool.slug, locale);
  if (!pack) return tool;
  return {
    ...tool,
    name: pack.name,
    seoTitle: pack.seoTitle ?? pack.name,
    description: pack.description,
    tagline: pack.tagline ?? tool.tagline,
    methodology: pack.methodology ?? tool.methodology,
    citation: pack.citation ?? tool.citation,
    guide: tool.guide && pack.guide
      ? {
          ...tool.guide,
          title: pack.guide.title,
          description: pack.guide.description,
          readMinutes: pack.guide.readMinutes ?? tool.guide.readMinutes,
        }
      : tool.guide,
  };
}

export function localizeFaqs(slug: string, fallback: FAQItem[], locale?: string): FAQItem[] {
  const pack = getLocalizedToolPack(slug, locale);
  return pack?.faqs?.length ? pack.faqs : fallback;
}

export function localizeKnowledge(
  slug: string,
  fallback: Knowledge | undefined,
  locale?: string,
): Knowledge | undefined {
  const pack = getLocalizedToolPack(slug, locale);
  if (!pack) return fallback;
  return {
    slug,
    ...(fallback ?? {}),
    primaryConcepts: pack.knowledge.primaryConcepts,
    realWorldUseCases: pack.knowledge.realWorldUseCases,
    commonMistakes: pack.knowledge.commonMistakes,
  };
}

export function hreflangLinksForPath(
  pathForLocale: (locale: LocaleCode) => string,
  locales: readonly LocaleCode[],
  site?: URL | string | null,
): HreflangLink[] {
  if (locales.length <= 1) return [];
  const origin = siteUrl(site);
  const abs = (p: string) => new URL(p, origin).href;
  const links: HreflangLink[] = [
    { hreflang: 'x-default', href: abs(pathForLocale(DEFAULT_LOCALE)) },
  ];
  for (const loc of locales) {
    links.push({
      hreflang: SUPPORTED_LOCALES[loc].hreflang,
      href: abs(pathForLocale(loc)),
    });
  }
  return links;
}

export function toolHreflangLinks(
  tool: Pick<Tool, 'slug'>,
  category: Pick<Category, 'segment'>,
  site?: URL | string | null,
): HreflangLink[] {
  const locales = availableLocalesForTool(tool.slug);
  return hreflangLinksForPath(
    loc => toolPath({ slug: tool.slug, segment: category.segment }, loc),
    locales,
    site,
  );
}

export function guideHreflangLinks(
  tool: Pick<Tool, 'slug' | 'guide'>,
  site?: URL | string | null,
): HreflangLink[] {
  if (!tool.guide) return [];
  const locales = availableLocalesForGuide(tool.slug);
  return hreflangLinksForPath(
    loc => guidePath({ categorySlug: tool.guide!.categorySlug, slug: tool.guide!.slug }, loc),
    locales,
    site,
  );
}

export function categoryHreflangLinks(
  category: Pick<Category, 'slug'>,
  site?: URL | string | null,
): HreflangLink[] {
  return hreflangLinksForPath(
    loc => categoryPath({ slug: category.slug }, loc),
    [DEFAULT_LOCALE, ...LOCALIZED_LOCALES],
    site,
  );
}

export function pageHreflangLinks(
  routePath: string,
  site?: URL | string | null,
): HreflangLink[] {
  return hreflangLinksForPath(
    loc => pagePath(routePath, loc),
    [DEFAULT_LOCALE, ...LOCALIZED_LOCALES],
    site,
  );
}

export function switcherAlternatesForPath(
  pathForLocale: (locale: LocaleCode) => string,
  locales: readonly LocaleCode[],
): { code: LocaleCode; href: string }[] {
  return locales.map(code => ({ code, href: pathForLocale(code) }));
}
