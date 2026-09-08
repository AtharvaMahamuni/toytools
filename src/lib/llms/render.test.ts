import { describe, expect, it } from 'vitest';
import { CORE_TOOL_SLUGS, renderLlmsTxt } from './render';
import { tools } from '@data/registry';
import { PRIVACY_LINE } from '@lib/privacy';
import type { ContentEntry } from '@lib/content/manifest';

const SITE = 'https://toytoolsapp.com/';

const categories: ContentEntry[] = [
  { type: 'category', slug: 'text-utilities', url: '/category/text-utilities/', categorySlug: 'text-utilities', priority: 0.8, changefreq: 'weekly' },
];
const platform: ContentEntry = { type: 'page', slug: 'platform', url: '/platform/', priority: 0.5, changefreq: 'monthly' };
const feedback: ContentEntry = { type: 'page', slug: 'feedback', url: '/feedback/', priority: 0.6, changefreq: 'monthly' };

describe('renderLlmsTxt', () => {
  const txt = renderLlmsTxt(categories, feedback, SITE, platform);

  it('opens with the site name and the canonical privacy line', () => {
    expect(txt.startsWith('# ToyTools\n')).toBe(true);
    expect(txt).toContain(PRIVACY_LINE);
  });

  it('lists every core tool as an absolute URL that exists in the registry', () => {
    expect(CORE_TOOL_SLUGS).toHaveLength(25);
    const known = new Set(tools.map(t => t.slug));
    for (const slug of CORE_TOOL_SLUGS) {
      expect(known.has(slug), slug).toBe(true);
      expect(txt).toContain(`/${slug}/`);
      expect(txt).toContain('https://toytoolsapp.com/tool/');
    }
  });

  it('puts Core tools above Categories', () => {
    const coreAt = txt.indexOf('## Core tools');
    const catsAt = txt.indexOf('## Categories');
    expect(coreAt).toBeGreaterThan(0);
    expect(catsAt).toBeGreaterThan(coreAt);
  });

  it('still lists categories and the platform page', () => {
    expect(txt).toContain('/category/text-utilities/');
    expect(txt).toContain('/platform/');
    expect(txt).toContain('/feedback/');
  });
});
