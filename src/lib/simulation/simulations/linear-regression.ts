// Linear Regression Playground. Points live in vars (n, then x0,y0 ... up to 8), not an array.
// One "example" param restarts into a preset cloud. Least squares is ordinary two-variable fit:
// slope, intercept, R², and the largest residual. Pure model; canvas work is in the draw file.

import type { SimState, SimulationDef } from '../types';
import { drawLinearRegression } from './linear-regression.draw';

/** Both axes run from 0 to this value. Pointer 0..1 maps onto the same square. */
export const WORLD = 10;
export const MAX_POINTS = 8;
/** Grab a point when the pointer lands within this many world units. */
export const HIT_RADIUS = 0.7;

const LINE: readonly (readonly [number, number])[] = [
  [1, 2.2],
  [2, 2.8],
  [3, 4.1],
  [4, 3.9],
  [5, 6.2],
];
const PERFECT: readonly (readonly [number, number])[] = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
];
const OUTLIER: readonly (readonly [number, number])[] = [...LINE, [5, 1]];

const EXAMPLES = [LINE, PERFECT, OUTLIER] as const;

export function exampleId(params: Record<string, number>): 0 | 1 | 2 {
  const raw = params.example;
  const rounded = Number.isFinite(raw) ? Math.round(raw) : 0;
  if (rounded <= 0) return 0;
  if (rounded >= 2) return 2;
  return 1;
}

export function pointCount(s: SimState): number {
  const n = s.vars.n;
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(MAX_POINTS, Math.round(n)));
}

export function showsLine(s: SimState): boolean {
  return pointCount(s) >= 2;
}

function coord(v: number | undefined): number {
  return Number.isFinite(v) ? (v as number) : 0;
}

export function pointsOf(s: SimState): [number, number][] {
  const n = pointCount(s);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) pts.push([coord(s.vars[`x${i}`]), coord(s.vars[`y${i}`])]);
  return pts;
}

export interface LineFit {
  slope: number;
  intercept: number;
  r2: number;
  maxResidual: number;
  residuals: number[];
  /** Every x is equal, so the best line is vertical (x = c) and y = mx + b cannot describe it. */
  vertical: boolean;
}

const EMPTY_FIT: LineFit = { slope: 0, intercept: 0, r2: 0, maxResidual: 0, residuals: [], vertical: false };

