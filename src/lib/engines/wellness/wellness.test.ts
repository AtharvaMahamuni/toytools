// Calculator-level tests for the wellness engine: the registry contract (never-throws), each worked
// example re-run against its expected card values, and the BMI calculator's category, healthy-range,
// and validation paths.

import { describe, expect, it } from 'vitest';
import { WELLNESS_CALCULATORS, wellnessFields, runWellness } from './registry';
import { WELLNESS_EXAMPLES } from './examples';
import type { InteractiveResult } from '@lib/results/types';

function cardRaw(result: InteractiveResult, id: string): number | undefined {
  if (result.hero?.id === id) return result.hero.raw;
  return result.metrics.find((c) => c.id === id)?.raw;
}

function cardValue(result: InteractiveResult, id: string): string | undefined {
  if (result.hero?.id === id) return result.hero.value;
  return result.metrics.find((c) => c.id === id)?.value;
}

describe('wellness registry', () => {
  it('every calculator exposes fields and a calculate()', () => {
    for (const [id, calc] of Object.entries(WELLNESS_CALCULATORS)) {
      expect(calc.id).toBe(id);
      expect(wellnessFields(id).length).toBeGreaterThan(0);
      expect(typeof calc.calculate).toBe('function');
    }
  });

  it('unknown ids surface as calculation errors, never exceptions', () => {
    expect(runWellness('nope', {}, {}).uiState).toBe('calculation-error');
  });
});

describe('worked examples', () => {
  it.each(WELLNESS_EXAMPLES.map((e) => [e.id, e] as const))('%s reproduces its expected values', (_id, ex) => {
    const res = runWellness(ex.ref, ex.inputs, {});
    expect(res.uiState).toBe('success');
    for (const [cardId, raw] of Object.entries(ex.expect ?? {})) {
      expect(cardRaw(res, cardId), cardId).toBeCloseTo(raw, 2);
    }
  });
});

describe('bmi calculator', () => {
  it('labels a healthy BMI and marks the milestone reached', () => {
    const res = runWellness('bmi', { unit: 'metric', weight: 70, height: 175 }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.value).toBe('22.9');
    expect(res.hero?.note).toBe('Healthy weight');
    expect(cardValue(res, 'category')).toBe('Healthy weight');
    expect(res.milestones?.find((m) => m.id === 'ms-healthy')?.reached).toBe(true);
    // Inside the healthy range => no "weight to lose/gain" card.
    expect(res.metrics.find((c) => c.id === 'to-healthy')).toBeUndefined();
  });

  it('flags obesity and surfaces the weight needed to reach the healthy range', () => {
    const res = runWellness('bmi', { unit: 'metric', weight: 90, height: 170 }, {});
    expect(res.hero?.note).toBe('Obesity');
    expect(res.milestones?.find((m) => m.id === 'ms-healthy')?.reached).toBe(false);
    const toHealthy = res.metrics.find((c) => c.id === 'to-healthy');
    expect(toHealthy).toBeDefined();
    expect(toHealthy?.raw).toBeGreaterThan(0);
  });

  it('agrees between metric and imperial for the same body', () => {
    const metric = runWellness('bmi', { unit: 'metric', weight: 69.85, height: 175.26 }, {});
    const imperial = runWellness('bmi', { unit: 'imperial', weight: 154, height: 69 }, {});
    expect(metric.hero?.raw).toBeCloseTo(imperial.hero?.raw ?? 0, 1);
  });

  it('always keeps the BMI-is-a-screen caution insight', () => {
    const res = runWellness('bmi', { unit: 'metric', weight: 70, height: 175 }, {});
    const cautions = (res.insights ?? []).filter((i) => i.tone === 'caution');
    expect(cautions.length).toBeGreaterThan(0);
    expect(cautions.some((i) => /not a diagnosis/i.test(i.text))).toBe(true);
  });

  it('rejects a zero or missing height as a validation error, not a crash', () => {
    expect(runWellness('bmi', { unit: 'metric', weight: 70, height: 0 }, {}).uiState).toBe('validation-error');
    expect(runWellness('bmi', { unit: 'metric', weight: 70 }, {}).uiState).toBe('validation-error');
  });

  it('rejects an unknown unit system as a validation error', () => {
    expect(runWellness('bmi', { unit: 'stones', weight: 70, height: 175 }, {}).uiState).toBe('validation-error');
  });
});

