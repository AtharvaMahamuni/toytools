// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { createGraphRenderer } from './graph';
import { makeMockCtx } from './mock-ctx.testutil';
import type { GraphDef, SimState, Viewport } from './types';

const vp: Viewport = {
  width: 600,
  height: 240,
  dpr: 1,
  palette: {
    ink: '#111',
    muted: '#666',
    accent: '#2F6B4F',
    accentSubtle: '#DFEBE4',
    bg: '#fff',
    surface: '#f4f2ee',
    border: '#e5e1da',
    danger: '#dc2626',
  },
};

const state = (t: number): SimState => ({ t, params: {}, vars: { v: Math.sin(t) } });

const spaceGraph: GraphDef = {
  mode: 'space',
  xLabel: 'x',
  yLabel: 'y',
  xRange: () => [0, 8],
  yRange: () => [-1, 1],
  series: [{ id: 's', label: 's', color: 'accent', sample: (_s, x) => Math.sin(x) }],
};

const timeGraph: GraphDef = {
  mode: 'time',
  window: 4,
  xLabel: 'Time',
  yLabel: 'Value',
  yRange: () => [-1, 1],
  series: [
    { id: 'a', label: 'A', color: 'accent', sample: (s) => s.vars.v },
    { id: 'b', label: 'B', color: 'danger', sample: (s) => -s.vars.v },
  ],
};

describe('graph renderer — space mode', () => {
  it('draws a static curve across the x range without throwing', () => {
    const r = createGraphRenderer(spaceGraph);
    r.push(state(0)); // no-op in space mode
    expect(() => r.draw(makeMockCtx(), state(1), vp)).not.toThrow();
  });

  it('uses a default x range when none is supplied', () => {
    const g: GraphDef = { ...spaceGraph, xRange: undefined };
    const r = createGraphRenderer(g);
    expect(() => r.draw(makeMockCtx(), state(0), vp)).not.toThrow();
  });
});

describe('graph renderer — time mode', () => {
  it('accumulates history, draws a multi-series legend, and evicts old points', () => {
    const r = createGraphRenderer(timeGraph);
    // Push a dense series of samples spanning past the 4 s window.
    for (let i = 0; i <= 600; i++) r.push(state(i / 60));
    expect(() => r.draw(makeMockCtx(), state(10), vp)).not.toThrow();
  });

  it('reset() clears accumulated history', () => {
    const r = createGraphRenderer(timeGraph);
    for (let i = 0; i < 100; i++) r.push(state(i / 60));
    r.reset();
    // Drawing immediately after reset (empty history) must still be safe.
    expect(() => r.draw(makeMockCtx(), state(0), vp)).not.toThrow();
  });

  it('throttles samples closer together than the trace resolution', () => {
    const r = createGraphRenderer(timeGraph);
    r.push(state(0));
    r.push(state(0.001)); // below TRACE_MIN_DT → skipped, no throw
    expect(() => r.draw(makeMockCtx(), state(0.001), vp)).not.toThrow();
  });

  it('handles a flat y range without dividing by zero', () => {
    const flat: GraphDef = { ...timeGraph, yRange: () => [5, 5] };
    const r = createGraphRenderer(flat);
    r.push(state(0));
    r.push(state(1));
    expect(() => r.draw(makeMockCtx(), state(1), vp)).not.toThrow();
  });
});