/** Ordinary least squares. A zero x-denominator (every x equal) yields slope 0, mean y, and R² 0. */
export function leastSquares(pts: readonly (readonly [number, number])[]): LineFit {
  const n = pts.length;
  if (n < 2) return { ...EMPTY_FIT, residuals: pts.map(() => 0) };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  for (const [x, y] of pts) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const den = n * sumXX - sumX * sumX;
  const meanY = sumY / n;
  if (Math.abs(den) < 1e-9) {
    const residuals = pts.map(([, y]) => y - meanY);
    return {
      slope: 0,
      intercept: meanY,
      r2: 0,
      maxResidual: residuals.reduce((max, r) => Math.max(max, Math.abs(r)), 0),
      residuals,
      vertical: true,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / den;
  const intercept = (sumY - slope * sumX) / n;
  if (!Number.isFinite(slope) || !Number.isFinite(intercept)) {
    return { slope: 0, intercept: meanY, r2: 0, maxResidual: 0, residuals: pts.map(() => 0), vertical: false };
  }

  let ssRes = 0;
  let ssTot = 0;
  let maxResidual = 0;
  const residuals = pts.map(([x, y]) => {
    const residual = y - (slope * x + intercept);
    ssRes += residual * residual;
    const fromMean = y - meanY;
    ssTot += fromMean * fromMean;
    maxResidual = Math.max(maxResidual, Math.abs(residual));
    return residual;
  });
  const r2 = Math.abs(ssTot) < 1e-12 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, r2, maxResidual, residuals, vertical: false };
}

export function fitOf(s: SimState): LineFit {
  return leastSquares(pointsOf(s));
}

export interface OutlierHit {
  /** 0-based index. */
  index: number;
  /** Signed residual on the fitted line. */
  residual: number;
}

/**
 * Flag the point with the largest absolute residual when that gap is at least 1.5 and at least
 * twice the next residual at a different x. Same-x partners share one fitted height, so the
 * runner-up on that vertical line is not "the next" gap.
 */
export function outlierHit(s: SimState): OutlierHit | null {
  const pts = pointsOf(s);
  if (pts.length < 3) return null;
  const { residuals, vertical } = fitOf(s);
  if (vertical) return null; // residuals from a vertical line are not defined
  let maxI = 0;
  for (let i = 1; i < residuals.length; i++) {
    if (Math.abs(residuals[i]) > Math.abs(residuals[maxI])) maxI = i;
  }
  const maxAbs = Math.abs(residuals[maxI]);
  let next = 0;
  for (let i = 0; i < residuals.length; i++) {
    if (i === maxI) continue;
    if (Math.abs(pts[i][0] - pts[maxI][0]) < 1e-6) continue;
    next = Math.max(next, Math.abs(residuals[i]));
  }
  if (maxAbs >= 1.5 && maxAbs >= 2 * next) return { index: maxI, residual: residuals[maxI] };
  return null;
}

/**
 * Slope, intercept and R² of the fit, or NaN when the points stand in one column: a vertical line
 * has none of them, and NaN renders as the engine's non-finite placeholder.
 */
export function definedFit(s: SimState, key: 'slope' | 'intercept' | 'r2'): number {
  const fit = fitOf(s);
  return fit.vertical ? Number.NaN : fit[key];
}

/** The common x when every point shares it, else null. */
export function verticalX(s: SimState): number | null {
  if (!showsLine(s) || !fitOf(s).vertical) return null;
  return pointsOf(s)[0]![0];
}

/** Said instead of an equation when the points stand in one column. */
export function verticalMessage(s: SimState): string | null {
  const x = verticalX(s);
  if (x === null) return null;
  return `Every point has x = ${x.toFixed(2)}, so the line through them is vertical (x = ${x.toFixed(2)}) and y = mx + b cannot describe it. Move a point sideways to fit a slope.`;
}

export function outlierObservation(s: SimState): string | null {
  const hit = outlierHit(s);
  if (!hit) return null;
  const abs = Math.abs(hit.residual);
  return `Point ${hit.index + 1} is an outlier: its absolute residual is ${abs.toFixed(2)}, at least twice the next residual at a different x and at least 1.5.`;
}

/**
 * Said when no other rule speaks, so a fit with three or more points never leaves the panel on
 * the shared "Press Play" placeholder: this simulation has nothing to play.
 */
export function steadyObservation(s: SimState): string | null {
  const n = pointCount(s);
  if (n < 3 || fitOf(s).vertical || outlierObservation(s)) return null;
  return `With ${n} points, R² is ${fitOf(s).r2.toFixed(3)}. Move a point, or edit the points list, and the line refits.`;
}

export function formatEquation(slope: number, intercept: number): string {
  const sign = intercept < 0 ? '-' : '+';
  return `y = ${slope.toFixed(2)}x ${sign} ${Math.abs(intercept).toFixed(2)}`;
}

export type PointsParse = { ok: true; points: [number, number][] } | { ok: false; error: string };

/** One "x, y" (or "x y") per line. Blank lines are skipped. Every value must sit in 0..WORLD. */
export function parsePoints(text: string): PointsParse {
  const points: [number, number][] = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;
    const parts = line.split(/[\s,;]+/).filter(Boolean);
    // Plain decimals only: Number() would also take "0x10" as 16 and "1e1" as 10.
    const nums = parts.map((p) => (/^[+-]?(\d+\.?\d*|\.\d+)$/.test(p) ? Number(p) : Number.NaN));
    if (parts.length !== 2 || nums.some((v) => !Number.isFinite(v))) {
      return { ok: false, error: `Line ${i + 1} needs two numbers, x and y, like 3, 4.` };
    }
    if (nums.some((v) => v < 0 || v > WORLD)) {
      return { ok: false, error: `Line ${i + 1}: x and y must each be from 0 to ${WORLD}.` };
    }
    points.push([nums[0]!, nums[1]!]);
  }
  if (points.length > MAX_POINTS) return { ok: false, error: `Up to ${MAX_POINTS} points. Remove a line.` };
  return { ok: true, points };
}

function trim2(v: number): string {
  return String(Math.round(v * 100) / 100);
}

export function formatPoints(pts: readonly (readonly [number, number])[]): string {
  return pts.map(([x, y]) => `${trim2(x)}, ${trim2(y)}`).join('\n');
}

/** Writes the points into vars (n, x0, y0 ...) and drops any stale higher slots. */
export function setPoints(s: SimState, pts: readonly (readonly [number, number])[]): void {
  for (let i = 0; i < MAX_POINTS; i++) {
    delete s.vars[`x${i}`];
    delete s.vars[`y${i}`];
  }
  pts.forEach(([x, y], i) => {
    s.vars[`x${i}`] = x;
    s.vars[`y${i}`] = y;
  });
  s.vars.n = pts.length;
  s.vars.grab = -1;
}

function clampWorld(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.min(WORLD, Math.max(0, v));
}

/** Canvas y grows downward; world y grows upward. Both map 0..1 onto 0..WORLD. */
export function worldFromPointer(x: number, y: number): [number, number] {
  const nx = Number.isFinite(x) ? x : 0;
  const ny = Number.isFinite(y) ? y : 0;
  return [clampWorld(nx * WORLD), clampWorld((1 - ny) * WORLD)];
}

