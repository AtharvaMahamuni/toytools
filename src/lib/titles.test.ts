import { describe, it, expect } from 'vitest';
import { generatePageTitle } from './titles';

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
