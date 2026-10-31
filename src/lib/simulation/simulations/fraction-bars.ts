// Fraction bars. Two fractions share one whole, so 2/4 and 1/2 shade the same length,
// and 1/2 + 1/3 lands on 5/6 rather than on 2/5. Dragging snaps to equal parts.

import type { SimState, SimulationDef } from '../types';
import { addFractions, simplify, subFractions, type Fraction } from '../../engines/math/models';
import { drawFractionBars } from './fraction-bars.draw';

export const DEN_MIN = 1;
export const DEN_MAX = 12;
export const TWEEN_S = 1 / 3;
/** One whole, in normalized canvas x. The second whole sits to its right. */
export const TRACK_X0 = 0.08;
export const TRACK_X1 = 0.46;
export const TRACK2_X0 = 0.54;
export const TRACK2_X1 = 0.92;

export type BarMode = 'show' | 'compare' | 'add' | 'subtract';

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function modeOf(value: number): BarMode {
  const i = Math.round(value);
  if (i <= 0) return 'show';
  if (i === 1) return 'compare';
  if (i === 2) return 'add';
  return 'subtract';
}

export function circleView(value: number): boolean {
  return value >= 0.5;
}

export function clampedParts(num: number, den: number): { n: number; d: number } {
  const d = Math.min(DEN_MAX, Math.max(DEN_MIN, Math.round(den)));
  const n = Math.min(d * 2, Math.max(0, Math.round(num)));
  return { n, d };
}

export function fmtParts(n: number, d: number): string {
  return `${n}/${d}`;
}

/** A simplified fraction. A denominator of 1 prints as the whole number: 3/1 is 3. */
export function fmtFraction(f: Fraction): string {
  if (f.d === 1n) return f.n.toString();
  return `${f.n.toString()}/${f.d.toString()}`;
}

export function lengthOf(n: number, d: number): number {
  return d === 0 ? 0 : n / d;
}

/**
 * Last animation step's wall clock. Kept off `vars` so two identical states
 * step to identical vars. Draw snaps to the target when this stamp is stale,
 * which is what a paused reduced-motion frame needs: the loop never calls step.
 */
let frameWall = 0;

/**
 * How many whole bars a length needs. 5/4 uses two, 3/2 + 3/2 uses three. A full whole stays one.
 * Each input is at most 2 (numerators cap at twice the denominator), so a sum needs at most 4.
 */
export function wholesUsed(length: number): number {
  if (length <= 1) return 1;
  return Math.ceil(length - 1e-9);
}

/** Left and right x of each whole in a row. Two or fewer wholes use the draggable tracks. */
export function wholeSlots(count: number): Array<{ x0: number; x1: number }> {
  if (count <= 1) return [{ x0: TRACK_X0, x1: TRACK_X1 }];
  if (count === 2) return [{ x0: TRACK_X0, x1: TRACK_X1 }, { x0: TRACK2_X0, x1: TRACK2_X1 }];
  const gap = 0.02;
  const w = (TRACK2_X1 - TRACK_X0 - gap * (count - 1)) / count;
  return Array.from({ length: count }, (_, i) => {
    const x0 = TRACK_X0 + i * (w + gap);
    return { x0, x1: x0 + w };
  });
}

/** Shaded share of whole i (0-based) for a length. */
export function fillOfWhole(length: number, i: number): number {
  return Math.min(1, Math.max(0, length - i));
}

export function partsOf(params: Record<string, number>, which: 'A' | 'B'): { n: number; d: number } {
  return which === 'A'
    ? clampedParts(params.numA, params.denA)
    : clampedParts(params.numB, params.denB);
}

export function sumOf(a: { n: number; d: number }, b: { n: number; d: number }): Fraction {
  return simplify(addFractions({ n: BigInt(a.n), d: BigInt(a.d) }, { n: BigInt(b.n), d: BigInt(b.d) }));
}

export function diffOf(a: { n: number; d: number }, b: { n: number; d: number }): { fraction: Fraction; blocked: boolean } {
  const f = simplify(subFractions({ n: BigInt(a.n), d: BigInt(a.d) }, { n: BigInt(b.n), d: BigInt(b.d) }));
  if (f.n < 0n) return { fraction: { n: 0n, d: 1n }, blocked: true };
  return { fraction: f, blocked: false };
}

