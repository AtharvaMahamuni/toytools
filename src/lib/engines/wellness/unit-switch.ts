// What the metric / imperial switch does to typed body measurements on the wellness calculators.
//
// The switch changes what the numbers mean (kg or lb, cm or in), so the values convert with it:
// 70 kg becomes 154.3 lb and 175 cm becomes 68.9 in. Relabelling alone would leave 175 in the height
// box as 175 inches, which is out of range, and the page would sit in an error. The widget inlines
// the field map below and repeats the two factors; the tests pin both.

import type { SmartFieldDef } from '@lib/inputs/field';

export type Dimension = 'mass' | 'length';

/** Field ids that hold a mass or a length, by convention across the wellness calculators. */
const BY_ID: Record<string, Dimension> = {
  weight: 'mass',
  goal: 'mass',
  height: 'length',
  neck: 'length',
  waist: 'length',
  hip: 'length',
};

export const LB_PER_KG = 2.2046226218;
export const CM_PER_IN = 2.54;

/** The unit-bearing numeric fields of a calculator with a unit switch, else {}. */
export function unitDimensions(fields: readonly Pick<SmartFieldDef, 'id' | 'type'>[]): Record<string, Dimension> {
  if (!fields.some((f) => f.id === 'unit')) return {};
  const out: Record<string, Dimension> = {};
  for (const f of fields) {
    const dim = BY_ID[f.id];
    if (dim && (f.type === 'number' || f.type === 'slider' || f.type === 'integer')) out[f.id] = dim;
  }
  return out;
}

/** Convert one value between the unit systems, rounded to 1 decimal. */
export function convertMeasurement(value: number, dim: Dimension, from: string, to: string): number {
  if (from === to || !Number.isFinite(value)) return value;
  const toImperial = to === 'imperial';
  const factor = dim === 'mass' ? LB_PER_KG : 1 / CM_PER_IN;
  return Math.round((toImperial ? value * factor : value / factor) * 10) / 10;
}
