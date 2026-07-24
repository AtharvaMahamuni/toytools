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
  bodyFatNavy,
  bodyFatCategory,
  macroGrams,
  idealWeight,
  IDEAL_WEIGHT_FORMULAS,
  maxHeartRate,
  heartRateAt,
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

describe('body fat (US Navy method)', () => {
  it('matches hand-computed values for men (waist − neck) and women (waist + hip − neck)', () => {
    expect(bodyFatNavy('male', 175, 38, 85)).toBeCloseTo(16.94, 1);
    expect(bodyFatNavy('female', 165, 34, 75, 95)).toBeCloseTo(26.40, 1);
  });

  it('returns NaN instead of throwing when the log argument is non-positive', () => {
    // Neck ≥ waist for a man makes waist − neck ≤ 0.
    expect(Number.isNaN(bodyFatNavy('male', 175, 40, 38))).toBe(true);
    expect(Number.isNaN(bodyFatNavy('female', 165, 200, 40, 40))).toBe(true);
  });

  it('classifies body fat on sex-specific ACE bands', () => {
    // Men: <6 essential, <14 athletes, <18 fitness, <25 average, else above.
    expect(bodyFatCategory('male', 5)).toBe('essential');
    expect(bodyFatCategory('male', 12)).toBe('athletes');
    expect(bodyFatCategory('male', 16)).toBe('fitness');
    expect(bodyFatCategory('male', 22)).toBe('average');
    expect(bodyFatCategory('male', 30)).toBe('obese');
    // Women's bands sit higher.
    expect(bodyFatCategory('female', 12)).toBe('essential');
    expect(bodyFatCategory('female', 22)).toBe('fitness');
    expect(bodyFatCategory('female', 35)).toBe('obese');
  });
});

describe('macro grams', () => {
  it('splits calories into grams using 4/4/9 kcal per gram', () => {
    const g = macroGrams(2000, { carb: 50, protein: 20, fat: 30 });
    expect(g.protein).toBeCloseTo(100, 6); // 2000*0.20/4
    expect(g.carb).toBeCloseTo(250, 6); // 2000*0.50/4
    expect(g.fat).toBeCloseTo(66.667, 3); // 2000*0.30/9
  });

  it('conserves calories: grams back to kcal equal the input (for a 100% split)', () => {
    const cals = 1800;
    const g = macroGrams(cals, { carb: 5, protein: 25, fat: 70 });
    const back = g.protein * 4 + g.carb * 4 + g.fat * 9;
    expect(back).toBeCloseTo(cals, 6);
  });
});

describe('ideal weight', () => {
  it('matches the Devine formula at 5 ft exactly (base weight, no inches over)', () => {
    // 60 inches == 152.4 cm; the per-inch term is zero, so only the base remains.
    expect(idealWeight('male', 152.4, IDEAL_WEIGHT_FORMULAS.devine)).toBeCloseTo(50, 6);
    expect(idealWeight('female', 152.4, IDEAL_WEIGHT_FORMULAS.devine)).toBeCloseTo(45.5, 6);
  });

  it('adds the per-inch term above 5 ft (Devine male, 180 cm)', () => {
    // 180 cm is 10.866 inches over 60; 50 + 2.3*10.866 ≈ 74.99
    expect(idealWeight('male', 180, IDEAL_WEIGHT_FORMULAS.devine)).toBeCloseTo(74.99, 1);
  });

  it('uses sex-specific per-inch coefficients (Robinson male 1.9 vs female 1.7)', () => {
    const male = idealWeight('male', 180, IDEAL_WEIGHT_FORMULAS.robinson);
    const female = idealWeight('female', 180, IDEAL_WEIGHT_FORMULAS.robinson);
    // Male base is higher AND grows faster per inch, so the gap exceeds the base gap of 3.
    expect(male - female).toBeGreaterThan(3);
  });
});

describe('heart rate', () => {
  it('estimates max HR by both formulas', () => {
    expect(maxHeartRate(30, 'simple')).toBe(190); // 220 - 30
    expect(maxHeartRate(40, 'tanaka')).toBeCloseTo(180, 6); // 208 - 0.7*40
  });

  it('uses a plain percent of max when no resting HR is given', () => {
    expect(heartRateAt(190, 0, 0.6)).toBeCloseTo(114, 6);
    expect(heartRateAt(190, 0, 0.7)).toBeCloseTo(133, 6);
  });

  it('switches to the Karvonen reserve method when a resting HR is present', () => {
    // reserve = 180 - 60 = 120; 60% => 120*0.6 + 60 = 132
    expect(heartRateAt(180, 60, 0.6)).toBeCloseTo(132, 6);
    expect(heartRateAt(180, 60, 1.0)).toBeCloseTo(180, 6); // 100% returns max
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