/** Snap a pointer x to an equal part. The left track is the first whole, the right track the second. */
export function numeratorFromTrack(x: number, den: number): number {
  const d = clampedParts(0, den).d;
  const onSecond = x >= (TRACK_X1 + TRACK2_X0) / 2;
  const x0 = onSecond ? TRACK2_X0 : TRACK_X0;
  const x1 = onSecond ? TRACK2_X1 : TRACK_X1;
  const t = Math.min(1, Math.max(0, (x - x0) / (x1 - x0)));
  const part = Math.min(d, Math.max(0, Math.round(t * d)));
  return onSecond ? d + part : part;
}

export function caption(s: SimState): string {
  const a = partsOf(s.params, 'A');
  const b = partsOf(s.params, 'B');
  const mode = modeOf(s.params.mode);
  const left = fmtParts(a.n, a.d);
  const right = fmtParts(b.n, b.d);
  if (mode === 'show') {
    return a.n > a.d
      ? `${left} fills one whole and part of the next.`
      : `${left} of one whole.`;
  }
  if (mode === 'compare') {
    const same = lengthOf(a.n, a.d) === lengthOf(b.n, b.d);
    return same
      ? `${left} and ${right} shade the same length.`
      : `${left} and ${right} share one whole.`;
  }
  if (mode === 'add') {
    return `${left} + ${right} = ${fmtFraction(sumOf(a, b))}. The shaded length matches.`;
  }
  const diff = diffOf(a, b);
  if (diff.blocked) return `${left} minus ${right} stays at zero. The picture does not shade a negative length.`;
  return `${left} - ${right} = ${fmtFraction(diff.fraction)}. The shaded length matches.`;
}

function targetLength(s: SimState, which: 'A' | 'B'): number {
  const p = partsOf(s.params, which);
  return lengthOf(p.n, p.d);
}

export function shownLength(s: SimState, which: 'A' | 'B'): number {
  const target = targetLength(s, which);
  if (prefersReducedMotion()) return target;
  const now = typeof performance !== 'undefined' ? performance.now() : 0;
  if (!frameWall || now - frameWall > 100) return target;
  return which === 'A' ? s.vars.shownA : s.vars.shownB;
}

function ease(s: SimState, which: 'A' | 'B', target: number, dt: number): void {
  const shownKey = which === 'A' ? 'shownA' : 'shownB';
  const toKey = which === 'A' ? 'tweenToA' : 'tweenToB';
  const fromKey = which === 'A' ? 'tweenFromA' : 'tweenFromB';
  const startKey = which === 'A' ? 'tweenStartA' : 'tweenStartB';
  if (prefersReducedMotion()) {
    s.vars[shownKey] = target;
    s.vars[toKey] = target;
    s.vars[fromKey] = target;
    return;
  }
  if (s.vars[toKey] !== target) {
    s.vars[fromKey] = s.vars[shownKey];
    s.vars[toKey] = target;
    s.vars[startKey] = s.t - dt;
  }
  const u = Math.min(1, Math.max(0, (s.t - s.vars[startKey]) / TWEEN_S));
  s.vars[shownKey] = s.vars[fromKey] + (target - s.vars[fromKey]) * u;
}

