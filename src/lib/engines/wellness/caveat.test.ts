import { describe, expect, it } from 'vitest';
import { wellnessCaveat } from './caveat';

describe('wellnessCaveat — where this input sits in the model', () => {
  it('catches a weight in pounds typed into a metric BMI form, and reads it back', () => {
    // 165 kg at 175 cm is a BMI of 53.9; read as pounds it is 24.4.
    const r = wellnessCaveat('bmi', { unit: 'metric', weight: 165, height: 175 });
    expect(r).toContain('53.9');
    expect(r).toContain('in pounds');
    expect(r).toContain('24.4');
  });

  it('calls a low resting burn ordinary, per kilogram', () => {
    const r = wellnessCaveat('bmr', { unit: 'metric', sex: 'female', weight: 50, height: 155, age: 30 });
    expect(r).toContain('kcal per kilogram');
    expect(r).toContain('being smaller');
  });

  it('says how much the deficit shrinks by the time the goal is reached', () => {
    const r = wellnessCaveat('calorie-deficit', {
      unit: 'metric', sex: 'male', weight: 110, height: 175, age: 30, activity: 'moderate', goal: 75,
    });
    expect(r).toContain('kcal fewer');
  });

  it('prices the max-heart-rate spread as the width of Zone 2', () => {
    const r = wellnessCaveat('heart-rate-zones', { age: 40, method: 'simple' });
    expect(r).toContain('Zone 2');
    expect(r).toContain('bpm');
  });

  it('reports the disagreement between the four ideal-weight formulas', () => {
    const r = wellnessCaveat('ideal-weight', { unit: 'metric', sex: 'male', height: 190 });
    expect(r).toContain('four formulas disagree');
    expect(r).toContain('no single ideal weight');
  });

  it('reports the one-rep-max spread once the rep count leaves the reliable range', () => {
    const r = wellnessCaveat('one-rep-max', { unit: 'kg', weight: 100, reps: 12 });
    expect(r).toContain('12 reps');
    expect(r).toContain('three to five');
  });

  it('turns a protein target into grams per sitting and names the plateau', () => {
    const r = wellnessCaveat('protein-intake', { unit: 'metric', weight: 100, goal: 'strength', meals: 2 });
    expect(r).toContain('a sitting');
    expect(r).toContain('40 g');
  });

  it('names the extrapolation factor when a marathon is predicted off a short run', () => {
    const r = wellnessCaveat('running-pace', { unit: 'km', distance: 5 });
    expect(r).toContain('8.4 times');
    expect(r).toContain('factor of three');
  });

  it('prices one step down the activity list', () => {
    const r = wellnessCaveat('tdee', {
      unit: 'metric', sex: 'male', weight: 80, height: 180, age: 30, activity: 'very-active',
    });
    expect(r).toContain('kcal a day');
    expect(r).toContain('very active');
  });
});

// Silence is the whole difference between this and the standing caution every result already
// carries. These fire where the model is weakest, not on every calculation.
describe('wellnessCaveat — silence', () => {
  const IDS = [
    'bmi', 'bmr', 'body-fat', 'calorie-deficit', 'heart-rate-zones', 'ideal-weight',
    'one-rep-max', 'protein-intake', 'running-pace', 'tdee', 'macro',
  ];

  it('says nothing on an empty form, for every calculator', () => {
    for (const id of IDS) expect(wellnessCaveat(id, {})).toBeNull();
  });

  it('says nothing to the two calculators with no honest rule', () => {
    expect(wellnessCaveat('macro', { calories: 2400, diet: 'balanced' })).toBeNull();
    // body-fat's tape sensitivity barely varies with the input, so a rule would be a disclaimer.
    expect(wellnessCaveat('body-fat', { unit: 'metric', sex: 'male', height: 175, neck: 38, waist: 85 })).toBeNull();
  });

  it('says nothing about units for a BMI a body actually reaches', () => {
    expect(wellnessCaveat('bmi', { unit: 'metric', weight: 75, height: 175 })).toBeNull();
    expect(wellnessCaveat('bmi', { unit: 'imperial', weight: 165, height: 69 })).toBeNull();
    // A real BMI of 39 whose pounds reading is 17.8: extreme, but not a unit mix-up.
    expect(wellnessCaveat('bmi', { unit: 'metric', weight: 120, height: 175 })).toBeNull();
  });

  it('says nothing about a resting burn that is not low', () => {
    expect(wellnessCaveat('bmr', { unit: 'metric', sex: 'male', weight: 85, height: 185, age: 30 })).toBeNull();
  });

  it('says nothing about a deficit with no goal weight, or a goal above the current one', () => {
    const base = { unit: 'metric', sex: 'male', weight: 80, height: 175, age: 30, activity: 'moderate' };
    expect(wellnessCaveat('calorie-deficit', base)).toBeNull();
    expect(wellnessCaveat('calorie-deficit', { ...base, goal: 90 })).toBeNull();
  });

  it('says nothing about formula spread once a resting heart rate is given', () => {
    expect(wellnessCaveat('heart-rate-zones', { age: 40, method: 'simple', resting: 55 })).toBeNull();
  });

  it('says nothing about ideal weight where the formulas agree closely', () => {
    // They converge near 165 cm and diverge at BOTH extremes, which is not what I assumed first.
    expect(wellnessCaveat('ideal-weight', { unit: 'metric', sex: 'male', height: 165 })).toBeNull();
  });

  it('says nothing about a one-rep-max estimated from a low-rep set', () => {
    for (const reps of [1, 3, 5]) {
      expect(wellnessCaveat('one-rep-max', { unit: 'kg', weight: 100, reps })).toBeNull();
    }
  });

  it('says nothing when the protein is already spread under the plateau', () => {
    expect(wellnessCaveat('protein-intake', { unit: 'metric', weight: 70, goal: 'active', meals: 4 })).toBeNull();
  });

  it('says nothing when the run is close enough to a marathon to extrapolate from', () => {
    expect(wellnessCaveat('running-pace', { unit: 'km', distance: 21.1 })).toBeNull();
  });

  it('says nothing at the activity levels people do not overstate', () => {
    const base = { unit: 'metric', sex: 'male', weight: 80, height: 180, age: 30 };
    for (const activity of ['sedentary', 'light', 'moderate']) {
      expect(wellnessCaveat('tdee', { ...base, activity })).toBeNull();
    }
  });
});
