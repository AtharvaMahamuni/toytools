import { describe, it, expect } from 'vitest';
import { escapeXml, absoluteUrl, renderUrlset, renderSitemapIndex } from './render';
import type { ContentEntry } from '@lib/content/manifest';

const SITE = 'https://toytoolsapp.com/';

const entries: ContentEntry[] = [
  { type: 'tool', slug: 'a', url: '/tool/developer/a/', priority: 0.9, changefreq: 'monthly' },
  { type: 'tool', slug: 'b', url: '/tool/developer/b/', priority: 0.9, changefreq: 'monthly' },
];

describe('escapeXml', () => {
  it('escapes XML-significant characters', () =>
    expect(escapeXml(`a&b<c>"d"'e'`)).toBe('a&amp;b&lt;c&gt;&quot;d&quot;&apos;e&apos;'));
});

describe('absoluteUrl', () => {
  it('resolves a site-relative path against the site origin', () =>
    expect(absoluteUrl('/tool/developer/a/', SITE)).toBe('https://toytoolsapp.com/tool/developer/a/'));
});

describe('renderUrlset', () => {
  const xml = renderUrlset(entries, SITE);
  it('declares the urlset namespace', () => expect(xml).toContain('<urlset xmlns='));
  it('emits one <loc> per entry as an absolute URL', () => {
    expect(xml).toContain('<loc>https://toytoolsapp.com/tool/developer/a/</loc>');
    expect(xml).toContain('<loc>https://toytoolsapp.com/tool/developer/b/</loc>');
    expect((xml.match(/<url>/g) ?? []).length).toBe(2);
  });
  it('starts with the XML declaration', () => expect(xml.startsWith('<?xml')).toBe(true));
});

describe('renderSitemapIndex', () => {
  const xml = renderSitemapIndex(['/sitemaps/tools.xml', '/sitemaps/guides.xml'], SITE);
  it('declares the sitemapindex element', () => expect(xml).toContain('<sitemapindex xmlns='));
  it('references each bucket as an absolute URL', () => {
    expect(xml).toContain('<loc>https://toytoolsapp.com/sitemaps/tools.xml</loc>');
    expect(xml).toContain('<loc>https://toytoolsapp.com/sitemaps/guides.xml</loc>');
    expect((xml.match(/<sitemap>/g) ?? []).length).toBe(2);
  });
});
