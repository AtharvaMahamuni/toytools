// Category Health Analyzer — per category: tool/guide/faq counts, average content relationships
// per tool (from the graph, excluding the structural BELONGS_TO_CATEGORY edge), and a 0–100
// coverageScore blending guide%, faq%, and relationship density. Pure over AnalyzerInputs.

import { RELATION_TYPES } from '@lib/knowledge/types';
import type { AnalyzerInputs, CategoryHealth, CategoryHealthEntry } from './types';

// Relationship density target: a tool with this many content relationships scores full density.
const REL_TARGET = 5;
const WEIGHT = { guide: 0.4, faq: 0.3, relationships: 0.3 };

export function analyzeCategoryHealth(inputs: AnalyzerInputs): CategoryHealth {
  const out: CategoryHealthEntry[] = [];

  for (const cat of inputs.categories) {
    const catTools = inputs.tools.filter(t => t.categorySlug === cat.slug);
    const tools = catTools.length;
    const guides = catTools.filter(t => t.guide !== undefined).length;
    const faqs = catTools.filter(t => t.faq !== undefined).length;

    // Count content relationships (exclude BELONGS_TO_CATEGORY) out of each tool node.
    let relEdges = 0;
    for (const t of catTools) {
      const edges = inputs.graph.adjacency.get(`tool:${t.slug}`) ?? [];
      relEdges += edges.filter(e => e.type !== RELATION_TYPES.BELONGS_TO_CATEGORY).length;
    }
    const avgRelationships = tools > 0 ? round(relEdges / tools, 2) : 0;

    const guidePct = tools > 0 ? guides / tools : 0;
    const faqPct = tools > 0 ? faqs / tools : 0;
    const relDensity = Math.min(avgRelationships / REL_TARGET, 1);
    const coverageScore = Math.round(
      (WEIGHT.guide * guidePct + WEIGHT.faq * faqPct + WEIGHT.relationships * relDensity) * 100,
    );

    out.push({ slug: cat.slug, tools, guides, faqs, avgRelationships, coverageScore });
  }

  return out;
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
