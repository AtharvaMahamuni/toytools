// Crystal Field Splitting Simulator — the d-orbital energy diagram of a transition metal complex,
// filled by the electrons themselves rather than by the reader.
//
// Five d orbitals that are degenerate in the free ion split once ligands approach. In an octahedral
// field the three t2g orbitals drop 0.4 delta and the two eg orbitals rise 0.6 delta; in a
// tetrahedral field the sets swap and the gap shrinks to four ninths of the octahedral one, which
// is why tetrahedral complexes are high spin in practice.
//
// The spin state is not asserted here, it is DECIDED: both the high-spin and the low-spin
// configuration are built and costed (crystal field energy plus the extra pairing the configuration
// forces beyond the free ion), and whichever is lower wins. That reproduces the delta versus P rule
// for d4 through d7 and correctly reports d1 through d3 and d8 through d10 as having one
// configuration only, without special-casing a single d count.
//
// Pure model + config. All canvas work lives in crystal-field.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { drawCrystalField } from './crystal-field.draw';

/** 1 cm^-1 in kJ/mol. Ligand field strengths are quoted in wavenumbers, energies in kJ/mol. */
export const CM1_TO_KJ = 0.0119627;

/** Tetrahedral splitting as a fraction of the octahedral splitting for the same ligand set. */
export const TETRAHEDRAL_RATIO = 4 / 9;

/** How the five d orbitals divide into a lower and an upper set for each geometry. */
export function orbitalSets(tetrahedral: boolean): { lower: number; upper: number } {
  return tetrahedral ? { lower: 2, upper: 3 } : { lower: 3, upper: 2 };
}

/** Orbital energies of the two sets, in units of the splitting, measured from the barycentre. */
export function orbitalEnergies(tetrahedral: boolean): { lower: number; upper: number } {
  return tetrahedral ? { lower: -0.6, upper: 0.4 } : { lower: -0.4, upper: 0.6 };
}

/** Set labels, which change with the geometry as well as the ordering. */
export function setLabels(tetrahedral: boolean): { lower: string; upper: string } {
  return tetrahedral ? { lower: 'e', upper: 't2' } : { lower: 't2g', upper: 'eg' };
}

export interface Occupancy {
  lower: number;
  upper: number;
  unpaired: number;
  pairs: number;
}

/** Unpaired electrons when `electrons` are spread over `orbitals` by Hund's rule. */
export function unpairedIn(electrons: number, orbitals: number): number {
  if (electrons <= orbitals) return Math.max(0, electrons);
  return Math.max(0, 2 * orbitals - electrons);
}

/** High spin: every orbital takes one electron, lower set first, before anything pairs up. */
export function highSpinOccupancy(n: number, lowerOrbitals: number, upperOrbitals: number): Occupancy {
  const singlesLower = Math.min(n, lowerOrbitals);
  const singlesUpper = Math.min(Math.max(n - lowerOrbitals, 0), upperOrbitals);
  const rest = Math.max(n - lowerOrbitals - upperOrbitals, 0);
  const pairsLower = Math.min(rest, lowerOrbitals);
  const lower = singlesLower + pairsLower;
  const upper = singlesUpper + (rest - pairsLower);
  const unpaired = unpairedIn(lower, lowerOrbitals) + unpairedIn(upper, upperOrbitals);
  return { lower, upper, unpaired, pairs: (n - unpaired) / 2 };
}

/** Low spin: the lower set fills completely, pairing included, before the upper set is touched. */
export function lowSpinOccupancy(n: number, lowerOrbitals: number, upperOrbitals: number): Occupancy {
  const lower = Math.min(n, 2 * lowerOrbitals);
  const upper = n - lower;
  const unpaired = unpairedIn(lower, lowerOrbitals) + unpairedIn(upper, upperOrbitals);
  return { lower, upper, unpaired, pairs: (n - unpaired) / 2 };
}

/** Electron pairs the free ion already has, so only the EXTRA pairing a field forces is charged. */
export function freeIonPairs(n: number): number {
  return (n - unpairedIn(n, 5)) / 2;
}

/** Crystal field stabilization energy of an occupancy, in kJ/mol. Negative means stabilized. */
export function crystalFieldEnergy(occ: Occupancy, tetrahedral: boolean, splittingCm: number): number {
  const e = orbitalEnergies(tetrahedral);
  return (occ.lower * e.lower + occ.upper * e.upper) * splittingCm * CM1_TO_KJ;
}

/** Total cost of a configuration relative to the free ion: field energy plus the extra pairing. */
export function configurationEnergy(
  occ: Occupancy,
  n: number,
  tetrahedral: boolean,
  splittingCm: number,
  pairingCm: number,
): number {
  const extraPairs = occ.pairs - freeIonPairs(n);
  return crystalFieldEnergy(occ, tetrahedral, splittingCm) + extraPairs * pairingCm * CM1_TO_KJ;
}

