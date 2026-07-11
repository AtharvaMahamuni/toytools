// Generic graph builders (Problem 15): simulations provide data (sample closures + ranges) and the
// engine's graph renderer (../graph.ts) draws them. These builders name the two fundamental graph
// types so a simulation never hand-assembles a GraphDef or repeats the mode string:
//   - streamGraph:   values traced against time over a rolling window (oscilloscope style).
//   - snapshotGraph: series resampled across a spatial domain every frame (a curve of state).
// Named physics shapes (sine wave, velocity-time, I-V line, P-V hyperbola) are these two primitives
// fed the appropriate sample function; convenience single-series wrappers cover the common case.

import type { GraphDef, GraphSeries, SimState } from '../types';

type Range = (s: SimState) => [number, number];
type Sampler = (s: SimState, x: number) => number;
type SeriesColor = GraphSeries['color'];

/** A time-series ("stream") graph: each series' value is traced against s.t over `window` seconds. */
export function streamGraph(opts: {
  yLabel: string;
  xLabel?: string;
  window?: number;
  yRange: Range;
  series: GraphSeries[];
}): GraphDef {
  return {
    mode: 'stream',
    xLabel: opts.xLabel ?? 'Time (s)',
    yLabel: opts.yLabel,
    window: opts.window,
    yRange: opts.yRange,
    series: opts.series,
  };
}

/** A spatial ("snapshot") graph: each series is resampled across xRange every frame. */
export function snapshotGraph(opts: {
  xLabel: string;
  yLabel: string;
  xRange: Range;
  yRange: Range;
  series: GraphSeries[];
}): GraphDef {
  return {
    mode: 'snapshot',
    xLabel: opts.xLabel,
    yLabel: opts.yLabel,
    xRange: opts.xRange,
    yRange: opts.yRange,
    series: opts.series,
  };
}

/** The common single-trace stream case (one value against time). */
export function singleStream(opts: {
  yLabel: string;
  window?: number;
  yRange: Range;
  id: string;
  label: string;
  color?: SeriesColor;
  sample: (s: SimState) => number;
}): GraphDef {
  return streamGraph({
    yLabel: opts.yLabel,
    window: opts.window,
    yRange: opts.yRange,
    series: [{ id: opts.id, label: opts.label, color: opts.color ?? 'accent', sample: opts.sample }],
  });
}

/** The common single-curve snapshot case (one curve across a spatial domain). */
export function singleSnapshot(opts: {
  xLabel: string;
  yLabel: string;
  xRange: Range;
  yRange: Range;
  id: string;
  label: string;
  color?: SeriesColor;
  sample: Sampler;
}): GraphDef {
  return snapshotGraph({
    xLabel: opts.xLabel,
    yLabel: opts.yLabel,
    xRange: opts.xRange,
    yRange: opts.yRange,
    series: [{ id: opts.id, label: opts.label, color: opts.color ?? 'accent', sample: opts.sample }],
  });
}
