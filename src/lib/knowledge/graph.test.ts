import { describe, it, expect } from 'vitest';
import { buildGraph } from './graph';
import { buildKnowledgeMap } from './registry';
import { makeKnowledge } from './fixtures';
import { CONTENT_TYPES, RELATION_TYPES, type Category, type Knowledge } from './types';
import type { ToolConfig } from '@data/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], ...o };
}

const categories: Category[] = [
  { slug: 'developer-tools', name: 'Developer Tools', description: '', segment: 'developer', toolCount: 0, engines: [] } as unknown as Category,
];

const tools: ToolConfig[] = [
  tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'g-fmt', categorySlug: 'developer', title: 'Fmt', description: '', readMinutes: 4, updatedAt: 'x' }, faq: { slug: 'json-formatter', categorySlug: 'developer' } }),
  tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'g-min', categorySlug: 'developer', title: 'Min', description: '', readMinutes: 4, updatedAt: 'x' } }),
  tool({ slug: 'json-validator', engine: 'structured-data', pattern: 'structured-validate', family: 'json' }),
];

const knowledge: Map<string, Knowledge> = buildKnowledgeMap([
  makeKnowledge({
    slug: 'json-formatter',
    usedWith: [{ slug: 'json-validator', reason: 'Catch errors first', strength: 0.8 }],
    nextSteps: [{ slug: 'json-minifier', reason: 'Shrink before shipping', priority: 1 }],
  }),
]);

describe('buildGraph', () => {
  const g = buildGraph(tools, categories, knowledge);

  it('creates tool, guide, faq, and category nodes', () => {
    expect(g.nodes.find(n => n.id === 'tool:json-formatter')).toBeTruthy();
    expect(g.nodes.find(n => n.id === 'guide:json-formatter')).toBeTruthy();
    expect(g.nodes.find(n => n.id === 'faq:json-formatter')).toBeTruthy();
    expect(g.nodes.find(n => n.id === 'category:developer-tools')).toBeTruthy();
  });

  it('only creates guide/faq nodes when the tool has them', () => {
    expect(g.nodes.find(n => n.id === 'faq:json-minifier')).toBeFalsy();
    expect(g.nodes.find(n => n.id === 'guide:json-validator')).toBeFalsy();
  });

  it('emits a BELONGS_TO_CATEGORY edge per tool', () => {
    const e = g.edges.find(e => e.from === 'tool:json-formatter' && e.type === RELATION_TYPES.BELONGS_TO_CATEGORY);
    expect(e?.to).toBe('category:developer-tools');
  });

  it('derives RELATED_TOOL edges with tier-based strength', () => {
    const rel = g.edges.filter(e => e.from === 'tool:json-formatter' && e.type === RELATION_TYPES.RELATED_TOOL);
    // json-minifier shares engine+pattern (tier 1 → 0.9)
    const toMin = rel.find(e => e.to === 'tool:json-minifier');
    expect(toMin?.strength).toBe(0.9);
  });

  it('only derives RELATED_GUIDE edges to tools that have guides', () => {
    const guides = g.edges.filter(e => e.from === 'tool:json-formatter' && e.type === RELATION_TYPES.RELATED_GUIDE);
    expect(guides.every(e => e.to.startsWith('guide:'))).toBe(true);
    expect(guides.find(e => e.to === 'guide:json-validator')).toBeFalsy(); // validator has no guide
  });

  it('adds overlay edges preserving reason/strength/priority', () => {
    const usedWith = g.edges.find(e => e.from === 'tool:json-formatter' && e.type === RELATION_TYPES.USED_WITH);
    expect(usedWith?.to).toBe('tool:json-validator');
    expect(usedWith?.reason).toBe('Catch errors first');
    expect(usedWith?.strength).toBe(0.8);
    const next = g.edges.find(e => e.type === RELATION_TYPES.NEXT_STEP);
    expect(next?.priority).toBe(1);
  });

  it('drops overlay edges whose target does not resolve', () => {
    const kn = buildKnowledgeMap([makeKnowledge({ slug: 'json-formatter', usedWith: [{ slug: 'ghost-tool' }] })]);
    const g2 = buildGraph(tools, categories, kn);
    expect(g2.edges.find(e => e.to === 'tool:ghost-tool')).toBeFalsy();
  });

  it('builds an adjacency map keyed by from-node', () => {
    expect(g.adjacency.get('tool:json-formatter')?.length).toBeGreaterThan(0);
    expect(g.adjacency.has('tool:does-not-exist')).toBe(false);
  });

  it('ignores tools without knowledge for overlay edges', () => {
    const overlay = g.edges.filter(e => e.from === 'tool:json-minifier' && e.type === RELATION_TYPES.USED_WITH);
    expect(overlay).toHaveLength(0);
  });
});
