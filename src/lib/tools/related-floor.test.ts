import { describe, it, expect } from 'vitest';
import { getRelatedTools, getRelatedGuides, clearsRelevanceFloor, relatedSource, MIN_RELATED } from './related';
import type { ToolConfig } from '@data/types';
import { tools } from '@data/registry';
import { graph } from '@lib/knowledge/graph';
import { RELATION_TYPES } from '@lib/knowledge/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'test tool', categorySlug: 'num', tags: [], ...o };
}

describe('relevance floor and fallback (fixtures)', () => {
  const roman = tool({ slug: 'roman', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['roman numerals'] });
  const binary = tool({ slug: 'binary', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['binary'] });
  const words = tool({ slug: 'words', engine: 'encoding', pattern: 'encode', family: 'numeral', tags: ['spell numerals'] });
  const tax = tool({ slug: 'tax', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['sales tax'] });
  const tip = tool({ slug: 'tip', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['restaurant tip'] });
  const sci = tool({ slug: 'sci', engine: 'calc', pattern: 'calc', family: 'arithmetic', tags: ['trigonometry'] });

  it('a category-only match is below the floor; a curated one clears it', () => {
    expect(clearsRelevanceFloor(roman, tax)).toBe(false);
    expect(clearsRelevanceFloor(roman, binary)).toBe(true);
    expect(clearsRelevanceFloor({ ...roman, relatedTools: ['sci'] }, sci)).toBe(true);
    expect(clearsRelevanceFloor(sci, { ...roman, relatedTools: ['sci'] })).toBe(true);
    expect(clearsRelevanceFloor(roman, { ...binary, categorySlug: 'dev' })).toBe(false);
    expect(clearsRelevanceFloor(roman, roman)).toBe(false);
  });

  it('a tool with too few relevant siblings never gets a top-up that shares no word', () => {
    const noFamily = { ...roman, family: undefined };
    expect(getRelatedTools(noFamily, [noFamily, binary, words, tax, tip], 24).map(t => t.slug)).toEqual(['binary', 'words']);
  });

  it('the family door is the one exception: a single below-floor slot, last', () => {
    const r = getRelatedTools(roman, [roman, binary, words, tax, tip], 24).map(t => t.slug);
    expect(r).toEqual(['binary', 'words', 'tax']);
  });

  it('the top-up prefers the below-floor sibling sharing the most words', () => {
    const numeralCalc = tool({ ...sci, slug: 'numcalc', tags: ['roman numerals in sums'] });
    const r = getRelatedTools(roman, [roman, binary, tax, numeralCalc, tip], 24).map(t => t.slug);
    expect(r).toEqual(['binary', 'numcalc']);
  });

  it('takes exactly one sibling in tier order when nothing relevant or word-sharing exists', () => {
    expect(getRelatedTools(tax, [tax, binary, words], 24).map(t => t.slug)).toEqual(['binary']);
  });

  it('group mates do not count towards the minimum', () => {
    const g = (t: ToolConfig) => ({ ...t, toolGroup: 'calcs' });
    const all = [g(tax), g(tip), g(sci), binary, tool({ ...words, slug: 'taxwords', tags: ['tax in words'] })];
    const r = getRelatedTools(all[0], all, 24).map(t => t.slug);
    expect(r).toEqual(['tip', 'sci', 'taxwords']);
  });

  it('a category that is one tool group falls back to the curated lists of the group', () => {
    const coin = tool({ slug: 'coin', categorySlug: 'generate' });
    const dice = tool({ slug: 'dice', categorySlug: 'generate' });
    const a = tool({ slug: 'a', categorySlug: 'games', toolGroup: 'hot', engine: 'g', relatedTools: ['b'] });
    const b = tool({ slug: 'b', categorySlug: 'games', toolGroup: 'hot', engine: 'g', relatedTools: ['coin', 'a', 'dice'] });
    expect(getRelatedTools(a, [a, b, coin, dice], 24).map(t => t.slug)).toEqual(['b', 'coin', 'dice']);
  });

  it('a one-tool category uses its curated list, and nothing when there is none', () => {
    const eq = tool({ slug: 'eq', categorySlug: 'music', relatedTools: ['wave', 'eq', 'ghost'] });
    const wave = tool({ slug: 'wave', categorySlug: 'physics' });
    expect(getRelatedTools(eq, [eq, wave], 24).map(t => t.slug)).toEqual(['wave']);
    expect(getRelatedTools({ ...eq, relatedTools: [] }, [eq, wave], 24)).toEqual([]);
  });
});

