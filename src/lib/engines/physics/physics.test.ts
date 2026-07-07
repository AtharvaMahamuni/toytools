// Engine-level tests: quantity formatting, the fixed-timestep loop (with injected timers),
// the loader ⇔ static-registry parity guarantee, and a stub-context smoke test asserting
// every simulation's draw() and the def contract hold for every registered simulation.

import { describe, expect, it, vi } from 'vitest';
import { formatQuantity, formatWithUnit } from './format';
import { createLoop, MAX_FRAME_DELTA, SPEED_MAX, SPEED_MIN, SUBSTEP } from './loop';
import { SIMULATIONS, getSimulation } from './simulations/registry';
import { simulationModuleIds } from './loader';
import type { SimState, Viewport } from './types';

describe('formatQuantity', () => {
  it('renders fixed decimals', () => {
    expect(formatQuantity(2, 2)).toBe('2.00');
    expect(formatQuantity(1.005, 1)).toBe('1.0');
    expect(formatQuantity(3.14159, 3)).toBe('3.142');
  });

  it('normalizes negative zero and rejects non-finite values', () => {
    expect(formatQuantity(-0.0001, 2)).toBe('0.00');
    expect(formatQuantity(Number.NaN)).toBe('—');
    expect(formatQuantity(Number.POSITIVE_INFINITY)).toBe('—');
  });

  it('appends units only when present', () => {
    expect(formatWithUnit(2.5, 'Hz')).toBe('2.50 Hz');
    expect(formatWithUnit(7, '', 0)).toBe('7');
  });
});

