// Chemical Bond Simulator — pick two elements and watch the bond between them slide along the
// continuum from nonpolar covalent, through polar covalent, to ionic.
//
// The point of the tool is the word CONTINUUM. Bond type is normally taught as three boxes with
// hard edges at 0.4 and 1.7 electronegativity difference, and students then classify by looking up
// which box a number falls in. Pauling's own relation is a smooth curve,
//
//     percent ionic character = 100 x (1 - e^(-(delta chi)^2 / 4))
//
// which happens to pass through 50% at delta chi = 1.7. That is where the famous cutoff comes from:
// it is a convention drawn on a curve, not a law the bond obeys.
//
// The tool says so out loud in the two places it matters. A bond sitting within 0.15 of a boundary
// is flagged as a boundary case rather than confidently sorted. And hydrogen fluoride, the textbook
// counterexample, is caught by name: delta chi is 1.78, so the cutoff calls it ionic while HF is a
// molecular gas. Any nonmetal pair past the threshold gets the same warning.
//
// Pure model + config. All canvas work lives in chemical-bond.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { elementOf } from '../data/elements';
import { drawChemicalBond } from './chemical-bond.draw';

/** Heaviest element the sliders offer. Past radon, Pauling's scale runs out of accepted values. */
export const MAX_BOND_Z = 86;

/** The conventional boundaries, in electronegativity difference. Conventions, not laws. */
export const NONPOLAR_LIMIT = 0.4;
export const IONIC_LIMIT = 1.7;

/** How close to a boundary counts as a boundary case worth flagging. */
export const BOUNDARY_MARGIN = 0.15;

/**
 * Elements that bond as nonmetals. A nonmetal pair cannot form an ionic lattice however large the
 * electronegativity difference gets, which is exactly why the 1.7 cutoff misclassifies HF.
 */
export const NONMETALS = new Set([1, 2, 6, 7, 8, 9, 10, 15, 16, 17, 18, 34, 35, 36, 53, 54, 86]);

export const electronegativityOf = (z: number): number | null => elementOf(z).electronegativity;

/** True when both elements carry a Pauling value, so a difference can be computed at all. */
export function isDefined(s: SimState): boolean {
  return electronegativityOf(Math.round(s.params.elementA)) !== null
    && electronegativityOf(Math.round(s.params.elementB)) !== null;
}

/** Electronegativity difference, or 0 when either element has no defined value. */
export function deltaEN(s: SimState): number {
  const a = electronegativityOf(Math.round(s.params.elementA));
  const b = electronegativityOf(Math.round(s.params.elementB));
  if (a === null || b === null) return 0;
  return Math.abs(a - b);
}

/** Pauling percent ionic character from an electronegativity difference. */
export function ionicCharacterOf(delta: number): number {
  return 100 * (1 - Math.exp(-(delta * delta) / 4));
}

export function ionicCharacter(s: SimState): number {
  return isDefined(s) ? ionicCharacterOf(deltaEN(s)) : 0;
}

export type BondType = 'nonpolar covalent' | 'polar covalent' | 'ionic' | 'undefined';

/** The bond type the conventional cutoffs give. */
export function bondType(s: SimState): BondType {
  if (!isDefined(s)) return 'undefined';
  const delta = deltaEN(s);
  if (delta < NONPOLAR_LIMIT) return 'nonpolar covalent';
  if (delta < IONIC_LIMIT) return 'polar covalent';
  return 'ionic';
}

/** How far the current difference sits from the nearer conventional boundary. */
export function distanceToBoundary(delta: number): number {
  return Math.min(Math.abs(delta - NONPOLAR_LIMIT), Math.abs(delta - IONIC_LIMIT));
}

/** True when the cutoff says ionic but both partners are nonmetals, so the label is wrong. */
export function isMisclassifiedNonmetalPair(s: SimState): boolean {
  if (!isDefined(s) || deltaEN(s) < IONIC_LIMIT) return false;
  return NONMETALS.has(Math.round(s.params.elementA)) && NONMETALS.has(Math.round(s.params.elementB));
}

/** Which element pulls the shared pair, as a signed offset: negative toward A, positive toward B. */
export function polarityDirection(s: SimState): number {
  const a = electronegativityOf(Math.round(s.params.elementA));
  const b = electronegativityOf(Math.round(s.params.elementB));
  if (a === null || b === null || a === b) return 0;
  return b > a ? 1 : -1;
}

/** How far the shared pair sits from the midpoint, 0 to 1, for the drawing. */
export function chargeOffset(s: SimState): number {
  return (ionicCharacter(s) / 100) * polarityDirection(s);
}

/** The bond as a chemist would write it, e.g. "Na-Cl". */
export function bondLabel(s: SimState): string {
  return `${elementOf(Math.round(s.params.elementA)).symbol}-${elementOf(Math.round(s.params.elementB)).symbol}`;
}

/** Cycles per second of the shared-pair oscillation on the canvas. */
export const CLOUD_HZ = 0.4;

/** Widest difference the graph plots: caesium to fluorine, the largest the table offers. */
export const MAX_DELTA = 3.3;

