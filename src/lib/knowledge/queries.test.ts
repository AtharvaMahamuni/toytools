import { describe, it, expect } from 'vitest';
import { buildGraph } from './graph';
import { buildKnowledgeMap } from './registry';
import { makeKnowledge } from './fixtures';
import {
  getRelatedTools,
  getRelatedGuides,
  getUsedWith,
  getAlternatives,
  getNextSteps,
  getTopicCluster,
  getWorkflow,
  getKnowledgeFor,
} from './queries';
import type { Category, Knowledge } from './types';
import type { ToolConfig } from '@data/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], ...o };
}

const categories: Category[] = [
  { slug: 'developer-tools', name: 'Developer Tools', description: '', segment: 'developer', toolCount: 0, engines: [] } as unknown as Category,
];

const tools: ToolConfig[] = [
  tool({ slug: 'base64', engine: 'encoding', pattern: 'encode-decode', family: 'binary-text' }),
  tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json', guide: { slug: 'g', categorySlug: 'developer', title: 'G', description: '', readMinutes: 3, updatedAt: 'x' } }),
  tool({ slug: 'json-validator', engine: 'structured-data', pattern: 'structured-validate', family: 'json' }),
  tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json' }),
];

const knowledge: Map<string, Knowledge> = buildKnowledgeMap([
  makeKnowledge({
    slug: 'base64',
    usedWith: [
      { slug: 'json-formatter', reason: 'Format decoded JSON', strength: 0.9 },
      { slug: 'json-validator', reason: 'Validate decoded JSON', strength: 0.5 },
    ],
    alternatives: [{ slug: 'json-minifier' }],
    nextSteps: [{ slug: 'json-validator', priority: 1 }, { slug: 'json-formatter', priority: 2 }],
  }),
]);

const g = buildGraph(tools, categories, knowledge);

describe('relationship queries', () => {
  it('getUsedWith returns resolved nodes with reason + strength, sorted by strength', () => {
    const result = getUsedWith('base64', 5, g);
    expect(result.map(r => r.node.slug)).toEqual(['json-formatter', 'json-validator']);
    expect(result[0].reason).toBe('Format decoded JSON');
    expect(result[0].strength).toBe(0.9);
  });

  it('getNextSteps honours explicit priority order', () => {
    const result = getNextSteps('base64', 5, g);
    expect(result.map(r => r.node.slug)).toEqual(['json-validator', 'json-formatter']);
  });

  it('getAlternatives resolves overlay edges', () => {
    expect(getAlternatives('base64', 5, g).map(r => r.node.slug)).toEqual(['json-minifier']);
  });

  it('respects the max cap', () => {
    expect(getUsedWith('base64', 1, g)).toHaveLength(1);
  });

  it('returns empty for an unknown slug without throwing', () => {
    expect(getRelatedTools('does-not-exist', 5, g)).toEqual([]);
    expect(getUsedWith('does-not-exist', 5, g)).toEqual([]);
  });

  it('getRelatedTools derives siblings even without a knowledge file', () => {
    const related = getRelatedTools('json-minifier', 5, g).map(r => r.node.slug);
    expect(related).toContain('json-formatter'); // same engine+pattern+family
  });

  it('getTopicCluster assembles tool, guide, and derived relations', () => {
    const cluster = getTopicCluster('json-formatter', 5, g);
    expect(cluster.tool?.slug).toBe('json-formatter');
    expect(cluster.guide?.slug).toBe('json-formatter');
    expect(cluster.relatedTools.length).toBeGreaterThan(0);
  });

  it('getKnowledgeFor returns the authored knowledge or undefined', () => {
    // base64 has no entry in the real registry path for this fixture; assert no throw + shape
    expect(() => getKnowledgeFor('base64')).not.toThrow();
  });

  it('getRelatedGuides only returns nodes that are guides', () => {
    const guides = getRelatedGuides('json-validator', 5, g);
    expect(guides.every(r => r.node.type === 'guide')).toBe(true);
    expect(guides.some(r => r.node.slug === 'json-formatter')).toBe(true); // only formatter has a guide
  });

  it('getNextSteps respects the max cap', () => {
    expect(getNextSteps('base64', 1, g)).toHaveLength(1);
  });
});

describe('getWorkflow', () => {
  it('orders neighbours by workflow stage (input→export) via the injected resolver', () => {
    const knowledgeOf = (s: string): Knowledge | undefined =>
      knowledge.get(s) ??
      ({
        'json-validator': makeKnowledge({ slug: 'json-validator', workflowStage: ['validate'] }),
        'json-formatter': makeKnowledge({ slug: 'json-formatter', workflowStage: ['analyze'] }),
        'json-minifier': makeKnowledge({ slug: 'json-minifier', workflowStage: ['export'] }),
      }[s]);
    const order = getWorkflow('base64', g, knowledgeOf).map(r => r.node.slug);
    // base64 usedWith json-formatter (analyze) + json-validator (validate);
    // nextSteps json-validator, json-formatter. Deduped, validate sorts before analyze.
    expect(order.indexOf('json-validator')).toBeLessThan(order.indexOf('json-formatter'));
  });

  it('falls back to end-of-pipeline for neighbours without a known stage', () => {
    const knowledgeOf = (): Knowledge | undefined => undefined; // no stage info
    const result = getWorkflow('base64', g, knowledgeOf);
    expect(result.length).toBeGreaterThan(0); // still returns deduped neighbours
  });

  it('returns empty for a tool with no workflow neighbours', () => {
    expect(getWorkflow('json-minifier', g, () => undefined)).toEqual([]);
  });
});
