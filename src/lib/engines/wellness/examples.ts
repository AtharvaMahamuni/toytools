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
  {
    id: 'tdee-male-moderate',
    engine: 'wellness',
    ref: 'tdee',
    title: 'Male, 30, 70 kg, 175 cm, moderate',
    inputs: { unit: 'metric', sex: 'male', age: 30, weight: 70, height: 175, activity: 'moderate' },
    expect: { bmr: 1649, tdee: 2556 },
    narrative: 'A 30-year-old man of 70 kg and 175 cm burns about 1,649 kcal at rest and roughly 2,556 kcal a day when moderately active.',
  },
  {
    id: 'tdee-female-light',
    engine: 'wellness',
    ref: 'tdee',
    title: 'Female, 30, 60 kg, 165 cm, light',
    inputs: { unit: 'metric', sex: 'female', age: 30, weight: 60, height: 165, activity: 'light' },
    expect: { bmr: 1320, tdee: 1815 },
    narrative: 'A 30-year-old woman of 60 kg and 165 cm has a BMR near 1,320 kcal and a lightly active TDEE around 1,815 kcal.',
  },
];

export const WELLNESS_EXAMPLE_MAP = buildExampleRegistry(WELLNESS_EXAMPLES);

export function wellnessExamplesFor(ref: string): WorkedExample<WellnessInput>[] {
  return examplesForRef(WELLNESS_EXAMPLES, 'wellness', ref);
}
