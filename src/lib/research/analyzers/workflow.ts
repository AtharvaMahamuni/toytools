// Workflow analyzer — sketches the input → transform → output shape of an opportunity, used in the
// opportunity model and reports. Heuristic and deterministic. Pure.

import type { RawOpportunity } from '../models/provider';

const ENGINE_IO: Record<string, { in: string; out: string }> = {
  'text-processor': { in: 'text', out: 'text' },
  'text-analysis': { in: 'text', out: 'metrics' },
  encoding: { in: 'text', out: 'encoded text' },
  hashing: { in: 'text', out: 'hash' },
  'structured-data': { in: 'data', out: 'data' },
  csv: { in: 'CSV', out: 'CSV' },
  datetime: { in: 'date/time', out: 'date/time' },
  calculator: { in: 'numbers', out: 'result' },
};

export function describeWorkflow(raw: RawOpportunity): string {
  const io = ENGINE_IO[raw.proposedEngine] ?? { in: 'input', out: 'output' };
  return `${io.in} → ${raw.transformation} → ${io.out}`;
}
