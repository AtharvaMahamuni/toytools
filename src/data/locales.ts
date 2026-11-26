// Supported locales and formatting configuration for ToyTools.
//
// English stays at the root (/) to protect existing backlinks and rankings, while localized
// versions live under ISO 639-1 subdirectories (/es/, /de/, /fr/). Only locales in ACTIVE_LOCALES
// are emitted as static routes and hreflang alternates.

export type LocaleCode = 'en' | 'es' | 'de' | 'fr';

export interface LocaleConfig {
  code: LocaleCode;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
  intlLocale: string;
  ogLocale: string;
}

export const DEFAULT_LOCALE: LocaleCode = 'en';

export const SUPPORTED_LOCALES: Record<LocaleCode, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    hreflang: 'en',
    intlLocale: 'en-US',
    ogLocale: 'en_US',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dir: 'ltr',
    hreflang: 'es',
    intlLocale: 'es-ES',
    ogLocale: 'es_ES',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    dir: 'ltr',
    hreflang: 'de',
    intlLocale: 'de-DE',
    ogLocale: 'de_DE',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    dir: 'ltr',
    hreflang: 'fr',
    intlLocale: 'fr-FR',
    ogLocale: 'fr_FR',
  },
};

export const ACTIVE_LOCALES: readonly LocaleCode[] = ['en', 'es', 'de', 'fr'];
export const LOCALIZED_LOCALES: readonly Exclude<LocaleCode, 'en'>[] = ['es', 'de', 'fr'];

export function isLocaleCode(value: string | undefined): value is LocaleCode {
  return Boolean(value && value in SUPPORTED_LOCALES);
}

export function normalizeLocale(value: string | undefined): LocaleCode {
  return isLocaleCode(value) ? value : DEFAULT_LOCALE;
}

export function getLocaleConfig(locale?: string): LocaleConfig {
  return SUPPORTED_LOCALES[normalizeLocale(locale)];
}