// ── Every live tool ───────────────────────────────────────────────────────────
const sameGroup = (a: ToolConfig, b: ToolConfig) => a.toolGroup !== undefined && a.toolGroup === b.toolGroup;
/** A category with no tool outside this tool's group: the only place a link may leave it. */
const isolated = (t: ToolConfig) => !tools.some(o => o.slug !== t.slug && o.categorySlug === t.categorySlug && !sameGroup(t, o));
const shown = (t: ToolConfig) => getRelatedTools(t, tools, 24).filter(r => !sameGroup(t, r)).slice(0, 3);

describe(`related tools across all ${tools.length} live tools`, () => {
  it('covers the whole catalog', () => {
    expect(tools.length).toBeGreaterThanOrEqual(192);
  });

  it('the only categories a link may leave are pinned', () => {
    expect(tools.filter(isolated).map(t => t.slug).sort()).toEqual(
      ['chess-tac-toe', 'connect-4', 'equalizer-settings-generator', 'quantum-tic-tac-toe', 'tic-tac-toe'],
    );
  });

  for (const max of [3, 6, 24]) {
    it(`getRelatedTools(max ${max}): never empty, never self, never outside the category`, () => {
      for (const t of tools) {
        const r = getRelatedTools(t, tools, max);
        expect(r.length, t.slug).toBeGreaterThan(0);
        expect(r.length, t.slug).toBeLessThanOrEqual(max);
        expect(r.some(x => x.slug === t.slug), t.slug).toBe(false);
        expect(new Set(r.map(x => x.slug)).size, t.slug).toBe(r.length);
        if (!isolated(t)) expect(r.filter(x => x.categorySlug !== t.categorySlug).map(x => x.slug), t.slug).toEqual([]);
      }
    });
  }

  it('every tool page names at least one related tool outside its group', () => {
    for (const t of tools) expect(shown(t).length, t.slug).toBeGreaterThan(0);
  });

  it('respects the floor: below-floor tools only as a capped top-up or the family door', () => {
    for (const t of tools) {
      if (isolated(t)) continue;
      const r = getRelatedTools(t, tools, 24);
      const below = r.filter(x => !clearsRelevanceFloor(t, x));
      const cap = relatedSource(t, tools) === 'top-up' ? MIN_RELATED + 1 : 1;
      expect(below.length, `${t.slug}: ${below.map(x => x.slug).join(',')}`).toBeLessThanOrEqual(cap);
      // Everything that cleared the floor ranks ahead of anything that did not (the door is last).
      const firstBelow = r.findIndex(x => !clearsRelevanceFloor(t, x));
      if (firstBelow >= 0) expect(r.slice(firstBelow).every(x => !clearsRelevanceFloor(t, x)), t.slug).toBe(true);
    }
  });

  it('the Roman numeral converter links numeral tools, never tax or tip', () => {
    const roman = tools.find(t => t.slug === 'roman-numeral-converter')!;
    const r = getRelatedTools(roman, tools, 24).map(t => t.slug);
    expect(r.slice(0, 3)).toEqual(['binary-converter', 'number-to-words', 'scientific-calculator']);
    expect(r).not.toContain('tax-calculator');
    expect(r).not.toContain('tip-calculator');
  });

  it('related guides stay in the category too', () => {
    for (const t of tools) {
      const r = getRelatedGuides(t, tools, 6);
      expect(r.some(x => x.slug === t.slug), t.slug).toBe(false);
      expect(r.every(x => x.guide !== undefined), t.slug).toBe(true);
      if (!isolated(t)) expect(r.filter(x => x.categorySlug !== t.categorySlug).map(x => x.slug), t.slug).toEqual([]);
    }
  });

  it('knowledge-graph RELATED_TOOL edges stay in the category', () => {
    const cat = new Map(tools.map(t => [`tool:${t.slug}`, t]));
    for (const e of graph.edges.filter(e => e.type === RELATION_TYPES.RELATED_TOOL)) {
      const from = cat.get(e.from)!, to = cat.get(e.to)!;
      expect(from && to, `${e.from} -> ${e.to}`).toBeTruthy();
      if (!isolated(from)) expect(to.categorySlug, `${e.from} -> ${e.to}`).toBe(from.categorySlug);
    }
  });
});
