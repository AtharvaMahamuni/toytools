import { describe, it, expect } from 'vitest';
import { buildSearchIndex } from './index';
import { tools } from '@data/registry';

describe('buildSearchIndex', () => {
  const index = buildSearchIndex();

  it('produces one document per tool', () => expect(index).toHaveLength(tools.length));

  it('every document carries the searchable fields', () =>
    index.forEach(doc => {
      expect(doc.slug).toBeTruthy();
      expect(doc.title).toBeTruthy();
      expect(doc.description).toBeTruthy();
      expect(doc.category).toBeTruthy();
      expect(doc.engine).toBeTruthy();
      expect(Array.isArray(doc.keywords)).toBe(true);
    }));

  it('merges tags into keywords without duplicates', () => {
    const base64 = index.find(d => d.slug === 'base64-encoder-decoder')!;
    expect(base64.keywords).toContain('base64');
    expect(base64.keywords.length).toBe(new Set(base64.keywords).size);
  });

  it('is JSON-serializable', () => expect(() => JSON.stringify(index)).not.toThrow());
});
