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
