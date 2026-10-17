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

  it('names the two lean-body-mass formulas once they differ by 5 kg or more', () => {
    // Male, 120 kg, 170 cm: Boer and Hume are about 7.5 kg apart.
    const r = wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'male', weight: 120, height: 170 });
    expect(r).toContain('Boer');
    expect(r).toContain('Hume');
    expect(r).toContain('7.5 kg');
    // Same body in pounds and inches. Female coefficients put Hume above James by about 8.6 kg.
    const imperial = wellnessCaveat('lean-body-mass', {
      unit: 'imperial', sex: 'male', weight: 120 * 2.2046226218, height: 170 / 2.54,
    });
    expect(imperial).toContain('Boer');
    expect(imperial).toContain('16.6 lb');
    expect(imperial).not.toContain('kg');
    // A height typed in metres is refused by the calculator, so the caveat stays silent too.
    expect(wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'male', weight: 80, height: 1.8 })).toBeNull();
    const female = wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'female', weight: 120, height: 170 });
    expect(female).toContain('Hume');
    expect(female).toContain('James');
    expect(female).toContain('8.6 kg');
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

  it('names the other unit when only one waist-to-hip circumference was converted', () => {
    const r = wellnessCaveat('waist-to-hip-ratio', { unit: 'metric', sex: 'male', waist: 32, hip: 102 });
    expect(r).toContain('0.31');
    expect(r).toContain('0.80');
    expect(r).toContain('inches');
    const imperial = wellnessCaveat('waist-to-hip-ratio', { unit: 'imperial', sex: 'male', waist: 90, hip: 38 });
    expect(imperial).toContain('centimetres');
  });

  it('names Mosteller and Du Bois once the surface-area spread reaches 0.05 m²', () => {
    const r = wellnessCaveat('body-surface-area', { unit: 'metric', height: 160, weight: 90 });
    expect(r).toContain('Mosteller');
    expect(r).toContain('Du Bois');
    expect(r).toContain('0.07');
  });

  it('names both VO2 estimates once they differ by 5 ml/kg/min', () => {
    const r = wellnessCaveat('vo2-max', { unit: 'km', distance: 2.4, age: 30, resting: 60 });
    expect(r).toContain('42.4');
    expect(r).toContain('47.7');
    expect(r).toContain('different measurements');
  });
});

// Silence is the whole difference between this and the standing caution every result already
// carries. These fire where the model is weakest, not on every calculation.
describe('wellnessCaveat — silence', () => {
  const IDS = [
    'bmi', 'bmr', 'body-fat', 'calorie-deficit', 'heart-rate-zones', 'ideal-weight',
    'lean-body-mass', 'one-rep-max', 'protein-intake', 'running-pace', 'tdee', 'macro',
    'waist-to-hip-ratio', 'body-surface-area', 'vo2-max',
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

  it('says nothing about lean body mass when the spread stays under 5 kg', () => {
    // Male, 80 kg, 180 cm: Boer, James, and Hume span about 4.9 kg.
    expect(wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'male', weight: 80, height: 180 })).toBeNull();
    expect(wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'female', weight: 80, height: 180 })).toBeNull();
    expect(wellnessCaveat('lean-body-mass', {})).toBeNull();
    expect(wellnessCaveat('lean-body-mass', { unit: 'metric', sex: 'male', weight: 80, height: 0 })).toBeNull();
    expect(wellnessCaveat('lean-body-mass', { unit: 'metric', weight: 80, height: 180 })).toBeNull();
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

  it('says nothing for an ordinary waist-to-hip ratio, even when both sides are the wrong unit together', () => {
    expect(wellnessCaveat('waist-to-hip-ratio', { unit: 'metric', sex: 'male', waist: 80, hip: 100 })).toBeNull();
    expect(wellnessCaveat('waist-to-hip-ratio', { unit: 'metric', sex: 'male', waist: 32, hip: 40 })).toBeNull();
    expect(wellnessCaveat('waist-to-hip-ratio', { unit: 'imperial', sex: 'female', waist: 80, hip: 100 })).toBeNull();
  });

  it('says nothing when Mosteller and Du Bois agree within 0.05 m²', () => {
    expect(wellnessCaveat('body-surface-area', { unit: 'metric', height: 175, weight: 70 })).toBeNull();
    expect(wellnessCaveat('body-surface-area', { unit: 'metric', height: 190, weight: 120 })).toBeNull();
    expect(wellnessCaveat('body-surface-area', { unit: 'metric', height: 1.75, weight: 70 })).toBeNull();
  });

  it('says nothing about VO2 when only one method is present, or the two agree', () => {
    expect(wellnessCaveat('vo2-max', { unit: 'km', distance: 2.4 })).toBeNull();
    expect(wellnessCaveat('vo2-max', { unit: 'km', age: 30, resting: 60 })).toBeNull();
    expect(wellnessCaveat('vo2-max', { unit: 'km', distance: 2.4, age: 30, resting: 68 })).toBeNull();
    expect(wellnessCaveat('vo2-max', { unit: 'km', distance: 2400, age: 30, resting: 60 })).toBeNull();
  });

  it('says nothing at the activity levels people do not overstate', () => {
    const base = { unit: 'metric', sex: 'male', weight: 80, height: 180, age: 30 };
    for (const activity of ['sedentary', 'light', 'moderate']) {
      expect(wellnessCaveat('tdee', { ...base, activity })).toBeNull();
    }
  });
});
