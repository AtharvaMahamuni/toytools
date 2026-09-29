import { describe, it, expect } from 'vitest';
import { generatePageTitle, type PageType } from './titles';
import { TITLE_SUFFIX, BRAND_NAME } from '@config/site';

describe('generatePageTitle', () => {
  it('home — returns site tagline without a tool name', () => {
    const title = generatePageTitle('home');
    expect(title).toContain('ToyTools');
    expect(title.length).toBeGreaterThan(0);
  });

  it('tool — includes tool name', () => {
    const title = generatePageTitle('tool', 'Word Counter');
    expect(title).toContain('Word Counter');
    expect(title).toContain('ToyTools');
  });

  it('tool — includes different tool name correctly', () => {
    const title = generatePageTitle('tool', 'Base64 Encoder');
    expect(title).toContain('Base64 Encoder');
  });

  it('guide — includes tool name and guide context', () => {
    const title = generatePageTitle('guide', 'Word Counter');
    expect(title).toContain('Word Counter');
    expect(title).toContain('ToyTools');
  });

  it('faq — includes tool name and FAQ context', () => {
    const title = generatePageTitle('faq', 'Word Counter');
    expect(title).toContain('Word Counter');
    expect(title).toContain('ToyTools');
  });

  it('category — includes category name', () => {
    const title = generatePageTitle('category', 'Text Utilities');
    expect(title).toContain('Text Utilities');
    expect(title).toContain('ToyTools');
  });

  it('search — returns search-specific title', () => {
    const title = generatePageTitle('search');
    expect(title).toContain('ToyTools');
    expect(title.length).toBeGreaterThan(0);
  });

  it('notFound — returns 404 title', () => {
    const title = generatePageTitle('notFound');
    expect(title).toContain('ToyTools');
    expect(title.length).toBeGreaterThan(0);
  });

  it('tool and guide titles differ for same name', () => {
    expect(generatePageTitle('tool', 'Word Counter')).not.toBe(generatePageTitle('guide', 'Word Counter'));
  });

  it('faq and guide titles differ for same name', () => {
    expect(generatePageTitle('faq', 'Word Counter')).not.toBe(generatePageTitle('guide', 'Word Counter'));
  });

  it('home and search produce different titles', () => {
    expect(generatePageTitle('home')).not.toBe(generatePageTitle('search'));
  });

  it('exact home title matches expected value', () => {
    expect(generatePageTitle('home')).toBe('Free Online Tools: Convert, Calculate, Encode ● ToyTools');
  });

  it('home title stays inside the length Google renders without truncating', () => {
    expect(generatePageTitle('home').length).toBeLessThanOrEqual(60);
  });

  it('home title names what the site contains, not only the brand', () => {
    // The title this replaced was three adjectives and a brand, so the homepage
    // matched no query anyone types. Pin the intent, not the exact wording.
    const title = generatePageTitle('home').toLowerCase();
    expect(title).toContain('tools');
    expect(title.replace('toytools', '').trim().length).toBeGreaterThan(20);
  });

  it('exact tool title format', () => {
    expect(generatePageTitle('tool', 'Word Counter')).toBe('Word Counter ● ToyTools');
  });

  it('exact guide title format', () => {
    expect(generatePageTitle('guide', 'Word Counter')).toBe('Word Counter ● ToyTools Guide');
  });

  it('exact faq title format', () => {
    expect(generatePageTitle('faq', 'Word Counter')).toBe('Word Counter FAQ ● ToyTools');
  });

  it('exact search title format', () => {
    expect(generatePageTitle('search')).toBe('Search ● ToyTools');
  });

  it('exact notFound title format', () => {
    expect(generatePageTitle('notFound')).toBe('Page Not Found ● ToyTools');
  });
});

// C3: the suffix now comes from the site identity. Every title text must be byte-for-byte what it
// was when the 15 suffixes were literals, so no page title changes.
describe('generatePageTitle: suffix from src/config/site.ts, text unchanged', () => {
  const pinned: Array<[PageType, string | undefined, string]> = [
    ['home', undefined, 'Free Online Tools: Convert, Calculate, Encode ● ToyTools'],
    ['tool', 'Word Counter', 'Word Counter ● ToyTools'],
    ['guide', 'Word Counter', 'Word Counter ● ToyTools Guide'],
    ['faq', 'Word Counter', 'Word Counter FAQ ● ToyTools'],
    ['category', 'Text Utilities', 'Text Utilities ● ToyTools'],
    ['search', undefined, 'Search ● ToyTools'],
    ['architecture', undefined, 'Architecture ● ToyTools'],
    ['platform', undefined, 'The Platform Behind the Tools ● ToyTools'],
    ['feedback', undefined, 'Suggest a Tool or Report an Issue ● ToyTools'],
    ['privacy', undefined, 'Privacy ● ToyTools'],
    ['about', undefined, 'About ● ToyTools'],
    ['changelog', undefined, 'Changelog ● ToyTools'],
    ['settings', undefined, 'Settings ● ToyTools'],
    ['offline', undefined, 'Offline ● ToyTools'],
    ['notFound', undefined, 'Page Not Found ● ToyTools'],
  ];

  it.each(pinned)('%s title is exactly as before', (type, name, expected) => {
    expect(generatePageTitle(type, name)).toBe(expected);
  });

  it('builds every suffix from TITLE_SUFFIX and BRAND_NAME', () => {
    expect(TITLE_SUFFIX).toBe(' ● ToyTools');
    expect(TITLE_SUFFIX).toBe(` ● ${BRAND_NAME}`);
    for (const [type, name] of pinned) {
      expect(generatePageTitle(type, name)).toContain(TITLE_SUFFIX);
    }
  });

  it('keeps every fixed title within 60 characters and free of "&"', () => {
    for (const [type, name] of pinned) {
      if (name) continue;
      const title = generatePageTitle(type);
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).not.toContain('&');
    }
  });
});
