import { describe, expect, it } from 'vitest';
import { allToolFacts, toolFacts } from './facts';
import { tools } from '@data/registry';
import { categories } from '@data/categories';
import { faqsByToolSlug } from '@data/faq-registry';
import type { Tool } from '@data/types';
import { getKnowledge } from '@lib/knowledge/registry';
import { canonicalFor } from '@lib/paths';
import { privacyStatement } from '@lib/privacy';

const SITE = 'https://toytoolsapp.com/';

describe('allToolFacts', () => {
  const facts = allToolFacts(SITE);

  it('has exactly one entry per registry tool, in registry order', () => {
    expect(facts.map(f => f.slug)).toEqual(tools.map(t => t.slug));
    expect(new Set(facts.map(f => f.slug)).size).toBe(tools.length);
  });

  it('takes every URL from the builder', () => {
    for (const [i, f] of facts.entries()) {
      const tool = tools[i]!;
      const segment = categories.find(c => c.slug === tool.categorySlug)!.segment;
      expect(f.urls.tool).toBe(canonicalFor({ kind: 'tool', slug: tool.slug, segment }, SITE));
      expect(f.urls.guide).toBe(tool.guide ? canonicalFor({ kind: 'guide', ...tool.guide }, SITE) : undefined);
    }
    expect(facts.filter(f => f.urls.guide).length).toBeGreaterThan(100);
  });

  it('joins the registry, knowledge, FAQ and privacy sources for each tool', () => {
    for (const [i, f] of facts.entries()) {
      const tool = tools[i]!;
      const knowledge = getKnowledge(tool.slug);
      const category = categories.find(c => c.slug === tool.categorySlug)!;
      expect(f).toEqual({
        slug: tool.slug,
        name: tool.name,
        category: { slug: category.slug, segment: category.segment, name: category.name },
        pattern: tool.pattern,
        tagline: tool.tagline ?? tool.description,
        summary: knowledge?.summary,
        problem: tool.citation?.problem,
        doesNot: tool.citation?.nonGoal,
        privacy: privacyStatement(tool.trustVariant),
        inputs: knowledge?.inputs ?? [],
        outputs: knowledge?.outputs ?? [],
        useCases: knowledge?.realWorldUseCases ?? [],
        exampleQuery: knowledge?.intentGroups.howTo[0],
        methodology: tool.methodology,
        faq: faqsByToolSlug[tool.slug] ?? [],
        urls: f.urls,
        updatedAt: tool.updatedAt,
      });
    }
  });

  it('carries real data from each source, not just empty defaults', () => {
    expect(facts.every(f => f.summary)).toBe(true);
    expect(facts.filter(f => f.faq.length > 0).length).toBeGreaterThan(100);
    expect(facts.filter(f => f.doesNot).length).toBeGreaterThan(0);
    expect(facts.filter(f => f.methodology).length).toBeGreaterThan(0);
    expect(facts.filter(f => f.useCases.length > 0).length).toBeGreaterThan(100);
  });
});

describe('allToolFacts site and catalog', () => {
  const fixture: Tool = { slug: 'x-tool', name: 'X Tool', description: 'Does x.', categorySlug: 'text-utilities', tags: [] };

  it('puts every URL, guides included, on the site of each call', () => {
    const [a, b] = [allToolFacts('https://a.test/'), allToolFacts('https://b.test/')];
    for (const [facts, origin] of [[a, 'https://a.test/'], [b, 'https://b.test/']] as const) {
      expect(facts.every(f => f.urls.tool.startsWith(origin))).toBe(true);
      const guides = facts.flatMap(f => (f.urls.guide ? [f.urls.guide] : []));
      expect(guides.length).toBeGreaterThan(100);
      expect(guides.every(g => g.startsWith(origin))).toBe(true);
    }
  });

  it('maps only the catalog it is given, and the registry otherwise', () => {
    expect(allToolFacts(SITE).length).toBe(tools.length);
    expect(allToolFacts(SITE, [fixture]).map(f => f.slug)).toEqual(['x-tool']);
    expect(allToolFacts(SITE, []).length).toBe(0);
    expect(allToolFacts(SITE).map(f => f.slug)).toEqual(tools.map(t => t.slug));
  });
});

describe('toolFacts', () => {
  const base: Tool = { slug: 'x-tool', name: 'X Tool', description: 'Does x. Then y.', categorySlug: 'text-utilities', tags: [] };

  it('falls back to the description while a tool has no tagline', () => {
    expect(toolFacts(base, SITE).tagline).toBe('Does x. Then y.');
    expect(toolFacts({ ...base, tagline: 'Short x.' }, SITE).tagline).toBe('Short x.');
  });

  it('reads the tool it is given, not a copy of the registry', () => {
    const f = toolFacts({ ...tools[0]!, name: 'Changed name', tagline: 'Changed.' }, SITE);
    expect([f.name, f.tagline]).toEqual(['Changed name', 'Changed.']);
  });

  it('puts URLs on the site it is given, and on the production origin by default', () => {
    expect(toolFacts(base, 'https://example.test/').urls.tool).toBe('https://example.test/tool/text/x-tool/');
    expect(toolFacts(base).urls.tool).toBe('https://toytoolsapp.com/tool/text/x-tool/');
  });

  it('gives a tool with no knowledge or FAQ empty lists, not undefined', () => {
    const f = toolFacts(base, SITE);
    expect([f.summary, f.exampleQuery, f.doesNot, f.urls.guide]).toEqual([undefined, undefined, undefined, undefined]);
    expect([f.inputs, f.outputs, f.useCases, f.faq]).toEqual([[], [], [], []]);
  });

  it('keeps the category slug as the segment for a category missing from categories.ts', () => {
    const f = toolFacts({ ...base, categorySlug: 'no-such-category' }, SITE);
    expect(f.category).toEqual({ slug: 'no-such-category', segment: 'no-such-category', name: undefined });
    expect(f.urls.tool).toBe('https://toytoolsapp.com/tool/no-such-category/x-tool/');
  });
});
