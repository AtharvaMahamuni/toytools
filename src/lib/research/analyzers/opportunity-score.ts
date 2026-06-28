// Opportunity-score analyzer — normalizes merged raws into the unified Opportunity model AND scores
// them. Each signal comes from a dedicated pure scorer; finalScore is their sum-normalized weighted
// blend (0–100). topicClusterPotential is computed from how many sibling opportunities share the
// transformation, so it needs the whole merged set. Deterministic. Pure.

import type { Opportunity } from '../models/opportunity';
import { opportunityId } from '../models/opportunity';
import type { MergedRaw } from './deduplicate';
import type { ResearchInputs } from '../types';
import { SCORE_WEIGHTS, WEIGHT_SUM, THRESHOLDS } from '../config';
import { transformationId } from './transformation';
import { describeWorkflow } from './workflow';
import { classifyIntent } from './intent';
import { deriveRelatedTools } from './related-tools';
import { classifyGap } from './gaps';
import { scoreDemand, clamp01 } from '../scorers/demand';
import { scoreCompetition } from '../scorers/competition';
import { scoreEvergreen } from '../scorers/evergreen';
import { scoreImplementation } from '../scorers/implementation';
import { scoreEngineReuse } from '../scorers/engine-reuse';
import { scoreSeo } from '../scorers/seo';
import { scoreLocalization } from '../scorers/localization';
import { scoreConfidence } from '../scorers/confidence';

export function scoreOpportunities(merged: MergedRaw[], inputs: ResearchInputs): Opportunity[] {
  // Sibling counts per transformation → cluster potential.
  const siblings = new Map<string, number>();
  for (const m of merged) {
    const tid = transformationId(m.raw.transformation);
    siblings.set(tid, (siblings.get(tid) ?? 0) + 1);
  }

  const out = merged.map(m => normalizeAndScore(m, inputs, siblings));
  return out.sort((a, b) => b.finalScore - a.finalScore || a.id.localeCompare(b.id));
}

function normalizeAndScore(
  m: MergedRaw,
  inputs: ResearchInputs,
  siblings: Map<string, number>,
): Opportunity {
  const raw = m.raw;
  const id = opportunityId(raw.proposedTool);
  const engineExists = inputs.engineIds.has(raw.proposedEngine);

  const searchDemand = scoreDemand(raw);
  const competition = scoreCompetition(raw);
  const evergreen = scoreEvergreen(raw);
  const implementationCost = scoreImplementation(raw, inputs);
  const engineReuse = scoreEngineReuse(raw, inputs);
  const seoPotential = scoreSeo(raw);
  const localizationPotential = scoreLocalization(raw);

  const tid = transformationId(raw.transformation);
  const clusterCount = siblings.get(tid) ?? 1;
  const topicClusterPotential = clamp01((clusterCount - 1) / 4);
  const commercialPotential = clamp01(
    0.2 + (raw.intent === 'transactional' ? 0.2 : 0) + (raw.demand / 100) * 0.2,
  );

  const finalScore = round1(
    ((SCORE_WEIGHTS.searchDemand * searchDemand +
      SCORE_WEIGHTS.competition * competition +
      SCORE_WEIGHTS.evergreen * evergreen +
      SCORE_WEIGHTS.implementationCost * implementationCost +
      SCORE_WEIGHTS.engineReuse * engineReuse +
      SCORE_WEIGHTS.seoPotential * seoPotential +
      SCORE_WEIGHTS.topicClusterPotential * topicClusterPotential +
      SCORE_WEIGHTS.commercialPotential * commercialPotential +
      SCORE_WEIGHTS.localizationPotential * localizationPotential) /
      WEIGHT_SUM) *
      100,
  );

  const confidence = round2(scoreConfidence(raw, m.sources.length));
  const relatedTools = deriveRelatedTools(raw, inputs);
  const relatedGuides = relatedTools.filter(s => inputs.guideSlugs.has(s));
  const relatedFaqs = relatedTools.filter(s => inputs.faqSlugs.has(s));
  const gap = classifyGap(raw.proposedTool, raw.proposedEngine, inputs);
  const exists = inputs.existingSlugs.has(raw.proposedTool);

  return {
    id,
    title: raw.proposedName ?? titleFromSlug(raw.proposedTool),
    problem: raw.problem,
    userIntent: classifyIntent(raw),
    workflow: describeWorkflow(raw),
    transformation: raw.transformation,
    proposedTool: raw.proposedTool,
    proposedEngine: raw.proposedEngine,
    searchQueries: raw.searchQueries,
    source: [...m.sources],
    discoveredAt: inputs.now,
    existingSolutions: raw.existingSolutions,
    solutionWeaknesses: raw.solutionWeaknesses,
    relatedProblems: raw.relatedProblems,
    relatedTools,
    relatedGuides,
    relatedFaqs,
    difficulty: raw.difficulty,
    evergreenScore: round2(evergreen),
    competitionScore: round2(competition),
    searchDemand: round2(searchDemand),
    implementationCost: round2(implementationCost),
    engineReuse: round2(engineReuse),
    seoPotential: round2(seoPotential),
    topicClusterPotential: round2(topicClusterPotential),
    commercialPotential: round2(commercialPotential),
    localizationPotential: round2(localizationPotential),
    confidence,
    finalScore,
    status: exists ? 'already-exists' : finalScore >= THRESHOLDS.recommend ? 'recommended' : 'discovered',
    gap,
    engineExists,
  };
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
