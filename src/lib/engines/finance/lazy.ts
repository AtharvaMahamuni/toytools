// Browser-only loader. A finance page runs exactly one calculator, so each one is its own chunk: a bare
// literal import() per id, and scripts/check-budget.ts charges a page only for the key on its
// widget's data-finance attribute. registry.ts keeps the static map for build-time use. Without
// this, every new calculator made every existing finance page heavier.

import type { FinanceCalculator, FinanceInput, FinanceOpts, FinanceResult } from './types';
import { calculationError } from '@lib/results/index';

const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  'compound-interest': () => import('./calculators/compound-interest'),
  'rule-of-72': () => import('./calculators/rule-of-72'),
  'inflation': () => import('./calculators/inflation'),
  'savings-goal': () => import('./calculators/savings-goal'),
  'emergency-fund': () => import('./calculators/emergency-fund'),
  'sip': () => import('./calculators/sip'),
  'roi': () => import('./calculators/roi'),
  'cagr': () => import('./calculators/cagr'),
  'upi-1999-split': () => import('./calculators/upi-1999-split'),
  'upi-mdr-estimator': () => import('./calculators/upi-mdr-estimator'),
  'split-bill': () => import('./calculators/split-bill'),
  'shop-upi-tally': () => import('./calculators/shop-upi-tally'),
  'loan': () => import('./calculators/loan'),
};

export const LAZY_FINANCE_IDS = Object.keys(LOADERS);

const loaded = new Map<string, FinanceCalculator>();

function isCalculator(value: unknown, id: string): value is FinanceCalculator {
  return typeof value === 'object' && value !== null && (value as FinanceCalculator).id === id
    && typeof (value as FinanceCalculator).calculate === 'function';
}

/** Fetch one lazy calculator. Never throws: a failed chunk leaves it unloaded. */
export async function loadFinanceCalculator(id: string): Promise<void> {
  const load = LOADERS[id];
  if (!load || loaded.has(id)) return;
  try {
    const mod = await load();
    const calc = Object.values(mod).find((v) => isCalculator(v, id));
    if (calc) loaded.set(id, calc as FinanceCalculator);
  } catch (_) {
    // Left unloaded on purpose.
  }
}

/** Same never-throw contract as runFinance in registry.ts, over the loaded calculators. */
export function runLazyFinance(id: string, input: FinanceInput, opts: FinanceOpts): FinanceResult {
  const calc = loaded.get(id);
  if (!calc) return calculationError('Unknown calculator');
  try {
    return calc.calculate(input, opts);
  } catch (_) {
    return calculationError('Could not complete this calculation');
  }
}
