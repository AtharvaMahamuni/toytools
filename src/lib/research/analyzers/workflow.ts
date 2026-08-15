// Workflow analyzer — sketches the input → transform → output shape of an opportunity, used in the
// opportunity model and reports. Heuristic and deterministic. Pure.
//
// The engine IO map itself lives in io-graph.ts, because the latent-demand analyzer reads the same
// map structurally (to find dead ends and handoff seams) and two copies would drift.

import type { RawOpportunity } from '../models/provider';
import { ENGINE_IO, formatLabel } from './io-graph';

export function describeWorkflow(raw: RawOpportunity): string {
  const io = ENGINE_IO[raw.proposedEngine];
  const inLabel = io ? formatLabel(io.in) : 'input';
  const outLabel = io ? formatLabel(io.out) : 'output';
  return `${inLabel} → ${raw.transformation} → ${outLabel}`;
}
