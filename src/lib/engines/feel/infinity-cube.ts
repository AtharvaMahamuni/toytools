// Infinity-cube hinge chain. Eight unit cubes, five quarter-turns, back to one cube.
// Pose is always rebuilt from the closed packing, so a cycle cannot drift into a clip.

export const HINGE_COUNT = 5;
export const FOLD_DEGREES = 90;
export const FOLD_MS = 480;

export type Cell = [number, number, number];
export type Axis = 0 | 1 | 2;

export interface FoldSpec {
  movers: readonly number[];
  axis: Axis;
  pivot: Cell;
  dir: 1 | -1;
}

export interface CubeState {
  hinge: number;
  angle: number;
  folding: boolean;
  folds: number;
}

export const START: readonly Cell[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
];

/** World-space hinges. Pivots stay on the closed packing, not on permuted labels. */
export const FOLDS: readonly FoldSpec[] = [
  { movers: [1, 3, 5, 7], axis: 2, pivot: [1, 2, 0], dir: 1 },
  { movers: [0, 2], axis: 2, pivot: [0, 1, 0], dir: 1 },
  { movers: [4, 6], axis: 0, pivot: [0, 1, 1], dir: 1 },
  { movers: [0, 2], axis: 1, pivot: [0, 1, 1], dir: -1 },
  { movers: [1, 3, 5, 7], axis: 2, pivot: [1, 2, 0], dir: -1 },
];

const CORNERS: readonly Cell[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
];

const FACES: readonly { normal: Cell; corners: readonly Cell[] }[] = [
  { normal: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]] },
  { normal: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]] },
  { normal: [0, 1, 0], corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]] },
  { normal: [0, -1, 0], corners: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 0, 0]] },
  { normal: [0, 0, 1], corners: [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1]] },
  { normal: [0, 0, -1], corners: [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 0]] },
];

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);
const VIEW: Cell = [1, 1, 1];
const INSET = 0.9;
const SWEEP_EPS = 0.06;

export type FaceTone = 'light' | 'mid' | 'dark';

export interface DrawFace {
  cube: number;
  free: boolean;
  tone: FaceTone;
  points: string;
  depth: number;
}

export interface DrawModel {
  viewBox: string;
  faces: DrawFace[];
  free: number[];
}

function normHinge(hinge: number): number {
  if (!Number.isFinite(hinge)) return 0;
  return ((Math.floor(hinge) % HINGE_COUNT) + HINGE_COUNT) % HINGE_COUNT;
}

function clampAngle(angle: number): number {
  if (!Number.isFinite(angle)) return 0;
  return Math.min(FOLD_DEGREES, Math.max(0, angle));
}

function rotExact(p: Cell, axis: Axis, pivot: Cell, dir: 1 | -1): Cell {
  const q: Cell = [p[0] - pivot[0], p[1] - pivot[1], p[2] - pivot[2]];
  const i = ((axis + 1) % 3) as Axis;
  const j = ((axis + 2) % 3) as Axis;
  const si = q[i];
  const sj = q[j];
  if (dir > 0) {
    q[i] = -sj;
    q[j] = si;
  } else {
    q[i] = sj;
    q[j] = -si;
  }
  return [q[0] + pivot[0], q[1] + pivot[1], q[2] + pivot[2]];
}