const chemicalBondSim: SimulationDef = {
  id: 'chemical-bond',
  aspect: 16 / 9,
  // Continuous: both parameters are identities, not initial conditions, so changing one re-costs
  // the bond without restarting the shared-pair animation.
  paramBehavior: 'continuous',
  params: [
    { id: 'elementA', label: 'First element (Z)', unit: '', min: 1, max: MAX_BOND_Z, step: 1, default: 11, decimals: 0 },
    { id: 'elementB', label: 'Second element (Z)', unit: '', min: 1, max: MAX_BOND_Z, step: 1, default: 17, decimals: 0 },
  ],
  presets: [
    { id: 'nacl', label: 'Na-Cl, ionic', values: { elementA: 11, elementB: 17 } },
    { id: 'hcl', label: 'H-Cl, polar covalent', values: { elementA: 1, elementB: 17 } },
    { id: 'oo', label: 'O=O, nonpolar', values: { elementA: 8, elementB: 8 } },
    { id: 'hf', label: 'H-F, where the cutoff fails', values: { elementA: 1, elementB: 9 } },
    { id: 'csf', label: 'Cs-F, the largest difference', values: { elementA: 55, elementB: 9 } },
  ],
  init: () => ({ phase: 0 }),
  step(s: SimState, dt: number) {
    s.t += dt;
    s.vars.phase = (s.vars.phase + dt * CLOUD_HZ) % 1;
  },
  measurements: [
    { id: 'deltaEN', label: 'Electronegativity difference', unit: '', decimals: 2, compute: deltaEN },
    { id: 'ionicCharacter', label: 'Ionic character', unit: '%', decimals: 1, compute: ionicCharacter },
    {
      id: 'enA',
      label: 'First electronegativity',
      unit: '',
      decimals: 2,
      compute: (s) => electronegativityOf(Math.round(s.params.elementA)) ?? 0,
    },
    {
      id: 'enB',
      label: 'Second electronegativity',
      unit: '',
      decimals: 2,
      compute: (s) => electronegativityOf(Math.round(s.params.elementB)) ?? 0,
    },
  ],
  formula: {
    expression: 'ionic % = (1 − e^(−Δχ² / 4)) × 100',
    terms: [
      { symbol: 'ionic %', label: 'Ionic character', measurementId: 'ionicCharacter' },
      { symbol: 'Δχ', label: 'Electronegativity difference', measurementId: 'deltaEN' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Electronegativity difference Δχ',
    yLabel: 'Ionic character (%)',
    xRange: () => [0, MAX_DELTA],
    yRange: () => [0, 100],
    series: [
      { id: 'pauling', label: 'Pauling curve', color: 'accent', sample: (_s, x) => ionicCharacterOf(x) },
      { id: 'current', label: 'This bond', color: 'danger', sample: (s) => ionicCharacter(s) },
    ],
  }),
  observations: [
    (s) => {
      if (isDefined(s)) return null;
      const a = elementOf(Math.round(s.params.elementA));
      const b = elementOf(Math.round(s.params.elementB));
      const missing = electronegativityOf(a.z) === null ? a.name : b.name;
      return `Pauling's scale defines no electronegativity for ${missing}, so there is no difference to report and the readouts stay at zero.`;
    },
    (s) => {
      if (!isDefined(s)) return null;
      if (deltaEN(s) === 0) return 'Two atoms of equal electronegativity share the pair evenly, so the bond is perfectly nonpolar however electronegative both partners are.';
      return `The shared pair sits closer to ${elementOf(Math.round(polarityDirection(s) > 0 ? s.params.elementB : s.params.elementA)).name}, giving it the partial negative charge.`;
    },
    (s) => {
      if (!isMisclassifiedNonmetalPair(s)) return null;
      return `Careful: the difference is past 1.7, so the cutoff calls this ionic, but both partners are nonmetals and this is a molecular compound. The cutoff is a convention, and this is where it fails.`;
    },
    (s) => {
      if (!isDefined(s) || isMisclassifiedNonmetalPair(s)) return null;
      const gap = distanceToBoundary(deltaEN(s));
      if (gap > BOUNDARY_MARGIN) return null;
      return `This bond sits within ${BOUNDARY_MARGIN} of a conventional boundary, so the label depends on which textbook's cutoff you use. Read the percentage rather than the box.`;
    },
    (s) => {
      if (!isDefined(s)) return null;
      return `At ${deltaEN(s).toFixed(2)} difference the bond is ${ionicCharacter(s).toFixed(0)}% ionic, which the cutoffs call ${bondType(s)}.`;
    },
  ],
  explanation(s: SimState) {
    const a = elementOf(Math.round(s.params.elementA));
    const b = elementOf(Math.round(s.params.elementB));
    if (!isDefined(s)) {
      return `A bond between ${a.name} and ${b.name} cannot be scored here, because Pauling's electronegativity scale defines no value for at least one of them. The noble gases below radon and the synthetic elements have no accepted value; that is a real gap in the scale rather than missing data.`;
    }
    const delta = deltaEN(s);
    const percent = ionicCharacter(s);
    const puller = polarityDirection(s) >= 0 ? b : a;
    if (delta === 0) {
      return `${a.symbol} and ${b.symbol} have the same electronegativity, so neither atom pulls the shared pair harder and the bond is 0% ionic. This is the pure covalent end of the scale, and it is the only place the electrons genuinely sit at the midpoint.`;
    }
    return `${a.name} at ${a.electronegativity} and ${b.name} at ${b.electronegativity} differ by ${delta.toFixed(2)}, so ${puller.name} pulls the shared pair toward itself. Pauling's relation turns that into ${percent.toFixed(0)}% ionic character, which the conventional cutoffs at ${NONPOLAR_LIMIT} and ${IONIC_LIMIT} label ${bondType(s)}. The curve is smooth, so a bond does not change nature at a boundary; only the name we give it does.`;
  },
  draw: drawChemicalBond,
};

export default chemicalBondSim;
