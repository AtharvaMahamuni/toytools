// Pure-model tests for the wellness engine: unit conversions and the BMI primitives, asserted
// against hand-computed values. These have no dependency on the result/experience layers.

import { describe, expect, it } from 'vitest';
import {
  lbToKg,
  kgToLb,
  inToM,
  inToCm,
  cmToM,
  bmi,
  bmiCategory,
  healthyWeightRangeKg,
  weightToHealthyKg,
  bmrMifflinStJeor,
  tdee,
  ACTIVITY_FACTOR,
  dailyCalorieDelta,
} from './models';

describe('unit conversion', () => {
  it('round-trips kilograms and pounds', () => {
    expect(kgToLb(1)).toBeCloseTo(2.2046226218, 6);
    expect(lbToKg(kgToLb(70))).toBeCloseTo(70, 9);
  });

  it('converts height to metres', () => {
    expect(cmToM(175)).toBeCloseTo(1.75, 9);
    expect(inToM(69)).toBeCloseTo(1.7526, 4);
  });

  it('converts inches to centimetres', () => {
    expect(inToCm(1)).toBeCloseTo(2.54, 9);
    expect(inToCm(69)).toBeCloseTo(175.26, 6);
  });
});

describe('BMR and TDEE', () => {
  it('computes Mifflin-St Jeor with the correct sex constant', () => {
    // Male: 10·70 + 6.25·175 − 5·30 + 5 = 1648.75
    expect(bmrMifflinStJeor('male', 70, 175, 30)).toBeCloseTo(1648.75, 4);
    // Female: same body, −161 instead of +5 => 166 less
    expect(bmrMifflinStJeor('female', 70, 175, 30)).toBeCloseTo(1648.75 - 166, 4);
  });

  it('scales BMR by the activity factor', () => {
    expect(tdee(1648.75, 'moderate')).toBeCloseTo(1648.75 * 1.55, 6);
    expect(tdee(1648.75, 'sedentary')).toBeCloseTo(1648.75 * ACTIVITY_FACTOR.sedentary, 6);
  });

  it('converts a weekly weight change into a daily calorie gap', () => {
    // 0.5 kg/week * 7700 kcal / 7 days = 550 kcal/day
    expect(dailyCalorieDelta(0.5)).toBeCloseTo(550, 6);
    expect(dailyCalorieDelta(-0.5)).toBeCloseTo(-550, 6);
  });
});

describe('bmi', () => {
  it('computes weight / height² in metric', () => {
    expect(bmi(70, 1.75)).toBeCloseTo(22.857, 3);
    expect(bmi(90, 1.7)).toBeCloseTo(31.142, 3);
  });

  it('returns NaN for a non-positive height instead of throwing', () => {
    expect(Number.isNaN(bmi(70, 0))).toBe(true);
    expect(Number.isNaN(bmi(70, -1))).toBe(true);
  });

  it('classifies against the WHO adult bands, including the boundaries', () => {
    expect(bmiCategory(18.49)).toBe('underweight');
    expect(bmiCategory(18.5)).toBe('normal');
    expect(bmiCategory(24.9)).toBe('normal');
    expect(bmiCategory(25)).toBe('overweight');
    expect(bmiCategory(29.9)).toBe('overweight');
    expect(bmiCategory(30)).toBe('obese');
  });
});

describe('healthy weight range', () => {
  it('spans BMI 18.5 to 24.9 for the given height', () => {
    const [lo, hi] = healthyWeightRangeKg(1.75);
    expect(lo).toBeCloseTo(18.5 * 1.75 * 1.75, 6); // 56.66
    expect(hi).toBeCloseTo(24.9 * 1.75 * 1.75, 6); // 76.26
  });

  it('reports zero distance inside the range, and a signed gap outside it', () => {
    // 70 kg at 1.75 m is inside the range.
    expect(weightToHealthyKg(70, 1.75)).toBe(0);
    // 90 kg at 1.70 m is above the range (positive => lose).
    expect(weightToHealthyKg(90, 1.7)).toBeGreaterThan(0);
    // 45 kg at 1.75 m is below the range (negative => gain).
    expect(weightToHealthyKg(45, 1.75)).toBeLessThan(0);
  });
});
