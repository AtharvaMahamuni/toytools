// Math engine registry — single source of truth. The shared MathWidget never imports a calculator
// directly: it calls ToyTools.runMath(id, input, opts), which resolves through runMath() below.
// The widget reads the build-time field schema via mathFields().
//
// Adding a calculator: create the file, add one import + one entry. Keys are the processorIds.

import type { MathCalculator, MathFieldDef, MathInput, MathOpts, MathResult } from './types';
import { calculationError } from '@lib/results/index';
import { fractionCalculator } from './calculators/fraction';
import { combinationsCalculator } from './calculators/combinations';
import { primeFactorizationCalculator } from './calculators/prime-factorization';

export const MATH_CALCULATORS: Record<string, MathCalculator> = {
  fraction: fractionCalculator,
  combinations: combinationsCalculator,
  'prime-factorization': primeFactorizationCalculator,
};

/**
 * Resolve a calculator by id and run it. Never throws: an unknown id (or an unexpected exception
 * inside a calculator) returns a calculation-error result so the experience layer renders uniformly.
 */
export function runMath(id: string, input: MathInput, opts: MathOpts): MathResult {
  const calc = MATH_CALCULATORS[id];
  if (!calc) {
    // eslint-disable-next-line no-console
    console.warn(`[math] Unknown calculator id "${id}".`);
    return calculationError('Unknown calculator');
  }
  try {
    return calc.calculate(input, opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[math] Calculator "${id}" threw:`, err);
    return calculationError('Could not complete this calculation');
  }
}

/** Build-time field schema for the widget frontmatter. Never throws; unknown id -> []. */
export function mathFields(id: string): MathFieldDef[] {
  return MATH_CALCULATORS[id]?.fields ?? [];
}

/** The full calculator definition (fields, layout, capabilities) for the widget. */
export function getMathCalculator(id: string): MathCalculator | undefined {
  return MATH_CALCULATORS[id];
}
