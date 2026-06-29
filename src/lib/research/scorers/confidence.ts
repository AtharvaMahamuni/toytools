// Confidence scorer — fraction of independent evidence signals that fired, lightly boosted by how
// many providers corroborated the opportunity (after dedup). 0–1. Pure.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

export function scoreConfidence(raw: RawOpportunity, sourceCount: number): number {
  const signals = [
    raw.demand >= 60,
    raw.solutionWeaknesses.length > 0,
    raw.searchQueries.length >= 3,
    raw.existingSolutions.length > 0,
    raw.evergreen >= 75,
  ];
  const fired = signals.filter(Boolean).length / signals.length;
  const corroboration = Math.min(Math.max(sourceCount - 1, 0) * 0.1, 0.2);
  return clamp01(fired * 0.8 + corroboration);
}
