// The craft seam for the wellness engine: where THIS person's numbers sit relative to the model.
//
// Every calculator here already carries a standing caution ("BMI is a screening ratio, not a
// diagnosis", "these are estimates from a formula"). Those are true, they are on every result, and
// they are therefore invisible: a disclaimer that never changes reads as boilerplate and gets
// skipped. What none of them does is say when the person in front of it has landed in the part of
// the model where the estimate is worst, and by how much.
//
// That is what each rule here computes, from the same model functions the calculator used. Every
// one is silent for inputs the model handles well, which is most of them, and every one names a
// number rather than a caution:
//
//   bmi              "Mixing units, weight in pounds while height is in centimetres" — the only
//                    documented mistake on this engine that produces a wrong ANSWER rather than an
//                    over-read one, and the resulting BMI is outside anything a body reaches.
//   bmr              "Reading a low BMR as a broken metabolism rather than as being smaller."
//   calorie-deficit  "Never recalculating, so the deficit becomes maintenance as weight falls."
//   heart-rate-zones "Treating a formula maximum as exact instead of a rough estimate."
//   ideal-weight     "Treating one formula number as an exact target to hit."
//   one-rep-max      "Using a high-rep set, where the formulas diverge the most."
//   protein-intake   "Eating most of the day's protein at dinner rather than spreading it."
//   running-pace     "Extrapolating a marathon from a 5K, far outside the reliable range."
//   tdee             "Overstating activity level, which inflates the calorie target."
//
// Two get nothing. macro's documented mistakes are that a ratio matters less than the calorie total
// and that fat carries 9 kcal per gram, neither of which is visible from a calorie figure and a
// split. body-fat's is tape tension, and that IS computable (a centimetre at the waist is about 0.8
// points) but the sensitivity barely varies with the input, so a rule would fire on every result.
// That is a standing disclaimer, which is the thing this file exists to be an alternative to.
//
// See docs/analysis/2026-08-11-tool-craft.md.

import {
  ACTIVITY_FACTOR, IDEAL_WEIGHT_FORMULAS, PROTEIN_G_PER_KG, RIEGEL_EXPONENT,
  bmi as bmiValue, bmrMifflinStJeor, cmToM, idealWeight, inToCm, inToM,
  kgToLb, lbToKg, maxHeartRate, miToKm, oneRepMax, tdee as tdeeValue,
  type ActivityLevel, type MaxHrMethod, type OneRepMaxFormula, type ProteinGoal, type Sex,
} from './models';
import type { WellnessInput } from './types';

const n = (input: WellnessInput, key: string): number => {
  const v = input[key];
  const parsed = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(parsed) ? parsed : NaN;
};
const s = (input: WellnessInput, key: string): string => String(input[key] ?? '');
const ok = (...vals: number[]) => vals.every(v => Number.isFinite(v) && v > 0);
const r0 = (v: number) => Math.round(v);
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Metric is the engine's canonical unit; every calculator carries the same `unit` select. */
const isMetric = (input: WellnessInput) => s(input, 'unit') !== 'imperial' && s(input, 'unit') !== 'lb' && s(input, 'unit') !== 'mi';

const ACTIVITY_ORDER: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very-active'];
const ACTIVITY_LABEL: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary', light: 'Lightly active', moderate: 'Moderately active',
  active: 'Very active', 'very-active': 'Extra active',
};

/**
 * One line about where this input sits in the model, or null.
 *
 * Pure and total: reads the raw form values, reuses the engine's own model functions, and guards
 * every rule so a half-filled form gets nothing.
 */
