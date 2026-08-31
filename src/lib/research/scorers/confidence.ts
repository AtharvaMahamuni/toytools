// Confidence scorer — how much we should trust that this opportunity is real. 0–1. Pure.
//
// Two independent halves, and keeping them separate is the point:
//
//   1. ASSERTED evidence — how many of our own desk-research signals fired (demand, weaknesses,
//      query breadth, known incumbents, evergreen), plus a small boost when more than one provider
//      surfaced the same need.
//   2. OBSERVED evidence — recorded engagement signals, scored by `corroboration`. This half is the
//      only input that did not come from us, so it is the only one that can contradict us.
//
// The observed half is capped well below the asserted half. That is not timidity: one probe is not
// a dataset, and a scorer that let a single strong observation carry confidence on its own would
// re-create by the back door exactly the "a post did well, so build it" reasoning the x-content
// skill forbids. It moves confidence enough to notice and not enough to decide.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';
import { scoreCorroboration } from './corroboration';

/** Most confidence an opportunity can earn from observed signals alone. */
const OBSERVED_CEILING = 0.2;

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
  const observed = scoreCorroboration(raw.signals) * OBSERVED_CEILING;
  return clamp01(fired * 0.8 + corroboration + observed);
}
