// Unit tests for the fan-out calculators added on the wellness engine: BMR on its own, the calorie
// deficit and its BMR floor, protein ranges, one rep max across four formulas, and running pace
// with Riegel predictions. The shared registry contract is covered in wellness.test.ts.

import { describe, expect, it } from 'vitest';
import { runWellness, WELLNESS_CALCULATORS } from './registry';
import { LAZY_WELLNESS_IDS, loadWellnessCalculator, runLazyWellness } from './lazy';
import {
  bmrMifflinStJeor,
  oneRepMax,
  proteinRangeG,
  paceSecPerKm,
  formatPace,
  formatDuration,
  riegelPredict,
  miToKm,
} from './models';
import type { InteractiveResult } from '@lib/results/types';

function raw(result: InteractiveResult, id: string): number | undefined {
  if (result.hero?.id === id) return result.hero.raw;
  return result.metrics.find((c) => c.id === id)?.raw;
}

// The browser loads calculators one chunk at a time through lazy.ts, so a calculator missing from
// that map would build fine and then fail on its own page. Pin the two maps to each other.
describe('lazy calculator map', () => {
  it('covers exactly the calculators in the static registry', () => {
    expect([...LAZY_WELLNESS_IDS].sort()).toEqual(Object.keys(WELLNESS_CALCULATORS).sort());
  });

  it('loads a calculator on demand and runs it to the same answer', async () => {
    await loadWellnessCalculator('bmi');
    const lazy = runLazyWellness('bmi', { unit: 'metric', weight: 70, height: 175 }, {});
    const eager = runWellness('bmi', { unit: 'metric', weight: 70, height: 175 }, {});
    expect(lazy.uiState).toBe('success');
    expect(lazy.hero?.raw).toBe(eager.hero?.raw);
  });

  it('reports an unloaded id as a calculation error rather than throwing', () => {
    expect(runLazyWellness('nope', {}, {}).uiState).toBe('calculation-error');
  });
});

describe('one rep max models', () => {
  it('every formula returns the lifted weight for a single rep', () => {
    for (const f of ['epley', 'brzycki', 'lombardi', 'oconner'] as const) {
      expect(oneRepMax(100, 1, f)).toBe(100);
    }
  });

  it('Epley and Brzycki agree within a few percent at five reps', () => {
    const e = oneRepMax(100, 5, 'epley');
    const b = oneRepMax(100, 5, 'brzycki');
    expect(e).toBeCloseTo(116.67, 2);
    expect(b).toBeCloseTo(112.5, 2);
    expect(Math.abs(e - b) / e).toBeLessThan(0.05);
  });

  it('Brzycki is undefined near its 37-rep asymptote', () => {
    expect(Number.isNaN(oneRepMax(100, 36, 'brzycki'))).toBe(true);
  });

  it('estimates rise with reps', () => {
    expect(oneRepMax(100, 8, 'epley')).toBeGreaterThan(oneRepMax(100, 3, 'epley'));
  });
});

describe('protein models', () => {
  it('scales the guideline band by body weight', () => {
    expect(proteinRangeG(70, 'strength')).toEqual([112, 154]);
    expect(proteinRangeG(60, 'sedentary')).toEqual([48, 60]);
  });

  it('ranks the goals from sedentary up to fat loss', () => {
    const at = (g: Parameters<typeof proteinRangeG>[1]) => proteinRangeG(70, g)[1];
    expect(at('sedentary')).toBeLessThan(at('active'));
    expect(at('active')).toBeLessThan(at('strength'));
    expect(at('strength')).toBeLessThan(at('fat-loss'));
  });
});

