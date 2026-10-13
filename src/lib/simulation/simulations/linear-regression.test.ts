// Numeric pins for the Linear Regression Playground: preset clouds, R², the outlier callout,
// the empty-line guard, pointer adds, and identical inits.

import { describe, expect, it } from 'vitest';
import type { SimState } from '../types';
import { formatQuantity } from '../format';
import linearRegression, {
  fitOf,
  outlierHit,
  outlierObservation,
  pointCount,
  showsLine,
  worldFromPointer,
} from './linear-regression';

function stateFor(example: number): SimState {
  const params = { example };
  return { t: 0, params, vars: linearRegression.init(params) };
}

function measure(s: SimState, id: string): number {
  const found = linearRegression.measurements.find((item) => item.id === id);
  if (!found) throw new Error(`missing measurement ${id}`);
  return found.compute(s);
}

describe('linear regression model', () => {
  it('example 0 has n = 5 and a positive slope', () => {
    const s = stateFor(0);
    expect(pointCount(s)).toBe(5);
    expect(measure(s, 'n')).toBe(5);
    const fit = fitOf(s);
    expect(fit.slope).toBeGreaterThan(0);
    expect(fit.slope).toBeCloseTo(0.91, 2);
    expect(fit.intercept).toBeCloseTo(1.11, 2);
    expect(fit.r2).toBeCloseTo(0.88, 2);
    expect(fit.maxResidual).toBeCloseTo(0.85, 2);
    expect(showsLine(s)).toBe(true);
  });

  it('example 1 is a perfect line with R² = 1', () => {
    const s = stateFor(1);
    expect(pointCount(s)).toBe(4);
    const fit = fitOf(s);
    expect(fit.r2).toBe(1);
    expect(fit.slope).toBeCloseTo(1, 10);
    expect(fit.intercept).toBeCloseTo(0, 10);
    expect(fit.maxResidual).toBeCloseTo(0, 10);
    expect(measure(s, 'r2')).toBe(1);
  });

  it('fires the outlier observation on example 2 and stays silent on example 0', () => {
    expect(outlierObservation(stateFor(0))).toBeNull();
    expect(outlierHit(stateFor(0))).toBeNull();
    expect(
      linearRegression.observations.some((rule) => /outlier/i.test(rule(stateFor(0)) ?? '')),
    ).toBe(false);

    const hit = outlierHit(stateFor(2));
    expect(hit).not.toBeNull();
    expect(hit!.index).toBe(5);
    expect(Math.abs(hit!.residual)).toBeCloseTo(2.9125, 3);
    const text = outlierObservation(stateFor(2));
    expect(text).toContain('Point 6');
    expect(text).toContain('2.91');
    expect(text).toMatch(/outlier/i);
    expect(linearRegression.observations.some((rule) => rule(stateFor(2)) === text)).toBe(true);
  });

  it('has no line when fewer than two points are present', () => {
    const s = stateFor(0);
    s.vars.n = 1;
    expect(showsLine(s)).toBe(false);
    expect(pointCount(s)).toBe(1);
    for (const id of ['slope', 'intercept', 'r2', 'maxResidual']) {
      expect(measure(s, id)).toBe(0);
    }
    const text = linearRegression.observations.map((rule) => rule(s)).filter(Boolean).join(' ');
    expect(text).toMatch(/two points are required/i);
    expect(outlierObservation(s)).toBeNull();
  });

  it('says two points always give R² = 1', () => {
    const s = stateFor(1);
    s.vars.n = 2;
    const text = linearRegression.observations.map((rule) => rule(s)).filter(Boolean).join(' ');
    expect(text).toMatch(/R² = 1/);
    expect(text).toMatch(/third point is what tests the fit/);
    expect(showsLine(s)).toBe(true);
  });

  it('adds a point through the pointer and increases n', () => {
    const s = stateFor(0);
    const before = s.vars.n;
    const [wx, wy] = worldFromPointer(0.9, 0.9);
    expect(linearRegression.pointer!.handle(s, { type: 'down', x: 0.9, y: 0.9, t: 0 })).toBeNull();
    expect(s.vars.n).toBe(before + 1);
    expect(s.vars.x5).toBeCloseTo(wx, 10);
    expect(s.vars.y5).toBeCloseTo(wy, 10);
    expect(s.vars.grab).toBe(5);
    expect(linearRegression.pointer!.handle(s, { type: 'up', x: 0.9, y: 0.9, t: 1 })).toBeNull();
    expect(s.vars.grab).toBe(-1);
  });

  it('grabs a nearby point instead of adding one, and clamps a drag to the world', () => {
    const s = stateFor(0);
    // Point 0 is (1, 2.2). Canvas y is flipped: world y 2.2 sits at ev.y = 1 - 0.22.
    expect(linearRegression.pointer!.handle(s, { type: 'down', x: 0.1, y: 0.78, t: 0 })).toBeNull();
    expect(s.vars.n).toBe(5);
    expect(s.vars.grab).toBe(0);
    expect(linearRegression.pointer!.handle(s, { type: 'move', x: 1.4, y: -0.2, t: 1 })).toBeNull();
    expect(s.vars.x0).toBe(10);
    expect(s.vars.y0).toBe(10);
    expect(linearRegression.pointer!.handle(s, { type: 'tap', x: 0.1, y: 0.78, t: 2 })).toBeNull();
    expect(s.vars.grab).toBe(-1);
  });

  it('matches identical inits and does not share state between them', () => {
    expect(linearRegression.init({ example: 0 })).toEqual(linearRegression.init({ example: 0 }));
    expect(linearRegression.init({ example: 1 })).toEqual(linearRegression.init({ example: 1 }));
    expect(linearRegression.init({ example: 2 })).toEqual(linearRegression.init({ example: 2 }));
    const first = linearRegression.init({ example: 2 });
    first.n = 0;
    expect(linearRegression.init({ example: 2 }).n).toBe(6);
    expect(linearRegression.init({ example: 0 }).grab).toBe(-1);
  });

  it('returns slope 0, mean y, and R² 0 when every x is equal', () => {
    const s = stateFor(0);
    s.vars.n = 3;
    s.vars.x0 = 2;
    s.vars.y0 = 1;
    s.vars.x1 = 2;
    s.vars.y1 = 4;
    s.vars.x2 = 2;
    s.vars.y2 = 7;
    const fit = fitOf(s);
    expect(fit.slope).toBe(0);
    expect(fit.intercept).toBeCloseTo(4, 10);
    expect(fit.r2).toBe(0);
    expect(fit.vertical).toBe(true);
    // Says vertical instead of a misleading y = 0.00x + 4.00.
    const text = linearRegression.explanation(s);
    expect(text).toContain('x = 2.00');
    expect(text).toMatch(/vertical/);
    expect(text).not.toContain('y = 0.00x');
    const obs = linearRegression.observations.map((rule) => rule(s)).filter(Boolean).join(' ');
    expect(obs).toMatch(/vertical/);
    expect(outlierObservation(s)).toBeNull();
  });

  it('shows the placeholder for slope, intercept and R² on a vertical line, and drops the R² = 1 note (Phase C item 6)', () => {
    for (const n of [2, 3]) {
      const s = stateFor(0);
      s.vars.n = n;
      s.vars.x0 = 2;
      s.vars.y0 = 1;
      s.vars.x1 = 2;
      s.vars.y1 = 4;
      s.vars.x2 = 2;
      s.vars.y2 = 7;
      for (const id of ['slope', 'intercept', 'r2', 'maxResidual']) {
        const m = linearRegression.measurements.find((q) => q.id === id)!;
        expect(Number.isNaN(m.compute(s)), id).toBe(true);
        expect(formatQuantity(m.compute(s), m.decimals)).toBe('—');
      }
      const obs = linearRegression.observations.map((rule) => rule(s)).filter(Boolean).join(' ');
      expect(obs).not.toContain('R² = 1');
      expect(obs).toMatch(/vertical/);
    }
  });

  it('fits a line through exactly two points (no third point needed)', () => {
    const s = stateFor(0);
    s.vars.n = 2;
    s.vars.x0 = 1;
    s.vars.y0 = 3;
    s.vars.x1 = 3;
    s.vars.y1 = 7;
    const fit = fitOf(s);
    expect(fit.slope).toBeCloseTo(2, 10);
    expect(fit.intercept).toBeCloseTo(1, 10);
    expect(fit.r2).toBeCloseTo(1, 10);
    expect(fit.vertical).toBe(false);
    expect(fit.residuals).toHaveLength(2);
    expect(linearRegression.explanation(s)).toContain('y = 2.00x + 1.00');
  });

  it('two points at the same x are a vertical line too', () => {
    const s = stateFor(0);
    s.vars.n = 2;
    s.vars.x0 = 5;
    s.vars.y0 = 1;
    s.vars.x1 = 5;
    s.vars.y1 = 9;
    expect(linearRegression.explanation(s)).toContain('x = 5.00');
  });

  it('reports R² = 1 when every y is equal and the x values differ', () => {
    const s = stateFor(0);
    s.vars.n = 3;
    s.vars.x0 = 1;
    s.vars.y0 = 3;
    s.vars.x1 = 2;
    s.vars.y1 = 3;
    s.vars.x2 = 4;
    s.vars.y2 = 3;
    const fit = fitOf(s);
    expect(fit.slope).toBeCloseTo(0, 10);
    expect(fit.intercept).toBeCloseTo(3, 10);
    expect(fit.r2).toBe(1);
  });

  it('only advances time in step', () => {
    const s = stateFor(0);
    const before = { ...s.vars };
    linearRegression.step(s, 0.25);
    expect(s.t).toBeCloseTo(0.25, 10);
    expect(s.vars).toEqual(before);
  });

  it('names n, the equation, and R²', () => {
    const text = linearRegression.explanation(stateFor(0));
    expect(text).toContain('n = 5');
    expect(text).toContain('y = 0.91x + 1.11');
    expect(text).toContain('R² is 0.880');
  });
});
