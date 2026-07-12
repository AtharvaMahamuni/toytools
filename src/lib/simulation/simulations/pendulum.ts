// Pendulum Explorer — the FULL nonlinear pendulum θ̈ = −(g/L)·sinθ integrated with RK4
// at the loop's fixed substep, so energy is conserved to numerical precision and the
// large-angle period genuinely exceeds the small-angle formula (which we label honestly).
// Mass is fixed at 1 kg and display-only: it cancels out of the motion.
// Pure model + config; all canvas work lives in pendulum.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleStream } from '../graphs';
import { drawPendulum } from './pendulum.draw';

export const PENDULUM_MASS_KG = 1;

/** dθ/dt and dω/dt for the nonlinear pendulum. */
function derivatives(theta: number, omega: number, g: number, L: number): [number, number] {
  return [omega, -(g / L) * Math.sin(theta)];
}

/** One classic RK4 step of the (θ, ω) system. Exported for direct numerical tests. */
export function rk4Step(
  theta: number,
  omega: number,
  g: number,
  L: number,
  dt: number,
): [number, number] {
  const [k1t, k1w] = derivatives(theta, omega, g, L);
  const [k2t, k2w] = derivatives(theta + (dt / 2) * k1t, omega + (dt / 2) * k1w, g, L);
  const [k3t, k3w] = derivatives(theta + (dt / 2) * k2t, omega + (dt / 2) * k2w, g, L);
  const [k4t, k4w] = derivatives(theta + dt * k3t, omega + dt * k3w, g, L);
  return [
    theta + (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t),
    omega + (dt / 6) * (k1w + 2 * k2w + 2 * k3w + k4w),
  ];
}

/** Small-angle period T ≈ 2π√(L/g) (s) — labelled as the approximation it is. */
export function smallAnglePeriod(params: Record<string, number>): number {
  return 2 * Math.PI * Math.sqrt(params.length / params.gravity);
}

/** Bob speed |v| = L|ω| (m/s). */
export function bobSpeed(state: SimState): number {
  return state.params.length * Math.abs(state.vars.omega);
}

/** Potential energy above the lowest point: PE = mgL(1 − cosθ) (J). */
export function potentialEnergy(state: SimState): number {
  const { length, gravity } = state.params;
  return PENDULUM_MASS_KG * gravity * length * (1 - Math.cos(state.vars.theta));
}

/** Kinetic energy: KE = ½m(Lω)² (J). */
export function kineticEnergy(state: SimState): number {
  const v = state.params.length * state.vars.omega;
  return 0.5 * PENDULUM_MASS_KG * v * v;
}

export function totalEnergy(state: SimState): number {
  return potentialEnergy(state) + kineticEnergy(state);
}

export function initPendulum(params: Record<string, number>): Record<string, number> {
  return { theta: (params.angle * Math.PI) / 180, omega: 0, holding: 0 };
}

export function stepPendulum(s: SimState, dt: number): void {
  const [theta, omega] = rk4Step(
    s.vars.theta,
    s.vars.omega,
    s.params.gravity,
    s.params.length,
    dt,
  );
  s.vars.theta = theta;
  s.vars.omega = omega;
  s.t += dt;
}

