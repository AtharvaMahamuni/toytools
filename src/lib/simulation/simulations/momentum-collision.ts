// Momentum Collision — two carts on a frictionless track. Cart 1 (mass m1) moves right at speed u1
// toward a stationary cart 2 (mass m2); they collide with a coefficient of restitution e, and the
// post-collision velocities come from the shared resolveCollision1D kernel. Momentum is conserved
// for any e; kinetic energy is conserved only when e = 1. The flight replays on a fixed cycle so the
// scene loops. Pure model + config; all canvas work lives in momentum-collision.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { streamGraph } from '../graphs';
import { resolveCollision1D, kineticEnergy } from '../render/physics';
import { drawMomentumCollision } from './momentum-collision.draw';

/** Track length in metres (the visible domain). */
export const TRACK_M = 10;

/** Cart half-width in metres, growing gently with mass so heavier carts read as bigger. */
export function cartHalfWidth(mass: number): number {
  return 0.35 + mass * 0.12;
}

const X1_0 = 1.6;
const X2_0 = 7.4;

/** Derive the collision time and post-collision velocities from the parameters. */
export function collision(params: Record<string, number>): {
  tc: number;
  v1: number;
  v2: number;
  xc: number;
  cycle: number;
} {
  const u1 = params.speed1;
  const gap = X2_0 - X1_0 - (cartHalfWidth(params.mass1) + cartHalfWidth(params.mass2));
  const tc = u1 > 0 ? Math.max(0, gap / u1) : 0;
  const [v1, v2] = resolveCollision1D(params.mass1, u1, params.mass2, 0, params.restitution);
  const xc = X1_0 + u1 * tc; // centre of cart 1 at contact
  return { tc, v1, v2, xc, cycle: tc + 3.4 };
}

/** Cart centre positions (m) at the current looped time. */
export function positions(s: SimState): { x1: number; x2: number; v1: number; v2: number } {
  const { tc, v1, v2 } = s.vars;
  const cycle = s.vars.cycle;
  const local = ((s.t % cycle) + cycle) % cycle;
  const u1 = s.params.speed1;
  if (local < tc) {
    return { x1: X1_0 + u1 * local, x2: X2_0, v1: u1, v2: 0 };
  }
  const dt = local - tc;
  return {
    x1: s.vars.xc + v1 * dt,
    x2: X2_0 + v2 * dt,
    v1,
    v2,
  };
}

/** Current velocity of each cart (m/s) at the looped time. */
function currentVel(s: SimState): { v1: number; v2: number } {
  const { v1, v2 } = positions(s);
  return { v1, v2 };
}

/** Total momentum p = m1 v1 + m2 v2 (kg m/s), constant through the collision. */
export function totalMomentum(s: SimState): number {
  const { v1, v2 } = currentVel(s);
  return s.params.mass1 * v1 + s.params.mass2 * v2;
}

/** Total kinetic energy (J); drops at an inelastic collision (e < 1). */
export function totalKineticEnergy(s: SimState): number {
  const { v1, v2 } = currentVel(s);
  return kineticEnergy(s.params.mass1, v1) + kineticEnergy(s.params.mass2, v2);
}

const momentumCollisionSim: SimulationDef = {
  id: 'momentum-collision',
  aspect: 16 / 9,
  paramBehavior: 'restart',
  params: [
    { id: 'mass1', label: 'Mass of cart 1', unit: 'kg', min: 0.5, max: 5, step: 0.1, default: 2, decimals: 1 },
    { id: 'mass2', label: 'Mass of cart 2', unit: 'kg', min: 0.5, max: 5, step: 0.1, default: 1, decimals: 1 },
    { id: 'speed1', label: 'Speed of cart 1', unit: 'm/s', min: 1, max: 8, step: 0.1, default: 4, decimals: 1 },
    { id: 'restitution', label: 'Restitution (e)', unit: '', min: 0, max: 1, step: 0.05, default: 1, decimals: 2 },
  ],
  presets: [
    { id: 'elastic', label: 'Elastic (e = 1)', values: { restitution: 1 } },
    { id: 'inelastic', label: 'Perfectly inelastic', values: { restitution: 0 } },
    { id: 'heavy-hits-light', label: 'Heavy hits light', values: { mass1: 5, mass2: 1, restitution: 1 } },
    { id: 'light-hits-heavy', label: 'Light hits heavy', values: { mass1: 1, mass2: 5, restitution: 1 } },
  ],
  init(params) {
    const { tc, v1, v2, xc, cycle } = collision(params);
    return { tc, v1, v2, xc, cycle };
  },
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'momentum', label: 'Total momentum', unit: 'kg·m/s', decimals: 2, compute: (s) => totalMomentum(s) },
    { id: 'energy', label: 'Total kinetic energy', unit: 'J', decimals: 2, compute: (s) => totalKineticEnergy(s) },
    { id: 'v1', label: 'Cart 1 velocity', unit: 'm/s', decimals: 2, compute: (s) => currentVel(s).v1 },
    { id: 'v2', label: 'Cart 2 velocity', unit: 'm/s', decimals: 2, compute: (s) => currentVel(s).v2 },
  ],
  formula: {
    expression: 'p = m1 v1 + m2 v2',
    terms: [
      { symbol: 'p', label: 'Total momentum', measurementId: 'momentum' },
      { symbol: 'm1', label: 'Mass of cart 1', paramId: 'mass1' },
      { symbol: 'v1', label: 'Cart 1 velocity', measurementId: 'v1' },
      { symbol: 'm2', label: 'Mass of cart 2', paramId: 'mass2' },
      { symbol: 'v2', label: 'Cart 2 velocity', measurementId: 'v2' },
    ],
  },
  graph: streamGraph({
    yLabel: 'Velocity (m/s)',
    window: 6,
    yRange: (s) => {
      const m = s.params.speed1 * 1.3 + 0.5;
      return [-m, m];
    },
    series: [
      { id: 'v1', label: 'Cart 1', color: 'accent', sample: (s) => currentVel(s).v1 },
      { id: 'v2', label: 'Cart 2', color: 'danger', sample: (s) => currentVel(s).v2 },
    ],
  }),
  observations: [
    (s) =>
      `Momentum is conserved at ${totalMomentum(s).toFixed(2)} kg·m/s before and after the collision, whatever the restitution.`,
    (s) =>
      s.params.restitution >= 0.99
        ? 'With e = 1 the collision is perfectly elastic, so kinetic energy is conserved too.'
        : s.params.restitution <= 0.01
          ? 'With e = 0 the carts stick together, and the lost kinetic energy becomes heat and sound.'
          : 'This is a partly elastic collision, so some kinetic energy is lost while momentum is preserved.',
    (s) =>
      s.params.mass1 >= s.params.mass2 * 3
        ? 'A much heavier cart barely slows down and drives the lighter one forward quickly.'
        : null,
  ],
  explanation(s: SimState) {
    const p = totalMomentum(s);
    const elastic = s.params.restitution >= 0.99;
    return `Cart 1 (${s.params.mass1.toFixed(1)} kg) strikes cart 2 (${s.params.mass2.toFixed(1)} kg) and momentum is conserved: p = m1 v1 + m2 v2 = ${p.toFixed(2)} kg·m/s stays the same through the impact. ${elastic ? 'Because e = 1, kinetic energy is also conserved, so the carts bounce apart cleanly.' : 'Because e is below 1, some kinetic energy is lost to heat and sound even though momentum is preserved.'}`;
  },
  draw: drawMomentumCollision,
};

export default momentumCollisionSim;
