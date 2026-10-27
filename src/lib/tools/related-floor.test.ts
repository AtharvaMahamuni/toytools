import { describe, it, expect } from 'vitest';
import { getRelatedTools, getRelatedGuides, clearsRelevanceFloor, eligibleCandidates } from './related';
import type { ToolConfig } from '@data/types';
import { tools } from '@data/registry';
import { graph } from '@lib/knowledge/graph';
import { RELATION_TYPES } from '@lib/knowledge/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'test tool', categorySlug: 'num', tags: [], ...o };
}
const slugs = (r: ToolConfig[]) => r.map(t => t.slug);

/**
 * The floor written out a second time, independently of related.ts, so that removing or lowering
 * the floor there (dropping the category check, admitting tier 4 or a word match) fails a test.
 */
function independentFloor(a: ToolConfig, b: ToolConfig): boolean {
  if (a.slug === b.slug || a.categorySlug !== b.categorySlug) return false;
  const pe = !!a.pattern && !!a.engine && a.pattern === b.pattern && a.engine === b.engine;
  const engine = !!a.engine && a.engine === b.engine;
  const family = !!a.family && a.family === b.family;
  const curated = (a.relatedTools ?? []).includes(b.slug) || (b.relatedTools ?? []).includes(a.slug);
  return pe || engine || family || curated;
}

describe('relevance floor (fixtures, mutation-sensitive)', () => {
  const roman = tool({ slug: 'roman', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['roman numerals'] });
  const binary = tool({ slug: 'binary', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['binary'] });
  const words = tool({ slug: 'words', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['numerals in words'] });
  // Same category, shares words with roman, but no engine, pattern, family or curated link.
  const tax = tool({ slug: 'tax', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['roman numerals', 'sales tax'] });
  const tip = tool({ slug: 'tip', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['tip'] });
  // Another category, same engine, pattern and family: strong, but out of the category.
  const b64 = tool({ slug: 'b64', categorySlug: 'dev', engine: 'encoding', pattern: 'encode', family: 'numeral' });

  it('a category-only or word-only sibling is below the floor', () => {
    expect(clearsRelevanceFloor(roman, tax)).toBe(false);
    expect(slugs(getRelatedTools(roman, [roman, tax, tip], 24))).toEqual([]);
  });

  it('a tool in another category is never linked, however strong the match', () => {
    expect(clearsRelevanceFloor(roman, b64)).toBe(false);
    expect(slugs(getRelatedTools(roman, [roman, b64, binary], 24))).toEqual(['binary']);
    expect(slugs(getRelatedTools({ ...roman, relatedTools: ['b64'] }, [roman, b64], 24))).toEqual([]);
  });

  it('accepts fewer links rather than padding: one good sibling gives one link', () => {
    expect(slugs(getRelatedTools(roman, [roman, binary, tax, tip, b64], 24))).toEqual(['binary']);
  });

  it('each way of clearing the floor works on its own', () => {
    const base = { categorySlug: 'num' };
    expect(clearsRelevanceFloor(roman, tool({ slug: 'e', ...base, engine: 'encoding' }))).toBe(true);
    expect(clearsRelevanceFloor(roman, tool({ slug: 'f', ...base, family: 'numeral' }))).toBe(true);
    expect(clearsRelevanceFloor(roman, tool({ slug: 'c', ...base, relatedTools: ['roman'] }))).toBe(true);
    expect(clearsRelevanceFloor({ ...roman, relatedTools: ['c'] }, tool({ slug: 'c', ...base }))).toBe(true);
    expect(clearsRelevanceFloor(roman, roman)).toBe(false);
  });

  it('the family door is only ever an eligible tool', () => {
    const sib = (n: number) => tool({ slug: `s${n}`, engine: 'encoding', pattern: 'encode', family: 'numeral' });
    const all = [roman, ...[1, 2, 3, 4, 5, 6].map(sib), tax, b64];
    expect(slugs(getRelatedTools(roman, all, 5))).toEqual(['s1', 's2', 's3', 's4', 's5']);
    const curatedOutsider = tool({ slug: 'calc', family: 'arithmetic', relatedTools: ['roman'] });
    expect(getRelatedTools(roman, [...all, curatedOutsider], 5).at(-1)?.slug).toBe('calc');
  });

  it('eligibleCandidates is the eligible set, so the bubble check never asks for a weak door', () => {
    expect(slugs(eligibleCandidates(roman, [roman, binary, tax, b64]))).toEqual(['binary']);
  });
});