describe('createLoop', () => {
  /** Deterministic timer harness: manual clock + manually pumped animation frames. */
  function harness() {
    let time = 0;
    let queued: ((t: number) => void) | null = null;
    const timers = {
      raf: (cb: (t: number) => void) => {
        queued = cb;
        return 1;
      },
      caf: () => {
        queued = null;
      },
      now: () => time,
    };
    return {
      timers,
      advance(ms: number) {
        time += ms;
        const cb = queued;
        queued = null;
        cb?.(time);
      },
      hasFrameQueued: () => queued !== null,
    };
  }

  it('advances the model in exact SUBSTEP increments matching elapsed time', () => {
    const h = harness();
    const step = vi.fn();
    const render = vi.fn();
    const loop = createLoop({ step, render }, h.timers);
    loop.play();
    h.advance(54); // 0.054 s = 6.48 substeps at 1/120 → exactly 6 whole steps
    expect(step).toHaveBeenCalledTimes(6);
    expect(step).toHaveBeenLastCalledWith(SUBSTEP);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it('clamps a huge frame delta (background tab) to MAX_FRAME_DELTA', () => {
    const h = harness();
    const step = vi.fn();
    const loop = createLoop({ step, render: vi.fn() }, h.timers);
    loop.play();
    h.advance(10_000);
    // Iterative subtraction can land one substep either side of the exact quotient.
    const simulated = step.mock.calls.length * SUBSTEP;
    expect(simulated).toBeLessThanOrEqual(MAX_FRAME_DELTA + 1e-9);
    expect(simulated).toBeGreaterThan(MAX_FRAME_DELTA - 2 * SUBSTEP);
  });

  it('scales simulated time by the playback speed and clamps the speed range', () => {
    const h = harness();
    const step = vi.fn();
    const loop = createLoop({ step, render: vi.fn() }, h.timers);
    loop.setSpeed(0.5);
    loop.play();
    h.advance(80); // 0.08 s × 0.5 = 0.04 s → 4 substeps (not 9)
    expect(step).toHaveBeenCalledTimes(4);
    loop.setSpeed(99);
    expect(loop.speed()).toBe(SPEED_MAX);
    loop.setSpeed(0);
    expect(loop.speed()).toBe(SPEED_MIN);
  });

  it('falls back to the global rAF/now when no timers are injected', () => {
    // Stub the browser globals the default timers reach for, then drive one frame.
    let queued: FrameRequestCallback | null = null;
    const raf = vi.fn((cb: FrameRequestCallback) => {
      queued = cb;
      return 7;
    });
    const caf = vi.fn();
    const g = globalThis as unknown as Record<string, unknown>;
    const saved = { raf: g.requestAnimationFrame, caf: g.cancelAnimationFrame, perf: g.performance };
    g.requestAnimationFrame = raf;
    g.cancelAnimationFrame = caf;
    g.performance = { now: () => 1000 };
    try {
      const step = vi.fn();
      const loop = createLoop({ step, render: vi.fn() }); // no timers → defaults
      loop.play();
      expect(raf).toHaveBeenCalledTimes(1);
      g.performance = { now: () => 1100 }; // +0.1 s
      queued!(1100);
      expect(step).toHaveBeenCalled();
      loop.pause();
      expect(caf).toHaveBeenCalledWith(7);
    } finally {
      g.requestAnimationFrame = saved.raf;
      g.cancelAnimationFrame = saved.caf;
      g.performance = saved.perf;
    }
  });

  it('pause stops frames; toggle reports the new state; play resets the clock', () => {
    const h = harness();
    const render = vi.fn();
    const loop = createLoop({ step: vi.fn(), render }, h.timers);
    expect(loop.toggle()).toBe(true);
    expect(loop.running()).toBe(true);
    h.advance(20);
    expect(render).toHaveBeenCalledTimes(1);
    expect(loop.toggle()).toBe(false);
    expect(h.hasFrameQueued()).toBe(false);
    // A long pause must not produce a catch-up burst on resume.
    const stepsBefore = render.mock.calls.length;
    loop.play();
    h.advance(16);
    expect(render.mock.calls.length).toBe(stepsBefore + 1);
  });
});

describe('simulation registry', () => {
  it('static registry and lazy loader glob expose the same simulation ids', () => {
    expect(Object.keys(SIMULATIONS).sort()).toEqual(simulationModuleIds);
  });

  it('every def id matches its registry key (and the module filename)', () => {
    for (const [key, def] of Object.entries(SIMULATIONS)) {
      expect(def.id).toBe(key);
    }
  });

  it('getSimulation never throws on unknown ids', () => {
    expect(getSimulation('does-not-exist')).toBeUndefined();
  });
});

// ── Stub-context draw smoke: draw() must never throw for a freshly initialized state ────────
function stubContext(): CanvasRenderingContext2D {
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

const stubViewport: Viewport = {
  width: 800,
  height: 450,
  dpr: 1,
  palette: {
    ink: '#000',
    muted: '#666',
    accent: '#2F6B4F',
    accentSubtle: '#DFEBE4',
    bg: '#fff',
    surface: '#f4f2ee',
    border: '#e5e1da',
    danger: '#dc2626',
  },
};

describe.each(Object.values(SIMULATIONS).map((def) => [def.id, def] as const))(
  'simulation "%s"',
  (_id, def) => {
    function defaultState(): SimState {
      const params: Record<string, number> = {};
      for (const p of def.params) params[p.id] = p.default;
      return { t: 0, params, vars: def.init(params) };
    }

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
      const s = defaultState();
      for (let i = 0; i < 600; i++) def.step(s, SUBSTEP);
      expect(s.t).toBeCloseTo(600 * SUBSTEP);
      for (const v of Object.values(s.vars)) expect(Number.isFinite(v)).toBe(true);
      for (const m of def.measurements) expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    });

    it('draw() runs against a stub context without throwing', () => {
      const s = defaultState();
      expect(() => def.draw(stubContext(), s, stubViewport)).not.toThrow();
      for (let i = 0; i < 120; i++) def.step(s, SUBSTEP);
      expect(() => def.draw(stubContext(), s, stubViewport)).not.toThrow();
    });

    it('graph ranges and series sample finitely', () => {
      if (!def.graph) return;
      const s = defaultState();
      const [yMin, yMax] = def.graph.yRange(s);
      expect(yMin).toBeLessThan(yMax);
      const [x0, x1] = def.graph.xRange ? def.graph.xRange(s) : [0, 1];
      for (const series of def.graph.series) {
        expect(Number.isFinite(series.sample(s, x0)), series.id).toBe(true);
        expect(Number.isFinite(series.sample(s, x1)), series.id).toBe(true);
      }
    });
  },
);
