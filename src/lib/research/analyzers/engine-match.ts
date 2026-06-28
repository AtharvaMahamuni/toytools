// Engine-match analyzer — groups opportunities by their proposed engine and decides whether an
// EXISTING engine already covers them (reuse) or the cluster is large enough to justify a NEW engine.
// This is the heart of ToyTools' engine-first decision making. Pure, deterministic.

import type { Opportunity } from '../models/opportunity';
import type { EngineRecommendation, EngineRecommendations } from '../models/engine';
import type { ResearchInputs } from '../types';
import { THRESHOLDS } from '../config';

export function recommendEngines(
  opportunities: Opportunity[],
  inputs: ResearchInputs,
): EngineRecommendations {
  const byEngine = new Map<string, Opportunity[]>();
  for (const o of opportunities) {
    const list = byEngine.get(o.proposedEngine) ?? [];
    list.push(o);
    byEngine.set(o.proposedEngine, list);
  }

  const recs: EngineRecommendation[] = [];
  for (const [engine, members] of byEngine) {
    const exists = inputs.engineIds.has(engine);
    const sorted = [...members].sort((a, b) => b.finalScore - a.finalScore || a.id.localeCompare(b.id));
    const transformations = [...new Set(sorted.map(m => m.transformation))].sort();
    const unlocksTools = sorted.map(m => m.id);
    const topScore = sorted[0]?.finalScore ?? 0;

    // Confidence: existing engines are certain reuse; new engines scale with cluster size.
    const confidence = exists
      ? 1
      : round2(Math.min(0.5 + (sorted.length - 1) * 0.15, 0.97));

    const rationale: string[] = exists
      ? [`Reuses the existing "${engine}" engine - ${sorted.length} tool(s), lowest implementation cost.`]
      : [
          `${sorted.length} opportunit${sorted.length === 1 ? 'y' : 'ies'} share the missing "${engine}" engine.`,
          sorted.length >= THRESHOLDS.newEngineCluster
            ? `Cluster ≥ ${THRESHOLDS.newEngineCluster} → justifies a new reusable engine that unlocks ${unlocksTools.length} tools.`
            : `Below the ${THRESHOLDS.newEngineCluster}-tool bar for a new engine - revisit as more demand accrues.`,
        ];

    recs.push({ engine, exists, confidence, transformations, unlocksTools, topScore, rationale });
  }

  // New-engine opportunities (the interesting roadmap signal) first, then by top score.
  return recs.sort(
    (a, b) => Number(a.exists) - Number(b.exists) || b.topScore - a.topScore || a.engine.localeCompare(b.engine),
  );
}

/** Just the NEW-engine recommendations that clear the cluster bar (for missing-engines.json). */
export function missingEngines(recs: EngineRecommendations): EngineRecommendations {
  return recs.filter(r => !r.exists && r.unlocksTools.length >= THRESHOLDS.newEngineCluster);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
