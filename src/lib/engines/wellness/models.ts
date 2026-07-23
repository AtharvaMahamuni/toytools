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