export const isTetrahedral = (s: SimState): boolean => s.params.geometry >= 0.5;

/** The splitting the complex actually experiences: delta o, or four ninths of it if tetrahedral. */
export function splittingCm(s: SimState): number {
  return isTetrahedral(s) ? s.params.fieldStrength * TETRAHEDRAL_RATIO : s.params.fieldStrength;
}

/** The configuration the complex adopts: whichever of the two costs less. Ties go to high spin. */
export function occupancyOf(s: SimState): Occupancy {
  const n = Math.round(s.params.dElectrons);
  const tet = isTetrahedral(s);
  const sets = orbitalSets(tet);
  const delta = splittingCm(s);
  const p = s.params.pairingEnergy;
  const hs = highSpinOccupancy(n, sets.lower, sets.upper);
  const ls = lowSpinOccupancy(n, sets.lower, sets.upper);
  const eHs = configurationEnergy(hs, n, tet, delta, p);
  const eLs = configurationEnergy(ls, n, tet, delta, p);
  return eLs < eHs - 1e-9 ? ls : hs;
}

/** True when the complex has genuinely chosen low spin over an available high-spin alternative. */
export function isLowSpin(s: SimState): boolean {
  const n = Math.round(s.params.dElectrons);
  const sets = orbitalSets(isTetrahedral(s));
  const hs = highSpinOccupancy(n, sets.lower, sets.upper);
  return occupancyOf(s).unpaired < hs.unpaired;
}

/** d counts where the two configurations differ at all, so a spin state is a real question. */
export function hasSpinChoice(s: SimState): boolean {
  const n = Math.round(s.params.dElectrons);
  const sets = orbitalSets(isTetrahedral(s));
  return highSpinOccupancy(n, sets.lower, sets.upper).unpaired !== lowSpinOccupancy(n, sets.lower, sets.upper).unpaired;
}

/** Spin-only magnetic moment in Bohr magnetons. */
export function spinOnlyMoment(unpaired: number): number {
  return Math.sqrt(unpaired * (unpaired + 2));
}

/** Wavelength of the d to d absorption, in nm. */
export function absorptionNm(s: SimState): number {
  return 1e7 / Math.max(1, splittingCm(s));
}

/** True when a d to d transition exists at all: something to promote, and a hole to promote it to. */
export function hasTransition(s: SimState): boolean {
  const n = Math.round(s.params.dElectrons);
  return n > 0 && n < 10;
}

interface ColourBand {
  absorbed: string;
  observed: string;
  /** Theme-invariant swatch for the observed colour: this is data, not chrome. */
  hex: string;
}

const COLOUR_BANDS: { max: number; band: ColourBand }[] = [
  { max: 435, band: { absorbed: 'violet', observed: 'yellow-green', hex: 'rgb(200, 214, 74)' } },
  { max: 480, band: { absorbed: 'blue', observed: 'yellow', hex: 'rgb(242, 213, 68)' } },
  { max: 490, band: { absorbed: 'green-blue', observed: 'orange', hex: 'rgb(232, 145, 60)' } },
  { max: 500, band: { absorbed: 'blue-green', observed: 'red', hex: 'rgb(214, 71, 60)' } },
  { max: 560, band: { absorbed: 'green', observed: 'purple', hex: 'rgb(155, 79, 160)' } },
  { max: 580, band: { absorbed: 'yellow-green', observed: 'violet', hex: 'rgb(123, 79, 196)' } },
  { max: 595, band: { absorbed: 'yellow', observed: 'blue', hex: 'rgb(63, 111, 214)' } },
  { max: 650, band: { absorbed: 'orange', observed: 'green-blue', hex: 'rgb(47, 163, 148)' } },
  { max: 750, band: { absorbed: 'red', observed: 'blue-green', hex: 'rgb(63, 180, 168)' } },
];

const COLOURLESS: ColourBand = { absorbed: 'nothing visible', observed: 'colourless', hex: 'rgb(228, 228, 224)' };

/** Absorbed and observed colour for a d to d band, using the standard complementary pairs. */
export function colourFor(nm: number): ColourBand {
  if (!(nm >= 400) || nm > 750) return COLOURLESS;
  for (const entry of COLOUR_BANDS) if (nm <= entry.max) return entry.band;
  return COLOURLESS;
}

/** The observed colour of the current complex, allowing for d0 and d10 having no transition. */
export function observedColour(s: SimState): ColourBand {
  return hasTransition(s) ? colourFor(absorptionNm(s)) : COLOURLESS;
}

