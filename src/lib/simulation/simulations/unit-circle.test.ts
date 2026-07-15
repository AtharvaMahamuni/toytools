// Numeric assertions for the Unit Circle Explorer model. Contract/narrative sweeps in
// contract.test.ts and narrative-coverage.test.ts cover totality; this file pins the trig values,
// wrapping, pointer mapping, and the tan clamp.

import { describe, expect, it } from 'vitest';
import type { SimState } from '../types';
import unitCircle, {
  angleDegrees,
  cosTheta,
  initUnitCircle,
  nearSpecialAngle,
  pointerAngle,
  quadrant,
  sinTheta,
  stepUnitCircle,
  tanTheta,
  wrapAngle,
  CIRCLE_CX,
  CIRCLE_CY,
  TAN_CLAMP,
} from './unit-circle';

function stateAt(angleDeg: number, speed = 0): SimState {
  const params = { angle: angleDeg, speed };
  return { t: 0, params, vars: initUnitCircle(params) };
}

describe('unit-circle model', () => {
  it('wraps angles into [0, 2π)', () => {
    expect(wrapAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2, 12);
    expect(wrapAngle(5 * Math.PI)).toBeCloseTo(Math.PI, 12);
    expect(wrapAngle(0)).toBe(0);
  });

  it('init converts the angle param from degrees to radians', () => {
    expect(stateAt(45).vars.theta).toBeCloseTo(Math.PI / 4, 12);
    expect(stateAt(360).vars.theta).toBeCloseTo(0, 12);
  });

  it('step advances θ by the rotation speed and wraps past a full turn', () => {
    const s = stateAt(350, 90); // 90°/s
    stepUnitCircle(s, 1);
    expect(angleDegrees(s)).toBeCloseTo(80, 9);
    expect(s.t).toBeCloseTo(1);
  });

  it('step freezes θ (but not time) while the point is held', () => {
    const s = stateAt(45, 90);
    s.vars.holding = 1;
    stepUnitCircle(s, 1);
    expect(angleDegrees(s)).toBeCloseTo(45, 9);
    expect(s.t).toBeCloseTo(1);
  });

  it('produces the exact special-angle values', () => {
    expect(sinTheta(stateAt(30))).toBeCloseTo(0.5, 9);
    expect(cosTheta(stateAt(30))).toBeCloseTo(Math.sqrt(3) / 2, 9);
    expect(sinTheta(stateAt(45))).toBeCloseTo(Math.SQRT2 / 2, 9);
    expect(cosTheta(stateAt(45))).toBeCloseTo(Math.SQRT2 / 2, 9);
    expect(sinTheta(stateAt(90))).toBeCloseTo(1, 9);
    expect(cosTheta(stateAt(90))).toBeCloseTo(0, 9);
    expect(tanTheta(stateAt(45))).toBeCloseTo(1, 9);
  });

  it('keeps tan θ finite and clamped at the 90° and 270° asymptotes', () => {
    for (const deg of [90, 270, 89.999, 90.001]) {
      const v = tanTheta(stateAt(deg));
      expect(Number.isFinite(v)).toBe(true);
      expect(Math.abs(v)).toBeLessThanOrEqual(TAN_CLAMP);
    }
  });

  it('satisfies the Pythagorean identity everywhere', () => {
    for (let deg = 0; deg < 360; deg += 7) {
      const s = stateAt(deg);
      expect(sinTheta(s) ** 2 + cosTheta(s) ** 2).toBeCloseTo(1, 12);
    }
  });

  it('assigns quadrants with axis angles opening the next quadrant', () => {
    expect(quadrant(0)).toBe(1);
    expect(quadrant(89.9)).toBe(1);
    expect(quadrant(90)).toBe(2);
    expect(quadrant(180)).toBe(3);
    expect(quadrant(270)).toBe(4);
    expect(quadrant(359.9)).toBe(4);
  });

  it('maps pointer positions to angles with aspect correction', () => {
    expect(pointerAngle(CIRCLE_CX + 0.15, CIRCLE_CY)).toBeCloseTo(0, 9);
    expect(pointerAngle(CIRCLE_CX, CIRCLE_CY - 0.2)).toBeCloseTo(Math.PI / 2, 9);
    expect(pointerAngle(CIRCLE_CX - 0.15, CIRCLE_CY)).toBeCloseTo(Math.PI, 9);
    expect(pointerAngle(CIRCLE_CX, CIRCLE_CY + 0.2)).toBeCloseTo((3 * Math.PI) / 2, 9);
  });

  it('ignores pointers in the wave panel or at the circle centre', () => {
    expect(pointerAngle(0.8, 0.5)).toBeNull();
    expect(pointerAngle(CIRCLE_CX, CIRCLE_CY)).toBeNull();
  });

  it('drag sets θ, syncs the angle slider in range, and releases on up', () => {
    const s = stateAt(45, 15);
    const patch = unitCircle.pointer!.handle(s, { type: 'move', x: CIRCLE_CX, y: CIRCLE_CY - 0.2, t: 0 });
    expect(s.vars.holding).toBe(1);
    expect(angleDegrees(s)).toBeCloseTo(90, 6);
    expect(patch).toEqual({ angle: 90 });

    const up = unitCircle.pointer!.handle(s, { type: 'up', x: CIRCLE_CX, y: CIRCLE_CY - 0.2, t: 0 });
    expect(up).toBeNull();
    expect(s.vars.holding).toBe(0);

    expect(unitCircle.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toBeNull();
  });

  it('recognises special angles within tolerance', () => {
    expect(nearSpecialAngle(44.9)).toBe(45);
    expect(nearSpecialAngle(46.6)).toBeNull();
    expect(nearSpecialAngle(359)).toBe(0);
  });

  it('explains the current state with quadrant and identity', () => {
    const text = unitCircle.explanation(stateAt(135));
    expect(text).toContain('quadrant II');
    expect(text).toContain('Pythagorean identity');
  });
});
