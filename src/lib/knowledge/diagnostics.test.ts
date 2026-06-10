import { describe, it, expect } from 'vitest';
import { buildGraph } from './graph';
import { buildDiagnostics } from './diagnostics';
import { buildKnowledgeMap } from './registry';
import { makeKnowledge } from './fixtures';
import { KNOWLEDGE_SCHEMA_VERSION, type Category, type KnowledgeGraph } from './types';
import type { ToolConfig } from '@data/types';

function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], ...o };
}

const categories: Category[] = [
  { slug: 'developer-tools', name: 'Developer Tools', description: '', segment: 'developer', toolCount: 0, engines: [] } as unknown as Category,
];

const tools: ToolConfig[] = [
  tool({ slug: 'json-formatter', engine: 'structured-data', pattern: 'structured-transform', family: 'json' }),
  tool({ slug: 'json-minifier', engine: 'structured-data', pattern: 'structured-transform', family: 'json' }),
];

const graph = buildGraph(tools, categories, buildKnowledgeMap([makeKnowledge({ slug: 'json-formatter' })]));

describe('buildDiagnostics', () => {
  const d = buildDiagnostics({ graph, schemaVersion: KNOWLEDGE_SCHEMA_VERSION, toolCount: 2, knowledgeCount: 1 });

  it('counts nodes, edges, and categories', () => {
    expect(d.nodes).toBe(graph.nodes.length);
    expect(d.edges).toBe(graph.edges.length);
    expect(d.categories).toBe(1);
  });

  it('computes knowledge coverage as a percentage', () => {
    expect(d.knowledgeCoverage).toBe(50);
  });

  it('reports avgRelationships and graphDensity', () => {
    expect(d.avgRelationships).toBeGreaterThan(0);
    expect(d.graphDensity).toBeGreaterThan(0);
  });

  it('stamps schemaVersion and a generatedAt timestamp', () => {
    expect(d.schemaVersion).toBe(KNOWLEDGE_SCHEMA_VERSION);
    expect(() => new Date(d.generatedAt).toISOString()).not.toThrow();
  });

  it('detects broken links to non-existent nodes', () => {
    const broken: KnowledgeGraph = {
      nodes: [{ id: 'tool:a', type: 'tool', slug: 'a', title: 'A', category: 'c', url: '/x/' }],
      edges: [{ from: 'tool:a', to: 'tool:ghost', type: 'RELATED_TOOL' }],
      adjacency: new Map(),
    };
    const bd = buildDiagnostics({ graph: broken, schemaVersion: 1, toolCount: 1, knowledgeCount: 0 });
    expect(bd.brokenLinks).toHaveLength(1);
  });

  it('detects orphan nodes with no edges', () => {
    const lonely: KnowledgeGraph = {
      nodes: [{ id: 'tool:a', type: 'tool', slug: 'a', title: 'A', category: 'c', url: '/x/' }],
      edges: [],
      adjacency: new Map(),
    };
    const od = buildDiagnostics({ graph: lonely, schemaVersion: 1, toolCount: 1, knowledgeCount: 0 });
    expect(od.orphanCount).toBe(1);
    expect(od.orphans).toContain('tool:a');
  });

  it('handles zero tools without dividing by zero', () => {
    const empty: KnowledgeGraph = { nodes: [], edges: [], adjacency: new Map() };
    const ed = buildDiagnostics({ graph: empty, schemaVersion: 1, toolCount: 0, knowledgeCount: 0 });
    expect(ed.knowledgeCoverage).toBe(0);
    expect(ed.graphDensity).toBe(0);
  });
});
