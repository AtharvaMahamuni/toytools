// Inclined Plane — a block on a ramp of angle theta with friction coefficient mu. The forces are the
// weight component along the incline (mg sinθ), the normal force (mg cosθ), and friction (mu mg cosθ).
// The block accelerates at a = g(sinθ - mu cosθ) when that is positive, and stays static otherwise.
// The slide replays on a fixed cycle so the scene loops. Pure model + config; canvas work is in
// inclined-plane.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleStream } from '../graphs';
import { drawInclinedPlane } from './inclined-plane.draw';

/** Standard gravity (m/s^2). */
export const GRAVITY = 9.81;

/** Ramp length along the incline (m) that the block can slide. */
export const RAMP_M = 6;

function thetaRad(params: Record<string, number>): number {
  return (params.angle * Math.PI) / 180;
}

/** Acceleration a = g(sinθ - mu cosθ), clamped at 0 when friction holds the block static (N). */
export function acceleration(params: Record<string, number>): number {
  const th = thetaRad(params);
  return Math.max(0, GRAVITY * (Math.sin(th) - params.friction * Math.cos(th)));
}

/** Whether the block slides (the driving force beats static friction). */
export function isSliding(params: Record<string, number>): boolean {
  return acceleration(params) > 1e-3;
}

/** Weight component along the incline: mg sinθ (N). */
export function gravityComponent(params: Record<string, number>): number {
  return params.mass * GRAVITY * Math.sin(thetaRad(params));
}

/** Friction force magnitude: mu mg cosθ (N). */
export function frictionForce(params: Record<string, number>): number {
  return params.friction * params.mass * GRAVITY * Math.cos(thetaRad(params));
}

/** Normal force: mg cosθ (N). */
export function normalForce(params: Record<string, number>): number {
  return params.mass * GRAVITY * Math.cos(thetaRad(params));
}

/** Slide duration to travel the whole ramp (s); Infinity when static. */
export function slideTime(params: Record<string, number>): number {
  const a = acceleration(params);
  return a > 1e-3 ? Math.sqrt((2 * RAMP_M) / a) : Infinity;
}

/** In-slide time tau within the looped cycle (slide, then a short pause). */
export function slideTau(params: Record<string, number>, t: number): number {
  const T = slideTime(params);
  if (!Number.isFinite(T)) return 0;
  const cycle = T + 1.2;
  const local = ((t % cycle) + cycle) % cycle;
  return Math.min(local, T);
}

/** Distance travelled down the incline (m) at the current looped time. */
export function distanceDown(s: SimState): number {
  const a = acceleration(s.params);
  const tau = slideTau(s.params, s.t);
  return 0.5 * a * tau * tau;
}

/** Speed down the incline (m/s) at the current looped time. */
export function slideSpeed(s: SimState): number {
  return acceleration(s.params) * slideTau(s.params, s.t);
}

const inclinedPlaneSim: SimulationDef = {
  id: 'inclined-plane',
  aspect: 16 / 9,
  paramBehavior: 'restart',
  params: [
    { id: 'angle', label: 'Ramp angle', unit: '°', min: 5, max: 60, step: 1, default: 30, decimals: 0 },
    { id: 'mass', label: 'Block mass', unit: 'kg', min: 0.5, max: 10, step: 0.5, default: 2, decimals: 1 },
    { id: 'friction', label: 'Friction (μ)', unit: '', min: 0, max: 0.8, step: 0.02, default: 0.2, decimals: 2 },
  ],
  presets: [
    { id: 'frictionless', label: 'Frictionless slope', values: { angle: 30, friction: 0 } },
    { id: 'held', label: 'Friction holds it', values: { angle: 20, friction: 0.5 } },
    { id: 'steep', label: 'Steep and slippery', values: { angle: 50, friction: 0.1 } },
    { id: 'gentle', label: 'Gentle grippy ramp', values: { angle: 15, friction: 0.3 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'acceleration', label: 'Acceleration', unit: 'm/s²', decimals: 2, compute: (s) => acceleration(s.params) },
    { id: 'gravityComponent', label: 'Force along incline', unit: 'N', decimals: 1, compute: (s) => gravityComponent(s.params) },
    { id: 'friction', label: 'Friction force', unit: 'N', decimals: 1, compute: (s) => frictionForce(s.params) },
    { id: 'normal', label: 'Normal force', unit: 'N', decimals: 1, compute: (s) => normalForce(s.params) },
  ],
  formula: {
    expression: 'a = g(sinθ - μcosθ)',
    substitution: '9.81 × (sin({angle}°) - {friction} × cos({angle}°))',
    terms: [
      { symbol: 'a', label: 'Acceleration', measurementId: 'acceleration' },
      { symbol: 'θ', label: 'Ramp angle', paramId: 'angle' },
      { symbol: 'μ', label: 'Friction', paramId: 'friction' },
    ],
  },
  graph: singleStream({
    yLabel: 'Speed down ramp (m/s)',
    window: 5,
    yRange: (s) => {
      const vmax = acceleration(s.params) * slideTime(s.params);
      return [0, Math.max(1, Number.isFinite(vmax) ? vmax * 1.1 : 1)];
    },
    id: 'v',
    label: 'v(t)',
    sample: (s) => slideSpeed(s),
  }),
  observations: [
    (s) =>
      isSliding(s.params)
        ? `The block accelerates down the ramp at ${acceleration(s.params).toFixed(2)} m/s², from a = g(sinθ - μcosθ).`
        : 'Friction is strong enough to hold the block static: the driving force does not beat the maximum friction, so it does not move.',
    (s) =>
      s.params.friction === 0
        ? 'With no friction the acceleration is simply g sinθ, independent of the mass.'
        : null,
    (s) =>
      s.params.angle >= 45 && isSliding(s.params)
        ? 'On a steep ramp the weight component along the incline dominates, so the block slides quickly.'
        : null,
  ],
  pointer: {
    hint: 'Drag up or down to change the ramp angle',
    handle(_s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // Higher on the canvas means a steeper ramp; map y in [0.1, 0.9] to 60..5 degrees.
      const frac = Math.min(Math.max((ev.y - 0.1) / 0.8, 0), 1);
      return { angle: 60 - frac * 55 };
    },
  },
  explanation(s: SimState) {
    if (!isSliding(s.params)) {
      return `On a ${s.params.angle.toFixed(0)}° ramp with friction μ = ${s.params.friction.toFixed(2)}, the maximum friction force (μmg cosθ) exceeds the weight component pulling the block down (mg sinθ), so the block stays put. It only slides once tanθ is greater than μ.`;
    }
    return `The weight component along the incline, mg sinθ, pulls the block down while friction μmg cosθ resists. The net effect gives an acceleration a = g(sinθ - μcosθ) = ${acceleration(s.params).toFixed(2)} m/s². Notice the mass cancels out, so a heavier block slides with the same acceleration.`;
  },
  draw: drawInclinedPlane,
};

export default inclinedPlaneSim;
