// Quality Guardian's page-type rules must reach real pages and never a redirect stub.
//
// Until beta-v12.1.1 the tool-specific rules in structured-data, performance and content-integrity,
// and the weekly Lighthouse picker, matched the plural `/tools/` prefix, which today serves only
// noindex redirect stubs. They selected zero real pages and passed every run.
//
// The fixture is built from the same sources the site builds its routes from (the content manifest
// for live pages, the redirect tables for stubs), so it is a list of real paths that cannot go
// stale: a new tool, category, guide or redirect appears here the moment it appears on the site.
// selector-coverage.ts runs the same selectors against the crawled dist/ on every PR.

import { describe, expect, it } from 'vitest';
import { contentByType } from '@lib/content/manifest';
import {
  categoriesPrefixRedirects,
  categoryRedirects,
  toolRedirects,
  toolsPrefixRedirects,
} from '@data/tool-redirects';
import { guideRedirects } from '@data/guide-redirects';
import { faqRedirects } from '@data/faq-redirects';
import type { CrawledPage, QualityContext } from '../types/index.js';
import { pageKind, toolPathParts } from '../config/page-kinds.js';
import { structuredDataTargets, structuredDataValidator } from '../validators/structured-data.js';
import { performanceToolPages, performanceValidator } from '../validators/performance.js';
import { contentIntegrityToolPages, contentIntegrityValidator } from '../validators/content-integrity.js';
import { selectorCases, selectorCoverageIssues } from '../validators/selector-coverage.js';
import { selectLighthouseRoutes } from '../workflows/lighthouse-targets.js';

function page(urlPath: string, stub: boolean, overrides: Partial<CrawledPage> = {}): CrawledPage {
  return {
    filePath: `/dist${urlPath}index.html`,
    urlPath,
    title: 'A title long enough',
    description: 'A description',
    canonical: `https://toytoolsapp.com${urlPath}`,
    ogTitle: '',
    ogDescription: '',
    twitterTitle: '',
    twitterDescription: '',
    h1s: stub ? [] : ['Heading'],
    h2s: [],
    internalLinks: [],
    jsonLdBlocks: [],
    robots: stub ? 'noindex, follow' : 'index, follow',
    isRedirectStub: stub,
    fileSizeBytes: 1024,
    altMissingCount: 0,
    ariaLabelMissingCount: 0,
    headingHierarchyViolations: [],
    ...overrides,
  };
}

const live = {
  home: contentByType('home').map(e => e.url),
  tool: contentByType('tool').map(e => e.url),
  category: contentByType('category').map(e => e.url),
  guide: contentByType('guide').map(e => e.url),
};

const stubPaths = [
  ...toolRedirects.map(r => `/tool/${r.oldPath}/`),
  ...toolsPrefixRedirects.map(r => `/tools/${r.oldPath}/`),
  ...categoryRedirects.map(r => `/category/${r.oldSlug}/`),
  ...categoriesPrefixRedirects.map(r => `/categories/${r.oldSlug}/`),
  ...guideRedirects.map(r => `/guide/${r.oldPath}/`),
  ...faqRedirects.map(r => `/faq/${r.oldPath}/`),
];

const pages: CrawledPage[] = [
  ...[...live.home, ...live.tool, ...live.category, ...live.guide].map(p => page(p, false)),
  ...stubPaths.map(p => page(p, true)),
];
const stubSet = new Set(stubPaths);
const ctx = (manifestRoutes: string[] = pages.map(p => p.urlPath)): QualityContext => ({
  distDir: '/nonexistent-dist',
  siteUrl: 'https://toytoolsapp.com',
  manifestRoutes,
});

describe('the fixture is the real site', () => {
  it('has live pages of every kind and stubs that share the live shapes', () => {
    expect(live.tool.length).toBeGreaterThan(100);
    expect(live.category.length).toBeGreaterThan(10);
    expect(live.guide.length).toBeGreaterThan(100);
    // The trap the old prefixes fell into: stubs that look exactly like live tool pages.
    expect(toolRedirects.length).toBeGreaterThan(0);
    expect(stubPaths.some(p => pageKind(p) === 'tool')).toBe(true);
    expect(stubPaths.some(p => p.startsWith('/tools/'))).toBe(true);
    for (const p of [...live.tool, ...live.category, ...live.guide]) expect(stubSet.has(p), p).toBe(false);
  });
});

