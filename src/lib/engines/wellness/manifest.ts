// Wellness Engine manifest — structured metadata describing the engine as a citizen of the
// engine-first architecture (which calculators, families, and result types it offers). Available to
// diagnostics and the /architecture view; derived from the registry so it never drifts.

import { WELLNESS_CALCULATORS } from './registry';
import type { VizKind } from '@lib/visualization/types';

export interface WellnessManifest {
  engine: 'wellness';
  runtimeGlobal: 'runWellness';
  widget: 'WellnessWidget';
  processors: string[];
  families: string[];
  visualizations: VizKind[];
  resultTypes: string[];
}

const calcs = Object.values(WELLNESS_CALCULATORS);

export const wellnessManifest: WellnessManifest = {
  engine: 'wellness',
  runtimeGlobal: 'runWellness',
  widget: 'WellnessWidget',
  processors: calcs.map((c) => c.id),
  families: [...new Set(calcs.map((c) => c.family))],
  visualizations: ['progress'],
  resultTypes: ['hero', 'metrics', 'milestones', 'insights', 'assumptions', 'explanation', 'decisions'],
};