/** How fast the absorption animation cycles on the canvas, in cycles per second. */
export const PHOTON_HZ = 0.5;

const crystalFieldSim: SimulationDef = {
  id: 'crystal-field',
  aspect: 16 / 9,
  // Continuous: every parameter is a property of the complex, not an initial condition, so changing
  // one re-costs the configuration without restarting anything.
  paramBehavior: 'continuous',
  params: [
    { id: 'dElectrons', label: 'd electrons', unit: '', min: 0, max: 10, step: 1, default: 6, decimals: 0 },
    { id: 'fieldStrength', label: 'Ligand field Δo', unit: 'cm⁻¹', min: 2000, max: 40000, step: 100, default: 20000, decimals: 0 },
    { id: 'pairingEnergy', label: 'Pairing energy P', unit: 'cm⁻¹', min: 8000, max: 30000, step: 100, default: 19000, decimals: 0 },
    { id: 'geometry', label: 'Geometry (0 octahedral, 1 tetrahedral)', unit: '', min: 0, max: 1, step: 1, default: 0, decimals: 0 },
  ],
  presets: [
    { id: 'fe-aqua', label: '[Fe(H2O)6]2+ high spin', values: { dElectrons: 6, fieldStrength: 10400, pairingEnergy: 19000, geometry: 0 } },
    { id: 'fe-cyano', label: '[Fe(CN)6]4- low spin', values: { dElectrons: 6, fieldStrength: 33000, pairingEnergy: 19000, geometry: 0 } },
    { id: 'cr-aqua', label: '[Cr(H2O)6]3+', values: { dElectrons: 3, fieldStrength: 17400, pairingEnergy: 19000, geometry: 0 } },
    { id: 'ni-ammine', label: '[Ni(NH3)6]2+', values: { dElectrons: 8, fieldStrength: 10800, pairingEnergy: 19000, geometry: 0 } },
    { id: 'co-chloro', label: '[CoCl4]2- tetrahedral', values: { dElectrons: 7, fieldStrength: 9000, pairingEnergy: 19000, geometry: 1 } },
  ],
  init: () => ({ phase: 0 }),
  step(s: SimState, dt: number) {
    s.t += dt;
    s.vars.phase = (s.vars.phase + dt * PHOTON_HZ) % 1;
  },
  measurements: [
    {
      id: 'cfse',
      label: 'CFSE',
      unit: 'kJ/mol',
      decimals: 1,
      compute: (s) => crystalFieldEnergy(occupancyOf(s), isTetrahedral(s), splittingCm(s)),
    },
    { id: 'unpaired', label: 'Unpaired electrons', unit: '', decimals: 0, compute: (s) => occupancyOf(s).unpaired },
    {
      id: 'moment',
      label: 'Magnetic moment',
      unit: 'BM',
      decimals: 2,
      compute: (s) => spinOnlyMoment(occupancyOf(s).unpaired),
    },
    { id: 'splitting', label: 'Splitting Δ', unit: 'cm⁻¹', decimals: 0, compute: (s) => splittingCm(s) },
    {
      id: 'absorption',
      label: 'Absorption λ',
      unit: 'nm',
      decimals: 0,
      compute: (s) => (hasTransition(s) ? absorptionNm(s) : 0),
    },
  ],
  formula: {
    expression: 'μ = √(n × (n + 2))',
    terms: [
      { symbol: 'μ', label: 'Spin-only magnetic moment', measurementId: 'moment' },
      { symbol: 'n', label: 'Unpaired electrons', measurementId: 'unpaired' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Ligand field Δo (cm⁻¹)',
    yLabel: 'Configuration energy (kJ/mol)',
    xRange: () => [0, 40000],
    yRange: (s) => {
      const n = Math.round(s.params.dElectrons);
      const tet = isTetrahedral(s);
      const sets = orbitalSets(tet);
      const scale = tet ? TETRAHEDRAL_RATIO : 1;
      const p = s.params.pairingEnergy;
      const values = [0, 40000].flatMap((x) => [
        configurationEnergy(highSpinOccupancy(n, sets.lower, sets.upper), n, tet, x * scale, p),
        configurationEnergy(lowSpinOccupancy(n, sets.lower, sets.upper), n, tet, x * scale, p),
      ]);
      const lo = Math.min(...values);
      const hi = Math.max(...values);
      const pad = Math.max(10, (hi - lo) * 0.1);
      return [lo - pad, hi + pad];
    },
    series: [
      {
        id: 'highSpin',
        label: 'High spin',
        color: 'accent',
        sample: (s, x) => {
          const n = Math.round(s.params.dElectrons);
          const tet = isTetrahedral(s);
          const sets = orbitalSets(tet);
          const delta = tet ? x * TETRAHEDRAL_RATIO : x;
          return configurationEnergy(highSpinOccupancy(n, sets.lower, sets.upper), n, tet, delta, s.params.pairingEnergy);
        },
      },
      {
        id: 'lowSpin',
        label: 'Low spin',
        color: 'danger',
        sample: (s, x) => {
          const n = Math.round(s.params.dElectrons);
          const tet = isTetrahedral(s);
          const sets = orbitalSets(tet);
          const delta = tet ? x * TETRAHEDRAL_RATIO : x;
          return configurationEnergy(lowSpinOccupancy(n, sets.lower, sets.upper), n, tet, delta, s.params.pairingEnergy);
        },
      },
    ],
  }),
  pointer: {
    hint: 'Tap the complex to switch between octahedral and tetrahedral',
    handle(s: SimState, ev) {
      if (ev.type !== 'tap') return null;
      return { geometry: isTetrahedral(s) ? 0 : 1 };
    },
  },
  observations: [
    (s) => {
      const n = Math.round(s.params.dElectrons);
      if (n === 0) return 'A d0 ion has no d electrons to promote, so there is no d to d absorption and no crystal field stabilization.';
      if (n === 10) return 'A d10 ion has every d orbital full, so there is no hole to promote an electron into and no d to d colour.';
      return null;
    },
    (s) => {
      if (!hasSpinChoice(s)) {
        return `A d${Math.round(s.params.dElectrons)} ion in this geometry has only one way to fill the orbitals, so high spin and low spin describe the same arrangement.`;
      }
      const delta = splittingCm(s);
      const p = s.params.pairingEnergy;
      return isLowSpin(s)
        ? `Low spin: the splitting of ${delta.toFixed(0)} cm⁻¹ beats the ${p.toFixed(0)} cm⁻¹ it costs to pair two electrons, so the lower set fills first.`
        : `High spin: pairing costs ${p.toFixed(0)} cm⁻¹ and the splitting is only ${delta.toFixed(0)} cm⁻¹, so electrons climb to the upper set instead of pairing.`;
    },
    (s) => {
      const unpaired = occupancyOf(s).unpaired;
      if (unpaired === 0) return 'With no unpaired electrons the complex is diamagnetic, and a magnetic balance reads essentially nothing.';
      return `${unpaired} unpaired electron${unpaired === 1 ? '' : 's'} give a spin-only moment of ${spinOnlyMoment(unpaired).toFixed(2)} BM, which is what a magnetic measurement compares against.`;
    },
    (s) => {
      if (!hasTransition(s)) return null;
      const nm = absorptionNm(s);
      const colour = observedColour(s);
      if (colour.observed === 'colourless') {
        return `The gap puts the absorption at ${nm.toFixed(0)} nm, outside the visible range, so the complex looks pale or colourless.`;
      }
      return `The complex absorbs ${colour.absorbed} light near ${nm.toFixed(0)} nm, so it looks ${colour.observed}, the complementary colour.`;
    },
    (s) => {
      if (!isTetrahedral(s)) return null;
      return 'Tetrahedral fields split the d orbitals only four ninths as far as octahedral ones, which is why tetrahedral complexes are almost always high spin.';
    },
  ],
  explanation(s: SimState) {
    const n = Math.round(s.params.dElectrons);
    const tet = isTetrahedral(s);
    const labels = setLabels(tet);
    const occ = occupancyOf(s);
    const geometry = tet ? 'tetrahedral' : 'octahedral';
    if (n === 0) {
      return `A d0 metal ion in an ${geometry} field still has split orbitals, but nothing occupies them. CFSE is zero, the complex is diamagnetic, and any colour it shows comes from charge transfer rather than a d to d transition. Add electrons with the slider to start filling the diagram.`;
    }
    const colour = observedColour(s);
    const colourLine = hasTransition(s)
      ? `The ${splittingCm(s).toFixed(0)} cm⁻¹ gap absorbs at ${absorptionNm(s).toFixed(0)} nm, leaving the complex looking ${colour.observed}.`
      : 'A full d shell leaves no d to d transition, so the complex has no colour of its own.';
    return `This is a d${n} ion in an ${geometry} field, with ${occ.lower} electron${occ.lower === 1 ? '' : 's'} in the ${labels.lower} set and ${occ.upper} in the ${labels.upper} set. The configuration is the cheaper of the two on offer once the splitting and the pairing energy are both counted, which leaves ${occ.unpaired} unpaired and a CFSE of ${crystalFieldEnergy(occ, tet, splittingCm(s)).toFixed(1)} kJ/mol. ${colourLine}`;
  },
  draw: drawCrystalField,
};

export default crystalFieldSim;
