// Engine-reuse scorer — 1 when the proposed engine is already registered (maximal reuse), lower when
// the opportunity implies a brand-new engine (more work, but engine-first still rewards it somewhat). Pure.
import type { RawOpportunity } from '../models/provider';
import type { ResearchInputs } from '../types';

const NEW_ENGINE_REUSE = 0.3;

export function scoreEngineReuse(raw: RawOpportunity, inputs: ResearchInputs): number {
  return inputs.engineIds.has(raw.proposedEngine) ? 1 : NEW_ENGINE_REUSE;
}
