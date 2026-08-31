// The response curve: one array of gains in, a smooth line out.
//
// The bands are spaced at an even ratio (see DEFAULT_BANDS), so the x axis can be the band index
// normalised to 0..1 and still be a true logarithmic frequency axis. That is what lets the curve
// and the seven controls under it line up exactly, which is the whole point of the picture: the
// dot you dragged is on the line you are looking at.

import type { CurvePoint } from './types';

/** Clamp a gain array to the definition's limits and length. Never throws, never returns holes. */
export function clampGains(gains: unknown, count: number, min: number, max: number): number[] {
  const input = Array.isArray(gains) ? gains : [];
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const raw = Number(input[i]);
    out.push(Number.isFinite(raw) ? Math.min(max, Math.max(min, Math.round(raw))) : 0);
  }
  return out;
}

/**
 * Interpolated gain at fractional band position `t` (0 = first band, n-1 = last).
 *
 * Catmull-Rom, so the line passes exactly THROUGH every band value rather than near it. A curve
 * that misses the point you dragged reads as the tool disagreeing with you. Ends are held flat,
 * which is also what a shelf-less graphic EQ does outside its range.
 */
export function gainAt(gains: number[], t: number): number {
  const n = gains.length;
  if (n === 0) return 0;
  if (n === 1) return gains[0]!;
  if (t <= 0) return gains[0]!;
  if (t >= n - 1) return gains[n - 1]!;

  const i = Math.floor(t);
  const u = t - i;
  const at = (k: number) => gains[Math.min(n - 1, Math.max(0, k))]!;
  const p0 = at(i - 1);
  const p1 = at(i);
  const p2 = at(i + 1);
  const p3 = at(i + 2);

  return 0.5 * (
    2 * p1 +
    (p2 - p0) * u +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
    (3 * p1 - p0 - 3 * p2 + p3) * u * u * u
  );
}

/**
 * `samples` points across the whole band range, x normalised to 0..1 and y clamped to the
 * definition's limits so an interpolation overshoot cannot draw outside the graph.
 */
export function curvePoints(gains: number[], min: number, max: number, samples = 49): CurvePoint[] {
  const n = gains.length;
  if (n < 2 || samples < 2) return gains.map((y, i) => ({ x: n > 1 ? i / (n - 1) : 0, y }));
  const out: CurvePoint[] = [];
  for (let s = 0; s < samples; s++) {
    const x = s / (samples - 1);
    const y = gainAt(gains, x * (n - 1));
    out.push({ x, y: Math.min(max, Math.max(min, y)) });
  }
  return out;
}

/**
 * The gain this curve implies at an arbitrary frequency, by reading the same interpolation at the
 * matching position on the log axis.
 *
 * This is the seam a band converter is built on: another equalizer's 31 Hz or 16 kHz band is just
 * another frequency to sample. Nothing in the tool calls it yet, and it is here so that adding one
 * is a new caller rather than a second copy of the curve maths.
 */
export function gainForFrequency(gains: number[], frequencies: number[], hz: number): number {
  const n = frequencies.length;
  if (n === 0 || gains.length !== n) return 0;
  if (n === 1) return gains[0]!;
  const f = Math.max(1, hz);
  if (f <= frequencies[0]!) return gains[0]!;
  if (f >= frequencies[n - 1]!) return gains[n - 1]!;
  let i = 0;
  while (i < n - 2 && frequencies[i + 1]! < f) i++;
  const span = Math.log(frequencies[i + 1]! / frequencies[i]!);
  const t = i + (span > 0 ? Math.log(f / frequencies[i]!) / span : 0);
  return gainAt(gains, t);
}

/**
 * The SVG geometry the widget draws in.
 *
 * One band is `unit` wide and its control sits at the CENTRE of that column, which is why the
 * curve starts half a unit in. That is not a detail: the seven sliders under the graph are a grid
 * of equal columns with no gaps, so a curve drawn on the same centres lines up with them exactly at
 * every width, with no measuring at runtime. Draw it edge to edge instead and the first and last
 * bands sit half a column away from their own controls.
 */
export const EQ_VIEW = { unit: 100, zeroY: 120, height: 240, span: 100 };

export interface CurvePaths {
  /** The response line. */
  line: string;
  /** The same line closed against the 0 dB axis, for the fill that shows boost from cut. */
  area: string;
}

/** SVG path data for these gains, in EQ_VIEW coordinates. Pure string building: no DOM, no layout. */
export function curvePath(gains: number[], maxGain: number, samples = 49): CurvePaths {
  const n = gains.length;
  const { unit, zeroY, span } = EQ_VIEW;
  const width = n * unit;
  if (n === 0 || maxGain <= 0) {
    return { line: `M0,${zeroY} L${width},${zeroY}`, area: '' };
  }

  const scale = span / maxGain;
  const points: string[] = [];
  for (let s = 0; s < samples; s++) {
    const x = (s / (samples - 1)) * width;
    const y = zeroY - gainAt(gains, x / unit - 0.5) * scale;
    points.push(`${round(x)},${round(y)}`);
  }

  const line = `M${points.join(' L')}`;
  return { line, area: `${line} L${width},${zeroY} L0,${zeroY} Z` };
}

/** Two decimals is under a tenth of a pixel at any width this renders at, and keeps the HTML small. */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}