describe('running pace models', () => {
  it('turns a distance and time into seconds per kilometre', () => {
    expect(paceSecPerKm(5, 25 * 60)).toBe(300);
  });

  it('formats pace as m:ss and duration as h:mm:ss', () => {
    expect(formatPace(300)).toBe('5:00');
    expect(formatPace(272)).toBe('4:32');
    expect(formatDuration(1500)).toBe('25:00');
    expect(formatDuration(12460)).toBe('3:27:40');
  });

  it('Riegel predicts a slower pace over a longer race', () => {
    const t10k = riegelPredict(25 * 60, 5, 10);
    expect(t10k).toBeGreaterThan(2 * 25 * 60); // slower than double, which is the whole point
    expect(t10k / 10).toBeGreaterThan(300);
  });

  it('predicts the same distance as the same time', () => {
    expect(riegelPredict(1500, 5, 5)).toBeCloseTo(1500, 6);
  });

  it('converts miles to kilometres', () => {
    expect(miToKm(1)).toBeCloseTo(1.609344, 6);
  });
});

describe('bmr calculator', () => {
  const base = { unit: 'metric', sex: 'male', age: 30, weight: 70, height: 175 };

  it('matches the Mifflin-St Jeor equation', () => {
    const res = runWellness('bmr', base, {});
    expect(res.uiState).toBe('success');
    expect(raw(res, 'bmr')).toBe(Math.round(bmrMifflinStJeor('male', 70, 175, 30)));
  });

  it('reads imperial input to the same answer', () => {
    const metric = runWellness('bmr', base, {});
    const imperial = runWellness('bmr', { unit: 'imperial', sex: 'male', age: 30, weight: 154.324, height: 68.898 }, {});
    expect(raw(imperial, 'bmr')).toBeCloseTo(raw(metric, 'bmr')!, -1);
  });

  it('reports every activity level above the resting figure', () => {
    const res = runWellness('bmr', base, {});
    expect(raw(res, 'sedentary')!).toBeGreaterThan(raw(res, 'bmr')!);
    expect(raw(res, 'very-active')!).toBeGreaterThan(raw(res, 'sedentary')!);
  });

  it('rejects a zero weight rather than throwing', () => {
    expect(runWellness('bmr', { ...base, weight: 0 }, {}).uiState).toBe('validation-error');
  });
});

describe('calorie deficit calculator', () => {
  const base = {
    unit: 'metric', sex: 'male', age: 30, weight: 90, height: 180,
    activity: 'moderate', rate: '0.5', goal: 0,
  };

  it('subtracts the daily energy the chosen rate needs', () => {
    const res = runWellness('calorie-deficit', base, {});
    expect(res.uiState).toBe('success');
    expect(raw(res, 'deficit')).toBe(550);
    expect(raw(res, 'target')).toBe(raw(res, 'maintenance')! - 550);
  });

  it('never suggests eating below BMR', () => {
    const res = runWellness('calorie-deficit', {
      unit: 'metric', sex: 'female', age: 35, weight: 65, height: 165,
      activity: 'light', rate: '1', goal: 0,
    }, {});
    expect(raw(res, 'target')).toBe(raw(res, 'bmr'));
    expect(raw(res, 'deficit')!).toBeLessThan(1100);
  });

  it('adds a timeline only when a goal weight is set below the current one', () => {
    expect(runWellness('calorie-deficit', base, {}).milestones ?? []).toHaveLength(0);
    const withGoal = runWellness('calorie-deficit', { ...base, goal: 80 }, {});
    expect(withGoal.milestones!.length).toBe(3);
    expect(raw(withGoal, 'weeks')).toBe(20);
  });

  it('ignores a goal weight above the current weight', () => {
    const res = runWellness('calorie-deficit', { ...base, goal: 100 }, {});
    expect(res.milestones ?? []).toHaveLength(0);
  });
});

