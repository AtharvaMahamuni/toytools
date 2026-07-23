// Wellness engine registry — single source of truth. The shared WellnessWidget never imports a
// calculator directly: it calls ToyTools.runWellness(id, input, opts), which resolves through
// runWellness() below. The widget reads the build-time field schema via wellnessFields().
//
// Adding a calculator: create the file, add one import + one entry. Keys are the processorIds.

import type { WellnessCalculator, WellnessFieldDef, WellnessInput, WellnessOpts, WellnessResult } from './types';
import { calculationError } from '@lib/results/index';
import { bmiCalculator } from './calculators/bmi';
import { tdeeCalculator } from './calculators/tdee';
import { bodyFatCalculator } from './calculators/body-fat';
import { macroCalculator } from './calculators/macro';
import { idealWeightCalculator } from './calculators/ideal-weight';
import { heartRateZonesCalculator } from './calculators/heart-rate-zones';

export const WELLNESS_CALCULATORS: Record<string, WellnessCalculator> = {
  bmi: bmiCalculator,
  tdee: tdeeCalculator,
  'body-fat': bodyFatCalculator,
  macro: macroCalculator,
  'ideal-weight': idealWeightCalculator,
  'heart-rate-zones': heartRateZonesCalculator,
};

/**
 * Resolve a calculator by id and run it. Never throws: an unknown id (or an unexpected exception
 * inside a calculator) returns a calculation-error result so the experience layer renders uniformly.
 */
export function runWellness(id: string, input: WellnessInput, opts: WellnessOpts): WellnessResult {
  const calc = WELLNESS_CALCULATORS[id];
  if (!calc) {
    // eslint-disable-next-line no-console
    console.warn(`[wellness] Unknown calculator id "${id}".`);
    return calculationError('Unknown calculator');
  }
  try {
    return calc.calculate(input, opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[wellness] Calculator "${id}" threw:`, err);
    return calculationError('Could not complete this calculation');
  }
}

/** Build-time field schema for the widget frontmatter. Never throws; unknown id -> []. */
export function wellnessFields(id: string): WellnessFieldDef[] {
  return WELLNESS_CALCULATORS[id]?.fields ?? [];
}

/** The full calculator definition (fields, layout, capabilities) for the widget. */
export function getWellnessCalculator(id: string): WellnessCalculator | undefined {
  return WELLNESS_CALCULATORS[id];
}
