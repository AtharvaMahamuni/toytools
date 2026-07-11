// The shared simulation CONTRACT (Problem 8): one reusable invariant suite every simulation must
// satisfy, so per-simulation tests shrink to only the sim-specific numeric assertions. Call
// `expectSimulation(def)` inside a describe block (see contract.test.ts, which runs it over the
// whole registry). This replaces the hand-copied describe.each that used to live in physics.test.ts.

import { expect, it } from 'vitest';
import type { Palette, SimState, SimulationDef, Viewport } from './types';
import { SUBSTEP } from './loop';

/** A Proxy CanvasRenderingContext2D that swallows every call — enough for draw() smoke tests. */
export function stubContext(): CanvasRenderingContext2D {
  const noop = () => undefined;
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === 'measureText') return () => ({ width: 10 });
        return noop;
      },
      set: () => true,
    },
  ) as unknown as CanvasRenderingContext2D;
}

const STUB_PALETTE: Palette = {
  ink: '#000',
  muted: '#666',
  accent: '#2F6B4F',
  accentSubtle: '#DFEBE4',
  bg: '#fff',
  surface: '#f4f2ee',
  border: '#e5e1da',
  danger: '#dc2626',
};

export const stubViewport: Viewport = { width: 800, height: 450, dpr: 1, palette: STUB_PALETTE };

/** Build the default state (all params at their default) for a simulation. */
export function defaultStateOf(def: SimulationDef): SimState {
  const params: Record<string, number> = {};
  for (const p of def.params) params[p.id] = p.default;
  return { t: 0, params, vars: def.init(params) };
}

/**
 * Assert every generic simulation invariant for `def`. Call inside a `describe`. Covers: valid
 * params/presets, resolvable formula terms, determinism + finite outputs across substeps, draw()
 * never throwing (fresh + after stepping), finite graph ranges/series, a correct static first frame
 * (reduced-motion), and human-readable labels on every param and measurement (accessibility).
 */
export function expectSimulation(def: SimulationDef): void {
  it('declares in-range defaults and valid presets', () => {
    expect(def.params.length).toBeGreaterThan(0);
    for (const p of def.params) {
      expect(p.min, p.id).toBeLessThan(p.max);
      expect(p.default, p.id).toBeGreaterThanOrEqual(p.min);
      expect(p.default, p.id).toBeLessThanOrEqual(p.max);
    }
    const paramIds = new Set(def.params.map((p) => p.id));
    for (const preset of def.presets) {
      for (const [pid, value] of Object.entries(preset.values)) {
        const p = def.params.find((x) => x.id === pid);
        expect(paramIds.has(pid), `${preset.id}.${pid}`).toBe(true);
        expect(value, `${preset.id}.${pid}`).toBeGreaterThanOrEqual(p!.min);
        expect(value, `${preset.id}.${pid}`).toBeLessThanOrEqual(p!.max);
      }
    }
  });

  it('labels every param and measurement (accessibility)', () => {
    for (const p of def.params) expect(p.label.trim().length, p.id).toBeGreaterThan(0);
    for (const m of def.measurements) expect(m.label.trim().length, m.id).toBeGreaterThan(0);
  });

  it('formula terms reference declared params or measurements', () => {
    if (!def.formula) return;
    const paramIds = new Set(def.params.map((p) => p.id));
    const measurementIds = new Set(def.measurements.map((m) => m.id));
    for (const term of def.formula.terms) {
      if (term.paramId) expect(paramIds.has(term.paramId), term.symbol).toBe(true);
      if (term.measurementId) expect(measurementIds.has(term.measurementId), term.symbol).toBe(true);
      expect(Boolean(term.paramId || term.measurementId), term.symbol).toBe(true);
    }
  });

  it('stays finite through 600 substeps and keeps advancing time', () => {
    const s = defaultStateOf(def);
    for (let i = 0; i < 600; i++) def.step(s, SUBSTEP);
    expect(s.t).toBeCloseTo(600 * SUBSTEP);
    for (const v of Object.values(s.vars)) expect(Number.isFinite(v)).toBe(true);
    for (const m of def.measurements) expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
  });

  it('is deterministic: identical states step to identical states', () => {
    const a = defaultStateOf(def);
    const b = defaultStateOf(def);
    for (let i = 0; i < 120; i++) {
      def.step(a, SUBSTEP);
      def.step(b, SUBSTEP);
    }
    expect(b.vars).toEqual(a.vars);
    for (const m of def.measurements) expect(m.compute(b)).toBe(m.compute(a));
  });

  it('renders a finite static first frame without throwing (reduced motion)', () => {
    const s = defaultStateOf(def);
    for (const m of def.measurements) expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    expect(() => def.draw(stubContext(), s, stubViewport)).not.toThrow();
  });

  it('draw() runs against a stub context after stepping without throwing', () => {
    const s = defaultStateOf(def);
    for (let i = 0; i < 120; i++) def.step(s, SUBSTEP);
    expect(() => def.draw(stubContext(), s, stubViewport)).not.toThrow();
  });

  it('graph ranges and series sample finitely', () => {
    if (!def.graph) return;
    const s = defaultStateOf(def);
    const [yMin, yMax] = def.graph.yRange(s);
    expect(yMin).toBeLessThan(yMax);
    const [x0, x1] = def.graph.xRange ? def.graph.xRange(s) : [0, 1];
    for (const series of def.graph.series) {
      expect(Number.isFinite(series.sample(s, x0)), series.id).toBe(true);
      expect(Number.isFinite(series.sample(s, x1)), series.id).toBe(true);
    }
  });
}
