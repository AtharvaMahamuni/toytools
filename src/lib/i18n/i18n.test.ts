import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LOCALIZED_LOCALES, SUPPORTED_LOCALES } from '@data/locales';
import { categories } from '@data/categories';
import { faqsByToolSlug } from '@data/faq-registry';
import { getToolBySlug } from '@data/registry';
import { localizedGuideKeys, localizedPacksByKey } from './registry.generated';
import {
  availableLocalesForGuide,
  availableLocalesForTool,
  categoryHreflangLinks,
  getLocalizedToolPack,
  guideHreflangLinks,
  localizeFaqs,
  localizeTool,
  pageHreflangLinks,
  toolHreflangLinks,
} from './registry';

const PILOT_TOOLS = [
  'no-sleep-website',
  'pomodoro-timer',
  'word-counter',
  'percentage-calculator',
  'json-formatter',
  'aspect-ratio-calculator',
  'bmi-calculator',
  'qr-code-generator',
  'unix-timestamp-converter',
  'text-compare',
] as const;

const SITE = 'https://toytoolsapp.com/';

function walkFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walkFiles(abs, out);
    else out.push(abs);
  }
  return out;
}

describe('i18n Phase 1 coverage and parity', () => {
  it('registers all 10 pilot tools and guides for es, de, fr', () => {
    for (const slug of PILOT_TOOLS) {
      const enTool = getToolBySlug(slug);
      const enFaqs = faqsByToolSlug[slug] ?? [];
      expect(enFaqs.length).toBeGreaterThan(0);

      for (const locale of LOCALIZED_LOCALES) {
        const key = `${locale}:${slug}`;
        const pack = getLocalizedToolPack(slug, locale);
        expect(pack, `Missing pack for ${key}`).not.toBeNull();
        expect(localizedPacksByKey[key]).toBeDefined();
        expect(localizedGuideKeys).toContain(key);
        expect(pack!.guide, `Missing guide metadata for ${key}`).toBeDefined();
        expect(pack!.name.trim().length).toBeGreaterThan(2);
        expect(pack!.description).not.toBe(enTool.description);
        expect(pack!.description.length).toBeGreaterThan(40);
        expect(pack!.faqs.length, `FAQ count mismatch for ${key}`).toBe(enFaqs.length);
        expect(pack!.faqs.map(f => f.id)).toEqual(enFaqs.map(f => f.id));

        const localizedTool = localizeTool(enTool, locale);
        expect(localizedTool.name).toBe(pack!.name);
        expect(localizeFaqs(slug, enFaqs, locale)).toHaveLength(enFaqs.length);
      }
    }
  });

  it('keeps hreflang availability-gated so unlocalized tools emit no alternate links', () => {
    const unlocalized = getToolBySlug('base64-encoder-decoder');
    const unlocCat = categories.find(c => c.slug === unlocalized.categorySlug)!;
    expect(availableLocalesForTool('base64-encoder-decoder')).toEqual(['en']);
    expect(availableLocalesForGuide('base64-encoder-decoder')).toEqual(['en']);
    expect(toolHreflangLinks(unlocalized, unlocCat, SITE)).toEqual([]);
    expect(guideHreflangLinks(unlocalized, SITE)).toEqual([]);
  });

  it('emits reciprocal x-default + en/es/de/fr hreflang links for localized tools, guides, categories, and pages', () => {
    const wc = getToolBySlug('word-counter');
    const wcCat = categories.find(c => c.slug === wc.categorySlug)!;

    const tLinks = toolHreflangLinks(wc, wcCat, SITE);
    expect(tLinks.map(l => l.hreflang)).toEqual(['x-default', 'en', 'es', 'de', 'fr']);
    expect(tLinks.find(l => l.hreflang === 'x-default')?.href).toBe('https://toytoolsapp.com/tool/text/word-counter/');
    expect(tLinks.find(l => l.hreflang === 'es')?.href).toBe('https://toytoolsapp.com/es/tool/text/word-counter/');

    const gLinks = guideHreflangLinks(wc, SITE);
    expect(gLinks.map(l => l.hreflang)).toEqual(['x-default', 'en', 'es', 'de', 'fr']);
    expect(gLinks.find(l => l.hreflang === 'de')?.href).toBe(
      'https://toytoolsapp.com/de/guide/text/how-to-count-words-in-your-writing/',
    );

    const catLinks = categoryHreflangLinks(wcCat, SITE);
    expect(catLinks).toHaveLength(5);

    const pageLinks = pageHreflangLinks('/about/', SITE);
    expect(pageLinks.map(l => l.hreflang)).toEqual(['x-default', 'en', 'es', 'de', 'fr']);
    expect(pageLinks.find(l => l.hreflang === 'fr')?.href).toBe('https://toytoolsapp.com/fr/about/');
  });

  it('uses valid BCP-47 hreflang codes', () => {
    for (const loc of Object.values(SUPPORTED_LOCALES)) {
      expect(loc.hreflang).toMatch(/^[a-z]{2}$/);
    }
  });

  it('contains zero em-dashes in authored i18n copy and localized templates', () => {
    const root = process.cwd();
    const files = [
      ...walkFiles(join(root, 'src/data/i18n')),
      ...walkFiles(join(root, 'src/pages/[lang]')),
      ...walkFiles(join(root, 'src/tools')).filter(f => /\/i18n\//.test(f)),
    ].filter(f => /\.(ts|astro)$/.test(f));

    expect(files.length).toBeGreaterThan(60);
    for (const file of files) {
      if (file.includes('/pages/[lang]/tool/')) continue;
      const content = readFileSync(file, 'utf8').replace(/\/\/[^\n]*/g, '');
      expect(content, `Unexpected em-dash (—) found in ${file}`).not.toContain('\u2014');
    }
  });
});
