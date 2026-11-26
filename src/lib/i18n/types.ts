import type { FAQItem } from '@data/types';
import type { LocaleCode } from '@data/locales';
import type { TrustVariant } from '@lib/privacy';

export type LocalizedLocale = Exclude<LocaleCode, 'en'>;

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export interface LocalizedFieldOverride {
  label?: string;
  help?: string;
  placeholder?: string;
  unit?: string;
  group?: string;
  options?: Record<string, string>;
}

export interface LocalizedToolPack {
  locale: LocalizedLocale;
  slug: string;
  /** Localized tool display name */
  name: string;
  /** Optional localized SEO title (overrides name in <title>) */
  seoTitle?: string;
  /** Localized meta description (under ~160 chars) */
  description: string;
  /** Localized short one-line subtitle under the header */
  tagline?: string;
  /** Optional localized methodology label and detail */
  methodology?: {
    name: string;
    detail: string;
  };
  /** Optional localized citation abstract for SoftwareApplication schema */
  citation?: {
    problem: string;
    nonGoal: string;
  };
  /** Localized Zone C knowledge drawers */
  knowledge: {
    primaryConcepts: string[];
    realWorldUseCases: string[];
    commonMistakes: string[];
  };
  /** 1:1 localized FAQ items matching English count */
  faqs: FAQItem[];
  /** Localized guide metadata (required when English tool has a guide) */
  guide?: {
    title: string;
    description: string;
    readMinutes?: number;
  };
  /** Localized widget/engine strings, field labels, card titles, or empty hints */
  ui?: Record<string, unknown>;
  /** Optional field schema overrides for shared engine widgets */
  fields?: Record<string, LocalizedFieldOverride>;
}

export interface CategoryTranslation {
  name: string;
  headline?: string;
  description: string;
  tagline?: string;
  intro?: string[];
}

export interface SiteUiStrings {
  locale: LocaleCode;
  nav: {
    home: string;
    homeAria: string;
    searchPlaceholder: string;
    searchAria: string;
    changelogAria: string;
    languageLabel: string;
    languageAria: string;
    themeLabel: string;
  };
  footer: {
    lightweight: string;
    lightweightTip: string;
    privateLabel: string;
    privacyByVariant: Record<TrustVariant, string>;
    contactAndFeedback: string;
    platform: string;
    about: string;
    privacy: string;
    terms: string;
    changelog: string;
    settings: string;
    shortcuts: string;
    siteInfoAria: string;
    madeBy: string;
  };
  tool: {
    moreAbout: string;
    moreAboutAria: string;
    usesOf: string; // template with {concept}
    pitfallsOf: string; // template with {concept}
    questionsOf: string; // template with {concept}
    relatedTo: string; // template with {concept}
    allCategory: string; // template with {category}
    methodPrefix: string;
    poweredBy: string;
    poweredByTitle: string;
    clearSavedInput: string;
    guideFallback: string;
    favoriteAria: string;
    installLabel: string;
    currency: string;
  };
  guide: {
    openTool: string;
    backToTool: string;
    readTimeSuffix: string;
    updatedPrefix: string;
    inCategory: string;
    relatedHeading: string;
  };
  category: {
    toolCountSingular: string;
    toolCountPlural: string;
    guidesHeading: string;
    toolsHeading: string;
    builtOn: string;
  };
  home: {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
    browseCategories: string;
    featuredTools: string;
    viewAll: string;
  };
  titles: {
    home: string;
    guideSuffix: string;
    faqSuffix: string;
    search: string;
    platform: string;
    feedback: string;
    privacy: string;
    terms: string;
    about: string;
    changelog: string;
    settings: string;
    offline: string;
    notFound: string;
  };
  categories: Record<string, CategoryTranslation>;
}
