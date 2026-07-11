// Projectile Motion Simulator — ideal (drag-free) launch from ground level, launched at speed v
// and angle θ under gravity g. The trajectory is the closed-form parabola
//   x(τ) = v·cosθ·τ,   y(τ) = v·sinθ·τ − ½·g·τ²
// so there is no numerical integration to drift: step() only advances time and the model replays
// each flight (fly, land, brief pause, relaunch) by wrapping τ into one flight-plus-pause cycle.
// Pure model + config; all canvas work lives in projectile-motion.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { drawProjectileMotion } from './projectile-motion.draw';

/** Seconds the projectile rests on the ground before the flight replays. */
export const LANDING_PAUSE_S = 1.1;

/** Launch angle in radians from the degrees parameter. */
function theta(params: Record<string, number>): number {
  return (params.angle * Math.PI) / 180;
}

/** Time of flight for a ground-to-ground launch: T = 2·v·sinθ / g (s). */
export function flightTime(params: Record<string, number>): number {
  return (2 * params.speed * Math.sin(theta(params))) / params.gravity;
}

/** Horizontal range: R = v²·sin(2θ) / g (m). */
export function range(params: Record<string, number>): number {
  return (params.speed * params.speed * Math.sin(2 * theta(params))) / params.gravity;
}

/** Peak height: H = (v·sinθ)² / (2g) (m). */
export function maxHeight(params: Record<string, number>): number {
  const vy = params.speed * Math.sin(theta(params));
  return (vy * vy) / (2 * params.gravity);
}

/** Constant horizontal velocity component vₓ = v·cosθ (m/s). */
export function horizontalVelocity(params: Record<string, number>): number {
  return params.speed * Math.cos(theta(params));
}

/** The in-flight time τ (s) for the current animation clock: flight, then a ground pause. */
export function flightTau(params: Record<string, number>, t: number): number {
  const T = flightTime(params);
  if (T <= 0) return 0;
  const cycle = T + LANDING_PAUSE_S;
  const local = ((t % cycle) + cycle) % cycle;
  return Math.min(local, T);
}

/** Horizontal position (m) at flight time τ. */
export function posX(params: Record<string, number>, tau: number): number {
  return horizontalVelocity(params) * tau;
}

/** Vertical position (m) at flight time τ, clamped at ground level. */
export function posY(params: Record<string, number>, tau: number): number {
  const vy = params.speed * Math.sin(theta(params));
  return Math.max(0, vy * tau - 0.5 * params.gravity * tau * tau);
}

/** Trajectory height (m) at horizontal distance x (m): y = x·tanθ − g·x² / (2v²cos²θ). */
export function heightAtX(params: Record<string, number>, x: number): number {
  const th = theta(params);
  const cos = Math.cos(th);
  if (cos === 0) return 0;
  const y = x * Math.tan(th) - (params.gravity * x * x) / (2 * params.speed * params.speed * cos * cos);
  return Math.max(0, y);
}

