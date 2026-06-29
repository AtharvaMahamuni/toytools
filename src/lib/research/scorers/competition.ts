// Competition scorer — returns OPENNESS (1 = wide open / weak incumbents). A high raw competition
// signal lowers it; documented incumbent weaknesses raise it. Pure.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

export function scoreCompetition(raw: RawOpportunity): number {
  const openBase = 1 - raw.competition / 100;
  const weaknessBoost = Math.min(raw.solutionWeaknesses.length, 4) * 0.06;
  return clamp01(openBase + weaknessBoost);
}
