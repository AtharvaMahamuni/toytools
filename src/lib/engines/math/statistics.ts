// Descriptive statistics for the math engine - pure, synchronous, never-throws. Invalid or empty
// input returns null so the calculator phrases the validation error. Quartiles use the inclusive
// Tukey hinge (median of each half, including the overall median when n is odd), which matches
// what most intro stats courses teach for a five-number summary and box plot.

export type StdevMode = 'sample' | 'population';

export interface DescriptiveStats {
  count: number;
  mean: number;
  median: number;
  /** Empty when every value appears once (no repeated mode). */
  modes: number[];
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  variance: number;
  stdev: number;
  sorted: number[];
  /** Tukey fences: values below q1 - 1.5·IQR or above q3 + 1.5·IQR. */
  outliers: number[];
}

export interface HistogramBin {
  id: string;
  label: string;
  from: number;
  to: number;
  count: number;
}

/** Cap on how many numbers a paste may contain so the UI stays responsive. */
export const MAX_STATS_VALUES = 10_000;

/**
 * Split a paste on commas, whitespace, semicolons, or pipes into finite numbers.
 * Returns null when nothing parses, or when any token is present but not a number.
 */
export function parseNumberList(text: string): number[] | null {
  const raw = text.trim();
  if (!raw) return null;
  const tokens = raw.split(/[\s,;|]+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return null;
  const values: number[] = [];
  for (const token of tokens) {
    const n = Number(token);
    if (!Number.isFinite(n)) return null;
    values.push(n);
  }
  return values;
}

function medianOfSorted(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

/** Inclusive Tukey hinges: lower/upper half each include the overall median when n is odd. */
function hinges(sorted: number[]): { q1: number; q3: number } {
  const n = sorted.length;
  if (n === 1) return { q1: sorted[0]!, q3: sorted[0]! };
  const mid = Math.floor(n / 2);
  const lower = sorted.slice(0, n % 2 === 0 ? mid : mid + 1);
  const upper = sorted.slice(mid);
  return { q1: medianOfSorted(lower), q3: medianOfSorted(upper) };
}

function modesOf(sorted: number[]): number[] {
  const freq = new Map<number, number>();
  for (const v of sorted) freq.set(v, (freq.get(v) ?? 0) + 1);
  let best = 0;
  for (const c of freq.values()) if (c > best) best = c;
  if (best < 2) return [];
  return [...freq.entries()].filter(([, c]) => c === best).map(([v]) => v);
}

/**
 * Compute the five-number summary plus mean/mode/variance/stdev. Returns null when fewer than one
 * finite value is present, or when sample stdev is requested with n < 2.
 */
export function descriptiveStats(values: number[], mode: StdevMode): DescriptiveStats | null {
  if (values.length === 0 || values.length > MAX_STATS_VALUES) return null;
  if (!values.every((v) => Number.isFinite(v))) return null;
  if (mode === 'sample' && values.length < 2) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;
  const median = medianOfSorted(sorted);
  const { q1, q3 } = hinges(sorted);
  const iqr = q3 - q1;
  const min = sorted[0]!;
  const max = sorted[count - 1]!;
  const modes = modesOf(sorted);

  const ss = sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0);
  const variance = mode === 'sample' ? ss / (count - 1) : ss / count;
  const stdev = Math.sqrt(variance);

  const fenceLo = q1 - 1.5 * iqr;
  const fenceHi = q3 + 1.5 * iqr;
  const outliers = sorted.filter((v) => v < fenceLo || v > fenceHi);

  return {
    count,
    mean,
    median,
    modes,
    min,
    max,
    range: max - min,
    q1,
    q3,
    iqr,
    variance,
    stdev,
    sorted,
    outliers,
  };
}

/**
 * Build equal-width histogram bins. When all values are identical, emits a single bin so the chart
 * still has something to draw. Bin count defaults to Sturges' rule, clamped to [4, 12].
 */
export function histogramBins(values: number[], binCount?: number): HistogramBin[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0]!;
  const max = sorted[sorted.length - 1]!;
  if (min === max) {
    return [{ id: 'bin-0', label: formatEdge(min), from: min, to: max, count: sorted.length }];
  }

  const k =
    binCount ??
    Math.min(12, Math.max(4, Math.ceil(1 + Math.log2(sorted.length))));
  const width = (max - min) / k;
  const bins: HistogramBin[] = [];
  for (let i = 0; i < k; i++) {
    const from = min + i * width;
    const to = i === k - 1 ? max : min + (i + 1) * width;
    bins.push({
      id: `bin-${i}`,
      label: `${formatEdge(from)} to ${formatEdge(to)}`,
      from,
      to,
      count: 0,
    });
  }
  for (const v of sorted) {
    let idx = Math.floor((v - min) / width);
    if (idx >= k) idx = k - 1;
    if (idx < 0) idx = 0;
    bins[idx]!.count += 1;
  }
  return bins;
}

function formatEdge(v: number): string {
  if (!Number.isFinite(v)) return '-';
  const abs = Math.abs(v);
  if (abs !== 0 && (abs >= 1e6 || abs < 0.001)) return v.toExponential(2);
  const rounded = Math.round(v * 1000) / 1000;
  return String(rounded);
}

/** Format a statistic for display: trim trailing zeros without losing significant digits. */
export function formatStat(v: number, digits = 4): string {
  if (!Number.isFinite(v)) return '-';
  if (Number.isInteger(v) && Math.abs(v) < 1e12) return String(v);
  const fixed = v.toFixed(digits);
  return fixed.replace(/\.?0+$/, '');
}