describe('pageKind', () => {
  it('classifies the live singular shapes', () => {
    expect(pageKind('/')).toBe('homepage');
    expect(pageKind('/tool/text/word-counter/')).toBe('tool');
    expect(pageKind('/category/text-utilities/')).toBe('category');
    expect(pageKind('/guide/text/how-to-count-words/')).toBe('guide');
    expect(pageKind('/faq/text/word-counter/')).toBe('faq');
  });

  it('never treats the plural legacy prefixes or odd depths as a live kind', () => {
    expect(pageKind('/tools/text/word-counter/')).toBe('other');
    expect(pageKind('/categories/text-utilities/')).toBe('other');
    expect(pageKind('/tool/text/')).toBe('other');
    expect(pageKind('/tool/text/word-counter/extra/')).toBe('other');
    expect(pageKind('/tool/text/word-counter')).toBe('other');
    expect(pageKind('/404.html')).toBe('other');
    expect(pageKind('/about/')).toBe('other');
  });

  it('splits a tool path into segment and slug (index 1 and 2 of /tool/<segment>/<slug>/)', () => {
    expect(toolPathParts('/tool/developer-utilities/json-formatter/')).toEqual({
      segment: 'developer-utilities',
      slug: 'json-formatter',
    });
    expect(toolPathParts('/tools/text/word-counter/')).toBeNull();
    expect(toolPathParts('/guide/text/x/')).toBeNull();
  });
});

describe('each page-type rule selects real pages and no redirect stub', () => {
  const cases = selectorCases(pages);

  it.each(cases.map(c => [c.name, c] as const))('%s', (_name, c) => {
    for (const kind of c.kinds) {
      expect(c.paths.filter(p => pageKind(p) === kind).length, `${c.name} → ${kind}`).toBeGreaterThanOrEqual(1);
    }
    expect(c.paths.filter(p => stubSet.has(p))).toEqual([]);
  });

  it('the tool rules reach every live tool page, not just one', () => {
    const all = new Set(live.tool);
    for (const selected of [
      structuredDataTargets(pages, 'tool'),
      performanceToolPages(pages),
      contentIntegrityToolPages(pages),
    ]) {
      expect(new Set(selected.map(p => p.urlPath))).toEqual(all);
    }
    expect(new Set(structuredDataTargets(pages, 'category').map(p => p.urlPath))).toEqual(new Set(live.category));
    expect(new Set(structuredDataTargets(pages, 'guide').map(p => p.urlPath))).toEqual(new Set(live.guide));
  });

  it('selector coverage is clean on the real site', () => {
    expect(selectorCoverageIssues(pages)).toEqual([]);
  });

  it('selector coverage fails when only stubs are left (the pre-fix state)', () => {
    const stubsOnly = [page('/', false), ...stubPaths.map(p => page(p, true))];
    const issues = selectorCoverageIssues(stubsOnly);
    const ids = issues.map(i => i.id);
    expect(ids).toContain('build-integrity:/:selector-misses-tool:structured-data/tool');
    expect(ids).toContain('build-integrity:/:selector-misses-tool:performance/tool-page-budget');
    expect(ids).toContain('build-integrity:/:selector-misses-tool:content-integrity/tool');
    expect(ids).toContain('build-integrity:/:selector-misses-category:structured-data/category');
    expect(ids).toContain('build-integrity:/:selector-misses-guide:weekly/lighthouse');
    expect(issues.every(i => i.severity === 'ERROR')).toBe(true);
  });

  it('selector coverage flags a rule that selects a stub', () => {
    // No shipped selector can do this today (they all go through livePagesOfKind); this pins the
    // alarm for the day one is rewritten by hand.
    const [stub] = stubPaths.filter(p => pageKind(p) === 'tool');
    const issues = selectorCoverageIssues(pages, [
      { name: 'hand-rolled/tool', paths: [...live.tool.slice(0, 1), stub!], kinds: ['tool'] },
    ]);
    expect(issues.map(i => i.id)).toEqual(['build-integrity:/:selector-hits-stub:hand-rolled/tool']);
    expect(issues[0]!.page).toBe(stub);
  });
});

