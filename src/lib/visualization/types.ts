// Visualization contract — presentation-independent. An engine emits a VizSpec describing WHAT to
// show (kind + data); the renderer (src/lib/visualization/render.ts) decides HOW. No chart code
// ever lives in a calculator, so the engine layer stays pure and testable and the same spec can be
// drawn as SVG, canvas, or a plain table.

/** The shape of visualization an engine is requesting. New kinds are additive. */
export type VizKind =
  | 'line'
  | 'area'
  | 'timeline'
  | 'progress'
  | 'comparison'
  | 'milestones'
  | 'bars'
  | 'stacked'
  | 'distribution'
  // A value marker positioned on a segmented scale (BMI bands, body-fat categories). The answer is
  // a POSITION, not a number, so the chart carries the meaning the label alone cannot.
  | 'band';

/** Semantic weight for a band segment. Drives a CSS class, never a hard-coded fill. */
export type VizTone = 'low' | 'good' | 'warn' | 'high' | 'neutral';

/** One segment of a banded scale, e.g. BMI 18.5 to 25 = "Healthy". */
export interface VizBand {
  id: string;
  label: string;
  from: number;
  to: number;
  tone?: VizTone;
}

/** An annotated sub-range drawn under a banded scale, e.g. "56.7 to 76.3 kg for you". */
export interface VizHighlight {
  from: number;
  to: number;
  label?: string;
}

/** A single (x, y) sample, with an optional pre-formatted label so the renderer needs no formatter. */
export interface VizPoint {
  x: number | string;
  y: number;
  label?: string;
}

/** A named series of points (e.g. "Balance", "Contributions"). */
export interface VizSeries {
  id: string;
  label?: string;
  points: VizPoint[];
}

/** A part-to-whole slice (e.g. protein / carb / fat). `display` is the pre-formatted label. */
export interface VizPart {
  id: string;
  label: string;
  value: number;
  display?: string;
}

/**
 * Engine-emitted visualization request. `data.series` carries line/area/bar data; `data.value`/
 * `data.target` drive a progress kind; `data.parts` drive stacked/distribution/bars; `data.bands`
 * plus `data.value` drive a band. All optional so a spec degrades gracefully.
 */
export interface VizSpec {
  kind: VizKind;
  title?: string;
  description?: string;
  data: {
    series?: VizSeries[];
    value?: number;
    target?: number;
    parts?: VizPart[];
    bands?: VizBand[];
    highlight?: VizHighlight;
    /** Pre-formatted marker caption for a band, e.g. "22.9". */
    valueLabel?: string;
  };
}

/** Build a single-series line/area spec from (x,y) pairs. Pure helper; never throws. */
export function lineSpec(
  id: string,
  points: VizPoint[],
  opts: { kind?: Extract<VizKind, 'line' | 'area'>; title?: string; description?: string } = {},
): VizSpec {
  return {
    kind: opts.kind ?? 'line',
    title: opts.title,
    description: opts.description,
    data: { series: [{ id, points }] },
  };
}

/** Build a progress spec (value toward a target), e.g. emergency-fund coverage. */
export function progressSpec(
  value: number,
  target: number,
  opts: { title?: string; description?: string } = {},
): VizSpec {
  return {
    kind: 'progress',
    title: opts.title,
    description: opts.description,
    data: { value, target },
  };
}

/** Build a stacked/distribution spec from part-to-whole values (e.g. principal vs interest). */
export function partsSpec(
  parts: VizPart[],
  opts: { kind?: Extract<VizKind, 'stacked' | 'distribution' | 'bars'>; title?: string; description?: string } = {},
): VizSpec {
  return {
    kind: opts.kind ?? 'stacked',
    title: opts.title,
    description: opts.description,
    data: { parts },
  };
}

/**
 * Build a band spec: where `value` falls on a segmented scale. `bands` must be ordered and
 * contiguous; the renderer scales to the first band's `from` and the last band's `to`.
 */
export function bandSpec(
  value: number,
  bands: VizBand[],
  opts: { title?: string; description?: string; highlight?: VizHighlight; valueLabel?: string } = {},
): VizSpec {
  return {
    kind: 'band',
    title: opts.title,
    description: opts.description,
    data: { value, bands, highlight: opts.highlight, valueLabel: opts.valueLabel },
  };
}
