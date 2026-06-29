// Visualization contract — presentation-independent. An engine emits a VizSpec describing WHAT to
// show (kind + data); a renderer (real charts are a later, reserved seam) decides HOW. No chart code
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
  | 'distribution';

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

/**
 * Engine-emitted visualization request. `data.series` carries line/area/bar data; `data.value`/
 * `data.target` drive a progress kind; `data.parts` drive stacked/distribution. All optional so a
 * spec degrades gracefully.
 */
export interface VizSpec {
  kind: VizKind;
  title?: string;
  description?: string;
  data: {
    series?: VizSeries[];
    value?: number;
    target?: number;
    parts?: { id: string; label: string; value: number }[];
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
  parts: { id: string; label: string; value: number }[],
  opts: { kind?: Extract<VizKind, 'stacked' | 'distribution' | 'bars'>; title?: string; description?: string } = {},
): VizSpec {
  return {
    kind: opts.kind ?? 'stacked',
    title: opts.title,
    description: opts.description,
    data: { parts },
  };
}