function rotPartial(p: Cell, axis: Axis, pivot: Cell, dir: 1 | -1, deg: number): Cell {
  const rad = (dir * deg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const q: Cell = [p[0] - pivot[0], p[1] - pivot[1], p[2] - pivot[2]];
  const i = ((axis + 1) % 3) as Axis;
  const j = ((axis + 2) % 3) as Axis;
  const si = q[i];
  const sj = q[j];
  q[i] = si * c - sj * s;
  q[j] = si * s + sj * c;
  return [q[0] + pivot[0], q[1] + pivot[1], q[2] + pivot[2]];
}

function spin(p: Cell, fold: FoldSpec, angle: number): Cell {
  if (angle >= FOLD_DEGREES - 1e-6) return rotExact(p, fold.axis, fold.pivot, fold.dir);
  if (angle <= 1e-6) return p;
  return rotPartial(p, fold.axis, fold.pivot, fold.dir, angle);
}

function worldCorner(cube: number, local: Cell, hinge: number, angle: number): Cell {
  return worldSpin(cube, local, hinge, angle, false);
}

/** Face normals rotate with the cube and stay direction vectors (no pivot translation). */
function worldVector(cube: number, local: Cell, hinge: number, angle: number): Cell {
  return worldSpin(cube, local, hinge, angle, true);
}

function worldSpin(cube: number, local: Cell, hinge: number, angle: number, direction: boolean): Cell {
  const h = normHinge(hinge);
  const a = clampAngle(angle);
  const origin: Cell = [0, 0, 0];
  let q = local;
  for (let i = 0; i < h; i++) {
    const fold = FOLDS[i]!;
    if (!fold.movers.includes(cube)) continue;
    const pivot = direction ? origin : fold.pivot;
    q = rotExact(q, fold.axis, pivot, fold.dir);
  }
  const active = FOLDS[h]!;
  if (a > 0 && active.movers.includes(cube)) {
    const pivot = direction ? origin : active.pivot;
    q = spin(q, { ...active, pivot }, a);
  }
  return q;
}

function originOf(cube: number, hinge: number, angle: number): Cell {
  const min: Cell = [Infinity, Infinity, Infinity];
  const base = START[cube]!;
  for (const d of CORNERS) {
    const p = worldCorner(cube, [base[0] + d[0], base[1] + d[1], base[2] + d[2]], hinge, angle);
    for (let k = 0; k < 3; k++) min[k] = Math.min(min[k]!, p[k]!);
  }
  return [Math.round(min[0]!), Math.round(min[1]!), Math.round(min[2]!)];
}

/** Grid cells after `hinge` completed folds, plus this hinge at 0 or 90. */
export function gridCells(hinge: number, angle: number): Cell[] {
  const a = clampAngle(angle) >= FOLD_DEGREES ? FOLD_DEGREES : 0;
  return START.map((_, cube) => originOf(cube, hinge, a));
}

function cellKey(c: Cell): string {
  return `${c[0]},${c[1]},${c[2]}`;
}

function samples(cell: Cell): Cell[] {
  const pts: Cell[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        pts.push([
          cell[0] + (i + 0.5) / 3,
          cell[1] + (j + 0.5) / 3,
          cell[2] + (k + 0.5) / 3,
        ]);
      }
    }
  }
  return pts;
}

function inside(p: Cell, cell: Cell): boolean {
  return (
    p[0] > cell[0] + SWEEP_EPS &&
    p[0] < cell[0] + 1 - SWEEP_EPS &&
    p[1] > cell[1] + SWEEP_EPS &&
    p[1] < cell[1] + 1 - SWEEP_EPS &&
    p[2] > cell[2] + SWEEP_EPS &&
    p[2] < cell[2] + 1 - SWEEP_EPS
  );
}

/** True when any cube interior meets another during this hinge at `angle`. */
export function cubesOverlap(hinge: number, angle: number): boolean {
  const h = normHinge(hinge);
  const a = clampAngle(angle);
  const base = gridCells(h, 0);
  if (new Set(base.map(cellKey)).size !== START.length) return true;
  if (a <= 0) return false;
  if (a >= FOLD_DEGREES) return new Set(gridCells(h, FOLD_DEGREES).map(cellKey)).size !== START.length;
  const fold = FOLDS[h]!;
  const moving = new Set(fold.movers);
  const still = base.filter((_, i) => !moving.has(i));
  for (const id of fold.movers) {
    for (const p0 of samples(base[id]!)) {
      const p = rotPartial(p0, fold.axis, fold.pivot, fold.dir, a);
      for (const s of still) if (inside(p, s)) return true;
    }
  }
  return false;
}

export function closedState(): CubeState {
  return { hinge: 0, angle: 0, folding: false, folds: 0 };
}

export function legalHinge(state: CubeState): number {
  return normHinge(state.hinge);
}

export function isClosed(state: CubeState): boolean {
  return !state.folding && state.angle === 0 && legalHinge(state) === 0;
}

function finish(state: CubeState): CubeState {
  return {
    hinge: (legalHinge(state) + 1) % HINGE_COUNT,
    angle: 0,
    folding: false,
    folds: state.folds + 1,
  };
}

