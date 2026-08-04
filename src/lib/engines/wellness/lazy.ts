// Per-calculator lazy loading for the BROWSER only.
//
// registry.ts holds every calculator in one static map, which is right for build-time consumers
// (the widget's field schema, the manifest, the tests) because none of them ship. It is wrong for
// the runtime: a wellness page uses exactly ONE calculator, and importing the map put all of them
// in the engine chunk, so every new calculator made every existing wellness page heavier. Adding
// five tools at once is what pushed that chunk past its budget.
//
// Each entry below is a bare literal `import()` so Vite emits one chunk per calculator and
// scripts/check-budget.ts can resolve which one a page really fetches (it reads the widget's
// `data-wellness` attribute, the same id used as the key here).

import type { WellnessCalculator, WellnessInput, WellnessOpts, WellnessResult } from './types';
import { calculationError } from '@lib/results/index';

const LOADERS: Record<string, () => Promise<Record<string, unknown>>> = {
  bmi: () => import('./calculators/bmi'),
  tdee: () => import('./calculators/tdee'),
  'body-fat': () => import('./calculators/body-fat'),
  macro: () => import('./calculators/macro'),
  'ideal-weight': () => import('./calculators/ideal-weight'),
  'heart-rate-zones': () => import('./calculators/heart-rate-zones'),
  bmr: () => import('./calculators/bmr'),
  'calorie-deficit': () => import('./calculators/calorie-deficit'),
  'protein-intake': () => import('./calculators/protein-intake'),
  'one-rep-max': () => import('./calculators/one-rep-max'),
  'running-pace': () => import('./calculators/running-pace'),
};

/** Every id this map can load, so validate-registry can check it against the static registry. */
export const LAZY_WELLNESS_IDS = Object.keys(LOADERS);

const loaded = new Map<string, WellnessCalculator>();

function isCalculator(value: unknown, id: string): value is WellnessCalculator {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as WellnessCalculator).id === id &&
    typeof (value as WellnessCalculator).calculate === 'function'
  );
}

/**
 * Fetch one calculator's chunk and hold it for the page's lifetime. Never throws: a failed chunk
 * leaves the id unloaded and runLazyWellness reports it as a calculation error, which is the same
 * path an unknown id already took.
 */
export async function loadWellnessCalculator(id: string): Promise<void> {
  if (loaded.has(id)) return;
  const load = LOADERS[id];
  if (!load) return;
  try {
    const mod = await load();
    // The module exports exactly one calculator, found by its own id rather than by a second
    // hand-maintained map of export names that could drift from the files.
    const calc = Object.values(mod).find((v) => isCalculator(v, id));
    if (calc) loaded.set(id, calc as WellnessCalculator);
  } catch (_) {
    // Leave it unloaded; the widget guards on ToyTools.runWellness returning an error result.
  }
}

/** Run an already-loaded calculator. Same never-throw contract as runWellness in registry.ts. */
export function runLazyWellness(id: string, input: WellnessInput, opts: WellnessOpts): WellnessResult {
  const calc = loaded.get(id);
  if (!calc) return calculationError('Unknown calculator');
  try {
    return calc.calculate(input, opts);
  } catch (_) {
    return calculationError('Could not complete this calculation');
  }
}