const pendulumSim: SimulationDef = {
  id: 'pendulum',
  aspect: 4 / 3,
  paramBehavior: 'restart',
  params: [
    { id: 'length', label: 'Length', unit: 'm', min: 0.2, max: 3, step: 0.05, default: 1 },
    { id: 'angle', label: 'Initial angle', unit: '°', min: 5, max: 60, step: 1, default: 20, decimals: 0 },
    { id: 'gravity', label: 'Gravity', unit: 'm/s²', min: 1.6, max: 25, step: 0.01, default: 9.81 },
  ],
  presets: [
    { id: 'earth', label: 'Earth', values: { gravity: 9.81 } },
    { id: 'moon', label: 'Moon', values: { gravity: 1.62 } },
    { id: 'jupiter', label: 'Jupiter', values: { gravity: 24.79 } },
    { id: 'clock', label: 'Grandfather clock', values: { length: 0.99, angle: 5, gravity: 9.81 } },
  ],
  init: initPendulum,
  step: stepPendulum,
  measurements: [
    { id: 'period', label: 'Period (small-angle)', unit: 's', compute: (s) => smallAnglePeriod(s.params) },
    { id: 'speed', label: 'Bob speed', unit: 'm/s', compute: bobSpeed },
    { id: 'pe', label: 'Potential energy', unit: 'J', compute: potentialEnergy },
    { id: 'ke', label: 'Kinetic energy', unit: 'J', compute: kineticEnergy },
  ],
  formula: {
    expression: 'T ≈ 2π √(L / g)',
    substitution: '2π √({length} / {gravity})',
    terms: [
      { symbol: 'T', label: 'Period (small-angle)', measurementId: 'period' },
      { symbol: 'L', label: 'Length', paramId: 'length' },
      { symbol: 'g', label: 'Gravity', paramId: 'gravity' },
    ],
  },
  graph: singleStream({
    yLabel: 'Angle (°)',
    window: 10,
    yRange: (s) => {
      const a = Math.max(s.params.angle, 10);
      return [-a * 1.15, a * 1.15];
    },
    id: 'theta',
    label: 'θ(t)',
    sample: (s) => (s.vars.theta * 180) / Math.PI,
  }),
  observations: [
    (s) => {
      const pe = potentialEnergy(s);
      const ke = kineticEnergy(s);
      if (ke > pe * 3) return 'Near the bottom of the swing the bob is fastest: the energy is almost all kinetic.';
      if (pe > ke * 3) return 'Near the turning point the bob nearly stops: the energy is almost all potential.';
      return 'Mid-swing, the energy is shifting between potential (height) and kinetic (speed) — the total stays constant.';
    },
    (s) =>
      s.params.gravity < 5
        ? 'In low gravity the restoring pull is weak, so each swing takes much longer — pendulum clocks would run slow on the Moon.'
        : null,
    (s) =>
      s.params.angle > 30
        ? 'At large angles the true period is slightly longer than the small-angle formula predicts — the formula is an approximation.'
        : null,
    (s) =>
      s.params.length >= 2
        ? 'A longer pendulum swings more slowly: the period grows with the square root of the length.'
        : null,
  ],
  pointer: {
    hint: 'Drag the bob and let go',
    handle(s, ev) {
      if (ev.type === 'up') {
        // Release from rest at the held angle: keep θ, zero the angular velocity.
        s.vars.holding = 0;
        s.vars.omega = 0;
        return null;
      }
      if (ev.type === 'tap') return null;
      // Horizontal offset from the pivot (canvas x ≈ 0.42) sets the release angle and its sign.
      const degrees = (ev.x - 0.42) * 170;
      const clamped = Math.sign(degrees) * Math.min(Math.max(Math.abs(degrees), 5), 60);
      s.vars.theta = (clamped * Math.PI) / 180;
      s.vars.omega = 0;
      s.vars.holding = 1;
      return { angle: Math.abs(clamped) };
    },
    isHolding: (s) => s.vars.holding === 1,
  },
  explanation(s: SimState) {
    const T = smallAnglePeriod(s.params);
    const g = s.params.gravity;
    if (g < 5) {
      return `With gravity at only ${g.toFixed(2)} m/s², the restoring force pulling the bob back is weak, so a full swing stretches to about ${T.toFixed(2)} s. Notice mass never appears in T ≈ 2π√(L/g): heavier bobs swing at exactly the same rate.`;
    }
    if (g > 15) {
      return `Strong gravity (${g.toFixed(2)} m/s²) snaps the bob back toward the centre, shortening the period to about ${T.toFixed(2)} s. Only length and gravity set the rhythm — the 1 kg mass cancels out of the equation.`;
    }
    return `The bob trades height for speed and back again: gravity accelerates it down toward the middle, momentum carries it up the other side. With L = ${s.params.length.toFixed(2)} m and g = ${g.toFixed(2)} m/s², one full swing takes about ${T.toFixed(2)} s regardless of the bob's mass.`;
  },
  draw: drawPendulum,
};

export default pendulumSim;
