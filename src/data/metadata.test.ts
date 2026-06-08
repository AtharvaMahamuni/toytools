import { describe, it, expect } from 'vitest';
import { getToolMetadata, getAllMetadata } from './metadata';
import { tools } from './registry';
import { engineIds } from './engines';

describe('getToolMetadata', () => {
  it('maps categorySlug → category and guide/faq → slugs', () => {
    const base64 = tools.find(t => t.slug === 'base64-encoder-decoder')!;
    const m = getToolMetadata(base64);
    expect(m.category).toBe('developer-tools');
    expect(m.engine).toBe('encoding');
    expect(m.guideSlug).toBe('what-is-base64');
    expect(m.faqSlug).toBe('base64-encoder-decoder');
    expect(m.relatedTools).toContain('url-encoder-decoder');
  });

  it('defaults arrays to empty when unset', () => {
    const m = getToolMetadata({
      slug: 'x', name: 'X', description: 'd', categorySlug: 'developer-tools', tags: ['a'],
    });
    expect(m.relatedTools).toEqual([]);
    expect(m.keywords).toEqual([]);
    expect(m.engine).toBe('');
  });
});

describe('getAllMetadata (platform contract holds for every tool)', () => {
  const all = getAllMetadata();

  it('covers every registered tool', () => expect(all).toHaveLength(tools.length));

  it('every tool exposes the required contract fields', () =>
    all.forEach(m => {
      expect(m.slug).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.category).toBeTruthy();
      expect(m.engine).toBeTruthy();
      expect(m.pattern).toBeTruthy();
      expect(m.family).toBeTruthy();
      expect(Array.isArray(m.tags) && m.tags.length > 0).toBe(true);
    }));

  it('every tool references a registered engine (no orphan engines)', () =>
    all.forEach(m => expect(engineIds.has(m.engine)).toBe(true)));
});
