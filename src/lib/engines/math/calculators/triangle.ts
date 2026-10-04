// Triangle solver. Any three of the six parts (sides a, b, c and opposite angles A, B, C, in
// degrees) determine the rest, except three angles, which fix the shape and not the size.
// Two sides and a non-included angle (SSA) can fit two triangles. Both are returned.

import type { MathCalculator } from '../types';
import { successResult, card, validationError } from '@lib/results/index';
import type { ResultCard } from '@lib/results/types';
import type { VizSpec } from '@lib/visualization/types';
import { optionalNumberField } from '../validation';
import { assumption, decisions, insight, toolDecision } from '../story';

const EPS = 1e-7;
/** Relative tolerance for "these lengths lie on a line": scale-free, so 0.003-0.004-0.005 and a thin 179.97° triangle both solve. */
const FLAT = 1e-12;
/** A right angle is reported only when the unrounded angle is this close to 90. */
const RIGHT_TOL = 1e-9;

export interface SolvedTriangle {
  a: number;
  b: number;
  c: number;
  A: number;
  B: number;
  C: number;
}

type SideName = 'a' | 'b' | 'c';
type AngleName = 'A' | 'B' | 'C';

const SIDES: SideName[] = ['a', 'b', 'c'];
const ANGLES: AngleName[] = ['A', 'B', 'C'];
const OPPOSITE: Record<SideName, AngleName> = { a: 'A', b: 'B', c: 'C' };
const OPPOSITE_SIDE: Record<AngleName, SideName> = { A: 'a', B: 'b', C: 'c' };

