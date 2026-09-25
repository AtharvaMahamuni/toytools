import { describe, expect, it } from 'vitest';
import { CORE_TOOL_SLUGS, doesNotLine, renderLlmsFull, renderLlmsTxt } from './render';
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

  it('points at the full inventory without inlining it', () => {
    expect(txt).toContain('https://toytoolsapp.com/llms-full.txt');
    expect(txt.indexOf('llms-full.txt')).toBeLessThan(txt.indexOf('## Core tools'));
  });
});

describe('renderLlmsFull', () => {
  const full = renderLlmsFull(SITE);

  it('lists every published tool once, with an absolute tool URL', () => {
    const urls = [...full.matchAll(/^URL: (\S+)$/gm)].map(m => m[1]);
    expect(urls).toHaveLength(tools.length);
    expect(new Set(urls).size).toBe(tools.length);
    for (const tool of tools) {
      expect(urls.some(url => url.endsWith(`/${tool.slug}/`)), tool.slug).toBe(true);
      expect(full).toContain(`## ${tool.name}`);
    }
    expect(urls.every(url => url.startsWith('https://toytoolsapp.com/tool/'))).toBe(true);
  });

  it('states privacy and a non-goal on every block', () => {
    const blocks = full.split(/\n(?=## )/).filter(block => block.startsWith('## '));
    expect(blocks.length).toBe(tools.length);
    for (const block of blocks) {
      expect(block).toMatch(/^Use for: \S/m);
      expect(block).toMatch(/^Privacy: \S/m);
      expect(block).toMatch(/^Does not: \S/m);
    }
    expect(full).toContain(PRIVACY_LINE);
  });

  it('uses a lookup tool\'s real privacy claim', () => {
    const ip = full.split(/\n(?=## )/).find(block => block.includes('/what-is-my-ip/'));
    expect(ip).toBeTruthy();
    expect(ip).toContain('IP echo');
    expect(ip).not.toContain('Nothing is uploaded');
  });

  it('capitalises a citation non-goal', () => {
    expect(doesNotLine(undefined)).toBe('Call an AI model.');
    expect(doesNotLine('verify the signature.')).toBe('Verify the signature.');
  });
});
