// Finance Engine manifest — structured metadata describing the engine as a citizen of the engine-first
// architecture (which calculators, families, visualizations, and result types it offers). Available to
// diagnostics and the /architecture view; derived from the registry so it never drifts.

import { FINANCE_CALCULATORS } from './registry';
import type { VizKind } from '@lib/visualization/types';

export interface FinanceManifest {
  engine: 'finance';
  runtimeGlobal: 'runFinance';
  widget: 'FinanceWidget';
  processors: string[];
  families: string[];
  visualizations: VizKind[];
  resultTypes: string[];
}

const calcs = Object.values(FINANCE_CALCULATORS);

export const financeManifest: FinanceManifest = {
  engine: 'finance',
  runtimeGlobal: 'runFinance',
  widget: 'FinanceWidget',
  processors: calcs.map((c) => c.id),
  families: [...new Set(calcs.map((c) => c.family))],
  visualizations: ['line', 'area', 'progress'],
  resultTypes: ['hero', 'metrics', 'timeline', 'milestones', 'insights', 'assumptions', 'decisions'],
};