describe('the validators themselves fire on real pages only', () => {
  it('structured-data: tool, category and guide schema rules run on every live page and no stub', async () => {
    const { issues } = await structuredDataValidator.detect(pages, ctx());
    const hit = (code: string) => new Set(issues.filter(i => i.id.endsWith(`:${code}`)).map(i => i.page));
    expect(hit('missing-software-application')).toEqual(new Set(live.tool));
    expect(hit('missing-collection-page')).toEqual(new Set(live.category));
    expect(hit('missing-article')).toEqual(new Set(live.guide));
    expect(issues.filter(i => stubSet.has(i.page))).toEqual([]);
  });

  it('structured-data: a complete tool, category and guide page passes', async () => {
    const block = (types: string[], parsed: unknown = {}) => ({ raw: '{}', parsed, types });
    const ok = [
      page('/tool/text/word-counter/', false, {
        jsonLdBlocks: [
          block(['SoftwareApplication'], { name: 'n', description: 'd', url: 'u', offers: {} }),
          block(['BreadcrumbList']),
        ],
      }),
      page('/category/text-utilities/', false, { jsonLdBlocks: [block(['CollectionPage', 'BreadcrumbList'])] }),
      page('/guide/text/how-to-count-words/', false, { jsonLdBlocks: [block(['Article', 'BreadcrumbList'])] }),
    ];
    const { issues } = await structuredDataValidator.detect(ok, ctx());
    expect(issues).toEqual([]);
  });

  it('performance: the tool page budget measures live tool pages and no stub', async () => {
    const heavy = pages.map(p => ({ ...p, fileSizeBytes: 400 * 1024 }));
    const { issues } = await performanceValidator.detect(heavy, ctx());
    const hit = new Set(issues.filter(i => i.id.endsWith(':tool-page-too-large')).map(i => i.page));
    expect(hit).toEqual(new Set(live.tool));
  });

  it('content-integrity: the FAQ link rule fires for a real FAQ page and ignores FAQ stubs', async () => {
    const [firstTool] = live.tool;
    const parts = toolPathParts(firstTool!)!;
    const realFaq = `/faq/${parts.segment}/${parts.slug}/`;
    const withRealFaq = [...pages.filter(p => p.urlPath !== realFaq), page(realFaq, false)];
    const { issues } = await contentIntegrityValidator.detect(withRealFaq, ctx(withRealFaq.map(p => p.urlPath)));
    const faqIssues = issues.filter(i => i.id.endsWith(':missing-faq-link'));
    expect(faqIssues.map(i => i.page)).toEqual([firstTool]);

    // Linked: no warning.
    const linked = withRealFaq.map(p => (p.urlPath === firstTool ? { ...p, internalLinks: [realFaq] } : p));
    const again = await contentIntegrityValidator.detect(linked, ctx(linked.map(p => p.urlPath)));
    expect(again.issues.filter(i => i.id.endsWith(':missing-faq-link'))).toEqual([]);

    // Today every /faq/ URL is a stub. A tool page must not be asked to link to its own stub.
    const today = await contentIntegrityValidator.detect(pages, ctx());
    expect(today.issues.filter(i => i.id.endsWith(':missing-faq-link'))).toEqual([]);
  });
});

describe('weekly Lighthouse targets', () => {
  it('audits the homepage plus real category, tool and guide pages, never a stub', () => {
    const routes = selectLighthouseRoutes(pages);
    expect(routes[0]).toBe('/');
    expect(routes.filter(r => pageKind(r) === 'category')).toHaveLength(2);
    expect(routes.filter(r => pageKind(r) === 'tool')).toHaveLength(2);
    expect(routes.filter(r => pageKind(r) === 'guide')).toHaveLength(1);
    expect(routes.filter(r => stubSet.has(r))).toEqual([]);
    expect(routes.some(r => r.startsWith('/tools/') || r.startsWith('/categories/') || r.startsWith('/faq/'))).toBe(false);
  });
});
