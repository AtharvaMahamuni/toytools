// Ideal Gas Law — PV = nRT. A box of gas particles whose count tracks the amount n and whose speed
// tracks the temperature T; a movable piston sets the volume V, and the pressure P = nRT/V emerges.
// Working in litres and kelvin, the litre-to-cubic-metre and pascal-to-kilopascal factors cancel, so
// P in kPa is exactly n·R·T/V(L). Pure model + config; canvas work is in ideal-gas-law.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleSnapshot } from '../graphs';
import { GAS_CONSTANT_R } from '../render/units';
import { drawIdealGasLaw } from './ideal-gas-law.draw';

/** Pressure P = nRT / V, returned in kPa when V is in litres and T in kelvin. */
export function pressureKpa(params: Record<string, number>): number {
  return (params.amount * GAS_CONSTANT_R * params.temperature) / params.volume;
}

/** Relative thermal speed (proxy for the animation), rising with the square root of temperature. */
export function thermalSpeed(params: Record<string, number>): number {
  return Math.sqrt(params.temperature / 300) * 0.9;
}

const idealGasLawSim: SimulationDef = {
  id: 'ideal-gas-law',
  aspect: 16 / 9,
  // Particles keep bouncing with the new values; nothing to re-initialise on a change.
  paramBehavior: 'continuous',
  params: [
    { id: 'temperature', label: 'Temperature', unit: 'K', min: 150, max: 600, step: 5, default: 300, decimals: 0 },
    { id: 'volume', label: 'Volume', unit: 'L', min: 5, max: 40, step: 0.5, default: 25, decimals: 1 },
    { id: 'amount', label: 'Amount', unit: 'mol', min: 0.2, max: 2, step: 0.1, default: 1, decimals: 1 },
  ],
  presets: [
    { id: 'room', label: 'Room conditions', values: { temperature: 300, volume: 25, amount: 1 } },
    { id: 'hot', label: 'Heated gas', values: { temperature: 550, volume: 25, amount: 1 } },
    { id: 'compressed', label: 'Compressed', values: { temperature: 300, volume: 8, amount: 1 } },
    { id: 'sparse', label: 'Few particles', values: { temperature: 300, volume: 30, amount: 0.3 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'pressure', label: 'Pressure', unit: 'kPa', decimals: 1, compute: (s) => pressureKpa(s.params) },
    { id: 'temperature', label: 'Temperature', unit: 'K', decimals: 0, compute: (s) => s.params.temperature },
    { id: 'volume', label: 'Volume', unit: 'L', decimals: 1, compute: (s) => s.params.volume },
  ],
  formula: {
    expression: 'P = n R T / V',
    substitution: '{amount} × 8.314 × {temperature} / {volume}',
    terms: [
      { symbol: 'P', label: 'Pressure', measurementId: 'pressure' },
      { symbol: 'n', label: 'Amount', paramId: 'amount' },
      { symbol: 'T', label: 'Temperature', paramId: 'temperature' },
      { symbol: 'V', label: 'Volume', paramId: 'volume' },
    ],
  },
  // The isotherm: at fixed temperature and amount, pressure against volume is a hyperbola P = nRT/V.
  graph: singleSnapshot({
    xLabel: 'Volume (L)',
    yLabel: 'Pressure (kPa)',
    xRange: () => [5, 40],
    yRange: (s) => [0, Math.max(50, (s.params.amount * GAS_CONSTANT_R * s.params.temperature) / 5)],
    id: 'pv',
    label: 'P = nRT / V',
    sample: (s, x) => (s.params.amount * GAS_CONSTANT_R * s.params.temperature) / x,
  }),
  observations: [
    (s) =>
      `${s.params.amount.toFixed(1)} mol at ${s.params.temperature.toFixed(0)} K in ${s.params.volume.toFixed(1)} L exerts a pressure of ${pressureKpa(s.params).toFixed(1)} kPa, from P = nRT / V.`,
    (s) =>
      s.params.volume <= 10
        ? 'Squeezing the gas into a small volume packs the collisions closer together, so the pressure climbs.'
        : null,
    (s) =>
      s.params.temperature >= 500
        ? 'At high temperature the particles move faster and strike the walls harder and more often, raising the pressure.'
        : null,
  ],
  pointer: {
    hint: 'Drag the piston to change the volume',
    handle(_s, ev) {
      if (ev.type === 'tap' || ev.type === 'up') return null;
      // The piston face spans the right portion of the box; map its x to the 5..40 L range.
      const frac = Math.min(Math.max((ev.x - 0.12) / 0.76, 0), 1);
      return { volume: 5 + frac * 35 };
    },
  },
  explanation(s: SimState) {
    const p = pressureKpa(s.params);
    return `The ideal gas law PV = nRT ties the four quantities together. With ${s.params.amount.toFixed(1)} mol at ${s.params.temperature.toFixed(0)} K squeezed into ${s.params.volume.toFixed(1)} L, the pressure works out to P = nRT / V = ${p.toFixed(1)} kPa. Heat the gas or shrink the box and the particles hit the walls harder or more often, so the pressure rises.`;
  },
  draw: drawIdealGasLaw,
};

export default idealGasLawSim;
