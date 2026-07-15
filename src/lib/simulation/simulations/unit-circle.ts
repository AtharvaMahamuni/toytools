// Unit Circle Explorer — the first Applied Math simulation. The state is a single angle θ on the
// unit circle; the point can auto-rotate (speed in °/s) or be dragged directly. Measurements are
// the live trig values; the graph traces sin θ and cos θ against time. tan θ is clamped so every
// measurement stays finite at 90° / 270° (the narrative panel explains the blow-up instead).
// Pure model + config; all canvas work lives in unit-circle.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { streamGraph } from '../graphs';
import { drawUnitCircle } from './unit-circle.draw';

const TWO_PI = Math.PI * 2;
const DEG = Math.PI / 180;

/** Where tan θ readouts stop: past this magnitude the value is effectively "undefined". */
export const TAN_CLAMP = 99.99;

// Circle geometry shared by the draw file and the pointer handler (normalized canvas units).
export const CIRCLE_CX = 0.28;
export const CIRCLE_CY = 0.52;
export const ASPECT = 16 / 9;

/** Wrap any angle in radians into [0, 2π). */
export function wrapAngle(rad: number): number {
  const r = rad % TWO_PI;
  return r < 0 ? r + TWO_PI : r;
}

export function initUnitCircle(params: Record<string, number>): Record<string, number> {
  return { theta: wrapAngle(params.angle * DEG), holding: 0 };
}

export function stepUnitCircle(s: SimState, dt: number): void {
  if (s.vars.holding !== 1) {
    s.vars.theta = wrapAngle(s.vars.theta + s.params.speed * DEG * dt);
  }
  s.t += dt;
}

/** Current angle in degrees, [0, 360). */
export function angleDegrees(s: SimState): number {
  return wrapAngle(s.vars.theta) / DEG;
}

export function sinTheta(s: SimState): number {
  return Math.sin(s.vars.theta);
}

export function cosTheta(s: SimState): number {
  return Math.cos(s.vars.theta);
}

/** tan θ clamped to ±TAN_CLAMP so the measurement stays finite at 90° and 270°. */
export function tanTheta(s: SimState): number {
  return Math.max(-TAN_CLAMP, Math.min(TAN_CLAMP, Math.tan(s.vars.theta)));
}

/** Quadrant 1-4 for an angle in degrees (axis angles count toward the quadrant they open). */
export function quadrant(deg: number): 1 | 2 | 3 | 4 {
  const d = ((deg % 360) + 360) % 360;
  if (d < 90) return 1;
  if (d < 180) return 2;
  if (d < 270) return 3;
  return 4;
}

/**
 * Angle (radians, [0, 2π)) for a pointer at normalized canvas coords, or null when the pointer is
 * outside the circle zone. Normalized coords are aspect-distorted, so dx is rescaled by ASPECT to
 * make both axes physical before atan2.
 */
export function pointerAngle(x: number, y: number): number | null {
  if (x > 0.58) return null; // right half belongs to the sine-wave panel
  const dx = (x - CIRCLE_CX) * ASPECT;
  const dy = CIRCLE_CY - y;
  if (Math.hypot(dx, dy) < 0.02) return null; // too close to the centre to define an angle
  return wrapAngle(Math.atan2(dy, dx));
}

/** Nearest "special" angle (deg) within tolerance, or null. */
export function nearSpecialAngle(deg: number, tolerance = 1.5): number | null {
  const specials = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];
  for (const sp of specials) {
    if (Math.abs(deg - sp) <= tolerance) return sp % 360;
  }
  return null;
}

const SPECIAL_VALUES: Record<number, string> = {
  0: 'At 0° the point sits on the positive x-axis: cos θ = 1 and sin θ = 0.',
  30: 'At 30°, sin θ = 1/2 exactly and cos θ = √3/2 ≈ 0.866. This is one of the three angles worth memorizing.',
  45: 'At 45° the triangle legs are equal: sin θ and cos θ are both √2/2 ≈ 0.707, so tan θ = 1.',
  60: 'At 60° the values of 30° swap: sin θ = √3/2 ≈ 0.866 and cos θ = 1/2.',
  90: 'At 90° the point is on the positive y-axis: sin θ = 1, cos θ = 0, and tan θ = sin/cos is undefined.',
  120: '120° is 60° past the y-axis: sin θ = √3/2 still, but cos θ has flipped to -1/2.',
  135: '135° mirrors 45° into quadrant II: sin θ = √2/2 but cos θ = -√2/2, so tan θ = -1.',
  150: '150° mirrors 30°: sin θ = 1/2, cos θ = -√3/2. The reference angle is 30°.',
  180: 'At 180° the point is on the negative x-axis: cos θ = -1 and sin θ = 0.',
  210: '210° is 30° into quadrant III: both legs flip negative, sin θ = -1/2 and cos θ = -√3/2.',
  225: '225° mirrors 45° into quadrant III: sin θ and cos θ are both -√2/2, so tan θ = 1 again.',
  240: '240° mirrors 60°: sin θ = -√3/2 and cos θ = -1/2.',
  270: 'At 270° the point is on the negative y-axis: sin θ = -1, cos θ = 0, and tan θ is undefined.',
  300: '300° mirrors 60° into quadrant IV: sin θ = -√3/2 but cos θ = 1/2.',
  315: '315° mirrors 45°: sin θ = -√2/2, cos θ = √2/2, tan θ = -1.',
  330: '330° mirrors 30°: sin θ = -1/2, cos θ = √3/2.',
};

