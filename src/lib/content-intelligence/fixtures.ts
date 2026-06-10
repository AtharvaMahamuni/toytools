// Shared test fixtures for content-intelligence suites. Builds a small, realistic AnalyzerInputs
// from a handful of tools + a knowledge graph, reusing the knowledge layer's own builders.

import type { ToolConfig, Category } from '@data/types';
import type { EngineManifest } from '@data/engines';
import { buildGraph } from '@lib/knowledge/graph';
import { buildKnowledgeMap } from '@lib/knowledge/registry';
import { makeKnowledge } from '@lib/knowledge/fixtures';
import type { Knowledge } from '@lib/knowledge/types';
import type { AnalyzerInputs, ExpansionTaxonomy } from './types';

export function tool(o: Partial<ToolConfig> & Pick<ToolConfig, 'slug'>): ToolConfig {
  return { name: o.slug, description: 'd', categorySlug: 'developer-tools', tags: ['t'], ...o };
}

export function category(o: Partial<Category> & Pick<Category, 'slug'>): Category {
  return {
    name: o.slug,
    description: '',
    segment: o.slug,
    toolCount: 0,
    engines: [],
    ...o,
  } as Category;
}

export function engine(o: Partial<EngineManifest> & Pick<EngineManifest, 'id'>): EngineManifest {
  return {
    name: o.id,
    category: 'developer-tools',
    patterns: [],
    runtimeGlobal: '',
    supportsGuides: true,
    supportsFaqs: true,
    supportedFamilies: [],
    toolCount: 0,
    ...o,
  };
}

export interface FixtureOptions {
  tools: ToolConfig[];
  categories: Category[];
  engines: EngineManifest[];
  knowledge?: Knowledge[];
  taxonomy?: ExpansionTaxonomy;
}

/** Assemble AnalyzerInputs with a real graph built from the given tools + knowledge. */
export function makeInputs(opts: FixtureOptions): AnalyzerInputs {
  const knowledge = buildKnowledgeMap(opts.knowledge ?? []);
  const graph = buildGraph(opts.tools, opts.categories, knowledge);
  return {
    tools: opts.tools,
    categories: opts.categories,
    engines: opts.engines,
    graph,
    knowledge,
    taxonomy: opts.taxonomy ?? [],
  };
}

export { makeKnowledge };
