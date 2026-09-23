import { describe, it, expect } from 'vitest';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import {
  toolRedirects,
  categoryRedirects,
  toolsPrefixRedirects,
  categoriesPrefixRedirects,
} from './tool-redirects';
import { faqRedirects } from './faq-redirects';
import { guideRedirects } from './guide-redirects';
import { sitemapRedirects, SITEMAP_STUB_TARGET } from './sitemap-redirects';
import { contentByType } from '@lib/content/manifest';

function liveToolPath(slug: string): string {
  const tool = tools.find(t => t.slug === slug);
  if (!tool) throw new Error(`unknown tool slug ${slug}`);
  const category = categories.find(c => c.slug === tool.categorySlug);
  if (!category) throw new Error(`unresolved category for ${slug}`);
  return `/tool/${category.segment}/${tool.slug}/`;
}

const liveTools = new Set(tools.map(t => liveToolPath(t.slug)));
const liveGuides = new Set(
  tools.flatMap(t => t.guide ? [`/guide/${t.guide.categorySlug}/${t.guide.slug}/`] : []),
);
const liveCategories = new Set(categories.map(c => `/category/${c.slug}/`));

describe('redirect stubs', () => {
  it('tool redirects resolve to a different live tool URL', () => {
    const olds = toolRedirects.map(r => r.oldPath);
    expect(new Set(olds).size).toBe(olds.length);
    expect(olds).toContain('text/case-converter');
    for (const redirect of toolRedirects) {
      const live = liveToolPath(redirect.toolSlug);
      expect(liveTools.has(live)).toBe(true);
      expect(`/tool/${redirect.oldPath}/`).not.toBe(live);
    }
  });

  it('legacy /tool/developer/json-* and siblings redirect to developer-utilities', () => {
    for (const slug of [
      'json-formatter',
      'json-minifier',
      'json-validator',
      'base64-encoder-decoder',
      'html-entity-encoder-decoder',
      'md5-hash-generator',
      'sha1-hash-generator',
      'sha256-hash-generator',
      'url-encoder-decoder',
    ]) {
      const entry = toolRedirects.find(r => r.oldPath === `developer/${slug}`);
      expect(entry, `missing tool redirect for developer/${slug}`).toBeTruthy();
      expect(entry!.toolSlug).toBe(slug);
      expect(liveToolPath(slug)).toBe(`/tool/developer-utilities/${slug}/`);
    }
  });

  it('plural /tools/ redirects cover every live tool plus historical extras', () => {
    const olds = toolsPrefixRedirects.map(r => r.oldPath);
    expect(new Set(olds).size).toBe(olds.length);

    // Every live tool has /tools/{segment}/{slug}/ → /tool/{segment}/{slug}/
    for (const tool of tools) {
      const category = categories.find(c => c.slug === tool.categorySlug)!;
      const oldPath = `${category.segment}/${tool.slug}`;
      const entry = toolsPrefixRedirects.find(r => r.oldPath === oldPath);
      expect(entry, `missing tools-prefix redirect for ${oldPath}`).toBeTruthy();
      expect(entry!.toolSlug).toBe(tool.slug);
    }

    // Historical extras that are not live segment/slug paths.
    for (const required of [
      'developer/base64-encoder-decoder',
      'developer/json-formatter',
      'developer/json-minifier',
      'developer/json-validator',
      'developer/html-entity-encoder-decoder',
      'developer/md5-hash-generator',
      'developer/sha1-hash-generator',
      'developer/sha256-hash-generator',
      'developer/url-encoder-decoder',
      'text/case-converter',
      'word-counter',
      'percentage-calculator',
      'base64-encoder',
      'case-converter',
      'productivity/keep-screen-awake',
      'productivity/pomodoro-timer',
    ]) {
      expect(olds, `missing historical tools-prefix path ${required}`).toContain(required);
    }

    for (const redirect of toolsPrefixRedirects) {
      const live = liveToolPath(redirect.toolSlug);
      expect(liveTools.has(live)).toBe(true);
      expect(`/tools/${redirect.oldPath}/`).not.toBe(live);
    }
    expect(liveToolPath('base64-encoder-decoder')).toBe('/tool/developer-utilities/base64-encoder-decoder/');
    expect(liveToolPath('title-case-converter')).toBe('/tool/text/title-case-converter/');
    expect(toolsPrefixRedirects.length).toBeGreaterThanOrEqual(tools.length + 14);
  });

  it('category redirects, singular and plural, resolve to live categories', () => {
    expect(categoryRedirects.map(r => r.oldSlug)).toEqual(['developer-tools']);
    const plural = categoriesPrefixRedirects.map(r => r.oldSlug);
    expect(plural.sort()).toEqual([
      'developer-tools',
      'number-utilities',
      'productivity',
      'text-utilities',
    ]);
    for (const redirect of [...categoryRedirects, ...categoriesPrefixRedirects]) {
      const live = `/category/${redirect.categorySlug}/`;
      expect(liveCategories.has(live)).toBe(true);
    }
    const developer = categoriesPrefixRedirects.find(r => r.oldSlug === 'developer-tools');
    expect(developer?.categorySlug).toBe('developer-utilities');
  });

  it('faq redirects include the missed case-converter URL and resolve', () => {
    const olds = faqRedirects.map(r => r.oldPath);
    expect(new Set(olds).size).toBe(olds.length);
    expect(olds).toContain('text/case-converter');
    for (const redirect of faqRedirects) {
      expect(liveTools.has(liveToolPath(redirect.toolSlug))).toBe(true);
    }
  });

  it('guide redirects cover the developer rename and the deleted case-converter guide', () => {
    const olds = guideRedirects.map(r => r.oldPath);
    expect(new Set(olds).size).toBe(olds.length);
    expect(olds).toEqual([
      'developer/what-is-base64',
      'developer/what-is-html-entity-encoding',
      'developer/what-is-json-formatting',
      'developer/what-is-json-minification',
      'developer/how-to-validate-json',
      'developer/what-is-md5',
      'developer/what-is-sha1',
      'developer/what-is-sha256',
      'developer/what-is-url-encoding',
      'text/how-to-change-text-case',
    ]);
    for (const redirect of guideRedirects) {
      expect(liveGuides.has(`/guide/${redirect.oldPath}/`)).toBe(false);
      const live = liveGuides.has(redirect.targetPath) || liveTools.has(redirect.targetPath);
      expect(live, redirect.targetPath).toBe(true);
    }
    const moved = guideRedirects.find(r => r.oldPath === 'text/how-to-change-text-case');
    expect(moved?.targetPath).toBe('/tool/text/title-case-converter/');
  });

  it('retired sitemap filenames point at the current index and nowhere else', () => {
    expect(sitemapRedirects.map(r => r.oldPath)).toEqual([
      '/sitemap-0.xml',
      '/sitemaps/faqs.xml',
      '/sitemaps/languages.xml',
    ]);
    expect(SITEMAP_STUB_TARGET).toBe('/sitemap-index.xml');
  });

  it('content manifest / sitemap registry emit only canonical /tool/ paths', () => {
    const toolEntries = contentByType('tool');
    expect(toolEntries.length).toBe(tools.length);
    for (const entry of toolEntries) {
      expect(entry.url.startsWith('/tool/'), entry.url).toBe(true);
      expect(entry.url.includes('/tools/'), entry.url).toBe(false);
      expect(entry.url.includes('/tool/developer/'), entry.url).toBe(false);
    }
  });
});
