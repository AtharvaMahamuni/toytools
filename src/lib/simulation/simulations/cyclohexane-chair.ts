// Cyclohexane chair flip. One substituent stays up. Axial and equatorial trade places.
// The well-to-well gap is an experimental A-value. The curve between the wells is the
// half-chair, labeled as the high point, not minimised as a boat.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { GAS_CONSTANT_R } from '../render/units';
import { drawCyclohexaneChair } from './cyclohexane-chair.draw';

/** Gas constant in kJ/(mol K). */
export const R_KJ = GAS_CONSTANT_R / 1000;

/** Methyl A-value, kJ/mol. Equatorial is lower by this much. Textbook experimental gap. */
export const METHYL_A = 7.6;

/** Approximate ring-flip barrier, kJ/mol, the height of the half-chair above the lower well. */
export const RING_BARRIER = 43;

export function isMethyl(substituent: number): boolean {
  return substituent >= 0.5;
}

export function energyGap(substituent: number): number {
  return isMethyl(substituent) ? METHYL_A : 0;
}

/** Axial population over equatorial population. */
export function axialOverEquatorial(substituent: number, temperatureK: number): number {
  const t = Math.max(1, temperatureK);
  return Math.exp(-energyGap(substituent) / (R_KJ * t));
}

export function populations(substituent: number, temperatureK: number): { equatorial: number; axial: number } {
  const k = axialOverEquatorial(substituent, temperatureK);
  const equatorial = 1 / (1 + k);
  return { equatorial, axial: 1 - equatorial };
}

/** Strain along the flip, 0 at the equatorial chair and the A-value at the axial chair. */
export function energyAt(flipPercent: number, substituent: number): number {
  const t = Math.min(1, Math.max(0, flipPercent / 100));
  return energyGap(substituent) * t + RING_BARRIER * Math.sin(Math.PI * t) ** 2;
}

export type ChairPosition = 'equatorial' | 'axial' | 'half-chair';

export function orientationAt(flipPercent: number): { vertical: 'up'; position: ChairPosition } {
  const t = Math.min(1, Math.max(0, flipPercent / 100));
  if (Math.abs(t - 0.5) <= 0.02) return { vertical: 'up', position: 'half-chair' };
  return { vertical: 'up', position: t < 0.5 ? 'equatorial' : 'axial' };
}

/** The line the page shows so up never flips into down. */
export function readout(flipPercent: number): string {
  const position = orientationAt(flipPercent).position;
  if (position === 'half-chair') return 'up, at the half-chair';
  return `up, now ${position}`;
}

const cyclohexaneChairSim: SimulationDef = {
  id: 'cyclohexane-chair',
  aspect: 16 / 9,
  paramBehavior: 'continuous',
  params: [
    { id: 'flip', label: 'Chair flip', unit: '%', min: 0, max: 100, step: 1, default: 0, decimals: 0 },
    { id: 'substituent', label: 'Methyl', unit: '', min: 0, max: 1, step: 1, default: 1, decimals: 0 },
    { id: 'temperature', label: 'Temperature', unit: 'K', min: 200, max: 600, step: 5, default: 298, decimals: 0 },
  ],
  presets: [
    { id: 'plain', label: 'Cyclohexane', values: { flip: 0, substituent: 0, temperature: 298 } },
    { id: 'eq', label: 'Methyl, equatorial', values: { flip: 0, substituent: 1, temperature: 298 } },
    { id: 'ax', label: 'Methyl, axial', values: { flip: 100, substituent: 1, temperature: 298 } },
  ],
  init: () => ({ phase: 0 }),
  step(s: SimState, dt: number) {
    s.t += dt;
    s.vars.phase = s.t;
  },
  measurements: [
    {
      id: 'gap',
      label: 'Chair gap',
      unit: 'kJ/mol',
      decimals: 1,
      compute: (s) => energyGap(s.params.substituent),
    },
    {
      id: 'equatorialPopulation',
      label: 'Equatorial share',
      unit: '%',
      decimals: 1,
      compute: (s) => populations(s.params.substituent, s.params.temperature).equatorial * 100,
    },
    {
      id: 'axialPopulation',
      label: 'Axial share',
      unit: '%',
      decimals: 1,
      compute: (s) => populations(s.params.substituent, s.params.temperature).axial * 100,
    },
  ],
  formula: {
    expression: 'K = e^(-dE / RT)',
    terms: [
      { symbol: 'K', label: 'Axial over equatorial', measurementId: 'axialPopulation' },
      { symbol: 'dE', label: 'Chair gap', measurementId: 'gap' },
      { symbol: 'T', label: 'Temperature', paramId: 'temperature' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Flip (percent)',
    yLabel: 'Strain (kJ/mol)',
    xRange: () => [0, 100],
    yRange: (s) => [0, energyAt(50, s.params.substituent) * 1.15 + 1],
    series: [
      {
        id: 'strain',
        label: 'Strain',
        color: 'accent',
        sample: (s, x) => energyAt(x, s.params.substituent),
      },
    ],
  }),
  observations: [
    (s) => readout(s.params.flip),
    (s) => {
      const p = populations(s.params.substituent, s.params.temperature);
      if (!isMethyl(s.params.substituent)) {
        return 'No substituent, so the two chairs are equal and the population stays 50/50.';
      }
      return `Equatorial holds ${(p.equatorial * 100).toFixed(1)}% at ${s.params.temperature.toFixed(0)} K. Up stays up.`;
    },
  ],
  explanation(s: SimState) {
    const gap = energyGap(s.params.substituent);
    const p = populations(s.params.substituent, s.params.temperature);
    const where = readout(s.params.flip);
    if (!isMethyl(s.params.substituent)) {
      return `This ring has no substituent. Both chairs sit at the same energy, so each holds half the population at any temperature. The flip still swaps axial and equatorial. The label reads ${where}.`;
    }
    return `The methyl stays up while the flip moves it between equatorial and axial. The axial chair is ${gap.toFixed(1)} kJ/mol higher, an experimental A-value, so at ${s.params.temperature.toFixed(0)} K about ${(p.equatorial * 100).toFixed(1)}% of molecules sit equatorial. The label reads ${where}. The high point halfway along is the half-chair. This page does not draw a boat minimum.`;
  },
  draw: drawCyclohexaneChair,
};

export default cyclohexaneChairSim;
