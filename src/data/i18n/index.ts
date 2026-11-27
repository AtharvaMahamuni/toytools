import { BRAND_NAME, TITLE_SUFFIX } from '@config/site';
import { DEFAULT_LOCALE, normalizeLocale, type LocaleCode } from '@data/locales';
import type { Category } from '@data/types';
import type { SiteUiStrings } from '@lib/i18n/types';
import { generatePageTitle, type PageType } from '@lib/titles';
import { EN_UI } from './en';
import { ES_UI } from './es';
import { DE_UI } from './de';
import { FR_UI } from './fr';
import { JA_UI } from './ja';
import { PT_UI } from './pt';
import { HI_UI } from './hi';

const BUNDLES: Record<LocaleCode, SiteUiStrings> = {
  en: EN_UI,
  es: ES_UI,
  de: DE_UI,
  fr: FR_UI,
  ja: JA_UI,
  pt: PT_UI,
  hi: HI_UI,
};

export function getUiStrings(locale?: string): SiteUiStrings {
  return BUNDLES[normalizeLocale(locale)];
}

export function formatTemplate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

/** Merge a Category definition with localized copy when locale !== 'en'. */
export function localizeCategory(category: Category, locale?: string): Category {
  const code = normalizeLocale(locale);
  if (code === DEFAULT_LOCALE) return category;
  const tr = BUNDLES[code].categories[category.slug];
  if (!tr) return category;
  return {
    ...category,
    name: tr.name,
    headline: tr.headline ?? tr.name,
    description: tr.description,
    tagline: tr.tagline ?? category.tagline,
    intro: tr.intro ?? category.intro,
  };
}

export function generateLocalizedPageTitle(
  type: PageType,
  name?: string,
  locale?: string,
): string {
  const code = normalizeLocale(locale);
  if (code === DEFAULT_LOCALE) return generatePageTitle(type, name);
  const t = BUNDLES[code].titles;
  switch (type) {
    case 'home': return `${t.home}${TITLE_SUFFIX}`;
    case 'tool': return `${name}${TITLE_SUFFIX}`;
    case 'guide': return `${name}${TITLE_SUFFIX} ${t.guideSuffix}`;
    case 'faq': return `${name} ${t.faqSuffix}${TITLE_SUFFIX}`;
    case 'category': return `${name}${TITLE_SUFFIX}`;
    case 'search': return `${t.search}${TITLE_SUFFIX}`;
    case 'architecture': return `Architecture${TITLE_SUFFIX}`;
    case 'platform': return `${t.platform}${TITLE_SUFFIX}`;
    case 'feedback': return `${t.feedback}${TITLE_SUFFIX}`;
    case 'privacy': return `${t.privacy}${TITLE_SUFFIX}`;
    case 'terms': return `${t.terms}${TITLE_SUFFIX}`;
    case 'about': return `${t.about}${TITLE_SUFFIX}`;
    case 'changelog': return `${t.changelog}${TITLE_SUFFIX}`;
    case 'settings': return `${t.settings}${TITLE_SUFFIX}`;
    case 'offline': return `${t.offline}${TITLE_SUFFIX}`;
    case 'notFound': return `${t.notFound}${TITLE_SUFFIX}`;
    default: return `${BRAND_NAME}`;
  }
}
