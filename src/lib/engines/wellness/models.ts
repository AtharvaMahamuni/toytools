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

// ---- Body fat (US Navy circumference method) --------------------------------------------------

/** Body fat percentage via the U.S. Navy tape-measure method (all lengths in cm, base-10 logs).
 *  Men use waist − neck; women use waist + hip − neck. Returns NaN when the log argument is
 *  non-positive (e.g. neck ≥ waist), which the calculator turns into a validation message. */
export function bodyFatNavy(
  sex: Sex,
  heightCm: number,
  neckCm: number,
  waistCm: number,
  hipCm = 0,
): number {
  if (sex === 'male') {
    const inner = waistCm - neckCm;
    if (inner <= 0 || heightCm <= 0) return NaN;
    return 495 / (1.0324 - 0.19077 * Math.log10(inner) + 0.15456 * Math.log10(heightCm)) - 450;
  }
  const inner = waistCm + hipCm - neckCm;
  if (inner <= 0 || heightCm <= 0) return NaN;
  return 495 / (1.29579 - 0.35004 * Math.log10(inner) + 0.22100 * Math.log10(heightCm)) - 450;
}

export type BodyFatCategory = 'essential' | 'athletes' | 'fitness' | 'average' | 'obese';

/**
 * American Council on Exercise body-fat boundaries, which differ by sex. `floor` is where the
 * essential-fat band starts (the physiological minimum) and `ceiling` is where the drawn scale
 * stops; both exist so the category logic and the band chart share one set of numbers.
 */
export const BODY_FAT_THRESHOLDS: Record<Sex, {
  floor: number;
  athletes: number;
  fitness: number;
  average: number;
  obese: number;
  ceiling: number;
}> = {
  male: { floor: 2, athletes: 6, fitness: 14, average: 18, obese: 25, ceiling: 40 },
  female: { floor: 10, athletes: 14, fitness: 21, average: 25, obese: 32, ceiling: 45 },
};

/** American Council on Exercise body-fat category, which differs by sex. */
export function bodyFatCategory(sex: Sex, bodyFatPct: number): BodyFatCategory {
  const t = BODY_FAT_THRESHOLDS[sex];
  if (bodyFatPct < t.athletes) return 'essential';
  if (bodyFatPct < t.fitness) return 'athletes';
  if (bodyFatPct < t.average) return 'fitness';
  if (bodyFatPct < t.obese) return 'average';
  return 'obese';
}

/** Human label for a body-fat category. */
export const BODY_FAT_CATEGORY_LABEL: Record<BodyFatCategory, string> = {
  essential: 'Essential fat',
  athletes: 'Athletes',
  fitness: 'Fitness',
  average: 'Average',
  obese: 'Above average',
};

// ---- Macros (calorie split) -------------------------------------------------------------------

/** Kilocalories per gram of each macronutrient. Protein and carbs give 4, fat gives 9. */
export const KCAL_PER_G = { protein: 4, carb: 4, fat: 9 } as const;

/** A macro split as whole-percentages of calories (carb/protein/fat), expected to sum to ~100. */
export interface MacroSplit {
  carb: number;
  protein: number;
  fat: number;
}

export interface MacroGrams {
  protein: number;
  carb: number;
  fat: number;
}

/** Grams of each macronutrient for a calorie target under a percentage split. */
export function macroGrams(calories: number, split: MacroSplit): MacroGrams {
  return {
    protein: (calories * split.protein) / 100 / KCAL_PER_G.protein,
    carb: (calories * split.carb) / 100 / KCAL_PER_G.carb,
    fat: (calories * split.fat) / 100 / KCAL_PER_G.fat,
  };
}

// ---- Ideal weight (classic clinical formulas) -------------------------------------------------

/** A linear ideal-body-weight formula: base weight (kg) at 5 ft plus a per-inch increment above it.
 *  Both the base and the per-inch term are sex-specific (Devine happens to share a per-inch value).
 *  All the classic formulas share this shape and differ only in the numbers. */
export interface IdealWeightCoeffs {
  base: number;
  perInch: number;
}
export interface IdealWeightFormula {
  male: IdealWeightCoeffs;
  female: IdealWeightCoeffs;
}

export const IDEAL_WEIGHT_FORMULAS: Record<'devine' | 'robinson' | 'miller' | 'hamwi', IdealWeightFormula> = {
  devine: { male: { base: 50, perInch: 2.3 }, female: { base: 45.5, perInch: 2.3 } },
  robinson: { male: { base: 52, perInch: 1.9 }, female: { base: 49, perInch: 1.7 } },
  miller: { male: { base: 56.2, perInch: 1.41 }, female: { base: 53.1, perInch: 1.36 } },
  hamwi: { male: { base: 48, perInch: 2.7 }, female: { base: 45.5, perInch: 2.2 } },
};

/** Ideal body weight (kg) for a height, by one of the classic formulas. Heights below 5 ft
 *  extrapolate linearly (the per-inch term goes negative), matching common calculator behaviour. */
export function idealWeight(sex: Sex, heightCm: number, formula: IdealWeightFormula): number {
  const inchesOver60 = heightCm / 2.54 - 60;
  const c = formula[sex];
  return c.base + c.perInch * inchesOver60;
}

// ---- Heart rate (max HR + training zones) -----------------------------------------------------

export type MaxHrMethod = 'simple' | 'tanaka';

