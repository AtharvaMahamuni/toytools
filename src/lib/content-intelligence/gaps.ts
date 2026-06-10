// Gap Detector — turns coverage + taxonomy + category/engine structure into actionable gaps:
// per-topic missing pieces, taxonomy-derived missing tools, and categories missing an engine
// they declare. Pure over AnalyzerInputs.

import { analyzeCoverage } from './coverage';
import { taxonomyEntries } from './taxonomy';
import type { AnalyzerInputs, ContentGaps, GapKind, TopicGaps } from './types';

export function detectGaps(inputs: AnalyzerInputs): ContentGaps {
  const coverage = analyzeCoverage(inputs);
  const existingSlugs = new Set(inputs.tools.map(t => t.slug));

  // Per-topic missing pieces
  const topics: TopicGaps[] = [];
  for (const t of inputs.tools) {
    const c = coverage[t.slug];
    const missing: GapKind[] = [];
    if (!c.guide) missing.push('guide');
    if (!c.faq) missing.push('faq');
    if (!c.relatedTools) missing.push('relatedTools');
    if (!c.relatedGuides) missing.push('relatedGuides');
    if (!inputs.knowledge.has(t.slug)) missing.push('knowledge');
    if (missing.length > 0) topics.push({ slug: t.slug, missing });
  }

  // Taxonomy-derived missing tools (expected − existing)
  const missingTools = taxonomyEntries(inputs.taxonomy).filter(
    e => !existingSlugs.has(e.expected),
  );

  // Categories that declare an engine which currently powers no tool in that category
  const enginesWithToolsByCategory = new Map<string, Set<string>>();
  for (const t of inputs.tools) {
    if (!t.engine) continue;
    const set = enginesWithToolsByCategory.get(t.categorySlug) ?? new Set<string>();
    set.add(t.engine);
    enginesWithToolsByCategory.set(t.categorySlug, set);
  }
  const categoriesMissingEngines: ContentGaps['categoriesMissingEngines'] = [];
  for (const cat of inputs.categories) {
    const active = enginesWithToolsByCategory.get(cat.slug) ?? new Set<string>();
    for (const eng of cat.engines) {
      if (!active.has(eng)) categoriesMissingEngines.push({ category: cat.slug, engine: eng });
    }
  }

  return { topics, missingTools, categoriesMissingEngines };
}
