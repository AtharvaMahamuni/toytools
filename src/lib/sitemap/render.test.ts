import { describe, it, expect } from 'vitest';
import { escapeXml, absoluteUrl, isW3CDate, renderUrlset, renderSitemapIndex } from './render';
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

  it('emits <lastmod> only for entries with a valid W3C (YYYY-MM-DD) updatedAt', () => {
    const mixed: ContentEntry[] = [
      { type: 'tool', slug: 't', url: '/tool/developer/t/', updatedAt: '2026-06-04', priority: 0.9, changefreq: 'monthly' },
      { type: 'guide', slug: 'g', url: '/guide/developer/g/', updatedAt: 'Jun 2026', priority: 0.7, changefreq: 'monthly' },
      { type: 'category', slug: 'c', url: '/category/developer-utilities/', priority: 0.8, changefreq: 'weekly' },
    ];
    const out = renderUrlset(mixed, SITE);
    expect(out).toContain('<lastmod>2026-06-04</lastmod>');      // tool: ISO date → emitted
    expect(out).not.toContain('<lastmod>Jun 2026</lastmod>');    // guide: display string → skipped
    expect((out.match(/<lastmod>/g) ?? []).length).toBe(1);      // category: no updatedAt → skipped
  });
});

describe('isW3CDate', () => {
  it('accepts a calendar-valid YYYY-MM-DD', () => expect(isW3CDate('2026-06-04')).toBe(true));
  it('rejects display strings', () => expect(isW3CDate('Jun 2026')).toBe(false));
  it('rejects undefined / empty', () => {
    expect(isW3CDate(undefined)).toBe(false);
    expect(isW3CDate('')).toBe(false);
  });
  it('rejects an impossible calendar date', () => expect(isW3CDate('2026-13-40')).toBe(false));
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