describe('tdee calculator', () => {
  const base = { unit: 'metric', sex: 'male', age: 30, weight: 70, height: 175, activity: 'moderate' };

  it('returns BMR and maintenance plus loss/gain targets', () => {
    const res = runWellness('tdee', base, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBe(2556); // 1648.75 * 1.55
    expect(res.metrics.find((c) => c.id === 'bmr')?.raw).toBe(1649);
    const loss = res.metrics.find((c) => c.id === 'loss')?.raw ?? 0;
    const gain = res.metrics.find((c) => c.id === 'gain')?.raw ?? 0;
    // Loss target is below maintenance, gain is above, by ~550 kcal.
    expect(gain - (res.hero?.raw ?? 0)).toBeCloseTo(550, 0);
    expect((res.hero?.raw ?? 0) - loss).toBeCloseTo(550, 0);
  });

  it('applies the female sex constant (lower BMR than male, same body)', () => {
    const male = runWellness('tdee', base, {});
    const female = runWellness('tdee', { ...base, sex: 'female' }, {});
    expect(female.metrics.find((c) => c.id === 'bmr')?.raw).toBeLessThan(
      male.metrics.find((c) => c.id === 'bmr')?.raw ?? 0,
    );
  });

  it('rises with a higher activity level', () => {
    const sed = runWellness('tdee', { ...base, activity: 'sedentary' }, {});
    const active = runWellness('tdee', { ...base, activity: 'very-active' }, {});
    expect(active.hero?.raw).toBeGreaterThan(sed.hero?.raw ?? 0);
  });

  it('never lets the weight-loss target drop below BMR', () => {
    // A small, very active person: the 0.5 kg/week deficit could otherwise fall under BMR.
    const res = runWellness('tdee', { unit: 'metric', sex: 'female', age: 25, weight: 50, height: 160, activity: 'sedentary' }, {});
    const bmr = res.metrics.find((c) => c.id === 'bmr')?.raw ?? 0;
    const loss = res.metrics.find((c) => c.id === 'loss')?.raw ?? 0;
    expect(loss).toBeGreaterThanOrEqual(bmr);
  });

  it('rejects a missing age or unknown activity level as validation errors', () => {
    expect(runWellness('tdee', { ...base, age: '' }, {}).uiState).toBe('validation-error');
    expect(runWellness('tdee', { ...base, activity: 'olympian' }, {}).uiState).toBe('validation-error');
  });
});

describe('body-fat calculator', () => {
  const male = { unit: 'metric', sex: 'male', height: 175, neck: 38, waist: 85, hip: 0, weight: 80 };

  it('estimates body fat and splits weight into fat and lean mass when weight is given', () => {
    const res = runWellness('body-fat', male, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBeCloseTo(16.9, 1);
    const fat = res.metrics.find((c) => c.id === 'fat-mass')?.raw ?? 0;
    const lean = res.metrics.find((c) => c.id === 'lean-mass')?.raw ?? 0;
    expect(fat + lean).toBeCloseTo(80, 1);
  });

  it('omits the fat/lean split when no weight is entered', () => {
    const res = runWellness('body-fat', { ...male, weight: 0 }, {});
    expect(res.uiState).toBe('success');
    expect(res.metrics.find((c) => c.id === 'fat-mass')).toBeUndefined();
    expect(res.metrics.find((c) => c.id === 'lean-mass')).toBeUndefined();
  });

  it('requires the hip measurement for women', () => {
    const noHip = runWellness('body-fat', { unit: 'metric', sex: 'female', height: 165, neck: 34, waist: 75 }, {});
    expect(noHip.uiState).toBe('validation-error');
    const withHip = runWellness('body-fat', { unit: 'metric', sex: 'female', height: 165, neck: 34, waist: 75, hip: 95 }, {});
    expect(withHip.uiState).toBe('success');
    expect(withHip.hero?.raw).toBeCloseTo(26.4, 1);
  });

  it('rejects a neck wider than the waist with an actionable message, not a crash', () => {
    const res = runWellness('body-fat', { ...male, neck: 90, waist: 85 }, {});
    expect(res.uiState).toBe('validation-error');
    expect(res.error).toMatch(/neck/i);
  });
});

describe('macro calculator', () => {
  it('splits a calorie target into protein/carb/fat grams', () => {
    const res = runWellness('macro', { calories: 2000, diet: 'balanced' }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBeCloseTo(100, 1); // protein
    expect(res.metrics.find((c) => c.id === 'carb')?.raw).toBeCloseTo(250, 1);
    expect(res.metrics.find((c) => c.id === 'fat')?.raw).toBeCloseTo(66.7, 1);
  });

  it('changes the split per diet, keeping calories conserved', () => {
    const keto = runWellness('macro', { calories: 1800, diet: 'keto' }, {});
    const p = keto.hero?.raw ?? 0;
    const c = keto.metrics.find((x) => x.id === 'carb')?.raw ?? 0;
    const f = keto.metrics.find((x) => x.id === 'fat')?.raw ?? 0;
    expect(p * 4 + c * 4 + f * 9).toBeCloseTo(1800, 0);
  });

  it('rejects zero calories and an unknown diet as validation errors', () => {
    expect(runWellness('macro', { calories: 0, diet: 'balanced' }, {}).uiState).toBe('validation-error');
    expect(runWellness('macro', { calories: 2000, diet: 'paleo' }, {}).uiState).toBe('validation-error');
  });
});

describe('ideal-weight calculator', () => {
  it('reports the four formulas, their average as the hero, and the BMI healthy range', () => {
    const res = runWellness('ideal-weight', { unit: 'metric', sex: 'male', height: 180 }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBeCloseTo(74.1, 1);
    for (const id of ['devine', 'robinson', 'miller', 'hamwi', 'healthy-range']) {
      expect(res.metrics.find((c) => c.id === id), id).toBeDefined();
    }
    // The hero average sits between the lowest and highest formula.
    const vals = ['devine', 'robinson', 'miller', 'hamwi'].map((id) => res.metrics.find((c) => c.id === id)!.raw!);
    expect(res.hero!.raw!).toBeGreaterThanOrEqual(Math.min(...vals));
    expect(res.hero!.raw!).toBeLessThanOrEqual(Math.max(...vals));
  });

  it('agrees between metric and imperial for the same height', () => {
    const metric = runWellness('ideal-weight', { unit: 'metric', sex: 'female', height: 165 }, {});
    const imperial = runWellness('ideal-weight', { unit: 'imperial', sex: 'female', height: 165 / 2.54 }, {});
    expect(metric.hero?.raw).toBeCloseTo(imperial.hero?.raw ?? 0, 1);
  });

  it('rejects a missing height as a validation error', () => {
    expect(runWellness('ideal-weight', { unit: 'metric', sex: 'male' }, {}).uiState).toBe('validation-error');
  });
});

describe('heart-rate-zones calculator', () => {
  it('reports max HR and five ascending zones (percent of max)', () => {
    const res = runWellness('heart-rate-zones', { age: 30, method: 'simple', resting: 0 }, {});
    expect(res.uiState).toBe('success');
    expect(res.hero?.raw).toBe(190);
    const zoneLows = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'].map((id) => res.metrics.find((c) => c.id === id)!.raw!);
    expect(zoneLows).toHaveLength(5);
    // Each zone starts higher than the last.
    for (let i = 1; i < zoneLows.length; i++) expect(zoneLows[i]).toBeGreaterThan(zoneLows[i - 1]);
    expect(res.metrics.find((c) => c.id === 'zone2')?.raw).toBe(114); // 190 * 0.6
  });

  it('personalises zones with the Karvonen method when resting HR is given', () => {
    const res = runWellness('heart-rate-zones', { age: 40, method: 'tanaka', resting: 60 }, {});
    expect(res.hero?.raw).toBe(180); // 208 - 0.7*40
    expect(res.metrics.find((c) => c.id === 'zone2')?.raw).toBe(132); // (180-60)*0.6 + 60
  });

  it('rejects a resting HR at or above the estimated maximum', () => {
    expect(runWellness('heart-rate-zones', { age: 30, method: 'simple', resting: 200 }, {}).uiState).toBe('validation-error');
  });

  it('rejects a missing age as a validation error', () => {
    expect(runWellness('heart-rate-zones', { age: '', method: 'simple', resting: 0 }, {}).uiState).toBe('validation-error');
  });
});