/**
 * Start the legal hinge. A second call while `folding` is the same state.
 * `reduced` jumps to the end pose instead of arming the swing.
 */
export function requestFold(state: CubeState, hinge: number, reduced = false): CubeState {
  if (state.folding) return state;
  if (state.angle !== 0) return state;
  if (!Number.isInteger(hinge) || hinge !== legalHinge(state)) return state;
  if (reduced) return finish(state);
  return { ...state, folding: true, angle: 0 };
}

/** Advance the active fold. Reaching 90 degrees hands the chain to the next hinge. */
export function stepAngle(state: CubeState, delta: number): CubeState {
  if (!state.folding) return state;
  if (!Number.isFinite(delta) || delta <= 0) return state;
  if (state.angle + delta >= FOLD_DEGREES - 1e-9) return finish(state);
  return { ...state, angle: state.angle + delta };
}

export function countLabel(state: CubeState): string {
  const n = state.folds;
  const noun = n === 1 ? 'fold' : 'folds';
  const phase = state.folding ? 'Folding' : isClosed(state) ? 'Closed' : 'Open';
  return `${phase} · ${n} ${noun}`;
}

export function project(x: number, y: number, z: number): [number, number] {
  return [(x - z) * COS30, -(y + (x + z) * SIN30)];
}

function toneOf(normal: Cell): FaceTone {
  const ax = Math.abs(normal[0]);
  const ay = Math.abs(normal[1]);
  const az = Math.abs(normal[2]);
  if (ay >= ax && ay >= az) return 'light';
  if (ax >= az) return 'mid';
  return 'dark';
}

function add(a: Cell, b: Cell): Cell {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

let cachedViewBox: string | null = null;

function viewBox(): string {
  if (cachedViewBox) return cachedViewBox;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let h = 0; h < HINGE_COUNT; h++) {
    for (let a = 0; a <= FOLD_DEGREES; a += 5) {
      for (let cube = 0; cube < START.length; cube++) {
        const base = START[cube]!;
        for (const d of CORNERS) {
          const p = worldCorner(cube, add(base, d), h, a);
          const [x, y] = project(p[0], p[1], p[2]);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
  }
  const pad = 0.55;
  const x = minX - pad;
  const y = minY - pad;
  const w = maxX - minX + pad * 2;
  const h = maxY - minY + pad * 2;
  cachedViewBox = `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`;
  return cachedViewBox;
}

export function drawModel(hinge: number, angle: number): DrawModel {
  const h = normHinge(hinge);
  const a = clampAngle(angle);
  const movers = FOLDS[h]!.movers;
  const free = new Set(movers);
  const faces: DrawFace[] = [];
  for (let cube = 0; cube < START.length; cube++) {
    const base = START[cube]!;
    const center = worldCorner(cube, add(base, [0.5, 0.5, 0.5]), h, a);
    for (const face of FACES) {
      const normal = worldVector(cube, face.normal, h, a);
      const dot = normal[0] * VIEW[0] + normal[1] * VIEW[1] + normal[2] * VIEW[2];
      if (dot <= 0.04) continue;
      const pts = face.corners.map((d) => {
        const world = worldCorner(cube, add(base, d), h, a);
        const inset: Cell = [
          center[0] + (world[0] - center[0]) * INSET,
          center[1] + (world[1] - center[1]) * INSET,
          center[2] + (world[2] - center[2]) * INSET,
        ];
        return project(inset[0], inset[1], inset[2]);
      });
      const depth =
        face.corners.reduce((sum, d) => {
          const p = worldCorner(cube, add(base, d), h, a);
          return sum + p[0] + p[1] + p[2];
        }, 0) / face.corners.length;
      faces.push({
        cube,
        free: free.has(cube),
        tone: toneOf(normal),
        depth,
        points: pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '),
      });
    }
  }
  faces.sort((p, q) => p.depth - q.depth || p.cube - q.cube);
  return { viewBox: viewBox(), faces, free: [...movers] };
}

export const infinityCubeApi = {
  HINGE_COUNT,
  FOLD_DEGREES,
  FOLD_MS,
  closedState,
  legalHinge,
  isClosed,
  requestFold,
  stepAngle,
  gridCells,
  cubesOverlap,
  countLabel,
  drawModel,
  project,
};