describe('protein intake calculator', () => {
  it('reports the range, its midpoint, and the per-meal split', () => {
    const res = runWellness('protein-intake', { unit: 'metric', weight: 70, goal: 'strength', meals: 3 }, {});
    expect(res.uiState).toBe('success');
    expect(raw(res, 'midpoint')).toBe(133);
    expect(raw(res, 'per-meal')).toBe(44);
  });

  it('splits the same total over more meals', () => {
    const three = runWellness('protein-intake', { unit: 'metric', weight: 70, goal: 'strength', meals: 3 }, {});
    const five = runWellness('protein-intake', { unit: 'metric', weight: 70, goal: 'strength', meals: 5 }, {});
    expect(raw(five, 'midpoint')).toBe(raw(three, 'midpoint'));
    expect(raw(five, 'per-meal')!).toBeLessThan(raw(three, 'per-meal')!);
  });

  it('converts pounds before applying grams per kilogram', () => {
    const metric = runWellness('protein-intake', { unit: 'metric', weight: 70, goal: 'active', meals: 3 }, {});
    const imperial = runWellness('protein-intake', { unit: 'imperial', weight: 154.324, goal: 'active', meals: 3 }, {});
    expect(raw(imperial, 'midpoint')).toBe(raw(metric, 'midpoint'));
  });
});

describe('one rep max calculator', () => {
  it('averages the formulas and reports the spread', () => {
    const res = runWellness('one-rep-max', { unit: 'kg', weight: 100, reps: 5 }, {});
    expect(res.uiState).toBe('success');
    expect(raw(res, 'epley')).toBeCloseTo(116.7, 1);
    expect(raw(res, 'brzycki')).toBeCloseTo(112.5, 1);
    expect(raw(res, 'one-rep-max')!).toBeGreaterThan(112.5);
    expect(raw(res, 'one-rep-max')!).toBeLessThan(120);
  });

  it('emits the training percentage table below 100 percent', () => {
    const res = runWellness('one-rep-max', { unit: 'kg', weight: 100, reps: 5 }, {});
    const max = raw(res, 'one-rep-max')!;
    expect(raw(res, 'pct-80')).toBeCloseTo(Number((max * 0.8).toFixed(1)), 1);
    expect(res.metrics.find((c) => c.id === 'pct-100')).toBeUndefined();
  });

  it('returns the lifted weight unchanged for a single rep', () => {
    expect(raw(runWellness('one-rep-max', { unit: 'kg', weight: 120, reps: 1 }, {}), 'one-rep-max')).toBe(120);
  });

  it('rejects a zero weight rather than throwing', () => {
    expect(runWellness('one-rep-max', { unit: 'kg', weight: 0, reps: 5 }, {}).uiState).toBe('validation-error');
  });
});

describe('running pace calculator', () => {
  const fiveK = { unit: 'km', distance: 5, hours: 0, minutes: 25, seconds: 0 };

  it('reports pace, speed, and race predictions', () => {
    const res = runWellness('running-pace', fiveK, {});
    expect(res.uiState).toBe('success');
    expect(raw(res, 'pace')).toBe(300);
    expect(raw(res, 'kmh')).toBeCloseTo(12, 1);
    expect(raw(res, '5k')).toBe(1500);
    expect(raw(res, 'full')!).toBeGreaterThan(raw(res, 'half')!);
  });

  it('gives the same pace whichever unit the distance is entered in', () => {
    const km = runWellness('running-pace', fiveK, {});
    const mi = runWellness('running-pace', { unit: 'mi', distance: 5 / 1.609344, hours: 0, minutes: 25, seconds: 0 }, {});
    expect(raw(mi, 'other-pace')).toBe(raw(km, 'pace'));
  });

  it('needs a time as well as a distance', () => {
    expect(runWellness('running-pace', { ...fiveK, minutes: 0 }, {}).uiState).toBe('validation-error');
    expect(runWellness('running-pace', { ...fiveK, distance: 0 }, {}).uiState).toBe('validation-error');
  });

  it('adds the hours field into the total time', () => {
    const res = runWellness('running-pace', { unit: 'km', distance: 42.195, hours: 3, minutes: 30, seconds: 0 }, {});
    expect(raw(res, 'pace')).toBe(Math.round((3.5 * 3600) / 42.195));
  });
});