function rad(d: number): number {
  return (d * Math.PI) / 180;
}
function deg(r: number): number {
  return (r * 180) / Math.PI;
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Trim binary noise to significant figures, so a right angle prints as 90, not 89.999999, and a
 * 0.003 side prints as 0.003 instead of 0. Each value is rounded on its own.
 */
export function tidy(n: number, digits = 6): number {
  if (!Number.isFinite(n)) return n;
  const nearest = Math.round(n);
  if (nearest !== 0 && Math.abs(n - nearest) <= 1e-9 * Math.max(1, Math.abs(n))) return nearest;
  return Number(n.toPrecision(digits));
}

/** Angles show five significant figures: 80.406, 19.188, 89.998, 0.004. */
export function tidyAngle(n: number): number {
  return tidy(n, 5);
}

function fmt(n: number): string {
  return String(tidy(n));
}

function fmtAngle(n: number): string {
  return String(tidyAngle(n));
}

function sideByCosine(x: number, y: number, includedDeg: number): number {
  const v = x * x + y * y - 2 * x * y * Math.cos(rad(includedDeg));
  return Math.sqrt(Math.max(0, v));
}

function angleByCosine(adj1: number, adj2: number, opposite: number): number {
  const den = 2 * adj1 * adj2;
  if (den === 0) return NaN;
  const cos = clamp((adj1 * adj1 + adj2 * adj2 - opposite * opposite) / den, -1, 1);
  return deg(Math.acos(cos));
}

function finishFromAngles(angles: Record<AngleName, number>, knownSide: SideName, knownLen: number): SolvedTriangle | string {
  const sum = angles.A + angles.B + angles.C;
  if (Math.abs(sum - 180) > 1e-4) return 'The three angles do not add up to 180 degrees.';
  const opp = angles[OPPOSITE[knownSide]];
  if (opp <= EPS) return 'That angle is too small to scale the triangle.';
  const scale = knownLen / Math.sin(rad(opp));
  const sides = { a: 0, b: 0, c: 0 };
  for (const s of SIDES) sides[s] = scale * Math.sin(rad(angles[OPPOSITE[s]]));
  return { ...sides, A: angles.A, B: angles.B, C: angles.C };
}

function isFlat(a: number, b: number, c: number): boolean {
  const tol = FLAT * Math.max(a, b, c);
  return a + b <= c + tol || a + c <= b + tol || b + c <= a + tol;
}

function solveSSS(a: number, b: number, c: number): SolvedTriangle | string {
  if (isFlat(a, b, c)) {
    return 'Those three lengths cannot form a triangle. Each side has to be shorter than the other two added together.';
  }
  const A = angleByCosine(b, c, a);
  const B = angleByCosine(a, c, b);
  const C = 180 - A - B;
  return { a, b, c, A, B, C };
}

/** Round each angle on its own, so an isosceles triangle shows equal base angles. */
function present(t: SolvedTriangle): SolvedTriangle {
  return { ...t, A: tidyAngle(t.A), B: tidyAngle(t.B), C: tidyAngle(t.C) };
}

/** Angle X, opposite side x, other side y. Returns one or two triangles in the a/b/c frame. */
function solveSSA(
  angleName: AngleName,
  angle: number,
  opposite: number,
  otherName: SideName,
  other: number,
): SolvedTriangle[] | string {
  if (angle <= 0 || angle >= 180) return 'An angle in a triangle sits between 0 and 180 degrees.';
  const ratio = (other * Math.sin(rad(angle))) / opposite;
  if (ratio > 1 + 1e-8) {
    return 'No triangle: the side opposite the given angle is too short to reach the other side.';
  }
  const acute = deg(Math.asin(clamp(ratio, -1, 1)));
  const candidates = ratio >= 1 - 1e-8 ? [90] : [acute];
  const sideTol = EPS * Math.max(opposite, other);
  if (angle < 90 - 1e-8 && opposite < other - sideTol && ratio < 1 - 1e-8) candidates.push(180 - acute);
  if (angle >= 90 - 1e-8 && opposite <= other + sideTol) {
    return 'No triangle: an obtuse or right angle needs the opposite side to be the longest side.';
  }

  const out: SolvedTriangle[] = [];
  for (const otherAngle of candidates) {
    const third = 180 - angle - otherAngle;
    if (third <= EPS) continue;
    const angles: Record<AngleName, number> = { A: 0, B: 0, C: 0 };
    angles[angleName] = angle;
    angles[OPPOSITE[otherName]] = otherAngle;
    const thirdName = ANGLES.find((n) => n !== angleName && n !== OPPOSITE[otherName])!;
    angles[thirdName] = third;
    const solved = finishFromAngles(angles, OPPOSITE_SIDE[angleName], opposite);
    if (typeof solved !== 'string') out.push(solved);
  }
  if (out.length === 0) return 'No triangle exists for those two sides and that angle.';
  return out;
}

export function solveTriangle(parts: Record<SideName | AngleName, number | null>): { solutions: SolvedTriangle[]; kind: string } | { error: string } {
  for (const s of SIDES) {
    const v = parts[s];
    if (v != null && v <= 0) return { error: `Side ${s} has to be greater than 0.` };
  }
  for (const a of ANGLES) {
    const v = parts[a];
    if (v != null && (v <= 0 || v >= 180)) return { error: `Angle ${a} has to be between 0 and 180 degrees.` };
  }

  const knownSides = SIDES.filter((s) => parts[s] != null);
  const knownAngles = ANGLES.filter((a) => parts[a] != null);
  const n = knownSides.length + knownAngles.length;
  if (n < 3) return { error: 'Enter any three parts. Leave the other three blank.' };
  if (n > 3) return { error: 'Enter exactly three parts. A fourth value over-determines the triangle, and these boxes cannot tell which three you meant.' };
  if (knownAngles.length === 3) {
    return { error: 'Three angles fix the shape, not the size. Add a side, or clear one angle.' };
  }
  if (knownAngles.length === 2 && knownAngles.reduce((sum, name) => sum + (parts[name] as number), 0) >= 180 - EPS) {
    return { error: 'Those two angles already add up to 180 degrees or more, so the third angle has no room.' };
  }

  if (knownSides.length === 3) {
    const solved = solveSSS(parts.a as number, parts.b as number, parts.c as number);
    if (typeof solved === 'string') return { error: solved };
    return { solutions: [solved], kind: 'SSS' };
  }

  if (knownSides.length === 2 && knownAngles.length === 1) {
    const angleName = knownAngles[0];
    const opposite = OPPOSITE_SIDE[angleName];
    if (parts[opposite] == null) {
      const included = parts[angleName] as number;
      let a = 0;
      let b = 0;
      let c = 0;
      if (angleName === 'C') {
        a = parts.a as number;
        b = parts.b as number;
        c = sideByCosine(a, b, included);
      } else if (angleName === 'A') {
        b = parts.b as number;
        c = parts.c as number;
        a = sideByCosine(b, c, included);
      } else {
        a = parts.a as number;
        c = parts.c as number;
        b = sideByCosine(a, c, included);
      }
      if (isFlat(a, b, c)) {
        return { error: 'Those two sides and the angle between them lie too close to a straight line to draw a triangle.' };
      }
      const solved = solveSSS(a, b, c);
      if (typeof solved === 'string') return { error: solved };
      return { solutions: [solved], kind: 'SAS' };
    }
    const other = knownSides.find((s) => s !== opposite)!;
    const solved = solveSSA(angleName, parts[angleName] as number, parts[opposite] as number, other, parts[other] as number);
    if (typeof solved === 'string') return { error: solved };
    return { solutions: solved, kind: 'SSA' };
  }

  if (knownAngles.length === 2 && knownSides.length === 1) {
    const angles: Record<AngleName, number> = { A: 0, B: 0, C: 0 };
    for (const name of knownAngles) angles[name] = parts[name] as number;
    const missing = ANGLES.find((name) => parts[name] == null)!;
    angles[missing] = 180 - knownAngles.reduce((sum, name) => sum + (parts[name] as number), 0);
    const side = knownSides[0];
    const solved = finishFromAngles(angles, side, parts[side] as number);
    if (typeof solved === 'string') return { error: solved };
    const included = OPPOSITE[side] === missing;
    return { solutions: [solved], kind: included ? 'ASA' : 'AAS' };
  }

  return { error: 'Those three parts do not determine a triangle.' };
}

function place(t: SolvedTriangle): { x: number; y: number; label: string }[] {
  const A = rad(t.A);
  return [
    { x: 0, y: 0, label: `A ${fmtAngle(t.A)}°` },
    { x: t.c, y: 0, label: `B ${fmtAngle(t.B)}°` },
    { x: t.b * Math.cos(A), y: t.b * Math.sin(A), label: `C ${fmtAngle(t.C)}°` },
  ];
}

function figure(solutions: SolvedTriangle[], kind: string): VizSpec {
  return {
    kind: 'polygon',
    title: kind === 'SSA' && solutions.length === 2 ? 'Both triangles that fit' : 'Triangle drawn to scale',
    description: 'Equal scale on both axes, so a right angle looks like a right angle.',
    data: {
      series: solutions.slice(0, 2).map((t, i) => ({
        id: i === 0 ? 'primary' : 'alternate',
        label: i === 0 ? 'Triangle' : 'Second triangle',
        points: place(t),
      })),
    },
  };
}

function partCards(t: SolvedTriangle): ResultCard[] {
  return [
    card('side-a', 'Side a', fmt(t.a), { raw: tidy(t.a), emphasis: 'primary' }),
    card('side-b', 'Side b', fmt(t.b), { raw: tidy(t.b) }),
    card('side-c', 'Side c', fmt(t.c), { raw: tidy(t.c) }),
    card('angle-a', 'Angle A', `${fmtAngle(t.A)}°`, { raw: tidyAngle(t.A) }),
    card('angle-b', 'Angle B', `${fmtAngle(t.B)}°`, { raw: tidyAngle(t.B) }),
    card('angle-c', 'Angle C', `${fmtAngle(t.C)}°`, { raw: tidyAngle(t.C) }),
  ];
}

export const triangleCalculator: MathCalculator = {
  id: 'triangle',
  family: 'triangles',
  capabilities: { loadExample: true, visualization: true },
  fields: [
    { id: 'a', label: 'Side a', type: 'number', default: 3, min: 0, step: 0.01, optional: true, help: 'Opposite angle A. Fill any three boxes and leave the rest blank.' },
    { id: 'b', label: 'Side b', type: 'number', default: 4, min: 0, step: 0.01, optional: true },
    { id: 'c', label: 'Side c', type: 'number', default: 5, min: 0, step: 0.01, optional: true },
    { id: 'A', label: 'Angle A (degrees)', type: 'number', default: '', min: 0, max: 180, step: 0.1, optional: true },
    { id: 'B', label: 'Angle B (degrees)', type: 'number', default: '', min: 0, max: 180, step: 0.1, optional: true },
    { id: 'C', label: 'Angle C (degrees)', type: 'number', default: '', min: 0, max: 180, step: 0.1, optional: true },
  ],

  calculate(input) {
    const parsed: Record<SideName | AngleName, number | null> = { a: null, b: null, c: null, A: null, B: null, C: null };
    for (const key of [...SIDES, ...ANGLES] as (SideName | AngleName)[]) {
      const field = optionalNumberField(input, key, key.length === 1 && key === key.toLowerCase() ? `side ${key}` : `angle ${key}`);
      if (!field.ok) return field.result;
      parsed[key] = field.value;
    }

    const solved = solveTriangle(parsed);
    if ('error' in solved) return validationError(solved.error);

    const solutions = solved.solutions.map(present);
    const primary = solutions[0];
    const ambiguous = solutions.length === 2;
    const exact = solved.solutions[0];
    const right = [exact.A, exact.B, exact.C].some((d) => Math.abs(d - 90) <= RIGHT_TOL);
    const hero = card('solutions', ambiguous ? 'Two triangles' : right ? 'Right triangle' : `${solved.kind} triangle`, ambiguous ? '2' : '1', {
      raw: solutions.length,
      emphasis: 'hero',
      note: ambiguous
        ? 'SSA fits two shapes. The dashed figure is the second one.'
        : `Angle A ${fmtAngle(primary.A)}°, B ${fmtAngle(primary.B)}°, C ${fmtAngle(primary.C)}°.`,
    });

    const insights = [
      insight(`${solved.kind}: side a ${fmt(primary.a)}, b ${fmt(primary.b)}, c ${fmt(primary.c)}.`),
    ];
    if (ambiguous) {
      const alt = solutions[1];
      insights.push(
        insight(
          `The same two sides and non-included angle also fit a second triangle: A ${fmtAngle(alt.A)}°, B ${fmtAngle(alt.B)}°, C ${fmtAngle(alt.C)}°, sides ${fmt(alt.a)}, ${fmt(alt.b)}, ${fmt(alt.c)}. A solver that prints only the first set hides this one.`,
          'caution',
        ),
      );
    }

    return successResult({
      hero,
      metrics: partCards(primary),
      insights,
      visualization: figure(solutions, solved.kind),
      assumptions: [
        assumption('Angle unit', 'degrees'),
        assumption('Side names', 'a opposite A, b opposite B, c opposite C'),
        assumption('Rounding', 'Each angle is rounded on its own, so the three shown can add to 179.99 or 180.01.'),
      ],
      decisions: decisions([toolDecision('Plot the angles on a unit circle', 'unit-circle-calculator')]),
    });
  },
};