function nearestPoint(pts: readonly [number, number][], wx: number, wy: number): number {
  let best = -1;
  let bestD = HIT_RADIUS;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - wx, pts[i][1] - wy);
    if (d <= HIT_RADIUS && (best < 0 || d < bestD)) {
      best = i;
      bestD = d;
    }
  }
  return best;
}

const linearRegression: SimulationDef = {
  id: 'linear-regression',
  aspect: 1,
  paramBehavior: 'restart',
  params: [
    { id: 'example', label: 'Example', unit: '', min: 0, max: 2, step: 1, default: 0, decimals: 0 },
  ],
  presets: [
    { id: 'line', label: 'Line', values: { example: 0 } },
    { id: 'perfect', label: 'Perfect', values: { example: 1 } },
    { id: 'outlier', label: 'Outlier', values: { example: 2 } },
  ],
  init(params) {
    const vars: Record<string, number> = { n: 0, grab: -1 };
    for (let i = 0; i < MAX_POINTS; i++) {
      vars[`x${i}`] = 0;
      vars[`y${i}`] = 0;
    }
    const pts = EXAMPLES[exampleId(params)];
    vars.n = pts.length;
    pts.forEach(([x, y], i) => {
      vars[`x${i}`] = x;
      vars[`y${i}`] = y;
    });
    return vars;
  },
  step(s, dt) {
    s.t += dt;
  },
  measurements: [
    { id: 'n', label: 'Points', unit: '', decimals: 0, compute: (s) => pointCount(s) },
    { id: 'slope', label: 'Slope', unit: '', decimals: 2, compute: (s) => definedFit(s, 'slope') },
    { id: 'intercept', label: 'Intercept', unit: '', decimals: 2, compute: (s) => definedFit(s, 'intercept') },
    { id: 'r2', label: 'R²', unit: '', decimals: 3, compute: (s) => definedFit(s, 'r2') },
    { id: 'maxResidual', label: 'Max residual', unit: '', decimals: 2, compute: (s) => (fitOf(s).vertical ? Number.NaN : fitOf(s).maxResidual) },
  ],
  formula: {
    expression: 'y = mx + b',
    terms: [
      { symbol: 'm', label: 'Slope', measurementId: 'slope' },
      { symbol: 'b', label: 'Intercept', measurementId: 'intercept' },
    ],
  },
  observations: [
    (s) => (pointCount(s) < 2 ? 'Two points are required before a line can be fit.' : null),
    (s) =>
      pointCount(s) === 2 && !fitOf(s).vertical
        ? 'Two points always give R² = 1, so a third point is what tests the fit.'
        : null,
    (s) => verticalMessage(s),
    outlierObservation,
    steadyObservation,
  ],
  pointer: {
    hint: 'Tap to add a point. Drag a point to move it.',
    handle(s, ev) {
      if (ev.type === 'up' || ev.type === 'tap') {
        s.vars.grab = -1;
        return null;
      }
      const [wx, wy] = worldFromPointer(ev.x, ev.y);
      if (ev.type === 'move') {
        const i = s.vars.grab;
        if (i >= 0 && i < pointCount(s)) {
          s.vars[`x${i}`] = wx;
          s.vars[`y${i}`] = wy;
        }
        return null;
      }
      if (ev.type !== 'down') return null;
      const pts = pointsOf(s);
      const hit = nearestPoint(pts, wx, wy);
      if (hit >= 0) {
        s.vars.grab = hit;
      } else if (pts.length < MAX_POINTS) {
        const i = pts.length;
        s.vars[`x${i}`] = wx;
        s.vars[`y${i}`] = wy;
        s.vars.n = i + 1;
        s.vars.grab = i;
      } else {
        s.vars.grab = -1;
      }
      return null;
    },
  },
  pointsEditor: {
    label: 'Points, one x, y per line',
    help: `Up to ${MAX_POINTS} points, each value from 0 to ${WORLD}. Edit a line to move a point, add a line to add one, delete a line to remove it.`,
    format: (s) => formatPoints(pointsOf(s)),
    apply(s, text) {
      const parsed = parsePoints(text);
      if (!parsed.ok) return parsed.error;
      setPoints(s, parsed.points);
      return null;
    },
  },
  explanation(s) {
    const n = pointCount(s);
    const fit = fitOf(s);
    const vertical = verticalMessage(s);
    if (vertical) return `The fit uses n = ${n}. ${vertical}`;
    return `The fit uses n = ${n}. Its equation is ${formatEquation(fit.slope, fit.intercept)}, and R² is ${fit.r2.toFixed(3)}.`;
  },
  draw: drawLinearRegression,
};

export default linearRegression;