export function wellnessCaveat(id: string, input: WellnessInput): string | null {
  const metric = isMetric(input);

  switch (id) {
    case 'bmi': {
      // The only documented mistake on this engine that produces a wrong ANSWER rather than an
      // over-read one. An absolute plausibility window does not separate it: 120 kg at 175 cm is a
      // real BMI of 39 and reads as 17.8 if you assume pounds, so a window would accuse a real user.
      // The test that does work is relative and two-sided: this reading is at an extreme AND the
      // other unit system puts the same figure in the ordinary range.
      const w = n(input, 'weight');
      const h = n(input, 'height');
      if (!ok(w, h)) return null;
      const kg = metric ? w : lbToKg(w);
      const m = metric ? cmToM(h) : inToM(h);
      if (!Number.isFinite(m) || m <= 0) return null;
      const value = bmiValue(kg, m);
      if (!Number.isFinite(value) || (value < 50 && value > 14)) return null;
      // Weight is the field that gets mixed up: people know their height in one system and read
      // their weight off whatever scale is in the room.
      const alt = bmiValue(metric ? lbToKg(w) : w, m);
      if (!Number.isFinite(alt) || alt < 18 || alt > 32) return null;
      return `This reads as ${r1(value)}. If that weight is in ${metric ? 'pounds' : 'kilograms'} rather than ${metric ? 'kilograms' : 'pounds'}, the same figure gives a BMI of ${r1(alt)}.`;
    }

    case 'bmr': {
      // A low resting burn reads as a broken metabolism. Per kilogram it is almost always ordinary,
      // and saying so with their own number is the difference between reassurance and a platitude.
      const sex = s(input, 'sex') as Sex;
      const w = n(input, 'weight');
      const h = n(input, 'height');
      const age = n(input, 'age');
      if (!ok(w, h, age) || (sex !== 'male' && sex !== 'female')) return null;
      const kg = metric ? w : lbToKg(w);
      const cm = metric ? h : inToCm(h);
      const value = bmrMifflinStJeor(sex, kg, cm, age);
      if (!Number.isFinite(value) || value >= 1400) return null;
      return `That is ${r1(value / kg)} kcal per kilogram of body weight, which is an ordinary rate. A low total here is a consequence of being smaller, not of a slow metabolism.`;
    }

    case 'calorie-deficit': {
      // The deficit shrinks as the body does, and the number people never recompute is the one that
      // turns their plan into maintenance. It is one TDEE call away.
      const sex = s(input, 'sex') as Sex;
      const w = n(input, 'weight');
      const h = n(input, 'height');
      const age = n(input, 'age');
      const goal = n(input, 'goal');
      const activity = s(input, 'activity') as ActivityLevel;
      if (!ok(w, h, age, goal) || !ACTIVITY_FACTOR[activity]) return null;
      if (sex !== 'male' && sex !== 'female') return null;
      const kg = metric ? w : lbToKg(w);
      const goalKg = metric ? goal : lbToKg(goal);
      if (goalKg >= kg) return null;
      const cm = metric ? h : inToCm(h);
      const now = tdeeValue(bmrMifflinStJeor(sex, kg, cm, age), activity);
      const later = tdeeValue(bmrMifflinStJeor(sex, goalKg, cm, age), activity);
      const drop = now - later;
      if (!Number.isFinite(drop) || drop < 75) return null;
      return `At your goal weight the same day burns ${r0(drop)} kcal fewer, so today's target becomes a ${r0(drop)} kcal smaller deficit by the time you get there.`;
    }

    case 'heart-rate-zones': {
      // Without a resting rate the zones are a flat percentage of an estimated maximum, and the
      // estimate carries about ten beats either way. Priced as the width of Zone 2, the zone people
      // are actually trying to hit.
      const age = n(input, 'age');
      const resting = n(input, 'resting');
      const method = (s(input, 'method') || 'simple') as MaxHrMethod;
      if (!ok(age)) return null;
      if (Number.isFinite(resting) && resting > 0) return null;
      const max = maxHeartRate(age, method);
      if (!Number.isFinite(max)) return null;
      return `Ten beats of formula error, which is the usual spread, moves the top of Zone 2 between ${r0((max - 10) * 0.7)} and ${r0((max + 10) * 0.7)} bpm. A resting rate would narrow that.`;
    }

    case 'ideal-weight': {
      // Four formulas, one height. The spread between them IS the answer, and quoting any single
      // number as a target is the documented mistake.
      const sex = s(input, 'sex') as Sex;
      const h = n(input, 'height');
      if (!ok(h) || (sex !== 'male' && sex !== 'female')) return null;
      const cm = metric ? h : inToCm(h);
      const values = Object.values(IDEAL_WEIGHT_FORMULAS)
        .map(f => idealWeight(sex, cm, f))
        .filter(Number.isFinite);
      if (values.length < 2) return null;
      const spreadKg = Math.max(...values) - Math.min(...values);
      if (spreadKg < 4) return null;
      const spread = metric ? spreadKg : kgToLb(spreadKg);
      return `The four formulas disagree by ${r1(spread)} ${metric ? 'kg' : 'lb'} at your height. That spread is the answer: there is no single ideal weight to hit.`;
    }

    case 'one-rep-max': {
      // Past about five reps the formulas stop agreeing, because endurance rather than strength
      // starts deciding how long the set lasts. The spread in their own units says how much.
      const w = n(input, 'weight');
      const reps = n(input, 'reps');
      if (!ok(w, reps) || reps <= 5) return null;
      const formulas: OneRepMaxFormula[] = ['epley', 'brzycki', 'lombardi', 'oconner'];
      const values = formulas.map(f => oneRepMax(w, reps, f)).filter(Number.isFinite);
      if (values.length < 2) return null;
      const spread = Math.max(...values) - Math.min(...values);
      if (spread < 2) return null;
      const unit = s(input, 'unit') === 'lb' ? 'lb' : 'kg';
      return `At ${reps} reps the four formulas disagree by ${r1(spread)} ${unit}. A set of three to five would cut that spread to a couple of ${unit === 'kg' ? 'kilos' : 'pounds'}.`;
    }

    case 'protein-intake': {
      // Spreading the total is the documented mistake, and the meal count makes it measurable:
      // muscle protein synthesis plateaus around 40 g in a sitting.
      const w = n(input, 'weight');
      const meals = n(input, 'meals');
      const goal = s(input, 'goal') as ProteinGoal;
      const range = PROTEIN_G_PER_KG[goal];
      if (!ok(w, meals) || !range) return null;
      const kg = metric ? w : lbToKg(w);
      const mid = (kg * (range[0] + range[1])) / 2;
      const perMeal = mid / meals;
      if (perMeal <= 40) return null;
      const needed = Math.ceil(mid / 40);
      return `Across ${meals} meals that is about ${r0(perMeal)} g a sitting, and the response plateaus near 40 g. ${needed} meals would put every serving inside that.`;
    }

    case 'running-pace': {
      // Riegel holds within roughly a factor of three of the distance actually run. A marathon off a
      // 5K is a factor of eight, and the prediction is quoted with the same confidence regardless.
      const d = n(input, 'distance');
      if (!ok(d)) return null;
      const km = metric ? d : miToKm(d);
      const factor = 42.195 / km;
      if (!Number.isFinite(factor) || factor <= 3) return null;
      // How far the exponent carries the error: the model's own sensitivity at this ratio.
      const stretch = Math.pow(factor, RIEGEL_EXPONENT - 1);
      return `A marathon is ${r1(factor)} times this distance, past the factor of three Riegel holds for. The prediction stretches your pace by ${Math.round((stretch - 1) * 100)}% and real marathons usually cost more.`;
    }

    case 'tdee': {
      // Activity level is the single largest source of error here and the one input people flatter
      // themselves on. The cost of being one step out is arithmetic.
      const sex = s(input, 'sex') as Sex;
      const w = n(input, 'weight');
      const h = n(input, 'height');
      const age = n(input, 'age');
      const activity = s(input, 'activity') as ActivityLevel;
      const idx = ACTIVITY_ORDER.indexOf(activity);
      if (!ok(w, h, age) || idx < 3) return null; // only the top two levels: 'active', 'very-active'
      if (sex !== 'male' && sex !== 'female') return null;
      const kg = metric ? w : lbToKg(w);
      const cm = metric ? h : inToCm(h);
      const bmr = bmrMifflinStJeor(sex, kg, cm, age);
      const here = tdeeValue(bmr, activity);
      const below = tdeeValue(bmr, ACTIVITY_ORDER[idx - 1]!);
      const gap = here - below;
      if (!Number.isFinite(gap) || gap < 50) return null;
      return `One step down to ${ACTIVITY_LABEL[ACTIVITY_ORDER[idx - 1]!].toLowerCase()} is ${r0(gap)} kcal a day. Activity level is the largest guess in this estimate, and the one most often set too high.`;
    }

    default:
      return null;
  }
}
