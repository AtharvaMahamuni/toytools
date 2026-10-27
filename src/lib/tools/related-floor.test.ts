import { describe, it, expect } from 'vitest';
import { getRelatedTools, getRelatedGuides, clearsRelevanceFloor, isStrongMatch, linkReason, MIN_RELATED } from './related';
import type { ToolConfig } from '@data/types';
import { tools } from '@data/registry';
import { graph } from '@lib/knowledge/graph';
import { RELATION_TYPES } from '@lib/knowledge/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'test tool', categorySlug: 'num', tags: [], ...o };
}
const slugs = (r: ToolConfig[]) => r.map(t => t.slug);

describe('relevance floor and fallback (fixtures)', () => {
  const roman = tool({ slug: 'roman', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['roman numerals'] });
  const binary = tool({ slug: 'binary', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['binary'] });
  const words = tool({ slug: 'words', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['spell numerals'] });
  const tax = tool({ slug: 'tax', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['sales tax', 'roman numerals'] });
  const tip = tool({ slug: 'tip', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['restaurant tip'] });
  const sci = tool({ slug: 'sci', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['trigonometry'] });

  it('a category-only match is below the floor; a curated one clears it', () => {
    expect(clearsRelevanceFloor(roman, tax)).toBe(false);
    expect(clearsRelevanceFloor(roman, binary)).toBe(true);
    expect(clearsRelevanceFloor({ ...roman, relatedTools: ['sci'] }, sci)).toBe(true);
    expect(clearsRelevanceFloor(sci, { ...roman, relatedTools: ['sci'] })).toBe(true);
    expect(clearsRelevanceFloor(roman, { ...binary, categorySlug: 'dev' })).toBe(false);
    expect(isStrongMatch(roman, { ...binary, categorySlug: 'dev' })).toBe(true);
    expect(clearsRelevanceFloor(roman, roman)).toBe(false);
  });

  it('never tops up with a category-only or word-only sibling, even one sharing words', () => {
    expect(slugs(getRelatedTools(roman, [roman, binary, words, tax, tip], 24))).toEqual(['binary', 'words']);
  });

  it('fills the minimum from a strong match in a neighbouring category, after the in-category floor', () => {
    const b64 = tool({ slug: 'b64', categorySlug: 'dev', engine: 'encoding', pattern: 'encode', family: 'text-encoding' });
    expect(slugs(getRelatedTools(roman, [b64, roman, binary, words, tax, tip], 24))).toEqual(['binary', 'words', 'b64']);
    // Once the floor alone reaches the minimum no fill is needed; b64 is then only the family door.
    const hex = tool({ slug: 'hex', engine: 'encoding', pattern: 'encode', family: 'numeral' });
    expect(slugs(getRelatedTools(roman, [b64, roman, binary, words, hex, tax], 24))).toEqual(['binary', 'words', 'hex', 'b64']);
    expect(slugs(getRelatedTools(roman, [roman, binary, words, hex, tax], 24))).toEqual(['binary', 'words', 'hex']);
  });

  it('a group mate\'s strong matches count as the closest siblings', () => {
    const g = (t: ToolConfig) => ({ ...t, toolGroup: 'calcs' });
    const split = tool({ slug: 'split', categorySlug: 'finance', relatedTools: ['tip'] });
    const all = [g(tax), g(tip), g(sci), binary, words, split];
    const r = slugs(getRelatedTools(all[0], all, 24));
    expect(r).toContain('split');
    expect(r).not.toContain('binary');
    expect(r).not.toContain('words');
  });

  it('second-degree needs two paths, or one into another category', () => {
    const hub1 = tool({ slug: 'h1', family: 'numeral', engine: 'e1' });
    const hub2 = tool({ slug: 'h2', family: 'numeral', engine: 'e2' });
    const me = tool({ slug: 'me', family: 'numeral', engine: 'e0' });
    const far = tool({ slug: 'far', relatedTools: ['h1'] });
    const two = tool({ slug: 'two', relatedTools: ['h1', 'h2'] });
    expect(slugs(getRelatedTools(me, [me, hub1, hub2, far, two], 24))).toEqual(['h1', 'h2', 'two']);
  });

  it('last resort, a single sibling, only when nothing strong exists anywhere', () => {
    expect(slugs(getRelatedTools(tax, [tax, binary, words], 24))).toEqual(['binary']);
  });

  it('a category that is one tool group falls back to the curated lists of the group', () => {
    const coin = tool({ slug: 'coin', categorySlug: 'generate' });
    const dice = tool({ slug: 'dice', categorySlug: 'generate' });
    const a = tool({ slug: 'a', categorySlug: 'games', toolGroup: 'hot', engine: 'g', relatedTools: ['b'] });
    const b = tool({ slug: 'b', categorySlug: 'games', toolGroup: 'hot', engine: 'g', relatedTools: ['coin', 'a', 'dice'] });
    expect(slugs(getRelatedTools(a, [a, b, coin, dice], 24))).toEqual(['b', 'coin', 'dice']);
  });

  it('a one-tool category uses its curated list, and nothing when there is none', () => {
    const eq = tool({ slug: 'eq', categorySlug: 'music', relatedTools: ['wave', 'eq', 'ghost'] });
    const wave = tool({ slug: 'wave', categorySlug: 'physics' });
    expect(slugs(getRelatedTools(eq, [eq, wave], 24))).toEqual(['wave']);
    expect(getRelatedTools({ ...eq, relatedTools: [] }, [eq, wave], 24)).toEqual([]);
  });
});

