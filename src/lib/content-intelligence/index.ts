// Content Intelligence orchestrator. Runs every analyzer over AnalyzerInputs and returns a single
// versioned IntelligenceReports. `defaultInputs()` wires the real registries; tests pass fixtures.

import { tools as allTools } from '@data/registry';
import { categories as allCategories } from '@data/categories';
import { engineRegistry } from '@data/engines';
import { graph as defaultGraph } from '@lib/knowledge/graph';
import { KNOWLEDGE } from '@lib/knowledge/registry';
import { analyzeCoverage } from './coverage';
import { detectGaps } from './gaps';
import { analyzeCategoryHealth } from './category-health';
import { analyzeEngineOpportunities } from './engine-opportunities';
import { analyzeTopicClusters } from './clusters';
import { scorePriorities } from './priorities';
import { summarizeEcosystem } from './ecosystem-health';
import { EXPANSION_TAXONOMY } from './taxonomy';
import { INTELLIGENCE_SCHEMA_VERSION, type AnalyzerInputs, type IntelligenceReports } from './types';

/** Wire the real registries into an AnalyzerInputs. */
export function defaultInputs(): AnalyzerInputs {
  return {
    tools: allTools,
    categories: allCategories,
    engines: engineRegistry,
    graph: defaultGraph,
    knowledge: KNOWLEDGE,
    taxonomy: EXPANSION_TAXONOMY,
  };
}

/** Run all analyzers and assemble the versioned report bundle. */
export function runContentIntelligence(inputs: AnalyzerInputs): IntelligenceReports {
  const coverage = analyzeCoverage(inputs);
  const gaps = detectGaps(inputs);
  const categoryHealth = analyzeCategoryHealth(inputs);
  const engineOpportunities = analyzeEngineOpportunities(inputs);
  const topicClusters = analyzeTopicClusters(inputs);
  const roadmap = scorePriorities(inputs, { gaps, categoryHealth, clusters: topicClusters });
  const ecosystem = summarizeEcosystem({ coverage, categoryHealth, clusters: topicClusters });

  return {
    version: INTELLIGENCE_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    coverage,
    gaps,
    categoryHealth,
    engineOpportunities,
    topicClusters,
    roadmap,
    ecosystem,
  };
}

export * from './types';