/** Estimated maximum heart rate (bpm). 'simple' is the familiar 220 − age; 'tanaka' is the more
 *  accurate 208 − 0.7·age, which reads higher for older adults and lower for the young. */
export function maxHeartRate(age: number, method: MaxHrMethod): number {
  return method === 'tanaka' ? 208 - 0.7 * age : 220 - age;
}

/** The heart rate (bpm) at a fraction of intensity. When a resting HR is given, the Karvonen
 *  heart-rate-reserve method is used (reserve·pct + rest); otherwise it is a plain percent of max. */
export function heartRateAt(maxHr: number, restHr: number, pct: number): number {
  if (restHr > 0) return (maxHr - restHr) * pct + restHr;
  return maxHr * pct;
}

// ---- Protein intake ---------------------------------------------------------------------------

export type ProteinGoal = 'sedentary' | 'active' | 'endurance' | 'strength' | 'fat-loss';

/** Grams of protein per kilogram of body weight per day, as a low-to-high range. The bands follow
 *  the position stands of the ISSN and the ACSM/AND/DC joint statement, which give ranges rather
 *  than single numbers because individual needs vary with training load and calorie intake. */
export const PROTEIN_G_PER_KG: Record<ProteinGoal, [number, number]> = {
  sedentary: [0.8, 1.0],
  active: [1.2, 1.6],
  endurance: [1.2, 1.6],
  strength: [1.6, 2.2],
  'fat-loss': [1.8, 2.4],
};

export const PROTEIN_GOAL_LABEL: Record<ProteinGoal, string> = {
  sedentary: 'Mostly sedentary',
  active: 'Generally active',
  endurance: 'Endurance training',
  strength: 'Strength training',
  'fat-loss': 'Losing fat',
};

/** Daily protein range (grams) for a body weight and goal. */
export function proteinRangeG(weightKg: number, goal: ProteinGoal): [number, number] {
  const [lo, hi] = PROTEIN_G_PER_KG[goal];
  return [weightKg * lo, weightKg * hi];
}

// ---- One rep max ------------------------------------------------------------------------------

export type OneRepMaxFormula = 'epley' | 'brzycki' | 'lombardi' | 'oconner';

/** Estimated one-rep max (same unit as `weight`) from a set taken close to failure. The four
 *  formulas are all curve fits to the same reps-versus-load relationship, which is why they agree
 *  closely at low reps and drift apart above about ten. */
export function oneRepMax(weight: number, reps: number, formula: OneRepMaxFormula): number {
  if (reps <= 1) return weight;
  switch (formula) {
    case 'epley':
      return weight * (1 + reps / 30);
    case 'brzycki':
      // Undefined at 37 reps, where the denominator hits zero; clamp well before that.
      return reps >= 36 ? NaN : weight * (36 / (37 - reps));
    case 'lombardi':
      return weight * Math.pow(reps, 0.1);
    case 'oconner':
      return weight * (1 + reps / 40);
  }
}

export const ONE_REP_MAX_FORMULA_LABEL: Record<OneRepMaxFormula, string> = {
  epley: 'Epley',
  brzycki: 'Brzycki',
  lombardi: 'Lombardi',
  oconner: "O'Conner",
};

/** The percentages of a one-rep max a training program is normally written against, with the reps
 *  most lifters can hold at each. These are the inverse of the Epley curve, rounded to the whole
 *  reps a program would actually prescribe. */
export const ONE_REP_MAX_TABLE: { pct: number; reps: number }[] = [
  { pct: 100, reps: 1 },
  { pct: 95, reps: 2 },
  { pct: 90, reps: 4 },
  { pct: 85, reps: 6 },
  { pct: 80, reps: 8 },
  { pct: 75, reps: 10 },
  { pct: 70, reps: 12 },
  { pct: 65, reps: 15 },
];

// ---- Running pace -----------------------------------------------------------------------------

export const KM_PER_MI = 1.609344;

export function miToKm(mi: number): number {
  return mi * KM_PER_MI;
}

export function kmToMi(km: number): number {
  return km / KM_PER_MI;
}

/** Seconds per kilometre for a distance covered in a total time. */
export function paceSecPerKm(distanceKm: number, totalSeconds: number): number {
  return totalSeconds / distanceKm;
}

/** A pace in seconds rendered as the m:ss every runner reads it as. */
export function formatPace(secondsPerUnit: number): string {
  const total = Math.round(secondsPerUnit);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** A duration in seconds rendered as h:mm:ss, dropping the hour when there is none. */
export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  return h > 0 ? `${h}:${mm}:${String(s).padStart(2, '0')}` : `${mm}:${String(s).padStart(2, '0')}`;
}

/** Riegel's endurance model: t2 = t1 · (d2 / d1)^1.06. The exponent above 1 is what encodes the
 *  fact that pace slows as distance grows, so it predicts a slower pace over longer races. */
export const RIEGEL_EXPONENT = 1.06;

export function riegelPredict(knownSeconds: number, knownKm: number, targetKm: number): number {
  return knownSeconds * Math.pow(targetKm / knownKm, RIEGEL_EXPONENT);
}

/** The race distances a pace calculator predicts against, in kilometres. */
export const RACE_DISTANCES: { id: string; label: string; km: number }[] = [
  { id: '5k', label: '5K', km: 5 },
  { id: '10k', label: '10K', km: 10 },
  { id: 'half', label: 'Half marathon', km: 21.0975 },
  { id: 'full', label: 'Marathon', km: 42.195 },
];
