// Priority Scoring — ranks what to build/improve next. Composes the gap, category-health, and
// cluster reports into roadmap entries, each with a weighted score, a confidence (how many
// independent signals back it), machine reasons[], and human explanation[]. Pure.
//
//   score = w1·coverageGap + w2·categoryImportance + w3·engineExpansion + w4·relationshipDeficiency
//
// The `inputs.signals` seam (Search Console / Analytics) is read here when present — dormant in E1.

import type {
  AnalyzerInputs,
  CategoryHealth,
  ContentGaps,
  PriorityEntry,
  RecommendationReason,
  RoadmapPriorities,
  TopicClusters,
} from './types';

export const PRIORITY_WEIGHTS = {
  coverageGap: 0.35,
  categoryImportance: 0.2,
  engineExpansion: 0.3,
  relationshipDeficiency: 0.15,
};
const WEIGHT_SUM =
  PRIORITY_WEIGHTS.coverageGap +
  PRIORITY_WEIGHTS.categoryImportance +
  PRIORITY_WEIGHTS.engineExpansion +
  PRIORITY_WEIGHTS.relationshipDeficiency;

const WEAK_CATEGORY = 50; // coverageScore below this → weak-category signal
const REL_TARGET = 3; // related topics for a "healthy" cluster
const MAX_REASONS = 3; // confidence denominator

export interface PriorityParts {
  gaps: ContentGaps;
  categoryHealth: CategoryHealth;
  clusters: TopicClusters;
}

export function scorePriorities(inputs: AnalyzerInputs, parts: PriorityParts): RoadmapPriorities {
  const totalTools = Math.max(inputs.tools.length, 1);
  const catSize = new Map<string, number>();
  for (const t of inputs.tools) catSize.set(t.categorySlug, (catSize.get(t.categorySlug) ?? 0) + 1);
  const maxCat = Math.max(1, ...catSize.values());
  const healthBySlug = new Map(parts.categoryHealth.map(h => [h.slug, h]));
  const clusterBySlug = new Map(parts.clusters.map(c => [c.slug, c]));
  const engineCategory = new Map(inputs.engines.map(e => [e.id, e.category]));
  const toolBySlug = new Map(inputs.tools.map(t => [t.slug, t]));

  const importanceOf = (categorySlug: string) => (catSize.get(categorySlug) ?? 0) / maxCat;
  const weak = (categorySlug: string) =>
    (healthBySlug.get(categorySlug)?.coverageScore ?? 0) < WEAK_CATEGORY;

  const entries: PriorityEntry[] = [];

  // --- Candidate set A: existing tools with content gaps ---
  for (const topic of parts.gaps.topics) {
    const tool = toolBySlug.get(topic.slug);
    if (!tool) continue;
    const reasons: RecommendationReason[] = [];
    const explanation: string[] = [];

    const coverageGap = topic.missing.length / 5; // 5 possible gap kinds
    if (topic.missing.includes('guide')) { reasons.push('missing-guide'); explanation.push('No guide yet'); }
    if (topic.missing.includes('faq')) { reasons.push('missing-faq'); explanation.push('No FAQ yet'); }

    const cluster = clusterBySlug.get(topic.slug);
    const relCount = cluster?.relatedTopics.length ?? 0;
    const relationshipDeficiency = 1 - Math.min(relCount / REL_TARGET, 1);
    if (relationshipDeficiency >= 0.5) { reasons.push('relationship-deficit'); explanation.push('Few related tools in its cluster'); }
    if ((cluster?.clusterSize ?? 0) <= 1) { reasons.push('orphan-cluster'); explanation.push('Isolated — not part of any cluster'); }
    if (weak(tool.categorySlug)) { reasons.push('weak-category'); explanation.push(`Category "${tool.categorySlug}" is under-developed`); }

    const factors = {
      coverageGap,
      categoryImportance: importanceOf(tool.categorySlug),
      engineExpansion: 0, // the tool already exists
      relationshipDeficiency,
    };
    entries.push(makeEntry(topic.slug, factors, reasons, explanation));
  }

  // --- Candidate set B: missing-tool opportunities (taxonomy) ---
  for (const m of parts.gaps.missingTools) {
    const reasons: RecommendationReason[] = ['missing-family-member'];
    const explanation: string[] = [`Missing from the ${m.family} family (${m.engine})`];
    const categorySlug = engineCategory.get(m.engine) ?? '';
    if (categorySlug && weak(categorySlug)) { reasons.push('weak-category'); explanation.push(`Category "${categorySlug}" is under-developed`); }

    const factors = {
      coverageGap: 1, // does not exist at all
      categoryImportance: categorySlug ? importanceOf(categorySlug) : 0,
      engineExpansion: 1, // taxonomy declares it expected
      relationshipDeficiency: 0.5, // no node yet — neutral
    };
    entries.push(makeEntry(m.expected, factors, reasons, explanation));
  }

  // Optional external-signal boost (dormant until signals are supplied)
  if (inputs.signals) {
    for (const e of entries) {
      const s = inputs.signals[e.slug];
      if (s?.impressions) e.factors.categoryImportance = Math.min(1, e.factors.categoryImportance + 0.1);
    }
  }

  return entries.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));
}

function makeEntry(
  slug: string,
  factors: PriorityEntry['factors'],
  reasons: RecommendationReason[],
  explanation: string[],
): PriorityEntry {
  const score =
    (PRIORITY_WEIGHTS.coverageGap * factors.coverageGap +
      PRIORITY_WEIGHTS.categoryImportance * factors.categoryImportance +
      PRIORITY_WEIGHTS.engineExpansion * factors.engineExpansion +
      PRIORITY_WEIGHTS.relationshipDeficiency * factors.relationshipDeficiency) /
    WEIGHT_SUM;
  const confidence = Math.min(1, reasons.length / MAX_REASONS);
  return { slug, score: round(score, 4), confidence: round(confidence, 2), reasons, explanation, factors };
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