const projectileMotionSim: SimulationDef = {
  id: 'projectile-motion',
  aspect: 16 / 9,
  // Changing any launch parameter re-aims and relaunches from the origin.
  paramBehavior: 'restart',
  params: [
    { id: 'speed', label: 'Launch speed', unit: 'm/s', min: 5, max: 60, step: 1, default: 25, decimals: 0 },
    { id: 'angle', label: 'Launch angle', unit: '°', min: 5, max: 85, step: 1, default: 45, decimals: 0 },
    { id: 'gravity', label: 'Gravity', unit: 'm/s²', min: 1.6, max: 25, step: 0.01, default: 9.81 },
  ],
  presets: [
    { id: 'max-range', label: 'Max range (45°)', values: { angle: 45 } },
    { id: 'high-arc', label: 'High lob (75°)', values: { angle: 75, speed: 25 } },
    { id: 'flat-shot', label: 'Flat shot (15°)', values: { angle: 15, speed: 40 } },
    { id: 'moon', label: 'On the Moon', values: { gravity: 1.62 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'range', label: 'Range', unit: 'm', compute: (s) => range(s.params) },
    { id: 'maxHeight', label: 'Peak height', unit: 'm', compute: (s) => maxHeight(s.params) },
    { id: 'flightTime', label: 'Time of flight', unit: 's', compute: (s) => flightTime(s.params) },
    { id: 'vx', label: 'Horizontal velocity', unit: 'm/s', compute: (s) => horizontalVelocity(s.params) },
  ],
  formula: {
    expression: 'R = v² × sin(2θ) / g',
    substitution: '{speed}² × sin(2 × {angle}°) / {gravity}',
    terms: [
      { symbol: 'R', label: 'Range', measurementId: 'range' },
      { symbol: 'v', label: 'Launch speed', paramId: 'speed' },
      { symbol: 'θ', label: 'Launch angle', paramId: 'angle' },
      { symbol: 'g', label: 'Gravity', paramId: 'gravity' },
    ],
  },
  graph: {
    mode: 'space',
    xLabel: 'Horizontal distance (m)',
    yLabel: 'Height (m)',
    xRange: (s) => [0, Math.max(range(s.params), 1)],
    yRange: (s) => [0, Math.max(maxHeight(s.params) * 1.15, 1)],
    series: [
      {
        id: 'trajectory',
        label: 'Trajectory',
        color: 'accent',
        sample: (s, x) => heightAtX(s.params, x),
      },
    ],
  },
  observations: [
    (s) => {
      const R = range(s.params);
      return `The launch sends it ${R.toFixed(1)} m downrange, reaching ${maxHeight(s.params).toFixed(1)} m at the top of the arc.`;
    },
    (s) =>
      Math.abs(s.params.angle - 45) <= 2
        ? 'At 45° the range is at its maximum for a given launch speed: the split between horizontal reach and airtime is perfectly balanced.'
        : null,
    (s) =>
      s.params.angle >= 70
        ? 'A steep launch spends most of its speed climbing, so it hangs in the air a long time but does not travel far.'
        : null,
    (s) =>
      s.params.angle <= 20
        ? 'A shallow launch keeps most of its speed horizontal, so it stays low and lands quickly despite covering ground fast.'
        : null,
    (s) =>
      s.params.gravity < 5
        ? 'In weak gravity the projectile hangs far longer and flies much further from the same launch.'
        : null,
  ],
  pointer: {
    hint: 'Drag from the launcher to aim and set speed',
    handle(_s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // The launcher sits near the bottom-left of the canvas. The drag vector from it sets both
      // the angle (its direction) and the speed (its length), like pulling back a slingshot.
      const originX = 0.1;
      const originY = 0.9;
      const dx = ev.x - originX;
      const dy = originY - ev.y; // canvas y grows downward; flip so up is positive
      if (dx <= 0.001 && dy <= 0.001) return null;
      const angleDeg = (Math.atan2(dy, Math.max(dx, 0.001)) * 180) / Math.PI;
      const dist = Math.hypot(dx, dy);
      // A full-canvas-diagonal drag maps to roughly the top of the speed range.
      const speed = dist * 70;
      return {
        angle: Math.min(Math.max(angleDeg, 5), 85),
        speed: Math.min(Math.max(speed, 5), 60),
      };
    },
  },
  explanation(s: SimState) {
    const R = range(s.params);
    const H = maxHeight(s.params);
    const T = flightTime(s.params);
    const a = s.params.angle;
    if (Math.abs(a - 45) <= 2) {
      return `Launched at ${a.toFixed(0)}° and ${s.params.speed.toFixed(0)} m/s, the projectile covers its greatest possible range of ${R.toFixed(1)} m. Forty-five degrees is the sweet spot because range depends on sin(2θ), which peaks at 2θ = 90°. The horizontal velocity stays constant the whole flight while gravity alone bends the path into a parabola.`;
    }
    if (a >= 70) {
      return `At a steep ${a.toFixed(0)}°, most of the ${s.params.speed.toFixed(0)} m/s goes into climbing, so the projectile reaches ${H.toFixed(1)} m and stays airborne for ${T.toFixed(2)} s, yet only travels ${R.toFixed(1)} m downrange. Height and hang-time are traded for distance.`;
    }
    if (a <= 20) {
      return `At a shallow ${a.toFixed(0)}°, the projectile keeps most of its speed horizontal, so it barely climbs (${H.toFixed(1)} m) and lands after just ${T.toFixed(2)} s, reaching ${R.toFixed(1)} m. Low, fast shots run out of airtime before they run out of speed.`;
    }
    return `At ${a.toFixed(0)}° and ${s.params.speed.toFixed(0)} m/s, gravity pulls the projectile into a symmetric parabola: it rises to ${H.toFixed(1)} m, is airborne for ${T.toFixed(2)} s, and lands ${R.toFixed(1)} m away. Its horizontal velocity never changes; only the vertical part slows, stops at the peak, then speeds back up.`;
  },
  draw: drawProjectileMotion,
};

export default projectileMotionSim;
