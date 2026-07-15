// Numeric assertions for the Quadratic Equation Explorer model. Contract/narrative sweeps cover
// totality; this file pins the algebra: discriminant, vertex, roots, the a = 0 guard, and the
// vertex-drag pointer mapping.

import { describe, expect, it } from 'vitest';
import type { SimState } from '../types';
import quadratic, {
  A_EPSILON,
  discriminant,
  effectiveA,
  evaluate,
  realRoots,
  rootCount,
  vertexX,
  vertexY,
  VIEW_X,
  VIEW_Y,
} from './quadratic';

function stateFor(a: number, b: number, c: number): SimState {
  const params = { a, b, c };
  return { t: 0, params, vars: quadratic.init(params) };
}

describe('quadratic model', () => {
  it('computes discriminant, roots, and vertex for the default (x² - 2x - 3)', () => {
    const s = stateFor(1, -2, -3);
    expect(discriminant(s)).toBeCloseTo(16, 12);
    expect(realRoots(s)).toEqual([-1, 3]);
    expect(rootCount(s)).toBe(2);
    expect(vertexX(s)).toBeCloseTo(1, 12);
    expect(vertexY(s)).toBeCloseTo(-4, 12);
    expect(evaluate(s, 0)).toBeCloseTo(-3, 12);
  });

  it('detects the repeated root of a perfect square (x² - 4x + 4)', () => {
    const s = stateFor(1, -4, 4);
    expect(discriminant(s)).toBeCloseTo(0, 12);
    expect(rootCount(s)).toBe(1);
    const roots = realRoots(s)!;
    expect(roots[0]).toBeCloseTo(2, 9);
    expect(roots[1]).toBeCloseTo(2, 9);
  });

  it('reports no real roots when the discriminant is negative', () => {
    const s = stateFor(1, 0, 4);
    expect(discriminant(s)).toBeLessThan(0);
    expect(realRoots(s)).toBeNull();
    expect(rootCount(s)).toBe(0);
  });

  it('orders roots ascending for downward parabolas', () => {
    const s = stateFor(-1, 2, 3);
    expect(realRoots(s)).toEqual([-1, 3]);
    expect(vertexY(s)).toBeCloseTo(4, 12);
  });

  it('keeps every measurement finite when a is 0 (degenerate line)', () => {
    const s = stateFor(0, 2, 1);
    expect(effectiveA(0)).toBe(A_EPSILON);
    expect(effectiveA(-0.01)).toBe(-A_EPSILON);
    for (const m of quadratic.measurements) {
      expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    }
  });

  it('advances the sweep phase and wraps it', () => {
    const s = stateFor(1, -2, -3);
    quadratic.step(s, 1);
    expect(s.vars.sweep).toBeCloseTo(0.6, 9);
    for (let i = 0; i < 100; i++) quadratic.step(s, 1);
    expect(s.vars.sweep).toBeGreaterThanOrEqual(0);
    expect(s.vars.sweep).toBeLessThan(Math.PI * 2);
  });

  it('vertex drag solves b and c from vertex form and clamps to slider ranges', () => {
    const s = stateFor(1, -2, -3);
    // Drag to the canvas centre → vertex at world (0, 0) → b = 0, c = 0.
    const centre = quadratic.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.5, t: 0 })!;
    expect(centre.b).toBeCloseTo(0, 9);
    expect(centre.c).toBeCloseTo(0, 9);
    // Drag to world (2, 3): b = -2a·h = -4, c = k + a·h² = 7.
    const wx = (2 / VIEW_X + 1) / 2;
    const wy = (1 - 3 / VIEW_Y) / 2;
    const patch = quadratic.pointer!.handle(s, { type: 'move', x: wx, y: wy, t: 0 })!;
    expect(patch.b).toBeCloseTo(-4, 6);
    expect(patch.c).toBeCloseTo(7, 6);
    // Far corner drags stay inside the declared param ranges.
    const corner = quadratic.pointer!.handle(s, { type: 'move', x: 1, y: 1, t: 0 })!;
    expect(corner.b).toBeGreaterThanOrEqual(-10);
    expect(corner.b).toBeLessThanOrEqual(10);
    expect(corner.c).toBeGreaterThanOrEqual(-10);
    expect(corner.c).toBeLessThanOrEqual(10);
    expect(quadratic.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toBeNull();
  });

  it('narrates roots and the axis of symmetry', () => {
    const text = quadratic.explanation(stateFor(1, -2, -3));
    expect(text).toContain('vertex sits at (1.00, -4.00)');
    expect(text).toContain('x = -1.00 and x = 3.00');
    const none = quadratic.explanation(stateFor(1, 0, 4));
    expect(none).toContain('no real roots');
  });
});
