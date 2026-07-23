// Wellness engine worked examples — the engine's data for the platform example registry. One source
// of truth for guides, the widget Load Example action, and tests (wellness.test.ts re-runs each and
// asserts `expect` against the result cards' raw values).

import { buildExampleRegistry, examplesForRef, type WorkedExample } from '@lib/examples/types';
import type { WellnessInput } from './types';

export const WELLNESS_EXAMPLES: WorkedExample<WellnessInput>[] = [
  {
    id: 'bmi-metric-healthy',
    engine: 'wellness',
    ref: 'bmi',
    title: '70 kg at 175 cm',
    inputs: { unit: 'metric', weight: 70, height: 175 },
    expect: { bmi: 22.86 },
    narrative: '70 kg at 175 cm is a BMI of about 22.9, comfortably inside the healthy 18.5 to 24.9 range.',
  },
  {
    id: 'bmi-metric-overweight',
    engine: 'wellness',
    ref: 'bmi',
    title: '90 kg at 170 cm',
    inputs: { unit: 'metric', weight: 90, height: 170 },
    expect: { bmi: 31.14 },
    narrative: '90 kg at 170 cm is a BMI of about 31.1, which lands in the obesity band and shows the weight needed to reach the healthy range.',
  },
  {
    id: 'bmi-imperial',
    engine: 'wellness',
    ref: 'bmi',
    title: '154 lb at 69 in',
    inputs: { unit: 'imperial', weight: 154, height: 69 },
    expect: { bmi: 22.74 },
    narrative: '154 lb at 69 inches converts to a BMI of about 22.7, showing metric and imperial land in the same place.',
  },
];

export const WELLNESS_EXAMPLE_MAP = buildExampleRegistry(WELLNESS_EXAMPLES);

export function wellnessExamplesFor(ref: string): WorkedExample<WellnessInput>[] {
  return examplesForRef(WELLNESS_EXAMPLES, 'wellness', ref);
}
