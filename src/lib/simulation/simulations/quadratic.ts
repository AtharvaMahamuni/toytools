// Quadratic Equation Explorer — the state is the coefficient triple (a, b, c) of
// y = ax² + bx + c. Sliders (or typing in the formula tile) morph the parabola; dragging on the
// canvas moves the vertex (solving b and c from vertex form); a sweep dot animates along the
// curve. There is no graph tile: the canvas IS the graph. tan-style blow-ups are impossible, but
// a = 0 degenerates to a line, so an effective-a guard keeps every measurement finite and an
// observation explains the degenerate case. Pure model + config; canvas work in quadratic.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { drawQuadratic } from './quadratic.draw';

// World window shared by the draw file and the pointer handler (canvas maps to ±VIEW_X, ±VIEW_Y).
export const VIEW_X = 8;
export const VIEW_Y = 10;

/** a clamped away from zero so vertex/root formulas stay finite (0 would make this a line). */
export const A_EPSILON = 0.05;

export function effectiveA(a: number): number {
  if (Math.abs(a) >= A_EPSILON) return a;
  return a < 0 ? -A_EPSILON : A_EPSILON;
}

export function discriminant(s: SimState): number {
  const { a, b, c } = s.params;
  return b * b - 4 * a * c;
}

export function vertexX(s: SimState): number {
  return -s.params.b / (2 * effectiveA(s.params.a));
}

export function vertexY(s: SimState): number {
  const a = effectiveA(s.params.a);
  const { b, c } = s.params;
  const h = -b / (2 * a);
  return a * h * h + b * h + c;
}

/** The real roots in ascending order, or null when the discriminant is negative. */
export function realRoots(s: SimState): [number, number] | null {
  const a = effectiveA(s.params.a);
  const { b, c } = s.params;
  const d = b * b - 4 * a * c;
  if (d < 0) return null;
  const sq = Math.sqrt(d);
  const r1 = (-b - sq) / (2 * a);
  const r2 = (-b + sq) / (2 * a);
  return r1 <= r2 ? [r1, r2] : [r2, r1];
}

export function rootCount(s: SimState): number {
  const d = discriminant(s);
  if (Math.abs(d) < 1e-9) return 1;
  return d > 0 ? 2 : 0;
}

/** y for the CURRENT coefficients at x (used by draw and the sweep dot). */
export function evaluate(s: SimState, x: number): number {
  const { a, b, c } = s.params;
  return a * x * x + b * x + c;
}

const clampParam = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