// ── Every live tool ───────────────────────────────────────────────────────────
const sameGroup = (a: ToolConfig, b: ToolConfig) => a.toolGroup !== undefined && a.toolGroup === b.toolGroup;
const shown = (t: ToolConfig) => getRelatedTools(t, tools, 24).filter(r => !sameGroup(t, r)).slice(0, 3);
const floorVisible = (t: ToolConfig) => tools.filter(o => clearsRelevanceFloor(t, o) && !sameGroup(t, o)).length;
const NUMBER_TOOLS_NOT_FOR_NUMERALS = /tax|tip|discount|margin|markup|percentage/;

describe(`related tools across all ${tools.length} live tools`, () => {
  it('covers the whole catalog', () => {
    expect(tools.length).toBeGreaterThanOrEqual(192);
  });

  it(`every tool page shows at least ${MIN_RELATED} related tools outside its group`, () => {
    for (const t of tools) expect(shown(t).length, `${t.slug}: ${slugs(shown(t)).join(',')}`).toBeGreaterThanOrEqual(MIN_RELATED);
  });

  for (const max of [3, 6, 24]) {
    it(`getRelatedTools(max ${max}): never self or duplicate, every link justified, none weak`, () => {
      for (const t of tools) {
        const r = getRelatedTools(t, tools, max);
        expect(r.length, t.slug).toBeGreaterThan(0);
        expect(r.length, t.slug).toBeLessThanOrEqual(max);
        expect(r.some(x => x.slug === t.slug), t.slug).toBe(false);
        expect(new Set(slugs(r)).size, t.slug).toBe(r.length);
        for (const x of r) {
          const why = linkReason(t, x, tools);
          expect(why === null || why === 'last-resort', `${t.slug} -> ${x.slug} (${why})`).toBe(false);
        }
      }
    });
  }

  it('leaves the category only when the in-category floor is short of the minimum', () => {
    for (const t of tools) {
      const r = getRelatedTools(t, tools, 24);
      // The family door (last slot, another family, a strong match) is the one exception.
      const door = r.at(-1);
      const body = door && t.family && door.family !== t.family && r.slice(0, -1).every(x => x.family === t.family) ? r.slice(0, -1) : r;
      const out = body.filter(x => x.categorySlug !== t.categorySlug);
      if (floorVisible(t) >= MIN_RELATED) expect(slugs(out), t.slug).toEqual([]);
    }
  });

  it('in-category floor links rank first (only the family door may follow a fallback)', () => {
    for (const t of tools) {
      const r = getRelatedTools(t, tools, 24).slice(0, -1);
      const first = r.findIndex(x => !clearsRelevanceFloor(t, x));
      if (first >= 0) expect(r.slice(first).some(x => clearsRelevanceFloor(t, x)), t.slug).toBe(false);
    }
  });

  it('the Roman numeral converter links numeral tools, never tax or tip', () => {
    const roman = tools.find(t => t.slug === 'roman-numeral-converter')!;
    const r = slugs(getRelatedTools(roman, tools, 24));
    expect(r.slice(0, 3)).toEqual(['binary-converter', 'number-to-words', 'scientific-calculator']);
    expect(r.filter(s => NUMBER_TOOLS_NOT_FOR_NUMERALS.test(s))).toEqual([]);
  });

  it('the Binary Converter links numeral and encoding tools, never tax or tip', () => {
    const binary = tools.find(t => t.slug === 'binary-converter')!;
    for (const max of [3, 6, 24]) {
      const r = slugs(getRelatedTools(binary, tools, max));
      expect(r.slice(0, 3)).toEqual(['number-to-words', 'roman-numeral-converter', 'binary-text-converter']);
      expect(r.filter(s => NUMBER_TOOLS_NOT_FOR_NUMERALS.test(s))).toEqual([]);
    }
    expect(slugs(getRelatedGuides(binary, tools, 6)).filter(s => NUMBER_TOOLS_NOT_FOR_NUMERALS.test(s))).toEqual([]);
  });

  it('text counters get no word-only top-up', () => {
    for (const slug of ['paragraph-counter', 'sentence-counter']) {
      const t = tools.find(x => x.slug === slug)!;
      for (const x of getRelatedTools(t, tools, 24)) expect(['floor', 'strong', 'group'], `${slug} -> ${x.slug}`).toContain(linkReason(t, x, tools));
    }
  });

  it('related guides: never self, every one justified', () => {
    for (const t of tools) {
      const r = getRelatedGuides(t, tools, 6);
      expect(r.some(x => x.slug === t.slug), t.slug).toBe(false);
      expect(r.every(x => x.guide !== undefined), t.slug).toBe(true);
      for (const x of r) expect(linkReason(t, x, tools), `${t.slug} -> ${x.slug}`).not.toBe('last-resort');
    }
  });

  it('knowledge-graph RELATED_TOOL edges are all justified', () => {
    const bySlug = new Map(tools.map(t => [`tool:${t.slug}`, t]));
    for (const e of graph.edges.filter(e => e.type === RELATION_TYPES.RELATED_TOOL)) {
      const from = bySlug.get(e.from)!, to = bySlug.get(e.to)!;
      expect(from && to, `${e.from} -> ${e.to}`).toBeTruthy();
      const why = linkReason(from, to, tools);
      expect(why === null || why === 'last-resort', `${e.from} -> ${e.to} (${why})`).toBe(false);
    }
  });
});
