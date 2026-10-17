// Pure body-measurement formulas shared by the calculators and the craft seam.
//
// caveat.ts imports this file, and the wellness runtime imports caveat.ts on every wellness page.
// These functions stay free of the calculator modules so a new formula does not pull every
// calculator into that shared chunk.

import { KM_PER_MI } from './models';
import { CM_PER_IN } from './unit-switch';

export const WHR_CUTOFF = { male: 0.9, female: 0.85 } as const;
/** A ratio inside this window is a human reading, so a unit mix is not the explanation. */
const WHR_HUMAN_LO = 0.6;
const WHR_HUMAN_HI = 1.2;
/** The other-unit reading has to land here before the note accuses a mix-up. */
const WHR_ALT_LO = 0.65;
const WHR_ALT_HI = 1.15;

export type WhrSex = keyof typeof WHR_CUTOFF;

export function whrRatio(waist: number, hip: number): number {
  return waist / hip;
}

export function whrAtOrAbove(sex: WhrSex, ratio: number): boolean {
  return ratio >= WHR_CUTOFF[sex];
}

interface UnitSide {
  side: 'waist' | 'hip';
  entered: number;
  other: number;
  alt: number;
}

/**
 * One circumference looks like the other unit, and reading it that way puts the ratio back in
 * range. Both circumferences in the wrong unit together stay silent: the ratio is dimensionless.
 */
export function whrMixedUnitNote(unit: string, waist: number, hip: number): string | null {
  if (!(waist > 0) || !(hip > 0)) return null;
  const ratio = waist / hip;
  if (ratio >= WHR_HUMAN_LO && ratio <= WHR_HUMAN_HI) return null;

  const metric = unit !== 'imperial';
  const candidates: UnitSide[] = [];
  if (metric) {
    if (waist < 60) candidates.push({ side: 'waist', entered: waist, other: hip, alt: (waist * CM_PER_IN) / hip });
    if (hip < 60) candidates.push({ side: 'hip', entered: hip, other: waist, alt: waist / (hip * CM_PER_IN) });
  } else {
    if (waist > 50) candidates.push({ side: 'waist', entered: waist, other: hip, alt: (waist / CM_PER_IN) / hip });
    if (hip > 50) candidates.push({ side: 'hip', entered: hip, other: waist, alt: waist / (hip / CM_PER_IN) });
  }
  const hits = candidates.filter((c) => c.alt >= WHR_ALT_LO && c.alt <= WHR_ALT_HI);
  if (hits.length === 0) return null;
  hits.sort((a, b) => Math.abs(a.alt - 0.9) - Math.abs(b.alt - 0.9));
  const hit = hits[0]!;
  const otherLabel = hit.side === 'waist' ? 'hip' : 'waist';
  const fromUnit = metric ? 'centimetres' : 'inches';
  const toUnit = metric ? 'inches' : 'centimetres';
  const shown = (n: number) => String(n);
  return `${hit.side === 'waist' ? 'Waist' : 'Hip'} ${shown(hit.entered)} and ${otherLabel} ${shown(hit.other)} read as ${ratio.toFixed(2)}. If that ${hit.side} is ${toUnit} rather than ${fromUnit}, the ratio is ${hit.alt.toFixed(2)}.`;
}

/** Mosteller 1987. Height in centimetres, weight in kilograms, area in square metres. */
export function mostellerM2(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

/** Du Bois and Du Bois 1916. Same units as Mosteller. */
export function duBoisM2(heightCm: number, weightKg: number): number {
  return 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
}

export const BSA_SPREAD_M2 = 0.05;

export function bsaSpreadNote(heightCm: number, weightKg: number): string | null {
  if (!(heightCm >= 50) || !(weightKg > 0)) return null;
  const spread = Math.abs(mostellerM2(heightCm, weightKg) - duBoisM2(heightCm, weightKg));
  if (spread < BSA_SPREAD_M2) return null;
  return `Mosteller and Du Bois disagree by ${spread.toFixed(2)} m². The hero number is Mosteller, so an unlabeled figure hides which formula was copied.`;
}

/** Cooper 1968. Twelve-minute distance in metres. */
export function cooperVo2(distanceMetres: number): number {
  return (distanceMetres - 504.9) / 44.73;
}

/** Tanaka, Monahan, and Seals 2001. */
export function tanakaMaxHr(age: number): number {
  return 208 - 0.7 * age;
}

/** Uth and others 2004, with Tanaka's maximum in place of a measured one. */
export function uthVo2(age: number, resting: number): number {
  return (15.3 * tanakaMaxHr(age)) / resting;
}

export const COOPER_MIN_KM = 0.8;
export const COOPER_MAX_KM = 6;
export const VO2_DIFF = 5;

export function distanceToKm(unit: string, distance: number): number {
  return unit === 'mi' ? distance * KM_PER_MI : distance;
}

export function vo2DisagreementNote(unit: string, distance: number, age: number, resting: number): string | null {
  const km = distanceToKm(unit, distance);
  if (!(km >= COOPER_MIN_KM && km <= COOPER_MAX_KM)) return null;
  if (!(age >= 10 && age <= 100) || !(resting >= 30 && resting <= 120)) return null;
  const cooper = cooperVo2(km * 1000);
  const pulse = uthVo2(age, resting);
  if (!Number.isFinite(cooper) || !Number.isFinite(pulse)) return null;
  if (Math.abs(cooper - pulse) < VO2_DIFF) return null;
  return `The Cooper test reads ${cooper.toFixed(1)} ml/kg/min and the resting-pulse estimate reads ${pulse.toFixed(1)}. They are different measurements.`;
}
