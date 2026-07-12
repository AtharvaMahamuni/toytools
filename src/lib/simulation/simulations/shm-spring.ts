// Simple Harmonic Motion — a mass on a spring. With the mass released from rest at displacement A,
// x(t) = A·cos(ωt) where ω = √(k/m). Energy trades between spring PE = ½kx² and KE = ½mv², summing
// to the constant total ½kA². Pure model + config; all canvas work is in shm-spring.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleStream } from '../graphs';
import { springPotential, kineticEnergy as keOf } from '../render/physics';
import { drawShmSpring } from './shm-spring.draw';

/** Angular frequency ω = √(k / m) (rad/s). */
export function angularFrequency(params: Record<string, number>): number {
  return Math.sqrt(params.springConstant / params.mass);
}

/** Period T = 2π √(m / k) (s). */
export function period(params: Record<string, number>): number {
  return 2 * Math.PI * Math.sqrt(params.mass / params.springConstant);
}

/** Displacement x(t) = A·cos(ωt) (m), released from rest at +A. */
export function displacement(params: Record<string, number>, t: number): number {
  return params.amplitude * Math.cos(angularFrequency(params) * t);
}

/** Velocity v(t) = -Aω·sin(ωt) (m/s). */
export function velocity(params: Record<string, number>, t: number): number {
  const omega = angularFrequency(params);
  return -params.amplitude * omega * Math.sin(omega * t);
}

/** Peak speed v_max = Aω (m/s). */
export function maxSpeed(params: Record<string, number>): number {
  return params.amplitude * angularFrequency(params);
}

/** Total mechanical energy E = ½ k A² (J), constant through the motion. */
export function totalEnergy(params: Record<string, number>): number {
  return springPotential(params.springConstant, params.amplitude);
}

const shmSpringSim: SimulationDef = {
  id: 'shm-spring',
  aspect: 16 / 9,
  // Changing mass, stiffness, or amplitude restarts the oscillation from rest at +A.
  paramBehavior: 'restart',
  params: [
    { id: 'mass', label: 'Mass', unit: 'kg', min: 0.2, max: 5, step: 0.1, default: 1, decimals: 1 },
    { id: 'springConstant', label: 'Spring constant', unit: 'N/m', min: 2, max: 50, step: 1, default: 20, decimals: 0 },
    { id: 'amplitude', label: 'Amplitude', unit: 'm', min: 0.1, max: 1.5, step: 0.05, default: 0.8, decimals: 2 },
  ],
  presets: [
    { id: 'stiff', label: 'Stiff & light', values: { mass: 0.4, springConstant: 45, amplitude: 0.6 } },
    { id: 'soft', label: 'Soft & heavy', values: { mass: 4, springConstant: 5, amplitude: 1 } },
    { id: 'default', label: 'Balanced', values: { mass: 1, springConstant: 20, amplitude: 0.8 } },
    { id: 'wide', label: 'Wide swing', values: { mass: 1.5, springConstant: 12, amplitude: 1.4 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'period', label: 'Period', unit: 's', decimals: 2, compute: (s) => period(s.params) },
    { id: 'maxSpeed', label: 'Max speed', unit: 'm/s', decimals: 2, compute: (s) => maxSpeed(s.params) },
    { id: 'angular', label: 'Angular frequency', unit: 'rad/s', decimals: 2, compute: (s) => angularFrequency(s.params) },
    { id: 'energy', label: 'Total energy', unit: 'J', decimals: 2, compute: (s) => totalEnergy(s.params) },
  ],
  formula: {
    expression: 'T = 2π √(m / k)',
    substitution: '2π √({mass} / {springConstant})',
    terms: [
      { symbol: 'T', label: 'Period', measurementId: 'period' },
      { symbol: 'm', label: 'Mass', paramId: 'mass' },
      { symbol: 'k', label: 'Spring constant', paramId: 'springConstant' },
    ],
  },
  graph: singleStream({
    yLabel: 'Displacement x (m)',
    window: 6,
    yRange: (s) => [-s.params.amplitude * 1.1, s.params.amplitude * 1.1],
    id: 'x',
    label: 'x(t)',
    sample: (s) => displacement(s.params, s.t),
  }),
  observations: [
    (s) =>
      `A ${s.params.mass.toFixed(1)} kg mass on a ${s.params.springConstant.toFixed(0)} N/m spring oscillates with a period of ${period(s.params).toFixed(2)} s, from T = 2π √(m / k).`,
    (s) =>
      s.params.springConstant / s.params.mass >= 60
        ? 'A stiff spring with a light mass gives a high angular frequency, so the mass buzzes back and forth quickly.'
        : null,
    (s) =>
      s.params.springConstant / s.params.mass <= 4
        ? 'A soft spring carrying a heavy mass oscillates slowly, with a long, lazy period.'
        : null,
  ],
  pointer: {
    hint: 'Drag the mass to set the amplitude',
    handle(_s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // Horizontal distance from centre maps to amplitude across 40% of the half-width.
      const fromCentre = Math.abs(ev.x - 0.5);
      const amplitude = (fromCentre / 0.5) * 1.5;
      return { amplitude: Math.min(Math.max(amplitude, 0.1), 1.5) };
    },
  },
  explanation(s: SimState) {
    const T = period(s.params);
    const e = totalEnergy(s.params);
    return `The restoring force F = -kx pulls the mass back toward the centre, producing simple harmonic motion with period T = 2π √(m / k) = ${T.toFixed(2)} s. The total energy stays fixed at ½ k A² = ${e.toFixed(2)} J, trading between spring potential energy at the ends and kinetic energy as it races through the middle.`;
  },
  draw: drawShmSpring,
};

// Re-export the energy helper for the draw file's bars without re-importing render/physics there.
export function currentEnergies(s: SimState): { pe: number; ke: number } {
  const x = displacement(s.params, s.t);
  const v = velocity(s.params, s.t);
  return { pe: springPotential(s.params.springConstant, x), ke: keOf(s.params.mass, v) };
}

export default shmSpringSim;
