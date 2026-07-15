// Math Engine manifest — structured metadata describing the engine as a citizen of the engine-first
// architecture. Available to diagnostics and the /architecture view; derived from the registry so
// it never drifts.

import { MATH_CALCULATORS } from './registry';

export interface MathManifest {
  engine: 'math';
  runtimeGlobal: 'runMath';
  widget: 'MathWidget';
  processors: string[];
  families: string[];
  resultTypes: string[];
}

const calcs = Object.values(MATH_CALCULATORS);

export const mathManifest: MathManifest = {
  engine: 'math',
  runtimeGlobal: 'runMath',
  widget: 'MathWidget',
  processors: calcs.map((c) => c.id),
  families: [...new Set(calcs.map((c) => c.family))],
  resultTypes: ['hero', 'metrics', 'insights', 'assumptions', 'decisions'],
};
