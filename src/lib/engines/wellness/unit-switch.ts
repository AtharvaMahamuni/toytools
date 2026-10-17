// What the metric / imperial switch does to typed body measurements on the wellness calculators.
//
// The switch changes what the numbers mean (kg or lb, cm or in), so the values convert with it:
// 70 kg becomes 154.3 lb and 175 cm becomes 68.9 in. Relabelling alone would leave 175 in the height
// box as 175 inches, which is out of range, and the page would sit in an error. The widget inlines
// the field map below and repeats the two factors; the tests pin both.

import type { SmartFieldDef } from '@lib/inputs/field';

export type Dimension = 'mass' | 'length' | 'distance';

/** Field ids that hold a mass, a body length or a running distance, by convention. */
const BY_ID: Record<string, Dimension> = {
  weight: 'mass',
  goal: 'mass',
  height: 'length',
  neck: 'length',
  waist: 'length',
  hip: 'length',
  distance: 'distance',
};

export const LB_PER_KG = 2.2046226218;
export const CM_PER_IN = 2.54;
export const KM_PER_MI = 1.609344;

/** Imperial units per metric unit, for each dimension. */
export const IMPERIAL_PER_METRIC: Record<Dimension, number> = {
  mass: LB_PER_KG,
  length: 1 / CM_PER_IN,
  distance: 1 / KM_PER_MI,
};

/**
 * Unit option values that mean the imperial side. The body calculators say metric / imperial;
 * One-Rep Max says kg / lb and Running Pace km / mi. Anything else is the metric side.
 */
export const IMPERIAL_UNITS: readonly string[] = ['imperial', 'lb', 'mi'];
const KNOWN_UNITS = new Set(['metric', 'imperial', 'kg', 'lb', 'km', 'mi']);

type FieldLike = Pick<SmartFieldDef, 'id' | 'type'> & { options?: readonly { value: string }[] };

/** The unit-bearing numeric fields of a calculator with a known unit switch, else {}. */
export function unitDimensions(fields: readonly FieldLike[]): Record<string, Dimension> {
  const unit = fields.find((f) => f.id === 'unit');
  if (!unit || !(unit.options ?? []).every((o) => KNOWN_UNITS.has(o.value))) return {};
  const out: Record<string, Dimension> = {};
  for (const f of fields) {
    const dim = BY_ID[f.id];
    if (dim && (f.type === 'number' || f.type === 'slider' || f.type === 'integer')) out[f.id] = dim;
  }
  return out;
}

/**
 * Decimals kept after a switch. A running distance keeps 2: at 1 decimal 2.45 km became 1.5 mi
 * (2.41 km) and a Cooper VO2 max moved by 0.8. Body mass and length keep 1.
 */
export const SWITCH_DECIMALS: Record<Dimension, number> = { mass: 1, length: 1, distance: 2 };

/** Convert one value between unit systems (`from` / `to` are unit option values), to SWITCH_DECIMALS. */
export function convertMeasurement(value: number, dim: Dimension, from: string, to: string): number {
  const fromImp = IMPERIAL_UNITS.includes(from);
  const toImp = IMPERIAL_UNITS.includes(to);
  if (fromImp === toImp || !Number.isFinite(value)) return value;
  const f = IMPERIAL_PER_METRIC[dim];
  const scale = 10 ** SWITCH_DECIMALS[dim];
  return Math.round((toImp ? value * f : value / f) * scale) / scale;
}