const quadraticSim: SimulationDef = {
  id: 'quadratic',
  aspect: 16 / 9,
  paramBehavior: 'continuous',
  params: [
    { id: 'a', label: 'Coefficient a', unit: '', min: -5, max: 5, step: 0.1, default: 1, decimals: 1 },
    { id: 'b', label: 'Coefficient b', unit: '', min: -10, max: 10, step: 0.1, default: -2, decimals: 1 },
    { id: 'c', label: 'Coefficient c', unit: '', min: -10, max: 10, step: 0.1, default: -3, decimals: 1 },
  ],
  presets: [
    { id: 'two-roots', label: 'Two roots', values: { a: 1, b: -2, c: -3 } },
    { id: 'perfect-square', label: 'Perfect square', values: { a: 1, b: -4, c: 4 } },
    { id: 'no-real-roots', label: 'No real roots', values: { a: 1, b: 0, c: 4 } },
    { id: 'downward', label: 'Downward', values: { a: -1, b: 2, c: 3 } },
  ],
  init: () => ({ sweep: 0 }),
  step(s: SimState, dt: number): void {
    // The sweep phase drives the animated point travelling along the parabola.
    s.vars.sweep = (s.vars.sweep + dt * 0.6) % (Math.PI * 2);
    s.t += dt;
  },
  measurements: [
    { id: 'discriminant', label: 'Discriminant Δ', unit: '', decimals: 2, compute: discriminant },
    { id: 'rootCount', label: 'Real roots', unit: '', decimals: 0, compute: rootCount },
    { id: 'vertexX', label: 'Vertex x', unit: '', decimals: 2, compute: vertexX },
    { id: 'vertexY', label: 'Vertex y', unit: '', decimals: 2, compute: vertexY },
    { id: 'yIntercept', label: 'y-intercept', unit: '', decimals: 2, compute: (s) => s.params.c },
  ],
  formula: {
    expression: 'Δ = b² - 4ac',
    substitution: '{b}² - 4 × {a} × {c}',
    terms: [
      { symbol: 'Δ', label: 'Discriminant', measurementId: 'discriminant' },
      { symbol: 'a', label: 'Coefficient a', paramId: 'a' },
      { symbol: 'b', label: 'Coefficient b', paramId: 'b' },
      { symbol: 'c', label: 'Coefficient c', paramId: 'c' },
    ],
  },
  observations: [
    (s) => {
      if (Math.abs(s.params.a) >= A_EPSILON) return null;
      return 'With a = 0 the x² term vanishes and the equation stops being quadratic: y = bx + c is a straight line.';
    },
    (s) => {
      const d = discriminant(s);
      const roots = realRoots(s);
      if (Math.abs(d) < 1e-9) return 'Δ = 0: one repeated root. The vertex sits exactly on the x-axis and the parabola only touches it.';
      if (d > 0 && roots) return `Δ > 0: two real roots, at x = ${roots[0].toFixed(2)} and x = ${roots[1].toFixed(2)}, where the parabola crosses the x-axis.`;
      return 'Δ < 0: no real roots. The whole parabola stays on one side of the x-axis, so it never crosses it.';
    },
    (s) =>
      s.params.a < -A_EPSILON
        ? 'a is negative, so the parabola opens downward and the vertex is its highest point (a maximum).'
        : null,
    (s) =>
      Math.abs(s.params.b) < 0.05 && Math.abs(s.params.a) >= A_EPSILON
        ? 'With b = 0 the axis of symmetry is the y-axis itself: the parabola is perfectly centered.'
        : null,
  ],
  pointer: {
    hint: 'Drag to move the vertex',
    handle(s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // Map normalized canvas coords to the world window, then solve b and c from vertex form:
      // y = a(x - h)² + k  =>  b = -2ah,  c = k + ah².
      const h = (ev.x - 0.5) * 2 * VIEW_X;
      const k = (0.5 - ev.y) * 2 * VIEW_Y;
      const a = effectiveA(s.params.a);
      return {
        b: clampParam(-2 * a * h, -10, 10),
        c: clampParam(k + a * h * h, -10, 10),
      };
    },
  },
  explanation(s: SimState) {
    const { a, b, c } = s.params;
    const h = vertexX(s);
    const k = vertexY(s);
    const roots = realRoots(s);
    const rootText = roots
      ? Math.abs(roots[0] - roots[1]) < 1e-6
        ? `one repeated root at x = ${roots[0].toFixed(2)}`
        : `roots at x = ${roots[0].toFixed(2)} and x = ${roots[1].toFixed(2)}`
      : 'no real roots';
    const opens = effectiveA(a) > 0 ? 'upward' : 'downward';
    return `The curve is y = ${a.toFixed(1)}x² ${b < 0 ? '-' : '+'} ${Math.abs(b).toFixed(1)}x ${c < 0 ? '-' : '+'} ${Math.abs(c).toFixed(1)}. It opens ${opens}, its vertex sits at (${h.toFixed(2)}, ${k.toFixed(2)}) on the axis of symmetry x = ${h.toFixed(2)}, and the quadratic formula x = (-b ± √Δ) / 2a gives ${rootText}. Drag the vertex or slide a, b, c and watch the discriminant decide how many times the parabola crosses the x-axis.`;
  },
  draw: drawQuadratic,
};

export default quadraticSim;