const QUADRANT_SIGNS: Record<1 | 2 | 3 | 4, string> = {
  1: 'In quadrant I (0° to 90°) both legs point positive: sin θ and cos θ are both positive.',
  2: 'In quadrant II (90° to 180°) the point is left of the y-axis: sin θ stays positive while cos θ turns negative.',
  3: 'In quadrant III (180° to 270°) both coordinates are negative, which makes tan θ positive again.',
  4: 'In quadrant IV (270° to 360°) cos θ is back to positive while sin θ stays negative.',
};

const unitCircleSim: SimulationDef = {
  id: 'unit-circle',
  aspect: ASPECT,
  paramBehavior: 'restart',
  params: [
    { id: 'angle', label: 'Angle θ', unit: '°', min: 0, max: 360, step: 1, default: 45, decimals: 0 },
    { id: 'speed', label: 'Rotation speed', unit: '°/s', min: 0, max: 90, step: 5, default: 15, decimals: 0 },
  ],
  presets: [
    { id: 'deg-30', label: '30°', values: { angle: 30, speed: 0 } },
    { id: 'deg-45', label: '45°', values: { angle: 45, speed: 0 } },
    { id: 'deg-60', label: '60°', values: { angle: 60, speed: 0 } },
    { id: 'deg-90', label: '90°', values: { angle: 90, speed: 0 } },
    { id: 'tour', label: 'Slow tour', values: { angle: 0, speed: 15 } },
  ],
  init: initUnitCircle,
  step: stepUnitCircle,
  measurements: [
    { id: 'angleDeg', label: 'Angle θ', unit: '°', decimals: 0, compute: angleDegrees },
    { id: 'radians', label: 'Radians', unit: 'rad', decimals: 3, compute: (s) => wrapAngle(s.vars.theta) },
    { id: 'sin', label: 'sin θ', unit: '', decimals: 3, compute: sinTheta },
    { id: 'cos', label: 'cos θ', unit: '', decimals: 3, compute: cosTheta },
    { id: 'tan', label: 'tan θ', unit: '', decimals: 2, compute: tanTheta },
  ],
  formula: {
    expression: '(x, y) = (cos θ, sin θ)',
    terms: [
      { symbol: 'θ', label: 'Angle', measurementId: 'angleDeg' },
      { symbol: 'x', label: 'cos θ', measurementId: 'cos' },
      { symbol: 'y', label: 'sin θ', measurementId: 'sin' },
    ],
  },
  graph: streamGraph({
    yLabel: 'Value',
    window: 12,
    yRange: () => [-1.15, 1.15],
    series: [
      { id: 'sin', label: 'sin θ', color: 'accent', sample: (s) => sinTheta(s) },
      { id: 'cos', label: 'cos θ', color: 'danger', sample: (s) => cosTheta(s) },
    ],
  }),
  observations: [
    (s) => {
      const sp = nearSpecialAngle(angleDegrees(s));
      return sp === null ? null : SPECIAL_VALUES[sp] ?? null;
    },
    (s) => {
      const c = Math.abs(cosTheta(s));
      return c < 0.06
        ? 'cos θ is passing through 0 here, so tan θ = sin θ / cos θ grows without bound: the tangent has a vertical asymptote at 90° and 270°.'
        : null;
    },
    (s) => (nearSpecialAngle(angleDegrees(s)) === null ? QUADRANT_SIGNS[quadrant(angleDegrees(s))] : null),
    (s) =>
      s.params.speed > 0
        ? 'Watch the graph: a point moving around the circle at a steady speed traces a perfect sine wave. That is where the sine curve comes from.'
        : null,
  ],
  pointer: {
    hint: 'Drag the point around the circle',
    handle(s, ev) {
      if (ev.type === 'tap') return null;
      if (ev.type === 'up') {
        s.vars.holding = 0;
        return null;
      }
      const rad = pointerAngle(ev.x, ev.y);
      if (rad === null) return null;
      s.vars.theta = rad;
      s.vars.holding = 1;
      // Sync the angle slider to the dragged position (boot never restarts from pointer patches).
      return { angle: Math.min(360, Math.max(0, Math.round(rad / DEG))) };
    },
    isHolding: (s) => s.vars.holding === 1,
  },
  explanation(s: SimState) {
    const deg = angleDegrees(s);
    const rad = wrapAngle(s.vars.theta);
    const x = cosTheta(s);
    const y = sinTheta(s);
    const q = quadrant(deg);
    const identity = x * x + y * y;
    return `The point sits at θ = ${deg.toFixed(0)}° (${rad.toFixed(2)} rad) in quadrant ${['I', 'II', 'III', 'IV'][q - 1]}, at coordinates (${x.toFixed(3)}, ${y.toFixed(3)}). The horizontal leg of the triangle is cos θ and the vertical leg is sin θ, and cos² θ + sin² θ = ${identity.toFixed(2)} always: the point never leaves the circle. That is the Pythagorean identity.`;
  },
  draw: drawUnitCircle,
};

export default unitCircleSim;