describe(`related tools across all ${tools.length} live tools`, () => {
  it('covers the whole catalog', () => {
    expect(tools.length).toBeGreaterThanOrEqual(192);
  });

  for (const max of [3, 5, 6, 24]) {
    it(`getRelatedTools(max ${max}): zero out-of-category links, no self, no duplicates, floor held`, () => {
      const out: string[] = [], weak: string[] = [];
      for (const t of tools) {
        const r = getRelatedTools(t, tools, max);
        expect(r.length, t.slug).toBeLessThanOrEqual(max);
        expect(r.some(x => x.slug === t.slug), t.slug).toBe(false);
        expect(new Set(slugs(r)).size, t.slug).toBe(r.length);
        for (const x of r) {
          if (x.categorySlug !== t.categorySlug) out.push(`${t.slug}->${x.slug}`);
          if (!independentFloor(t, x)) weak.push(`${t.slug}->${x.slug}`);
        }
      }
      expect(out).toEqual([]);
      expect(weak).toEqual([]);
    });
  }

  it('related guides: zero out-of-category links, no self, floor held', () => {
    for (const t of tools) {
      for (const x of getRelatedGuides(t, tools, 6)) {
        expect(x.slug, t.slug).not.toBe(t.slug);
        expect(x.guide, `${t.slug}->${x.slug}`).toBeDefined();
        expect(x.categorySlug, `${t.slug}->${x.slug}`).toBe(t.categorySlug);
        expect(independentFloor(t, x), `${t.slug}->${x.slug}`).toBe(true);
      }
    }
  });

  it('knowledge-graph RELATED_TOOL edges: zero out-of-category, floor held', () => {
    const bySlug = new Map(tools.map(t => [`tool:${t.slug}`, t]));
    const edges = graph.edges.filter(e => e.type === RELATION_TYPES.RELATED_TOOL);
    expect(edges.length).toBeGreaterThan(0);
    for (const e of edges) {
      const from = bySlug.get(e.from)!, to = bySlug.get(e.to)!;
      expect(from && to, `${e.from} -> ${e.to}`).toBeTruthy();
      expect(to.categorySlug, `${e.from} -> ${e.to}`).toBe(from.categorySlug);
      expect(independentFloor(from, to), `${e.from} -> ${e.to}`).toBe(true);
    }
  });

  for (const slug of ['number-to-words', 'binary-converter', 'roman-numeral-converter']) {
    it(`${slug} never links the tax or tip calculator`, () => {
      const t = tools.find(x => x.slug === slug)!;
      expect(t, slug).toBeDefined();
      for (const max of [3, 6, 24]) {
        const r = slugs(getRelatedTools(t, tools, max));
        expect(r).not.toContain('tax-calculator');
        expect(r).not.toContain('tip-calculator');
      }
      const g = slugs(getRelatedGuides(t, tools, 6));
      expect(g).not.toContain('tax-calculator');
      expect(g).not.toContain('tip-calculator');
    });
  }

  it('the Roman numeral converter links its numeral siblings first', () => {
    const roman = tools.find(t => t.slug === 'roman-numeral-converter')!;
    expect(slugs(getRelatedTools(roman, tools, 3))).toEqual(['binary-converter', 'number-to-words', 'scientific-calculator']);
  });
});
