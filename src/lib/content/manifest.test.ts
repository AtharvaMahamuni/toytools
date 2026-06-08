import { describe, it, expect } from 'vitest';
import { buildContentManifest, contentByType } from './manifest';
import { tools, toolsWithGuide, toolsWithFaq } from '@data/registry';
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

  it('includes one faq entry per tool with a faq', () =>
    expect(contentByType('faq')).toHaveLength(toolsWithFaq.length));

  it('includes the four language stubs', () =>
    expect(contentByType('language').map(e => e.slug).sort()).toEqual(['de', 'en', 'fr', 'ja']));

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
    expect(base64?.url).toContain('/tool/developer/');
  });
});
