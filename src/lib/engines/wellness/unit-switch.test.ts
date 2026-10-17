// Phase C PR 2 item 4: the metric / imperial switch converts body measurements.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { convertMeasurement, unitDimensions, LB_PER_KG, CM_PER_IN, KM_PER_MI, IMPERIAL_UNITS } from './unit-switch';
import { getWellnessCalculator } from './registry';

describe('unit switch (item 4)', () => {
  it('converts kg <-> lb and cm <-> in to 1 decimal', () => {
    expect(convertMeasurement(70, 'mass', 'metric', 'imperial')).toBe(154.3);
    expect(convertMeasurement(154.3, 'mass', 'imperial', 'metric')).toBe(70);
    expect(convertMeasurement(175, 'length', 'metric', 'imperial')).toBe(68.9);
    expect(convertMeasurement(68.9, 'length', 'imperial', 'metric')).toBe(175);
    expect(convertMeasurement(5, 'mass', 'metric', 'metric')).toBe(5);
  });

  it('covers every unit-bearing field on the seven health tools', () => {
    const expected: Record<string, string[]> = {
      bmi: ['weight', 'height'],
      bmr: ['weight', 'height'],
      tdee: ['weight', 'height'],
      'calorie-deficit': ['weight', 'height', 'goal'],
      'body-fat': ['height', 'neck', 'waist', 'hip', 'weight'],
      'ideal-weight': ['height'],
      'protein-intake': ['weight'],
      'lean-body-mass': ['weight', 'height'],
      'one-rep-max': ['weight'],
      'running-pace': ['distance'],
      'waist-to-hip-ratio': ['waist', 'hip'],
      'body-surface-area': ['weight', 'height'],
      'vo2-max': ['distance'],
    };
    for (const [id, ids] of Object.entries(expected)) {
      const dims = unitDimensions(getWellnessCalculator(id)!.fields);
      expect(Object.keys(dims).sort(), id).toEqual([...ids].sort());
    }
  });

  it('the widget inlines the same factors', () => {
    const src = readFileSync('src/tools/_shared/WellnessWidget.astro', 'utf8');
    expect(src).toContain(String(LB_PER_KG));
    expect(src).toContain(`1 / ${CM_PER_IN}`);
    expect(src).toContain(`1 / ${KM_PER_MI}`);
    expect(src).toContain(JSON.stringify(IMPERIAL_UNITS).replace(/"/g, "'").replace(/,/g, ', '));
  });
});

describe('kg / lb and km / mi switches (round 1, M1)', () => {
  it('One-Rep Max converts kg to lb, not the other way', () => {
    expect(convertMeasurement(100, 'mass', 'kg', 'lb')).toBe(220.5);
    expect(convertMeasurement(220.5, 'mass', 'lb', 'kg')).toBe(100);
  });
  it('Running Pace converts km to mi', () => {
    expect(convertMeasurement(5, 'distance', 'km', 'mi')).toBe(3.1);
    expect(convertMeasurement(10, 'distance', 'mi', 'km')).toBe(16.1);
  });
  it('a same-side switch changes nothing', () => {
    expect(convertMeasurement(70, 'mass', 'metric', 'kg')).toBe(70);
  });
});
