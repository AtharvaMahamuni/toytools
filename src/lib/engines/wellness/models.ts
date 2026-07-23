// Wellness math primitives — pure, framework-free, no formatting, no validation. These are the
// reusable formulas every calculator composes; keeping them isolated makes them exhaustively unit
// testable against hand-computed values. All body math works in metric (kg, metres); the unit
// converters below are the ONLY place imperial input is normalised.

// ---- unit conversion --------------------------------------------------------------------------

export const LB_PER_KG = 2.2046226218;
export const IN_PER_M = 39.3700787402;
export const CM_PER_M = 100;

/** Pounds to kilograms. */
export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

/** Kilograms to pounds. */
export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

/** Inches to metres. */
export function inToM(inches: number): number {
  return inches / IN_PER_M;
}

/** Inches to centimetres. */
export function inToCm(inches: number): number {
  return inches * 2.54;
}

/** Centimetres to metres. */
export function cmToM(cm: number): number {
  return cm / CM_PER_M;
}

// ---- BMI --------------------------------------------------------------------------------------

/** Body Mass Index: weight (kg) / height (m)². Returns NaN for a non-positive height. */
export function bmi(weightKg: number, heightM: number): number {
  if (heightM <= 0) return NaN;
  return weightKg / (heightM * heightM);
}

/** WHO BMI category id for adults. Thresholds: <18.5 / 18.5–24.9 / 25–29.9 / ≥30. */
export type BmiCategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export function bmiCategory(value: number): BmiCategory {
  if (value < 18.5) return 'underweight';
  if (value < 25) return 'normal';
  if (value < 30) return 'overweight';
  return 'obese';
}

/** Human label for a BMI category. */
export const BMI_CATEGORY_LABEL: Record<BmiCategory, string> = {
  underweight: 'Underweight',
  normal: 'Healthy weight',
  overweight: 'Overweight',
  obese: 'Obesity',
};

/** The healthy-weight range (kg) for a height, i.e. the weights giving BMI 18.5–24.9. */
export function healthyWeightRangeKg(heightM: number): [number, number] {
  if (heightM <= 0) return [NaN, NaN];
  const h2 = heightM * heightM;
  return [18.5 * h2, 24.9 * h2];
}

/** How much weight (kg) separates the current weight from the nearest edge of the healthy range.
 *  Positive => must lose that much to reach the top edge; negative => must gain to reach the bottom
 *  edge; 0 => already inside the range. */
export function weightToHealthyKg(weightKg: number, heightM: number): number {
  const [lo, hi] = healthyWeightRangeKg(heightM);
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return NaN;
  if (weightKg > hi) return weightKg - hi;
  if (weightKg < lo) return weightKg - lo; // negative
  return 0;
}

// ---- BMR / TDEE (energy expenditure) ----------------------------------------------------------

export type Sex = 'male' | 'female';

/** Basal Metabolic Rate via the Mifflin-St Jeor equation (kcal/day):
 *  10·kg + 6.25·cm − 5·age + s, where s = +5 for male, −161 for female. */
export function bmrMifflinStJeor(sex: Sex, weightKg: number, heightCm: number, ageYears: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === 'male' ? base + 5 : base - 161;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

/** Standard TDEE activity multipliers applied to BMR. */
export const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

/** Total Daily Energy Expenditure: BMR scaled by the activity factor (kcal/day). */
export function tdee(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_FACTOR[activity];
}

/** Kilocalories in a kilogram of body weight (energy density used for calorie-goal math). */
export const KCAL_PER_KG = 7700;

/** The daily calorie change for a target weekly weight change (kg/week). A 0.5 kg/week loss is a
 *  deficit of 0.5·7700/7 ≈ 550 kcal/day. Positive kgPerWeek => surplus; negative => deficit. */
export function dailyCalorieDelta(kgPerWeek: number): number {
  return (kgPerWeek * KCAL_PER_KG) / 7;
}
