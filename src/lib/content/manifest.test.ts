import { describe, it, expect } from 'vitest';
import { buildContentManifest, contentByType } from './manifest';
import { tools, toolsWithGuide } from '@data/registry';
import { faqsByToolSlug } from '@data/faq-registry';
import { categories } from '@data/categories';

describe('buildContentManifest', () => {
  const manifest = buildContentManifest();

  it('includes exactly one home entry', () =>
    expect(manifest.filter(e => e.type === 'home')).toHaveLength(1));

  it('includes one entry per tool', () =>
    expect(contentByType('tool')).toHaveLength(tools.length));

  it('includes one entry per category', () =>
    expect(contentByType('category')).toHaveLength(categories.length));

  it('includes one guide entry per tool with a guide', () =>
    expect(contentByType('guide')).toHaveLength(toolsWithGuide.length));

  it('has no standalone faq entries — FAQ content lives on tool pages', () =>
    expect(manifest.some(e => e.url.includes('/faq/'))).toBe(false));

  it('flags faqExists on tool entries from the faq registry', () => {
    const wordCounter = contentByType('tool').find(e => e.slug === 'word-counter');
    expect(wordCounter?.faqExists).toBe((faqsByToolSlug['word-counter']?.length ?? 0) > 0);
  });

  it('omits the thin language stubs (noindex, excluded from sitemap + IndexNow)', () =>
    expect(contentByType('language')).toHaveLength(0));

  it('every URL ends with a trailing slash', () =>
    manifest.forEach(e => expect(e.url.endsWith('/')).toBe(true)));

  it('every entry has a numeric priority and changefreq', () =>
    manifest.forEach(e => {
      expect(typeof e.priority).toBe('number');
      expect(e.changefreq).toBeTruthy();
    }));

  it('tool entries carry engine + relatedTools metadata', () => {
    const base64 = contentByType('tool').find(e => e.slug === 'base64-encoder-decoder');
    expect(base64?.engine).toBe('encoding');
    expect(base64?.relatedTools).toContain('url-encoder-decoder');
  });

  it('tool URLs use the category segment, not the category slug', () => {
    const base64 = contentByType('tool').find(e => e.slug === 'base64-encoder-decoder');
    expect(base64?.url).toContain('/tool/developer-utilities/');
  });
});
