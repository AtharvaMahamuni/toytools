import { describe, it, expect } from 'vitest';
import { buildGraph } from './graph';
import { buildKnowledgeMap } from './registry';
import { makeKnowledge } from './fixtures';
import { getRecommendations } from './recommendations';
import type { Category, Knowledge } from './types';
import type { ToolConfig } from '@data/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], ...o };
}

const categories: Category[] = [
  { slug: 'developer-tools', name: 'Developer Tools', description: '', segment: 'developer', toolCount: 0, engines: [] } as unknown as Category,
];

const tools: ToolConfig[] = [
  tool({ slug: 'base64' }),
  tool({ slug: 'json-formatter' }),
  tool({ slug: 'json-validator' }),
  tool({ slug: 'json-minifier' }),
];

const knowledge: Map<string, Knowledge> = buildKnowledgeMap([
  makeKnowledge({
    slug: 'base64',
    usedWith: [{ slug: 'json-formatter', reason: 'Format decoded JSON' }],
    nextSteps: [{ slug: 'json-validator' }],
    alternatives: [{ slug: 'json-minifier' }],
  }),
  makeKnowledge({ slug: 'json-formatter' }), // no overlay relationships
]);

const g = buildGraph(tools, categories, knowledge);

describe('getRecommendations', () => {
  it('builds You-May-Also-Need / Next-Steps / Alternatives blocks', () => {
    const blocks = getRecommendations('base64', 4, g);
    const keys = blocks.map(b => b.key);
    expect(keys).toEqual(['used-with', 'next-steps', 'alternatives']);
  });

  it('passes the relationship reason through to items', () => {
    const blocks = getRecommendations('base64', 4, g);
    const used = blocks.find(b => b.key === 'used-with');
    expect(used?.items[0].reason).toBe('Format decoded JSON');
  });

  it('omits empty blocks entirely', () => {
    expect(getRecommendations('json-formatter', 4, g)).toEqual([]);
  });

  it('returns nothing for a tool without a knowledge file', () => {
    expect(getRecommendations('json-minifier', 4, g)).toEqual([]);
  });

  it('never throws for an unknown slug', () => {
    expect(getRecommendations('does-not-exist', 4, g)).toEqual([]);
  });

  it('dedupes a target that appears twice within a block', () => {
    const kn = buildKnowledgeMap([
      makeKnowledge({
        slug: 'base64',
        usedWith: [
          { slug: 'json-formatter', reason: 'first' },
          { slug: 'json-formatter', reason: 'duplicate' },
        ],
      }),
    ]);
    const g2 = buildGraph(tools, categories, kn);
    const used = getRecommendations('base64', 4, g2).find(b => b.key === 'used-with');
    expect(used?.items).toHaveLength(1);
  });

  it('renders each target once across blocks, in the first block that names it (audit item 20)', () => {
    const kn = buildKnowledgeMap([
      makeKnowledge({
        slug: 'base64',
        usedWith: [{ slug: 'json-formatter' }],
        nextSteps: [{ slug: 'json-formatter' }, { slug: 'json-validator' }],
        alternatives: [{ slug: 'json-formatter' }, { slug: 'json-validator' }],
      }),
    ]);
    const blocks = getRecommendations('base64', 4, buildGraph(tools, categories, kn));
    expect(blocks.map(b => [b.key, b.items.map(i => i.node.slug)])).toEqual([
      ['used-with', ['json-formatter']],
      ['next-steps', ['json-validator']],
    ]); // alternatives held only repeats, so the block is omitted
  });

  it('caps a block after the dedupe, so a repeat does not cost it a slot', () => {
    const kn = buildKnowledgeMap([
      makeKnowledge({
        slug: 'base64',
        usedWith: [{ slug: 'json-formatter' }],
        nextSteps: [{ slug: 'json-formatter' }, { slug: 'json-validator' }, { slug: 'json-minifier' }],
      }),
    ]);
    const next = getRecommendations('base64', 2, buildGraph(tools, categories, kn)).find(b => b.key === 'next-steps');
    expect(next?.items.map(i => i.node.slug)).toEqual(['json-validator', 'json-minifier']);
  });
});
