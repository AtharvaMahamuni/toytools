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

/** Puckering of the chair: carbons sit this far above or below the mean plane, ring radius 1. */
export const PUCKER = 0.25;
/** Bond length for the axial and equatorial stubs, ring radius 1. */
export const STUB = 0.42;
/** View tilt: how much of the ring's depth shows on screen. */
const DEPTH = 0.32;

export interface Point3 { x: number; y: number; z: number }
export type BondKind = 'axial' | 'equatorial';
export interface ChairBond { carbon: number; from: Point3; to: Point3; kind: BondKind; methyl: boolean }
export interface ChairGeometry { carbons: Point3[]; bonds: ChairBond[] }

function lerp3(a: Point3, b: Point3, u: number): Point3 {
  return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u };
}

/** Carbon i's height. Carbon 0 starts down, so its equatorial bond tilts up. */
function sideOf(i: number, flipped: boolean): number {
  const down = i % 2 === 0;
  return (down !== flipped ? -1 : 1);
}

function stubs(i: number, flipped: boolean): { axial: Point3; equatorial: Point3 } {
  const ang = (i * Math.PI) / 3;
  const side = sideOf(i, flipped);
  return {
    axial: { x: 0, y: 0, z: side * STUB },
    equatorial: { x: Math.cos(ang) * STUB * 0.94, y: Math.sin(ang) * STUB * 0.94, z: -side * STUB * 0.33 },
  };
}

/**
 * A real chair in 3D (z up), flipped by t from 0 to 1. Every carbon moves from one face of the
 * ring to the other, so every axial bond becomes equatorial and every equatorial bond axial.
 * Carbon 0 carries the methyl: equatorial at t = 0 and axial at t = 1, pointing up both times.
 */
export function chairGeometry(flipPercent: number): ChairGeometry {
  const t = Math.min(1, Math.max(0, flipPercent / 100));
  const carbons: Point3[] = [];
  const bonds: ChairBond[] = [];
  for (let i = 0; i < 6; i++) {
    const ang = (i * Math.PI) / 3;
    const z = sideOf(i, false) * PUCKER * (1 - 2 * t);
    const c = { x: Math.cos(ang), y: Math.sin(ang), z };
    carbons.push(c);
    const before = stubs(i, false);
    const after = stubs(i, true);
    // Bond one is axial before the flip and equatorial after it. Bond two the reverse.
    const one = lerp3(before.axial, after.equatorial, t);
    const two = lerp3(before.equatorial, after.axial, t);
    const early = t < 0.5;
    bonds.push({ carbon: i, from: c, to: lerp3(c, { x: c.x + one.x, y: c.y + one.y, z: c.z + one.z }, 1), kind: early ? 'axial' : 'equatorial', methyl: false });
    bonds.push({ carbon: i, from: c, to: { x: c.x + two.x, y: c.y + two.y, z: c.z + two.z }, kind: early ? 'equatorial' : 'axial', methyl: i === 0 });
  }
  return { carbons, bonds };
}

/** Screen projection, viewed slightly from above: x across, ring depth and z both on screen y (down positive). */
export function project(p: Point3): { x: number; y: number } {
  return { x: p.x, y: p.y * DEPTH - p.z };
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
      id: 'k',
      label: 'K (axial over equatorial)',
      unit: '',
      decimals: 3,
      compute: (s) => axialOverEquatorial(s.params.substituent, s.params.temperature),
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
      { symbol: 'K', label: 'Axial over equatorial', measurementId: 'k' },
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