const fractionBarsSim: SimulationDef = {
  id: 'fraction-bars',
  aspect: 3 / 2,
  paramBehavior: 'continuous',
  params: [
    { id: 'mode', label: 'Mode', unit: '', min: 0, max: 3, step: 1, default: 2, decimals: 0 },
    { id: 'view', label: 'Circles', unit: '', min: 0, max: 1, step: 1, default: 0, decimals: 0 },
    { id: 'numA', label: 'First numerator', unit: '', min: 0, max: 24, step: 1, default: 1, decimals: 0 },
    { id: 'denA', label: 'First denominator', unit: '', min: 1, max: 12, step: 1, default: 2, decimals: 0 },
    { id: 'numB', label: 'Second numerator', unit: '', min: 0, max: 24, step: 1, default: 1, decimals: 0 },
    { id: 'denB', label: 'Second denominator', unit: '', min: 1, max: 12, step: 1, default: 3, decimals: 0 },
  ],
  presets: [
    { id: 'half', label: 'One half', values: { mode: 0, view: 0, numA: 1, denA: 2, numB: 1, denB: 2 } },
    { id: 'quarters', label: 'Two quarters', values: { mode: 1, view: 0, numA: 2, denA: 4, numB: 1, denB: 2 } },
    { id: 'sum', label: 'Half plus a third', values: { mode: 2, view: 0, numA: 1, denA: 2, numB: 1, denB: 3 } },
    { id: 'improper', label: 'Five quarters', values: { mode: 0, view: 0, numA: 5, denA: 4, numB: 1, denB: 4 } },
  ],
  init(params) {
    const a = lengthOf(clampedParts(params.numA, params.denA).n, clampedParts(params.numA, params.denA).d);
    const b = lengthOf(clampedParts(params.numB, params.denB).n, clampedParts(params.numB, params.denB).d);
    return {
      shownA: a,
      shownB: b,
      tweenFromA: a,
      tweenToA: a,
      tweenStartA: 0,
      tweenFromB: b,
      tweenToB: b,
      tweenStartB: 0,
      holding: 0,
    };
  },
  step(s, dt) {
    s.t += dt;
    frameWall = typeof performance !== 'undefined' ? performance.now() : 0;
    if (s.vars.holding === 1) return;
    ease(s, 'A', targetLength(s, 'A'), dt);
    ease(s, 'B', targetLength(s, 'B'), dt);
  },
  measurements: [
    {
      id: 'lengthA',
      label: 'First length',
      unit: 'wholes',
      decimals: 3,
      compute: (s) => targetLength(s, 'A'),
    },
    {
      id: 'lengthB',
      label: 'Second length',
      unit: 'wholes',
      decimals: 3,
      compute: (s) => targetLength(s, 'B'),
    },
    {
      id: 'lengthResult',
      label: 'Result length',
      unit: 'wholes',
      decimals: 3,
      compute: (s) => {
        const a = partsOf(s.params, 'A');
        const b = partsOf(s.params, 'B');
        const mode = modeOf(s.params.mode);
        if (mode === 'add') return lengthOf(Number(sumOf(a, b).n), Number(sumOf(a, b).d));
        if (mode === 'subtract') {
          const diff = diffOf(a, b);
          return lengthOf(Number(diff.fraction.n), Number(diff.fraction.d));
        }
        return targetLength(s, 'A');
      },
    },
  ],
  formula: {
    expression: 'length = n / d',
    terms: [
      { symbol: 'n', label: 'First numerator', unit: '', paramId: 'numA' },
      { symbol: 'd', label: 'First denominator', unit: '', paramId: 'denA' },
    ],
  },
  pointer: {
    hint: 'Drag the shaded edge',
    handle(s, ev) {
      if (ev.type === 'up' || ev.type === 'tap') {
        s.vars.holding = 0;
        return null;
      }
      const mode = modeOf(s.params.mode);
      const which: 'A' | 'B' = mode !== 'show' && ev.y >= 0.42 ? 'B' : 'A';
      const den = which === 'A' ? s.params.denA : s.params.denB;
      const num = numeratorFromTrack(ev.x, den);
      s.vars.holding = 1;
      if (which === 'A') s.vars.shownA = lengthOf(clampedParts(num, den).n, clampedParts(num, den).d);
      else s.vars.shownB = lengthOf(clampedParts(num, den).n, clampedParts(num, den).d);
      return which === 'A' ? { numA: num } : { numB: num };
    },
    isHolding: (s) => s.vars.holding === 1,
  },
  observations: [
    (s) => caption(s),
    (s) => (circleView(s.params.view) ? 'Circle view splits the same whole into equal slices.' : null),
    (s) => {
      const a = partsOf(s.params, 'A');
      return a.n === 0 ? 'Nothing is shaded yet. Drag the edge onto a part.' : null;
    },
  ],
  explanation(s) {
    const a = partsOf(s.params, 'A');
    const b = partsOf(s.params, 'B');
    const mode = modeOf(s.params.mode);
    const shared = 'Both bars are the same width, so equal values take equal length. 2/4 is not drawn shorter than 1/2, and 1/2 + 1/3 is not drawn as 2/5.';
    if (mode === 'add') return `${caption(s)} ${shared}`;
    if (mode === 'compare') return `${fmtParts(a.n, a.d)} beside ${fmtParts(b.n, b.d)}. ${shared}`;
    if (mode === 'subtract') return `${caption(s)} ${shared}`;
    return `${fmtParts(a.n, a.d)} on one whole. ${shared}`;
  },
  draw: drawFractionBars,
};

export default fractionBarsSim;
