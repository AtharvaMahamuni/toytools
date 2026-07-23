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
  {
    id: 'body-fat-male',
    engine: 'wellness',
    ref: 'body-fat',
    title: 'Male, 175 cm, 38/85 neck/waist',
    inputs: { unit: 'metric', sex: 'male', height: 175, neck: 38, waist: 85, hip: 0, weight: 80 },
    expect: { 'body-fat': 16.9, 'fat-mass': 13.6 },
    narrative: 'A man of 175 cm with a 38 cm neck and 85 cm waist estimates at about 16.9% body fat, or roughly 13.6 kg of fat on an 80 kg frame.',
  },
  {
    id: 'body-fat-female',
    engine: 'wellness',
    ref: 'body-fat',
    title: 'Female, 165 cm, 34/75/95',
    inputs: { unit: 'metric', sex: 'female', height: 165, neck: 34, waist: 75, hip: 95, weight: 62 },
    expect: { 'body-fat': 26.4 },
    narrative: 'A woman of 165 cm measuring 34 cm neck, 75 cm waist, and 95 cm hip estimates at about 26.4% body fat.',
  },
  {
    id: 'macro-balanced-2000',
    engine: 'wellness',
    ref: 'macro',
    title: '2,000 kcal, balanced',
    inputs: { calories: 2000, diet: 'balanced' },
    expect: { protein: 100, carb: 250, fat: 66.7 },
    narrative: 'A balanced 2,000 kcal day is 100 g protein, 250 g carbs, and about 67 g fat.',
  },
  {
    id: 'macro-keto-1800',
    engine: 'wellness',
    ref: 'macro',
    title: '1,800 kcal, keto',
    inputs: { calories: 1800, diet: 'keto' },
    expect: { protein: 112.5, carb: 22.5, fat: 140 },
    narrative: 'A 1,800 kcal keto split lands near 113 g protein, 23 g carbs, and 140 g fat, most calories coming from fat.',
  },
  {
    id: 'ideal-weight-male-180',
    engine: 'wellness',
    ref: 'ideal-weight',
    title: 'Male, 180 cm',
    inputs: { unit: 'metric', sex: 'male', height: 180 },
    expect: { ideal: 74.1 },
    narrative: 'For a 180 cm man the four classic formulas average about 74 kg, inside the wider BMI healthy range.',
  },
  {
    id: 'ideal-weight-female-165',
    engine: 'wellness',
    ref: 'ideal-weight',
    title: 'Female, 165 cm',
    inputs: { unit: 'metric', sex: 'female', height: 165 },
    expect: { ideal: 57.7 },
    narrative: 'For a 165 cm woman the formulas average about 58 kg.',
  },
];

export const WELLNESS_EXAMPLE_MAP = buildExampleRegistry(WELLNESS_EXAMPLES);

export function wellnessExamplesFor(ref: string): WorkedExample<WellnessInput>[] {
  return examplesForRef(WELLNESS_EXAMPLES, 'wellness', ref);
}
