import { describe, it, expect } from 'vitest';
import { collectUrls } from './collectUrls';

const SITE = 'https://toytoolsapp.com';

describe('collectUrls', () => {
  const urls = collectUrls(SITE);

  it('includes the homepage', () => {
    expect(urls).toContain(`${SITE}/`);
  });

  it('returns a non-empty list', () => {
    expect(urls.length).toBeGreaterThan(0);
  });

  it('emits only absolute https URLs on the canonical host', () => {
    for (const u of urls) {
      const parsed = new URL(u);
      expect(parsed.protocol).toBe('https:');
      expect(parsed.hostname).toBe('toytoolsapp.com');
    }
  });

  it('has no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('never leaks non-indexable surfaces (redirects, search, 404, xml)', () => {
    for (const u of urls) {
      expect(u).not.toContain('/faq/');
      expect(u).not.toContain('/search');
      expect(u).not.toContain('/404');
      expect(u).not.toMatch(/\.xml$/);
    }
  });

  it('includes tool, guide, and category URLs', () => {
    expect(urls.some(u => u.includes('/tool/'))).toBe(true);
    expect(urls.some(u => u.includes('/guide/'))).toBe(true);
    expect(urls.some(u => u.includes('/category/'))).toBe(true);
  });

  it('excludes the thin language stubs (noindex, not submitted)', () => {
    expect(urls.some(u => /\/(en|de|fr|ja)\/$/.test(u))).toBe(false);
  });

  it('is deterministic across calls', () => {
    expect(collectUrls(SITE)).toEqual(urls);
  });
});
