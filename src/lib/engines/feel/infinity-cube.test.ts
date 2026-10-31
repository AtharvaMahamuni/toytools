import { describe, expect, it } from 'vitest';

import {
  FOLD_DEGREES,
  HINGE_COUNT,
  START,
  closedState,
  countLabel,
  cubesOverlap,
  drawModel,
  gridCells,
  legalHinge,
  requestFold,
  stepAngle,
  type Cell,
} from './infinity-cube';

function key(cells: Cell[]): string {
  return cells
    .map((c) => c.join(','))
    .sort()
    .join('|');
}

describe('infinity cube hinges', () => {
  it('names the next legal hinge and ignores a pointer on any other', () => {
    const closed = closedState();
    expect(legalHinge(closed)).toBe(0);
    expect(requestFold(closed, 1, false)).toBe(closed);
    expect(requestFold(closed, 3, true)).toBe(closed);
    const open = requestFold(closed, 0, true);
    expect(legalHinge(open)).toBe(1);
    expect(requestFold(open, 0, false)).toBe(open);
  });

  it('steps the angle and completes one quarter turn', () => {
    let state = requestFold(closedState(), 0, false);
    expect(state.folding).toBe(true);
    expect(state.folds).toBe(0);
    expect(state.angle).toBe(0);
    state = stepAngle(state, 30);
    expect(state.angle).toBeCloseTo(30);
    expect(state.folds).toBe(0);
    expect(countLabel(state)).toBe('Folding · 0 folds');
    const done = stepAngle(state, 70);
    expect(done.hinge).toBe(1);
    expect(done.angle).toBe(0);
    expect(done.folding).toBe(false);
    expect(done.folds).toBe(1);
    expect(countLabel(done)).toBe('Open · 1 fold');
    expect(stepAngle(done, 15)).toBe(done);
  });

  it('treats a second input during a fold as a no-op', () => {
    const started = requestFold(closedState(), 0, false);
    const mid = stepAngle(started, 20);
    expect(requestFold(mid, 0, false)).toBe(mid);
    expect(requestFold(mid, 0, true)).toBe(mid);
    expect(mid.folds).toBe(0);
    const done = stepAngle(mid, FOLD_DEGREES);
    expect(done.folds).toBe(1);
  });

  it('jumps to the end pose when motion is reduced', () => {
    const end = requestFold(closedState(), 0, true);
    expect(end.folding).toBe(false);
    expect(end.hinge).toBe(1);
    expect(end.angle).toBe(0);
    expect(end.folds).toBe(1);
    expect(key(gridCells(end.hinge, end.angle))).toBe(key(gridCells(0, FOLD_DEGREES)));
  });

  it('keeps every cube out of every other cube, and closes the chain', () => {
    for (let h = 0; h < HINGE_COUNT; h++) {
      for (let a = 0; a <= FOLD_DEGREES; a += 1) {
        expect(cubesOverlap(h, a), `hinge ${h} at ${a}°`).toBe(false);
      }
      expect(new Set(gridCells(h, 0).map((c) => c.join(','))).size).toBe(8);
      expect(new Set(gridCells(h, FOLD_DEGREES).map((c) => c.join(','))).size).toBe(8);
    }
    expect(key(gridCells(0, 0))).toBe(key([...START]));
    expect(key(gridCells(4, FOLD_DEGREES))).toBe(key([...START]));
    expect(gridCells(4, FOLD_DEGREES)[0]).not.toEqual(START[0]);
  });

  it('follows the recorded quarter turns back to the same cells', () => {
    expect(gridCells(0, FOLD_DEGREES)).toEqual([
      [0, 0, 0],
      [2, 2, 0],
      [0, 1, 0],
      [1, 2, 0],
      [0, 0, 1],
      [2, 2, 1],
      [0, 1, 1],
      [1, 2, 1],
    ]);
    expect(gridCells(1, FOLD_DEGREES)[0]).toEqual([0, 1, 0]);
    expect(gridCells(1, FOLD_DEGREES)[2]).toEqual([-1, 1, 0]);
    expect(gridCells(2, FOLD_DEGREES)[4]).toEqual([0, 0, 0]);
    expect(gridCells(2, FOLD_DEGREES)[6]).toEqual([0, 0, 1]);
    expect(gridCells(3, FOLD_DEGREES)[0]).toEqual([0, 1, 1]);
    expect(gridCells(3, FOLD_DEGREES)[2]).toEqual([0, 1, 0]);
  });

  it('returns to a closed cube after one pass of the hinge chain', () => {
    let state = closedState();
    for (let i = 0; i < HINGE_COUNT; i++) state = requestFold(state, legalHinge(state), true);
    expect(state.hinge).toBe(0);
    expect(state.angle).toBe(0);
    expect(state.folds).toBe(HINGE_COUNT);
    expect(countLabel(state)).toBe('Closed · 5 folds');
    expect(countLabel(closedState())).toBe('Closed · 0 folds');
  });

  it('marks only the free half, and keeps one view box', () => {
    const closed = drawModel(0, 0);
    const free = new Set(closed.faces.filter((f) => f.free).map((f) => f.cube));
    expect([...free].sort((a, b) => a - b)).toEqual([1, 3, 5, 7]);
    // Three outer faces of the 2×2×2, four blocks each. The back corner is covered.
    expect(closed.faces).toHaveLength(12);
    expect(closed.faces.filter((f) => f.cube === 0)).toHaveLength(0);
    expect(closed.faces.filter((f) => f.cube === 7)).toHaveLength(3);
    expect(closed.cue).not.toBeNull();
    const moving = closed.faces.filter((f) => f.free);
    const still = closed.faces.filter((f) => !f.free);
    const near = (faces: typeof closed.faces) => {
      let x = 0;
      let y = 0;
      let n = 0;
      for (const face of faces) {
        for (const pair of face.points.split(' ')) {
          const [px, py] = pair.split(',').map(Number);
          x += px!;
          y += py!;
          n += 1;
        }
      }
      return Math.hypot(closed.cue!.x - x / n, closed.cue!.y - y / n);
    };
    expect(near(moving)).toBeLessThan(0.05);
    expect(near(moving)).toBeLessThan(near(still));
    expect(drawModel(1, 0).faces.length).toBeGreaterThan(12);
    const edgeOn = drawModel(0, 45).faces.map((f) => f.points);
    expect(edgeOn.length).toBeGreaterThan(8);
    for (const points of edgeOn) {
      const pts = points.split(' ').map((pair) => pair.split(',').map(Number) as [number, number]);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const [x, y] of pts) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      expect(Math.hypot(maxX - minX, maxY - minY)).toBeGreaterThan(0.5);
    }
    expect(drawModel(2, 40).viewBox).toBe(closed.viewBox);
    const mid = drawModel(0, 40);
    expect(mid.faces.length).toBeGreaterThan(8);
    expect(new Set(mid.faces.filter((f) => f.free).map((f) => f.cube))).toEqual(free);
  });
});
