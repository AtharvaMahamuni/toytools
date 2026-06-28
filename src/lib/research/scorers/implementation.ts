// Implementation-cost scorer — returns EASE (1 = cheap to build). Driven by difficulty, with a
// reuse bonus when the proposed engine already exists (a 3-line widget vs a new engine). Pure.
import type { RawOpportunity } from '../models/provider';
import type { ResearchInputs } from '../types';
import { clamp01 } from './demand';

const DIFFICULTY_EASE: Record<RawOpportunity['difficulty'], number> = {
  low: 0.9,
  medium: 0.6,
  high: 0.3,
};

export function scoreImplementation(raw: RawOpportunity, inputs: ResearchInputs): number {
  const base = DIFFICULTY_EASE[raw.difficulty] ?? 0.5;
  const reuseBonus = inputs.engineIds.has(raw.proposedEngine) ? 0.1 : 0;
  return clamp01(base + reuseBonus);
}
