// Ohm's Law Explorer — a single-loop circuit where I = V / R. A battery drives a current through
// one resistor; charge carriers animate around the loop at a speed proportional to the current, and
// the resistor dissipates power P = V·I. Pure model + config; all canvas work is in ohms-law.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { singleSnapshot } from '../graphs';
import { drawOhmsLaw } from './ohms-law.draw';

/** Current I = V / R (amps). */
export function current(params: Record<string, number>): number {
  return params.voltage / params.resistance;
}

/** Power dissipated P = V·I = V² / R (watts). */
export function power(params: Record<string, number>): number {
  return params.voltage * current(params);
}

/** Carrier drift speed proxy (loops per second), proportional to current, for the animation. */
export function driftRate(params: Record<string, number>): number {
  return current(params) * 0.6;
}

const ohmsLawSim: SimulationDef = {
  id: 'ohms-law',
  aspect: 16 / 9,
  // Carriers keep circulating with the new value; nothing to re-initialise on a change.
  paramBehavior: 'continuous',
  params: [
    { id: 'voltage', label: 'Voltage', unit: 'V', min: 1, max: 24, step: 0.5, default: 9, decimals: 1 },
    { id: 'resistance', label: 'Resistance', unit: 'Ω', min: 1, max: 100, step: 1, default: 30, decimals: 0 },
  ],
  presets: [
    { id: 'led', label: 'LED + resistor', values: { voltage: 5, resistance: 100 } },
    { id: 'flashlight', label: 'Flashlight bulb', values: { voltage: 3, resistance: 6 } },
    { id: 'nine-volt', label: '9 V through 30 Ω', values: { voltage: 9, resistance: 30 } },
    { id: 'short', label: 'Near short circuit', values: { voltage: 12, resistance: 2 } },
  ],
  init: () => ({}),
  step(s: SimState, dt: number) {
    s.t += dt;
  },
  measurements: [
    { id: 'current', label: 'Current', unit: 'A', decimals: 3, compute: (s) => current(s.params) },
    { id: 'power', label: 'Power', unit: 'W', decimals: 2, compute: (s) => power(s.params) },
    { id: 'voltage', label: 'Voltage', unit: 'V', decimals: 1, compute: (s) => s.params.voltage },
  ],
  formula: {
    expression: 'I = V / R',
    substitution: '{voltage} / {resistance}',
    terms: [
      { symbol: 'I', label: 'Current', measurementId: 'current' },
      { symbol: 'V', label: 'Voltage', paramId: 'voltage' },
      { symbol: 'R', label: 'Resistance', paramId: 'resistance' },
    ],
  },
  // The I-V characteristic: current against voltage is a straight line through the origin with
  // slope 1 / R. Changing R tilts the line; changing V slides the operating point along it.
  graph: singleSnapshot({
    xLabel: 'Voltage (V)',
    yLabel: 'Current (A)',
    xRange: () => [0, 24],
    yRange: (s) => [0, Math.max(0.5, (24 / s.params.resistance) * 1.1)],
    id: 'iv',
    label: 'I = V / R',
    sample: (s, x) => x / s.params.resistance,
  }),
  observations: [
    (s) => {
      const i = current(s.params);
      return `${s.params.voltage.toFixed(1)} volts across ${s.params.resistance.toFixed(0)} ohms drives a current of ${i.toFixed(3)} amps, straight from I = V / R.`;
    },
    (s) =>
      s.params.resistance <= 4
        ? 'The low resistance lets a large current flow, so the resistor heats up fast; this is why a near short circuit is dangerous.'
        : null,
    (s) =>
      s.params.resistance >= 80
        ? 'The high resistance chokes the current down to a trickle, so very little power is dissipated.'
        : null,
    (s) =>
      power(s.params) >= 20
        ? 'A lot of power is being turned into heat here, more than a small resistor could safely handle.'
        : null,
  ],
  explanation(s: SimState) {
    const i = current(s.params);
    const p = power(s.params);
    return `With ${s.params.voltage.toFixed(1)} V pushing charge through ${s.params.resistance.toFixed(0)} Ω, Ohm's law gives a current of I = V / R = ${i.toFixed(3)} A. The resistor turns this into heat at P = V·I = ${p.toFixed(2)} W, which is why the carriers glow brighter as either the voltage rises or the resistance falls.`;
  },
  draw: drawOhmsLaw,
};

export default ohmsLawSim;
