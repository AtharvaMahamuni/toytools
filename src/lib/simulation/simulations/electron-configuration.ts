// Electron Configuration Simulator — build an atom one electron at a time, in the order the
// electrons actually go in, and see which of them are the ones that bond.
//
// Three things this does that a configuration string on its own does not:
//
//   IT FILLS IN ORDER. The electrons are placed over time in Madelung (aufbau) order, so 4s
//     visibly fills before 3d. That ordering is the single most counter-intuitive fact in the
//     topic, and a finished string hides it completely.
//
//   IT KNOWS THE EXCEPTIONS. Chromium and copper are not aufbau, and neither are eighteen other
//     ground states. They are stored as an explicit electron transfer (4s to 3d for chromium),
//     which is both the compact encoding and the actual explanation: a half or fully filled d
//     subshell wins. Guessing from aufbau alone and calling it correct is the mistake this is here
//     to stop.
//
//   IT HANDLES IONS. A cation loses electrons from the highest principal shell first, NOT in
//     reverse aufbau order, which is why Fe2+ is [Ar] 3d6 and not [Ar] 4s2 3d4. Most tools either
//     get this backwards or refuse ions altogether.
//
// Pure model + config. All canvas work lives in electron-configuration.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { MAX_Z, elementOf } from '../data/elements';
import { drawElectronConfiguration } from './electron-configuration.draw';

export interface Subshell {
  n: number;
  /** Azimuthal quantum number: 0 = s, 1 = p, 2 = d, 3 = f. */
  l: number;
  label: string;
  capacity: number;
}

const ORBITAL_LETTERS = ['s', 'p', 'd', 'f'];

function subshell(n: number, l: number): Subshell {
  return { n, l, label: `${n}${ORBITAL_LETTERS[l]}`, capacity: 2 * (2 * l + 1) };
}

/**
 * Subshells in Madelung order: lowest n + l first, and lowest n breaking a tie. Written out rather
 * than sorted so the order is readable at a glance, and asserted against the rule in the tests.
 * The capacities sum to exactly 118, the size of the periodic table.
 */
export const AUFBAU: Subshell[] = [
  subshell(1, 0),
  subshell(2, 0), subshell(2, 1),
  subshell(3, 0), subshell(3, 1),
  subshell(4, 0), subshell(3, 2), subshell(4, 1),
  subshell(5, 0), subshell(4, 2), subshell(5, 1),
  subshell(6, 0), subshell(4, 3), subshell(5, 2), subshell(6, 1),
  subshell(7, 0), subshell(5, 3), subshell(6, 2), subshell(7, 1),
];

/** Atomic numbers of the noble gases, used for the shorthand core. */
export const NOBLE_GASES = [2, 10, 18, 36, 54, 86];

/**
 * Ground states that are not what aufbau predicts, as the electron transfer that produces them.
 * Every one of these is driven by the stability of a half-filled or filled d or f subshell.
 */
export const EXCEPTIONS: Record<number, { from: string; to: string; count: number }> = {
  24: { from: '4s', to: '3d', count: 1 }, // Cr: half-filled 3d5
  29: { from: '4s', to: '3d', count: 1 }, // Cu: filled 3d10
  41: { from: '5s', to: '4d', count: 1 },
  42: { from: '5s', to: '4d', count: 1 },
  44: { from: '5s', to: '4d', count: 1 },
  45: { from: '5s', to: '4d', count: 1 },
  46: { from: '5s', to: '4d', count: 2 }, // Pd: empties 5s entirely
  47: { from: '5s', to: '4d', count: 1 },
  57: { from: '4f', to: '5d', count: 1 },
  58: { from: '4f', to: '5d', count: 1 },
  64: { from: '4f', to: '5d', count: 1 }, // Gd: half-filled 4f7
  78: { from: '6s', to: '5d', count: 1 },
  79: { from: '6s', to: '5d', count: 1 }, // Au: filled 5d10
  89: { from: '5f', to: '6d', count: 1 },
  90: { from: '5f', to: '6d', count: 2 },
  91: { from: '5f', to: '6d', count: 1 },
  92: { from: '5f', to: '6d', count: 1 },
  93: { from: '5f', to: '6d', count: 1 },
  96: { from: '5f', to: '6d', count: 1 }, // Cm: half-filled 5f7
  103: { from: '6d', to: '7p', count: 1 },
};

/** Electron counts per subshell, indexed the same way as AUFBAU. */
export type Configuration = number[];

/** Fill `count` electrons straight down the Madelung order, with no exceptions applied. */
export function aufbauFill(count: number): Configuration {
  let left = Math.max(0, Math.min(count, MAX_Z));
  return AUFBAU.map((s) => {
    const take = Math.min(left, s.capacity);
    left -= take;
    return take;
  });
}

const indexOfLabel = (label: string) => AUFBAU.findIndex((s) => s.label === label);

/** The ground-state configuration of a NEUTRAL atom: aufbau, then its exception if it has one. */
export function neutralConfiguration(z: number): Configuration {
  const config = aufbauFill(z);
  const swap = EXCEPTIONS[z];
  if (!swap) return config;
  const from = indexOfLabel(swap.from);
  const to = indexOfLabel(swap.to);
  if (from < 0 || to < 0) return config;
  const moved = Math.min(swap.count, config[from]!, AUFBAU[to]!.capacity - config[to]!);
  config[from]! -= moved;
  config[to]! += moved;
  return config;
}

/**
 * The configuration of an ion. Electrons are removed from the highest principal shell first, which
 * is what makes Fe2+ [Ar] 3d6: the 4s electrons go before the 3d ones, even though 4s filled first.
 * Added electrons continue down the aufbau order.
 */
export function configurationFor(z: number, charge: number): Configuration {
  const electrons = z - charge;
  if (electrons <= 0) return AUFBAU.map(() => 0);
  if (charge <= 0) return chargeAdjustedAnion(z, electrons);

  const config = neutralConfiguration(z);
  let toRemove = charge;
  // Highest n first, then highest l within that n: the outermost electrons leave first.
  const order = AUFBAU.map((s, i) => ({ i, n: s.n, l: s.l }))
    .sort((a, b) => b.n - a.n || b.l - a.l);
  for (const slot of order) {
    if (toRemove <= 0) break;
    const take = Math.min(toRemove, config[slot.i]!);
    config[slot.i]! -= take;
    toRemove -= take;
  }
  return config;
}

/** An anion (or neutral atom) is simply the aufbau ground state for that electron count. */
function chargeAdjustedAnion(z: number, electrons: number): Configuration {
  // Exceptions are ground states of neutral ATOMS, so they only apply when the count matches z.
  return electrons === z ? neutralConfiguration(z) : aufbauFill(electrons);
}

export const totalElectrons = (config: Configuration): number => config.reduce((a, b) => a + b, 0);

/** The highest principal shell holding any electrons, or 0 for a bare nucleus. */
export function outermostShell(config: Configuration): number {
  let max = 0;
  for (let i = 0; i < config.length; i++) if (config[i]! > 0) max = Math.max(max, AUFBAU[i]!.n);
  return max;
}

/** Electrons in the outermost shell: the ones a main-group atom bonds with. */
export function valenceElectrons(config: Configuration): number {
  const n = outermostShell(config);
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < config.length; i++) if (AUFBAU[i]!.n === n) sum += config[i]!;
  return sum;
}

/** Electrons in an incomplete d subshell one shell below the outermost: a transition metal's own. */
export function dElectrons(config: Configuration): number {
  const n = outermostShell(config);
  let sum = 0;
  for (let i = 0; i < config.length; i++) {
    const s = AUFBAU[i]!;
    if (s.l === 2 && s.n === n - 1 && config[i]! > 0 && config[i]! < s.capacity) sum += config[i]!;
  }
  return sum;
}

/** Unpaired electrons, by Hund's rule within each subshell. */
export function unpairedElectrons(config: Configuration): number {
  let sum = 0;
  for (let i = 0; i < config.length; i++) {
    const orbitals = 2 * AUFBAU[i]!.l + 1;
    const e = config[i]!;
    sum += e <= orbitals ? e : 2 * orbitals - e;
  }
  return sum;
}

/** Electrons in principal shell `n`. */
export function electronsInShell(config: Configuration, n: number): number {
  let sum = 0;
  for (let i = 0; i < config.length; i++) if (AUFBAU[i]!.n === n) sum += config[i]!;
  return sum;
}

/** The configuration written out, e.g. "1s2 2s2 2p6 3s2 3p6 4s2 3d6". */
export function configurationString(config: Configuration): string {
  const parts: string[] = [];
  for (let i = 0; i < config.length; i++) if (config[i]! > 0) parts.push(`${AUFBAU[i]!.label}${config[i]}`);
  return parts.join(' ') || 'no electrons';
}

/**
 * The largest noble gas whose electron count the configuration fully contains, or 0 for none.
 *
 * A core EQUAL to the electron count counts, which is what makes the chloride ion [Ar] rather than
 * [Ne] 3s2 3p6. The whole point of an isoelectronic ion is that it has reached that noble gas.
 */
export function nobleCore(config: Configuration): number {
  const total = totalElectrons(config);
  let core = 0;
  for (const z of NOBLE_GASES) {
    if (z > total) break;
    // Only a core the configuration actually matches, so an unusual ion never claims a false one.
    const coreConfig = aufbauFill(z);
    if (coreConfig.every((count, i) => config[i]! >= count)) core = z;
  }
  return core;
}

/**
 * Noble-gas shorthand, e.g. "[Ar] 4s2 3d6". Falls back to the full string when no core applies.
 *
 * Pass the atomic number to suppress the circular case: neon's own configuration written as "[Ne]"
 * defines the element in terms of itself and tells the reader nothing.
 */
export function shorthandString(config: Configuration, z?: number): string {
  const core = nobleCore(config);
  if (!core || core === z) return configurationString(config);
  const coreConfig = aufbauFill(core);
  const parts: string[] = [];
  for (let i = 0; i < config.length; i++) {
    const rest = config[i]! - coreConfig[i]!;
    if (rest > 0) parts.push(`${AUFBAU[i]!.label}${rest}`);
  }
  return `[${elementOf(core).symbol}]${parts.length ? ` ${parts.join(' ')}` : ''}`;
}

/** Electrons placed per second while the fill animates. */
export const FILL_RATE = 6;

/** The live configuration, truncated to however many electrons have been placed so far. */
export function placedConfiguration(s: SimState): Configuration {
  const full = configurationFor(Math.round(s.params.atomicNumber), Math.round(s.params.charge));
  let left = Math.floor(s.vars.placed);
  return full.map((count) => {
    const take = Math.min(left, count);
    left -= take;
    return take;
  });
}

/** The finished configuration for the current sliders, regardless of the fill animation. */
export function currentConfiguration(s: SimState): Configuration {
  return configurationFor(Math.round(s.params.atomicNumber), Math.round(s.params.charge));
}

/** Ion label for the current sliders, e.g. "Fe2+", or the bare symbol when neutral. */
export function speciesLabel(s: SimState): string {
  const z = Math.round(s.params.atomicNumber);
  const charge = Math.round(s.params.charge);
  const symbol = elementOf(z).symbol;
  if (charge === 0) return symbol;
  const magnitude = Math.abs(charge) === 1 ? '' : String(Math.abs(charge));
  return `${symbol}${magnitude}${charge > 0 ? '+' : '-'}`;
}

const electronConfigurationSim: SimulationDef = {
  id: 'electron-configuration',
  aspect: 16 / 9,
  // Restart: a different element is a different atom, so the fill animation starts again rather
  // than the previous atom's electrons carrying over.
  paramBehavior: 'restart',
  params: [
    { id: 'atomicNumber', label: 'Atomic number Z', unit: '', min: 1, max: MAX_Z, step: 1, default: 26, decimals: 0 },
    { id: 'charge', label: 'Ion charge', unit: '', min: -3, max: 3, step: 1, default: 0, decimals: 0 },
  ],
  presets: [
    { id: 'iron', label: 'Iron', values: { atomicNumber: 26, charge: 0 } },
    { id: 'iron-ii', label: 'Fe2+ (loses 4s first)', values: { atomicNumber: 26, charge: 2 } },
    { id: 'chromium', label: 'Chromium (exception)', values: { atomicNumber: 24, charge: 0 } },
    { id: 'copper', label: 'Copper (exception)', values: { atomicNumber: 29, charge: 0 } },
    { id: 'chloride', label: 'Chloride ion', values: { atomicNumber: 17, charge: -1 } },
  ],
  init: () => ({ placed: 0 }),
  step(s: SimState, dt: number) {
    s.t += dt;
    const target = totalElectrons(currentConfiguration(s));
    s.vars.placed = Math.min(target, s.vars.placed + dt * FILL_RATE);
  },
  measurements: [
    {
      id: 'electrons',
      label: 'Electrons',
      unit: '',
      decimals: 0,
      compute: (s) => totalElectrons(currentConfiguration(s)),
    },
    { id: 'valence', label: 'Valence electrons', unit: '', decimals: 0, compute: (s) => valenceElectrons(currentConfiguration(s)) },
    { id: 'unpaired', label: 'Unpaired electrons', unit: '', decimals: 0, compute: (s) => unpairedElectrons(currentConfiguration(s)) },
    { id: 'shells', label: 'Occupied shells', unit: '', decimals: 0, compute: (s) => outermostShell(currentConfiguration(s)) },
  ],
  formula: {
    expression: 'electrons = Z − charge',
    substitution: '{atomicNumber} − {charge}',
    terms: [
      { symbol: 'e', label: 'Electrons', measurementId: 'electrons' },
      { symbol: 'Z', label: 'Atomic number', paramId: 'atomicNumber' },
      { symbol: 'charge', label: 'Ion charge', paramId: 'charge' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Shell (n)',
    yLabel: 'Electrons in shell',
    xRange: () => [1, 7],
    yRange: () => [0, 34],
    series: [
      {
        id: 'shell',
        label: 'Electrons',
        color: 'accent',
        sample: (s, x) => electronsInShell(currentConfiguration(s), Math.round(x)),
      },
    ],
  }),
  observations: [
    (s) => {
      const z = Math.round(s.params.atomicNumber);
      const swap = EXCEPTIONS[z];
      if (!swap || Math.round(s.params.charge) !== 0) return null;
      return `${elementOf(z).name} breaks the aufbau order: one electron moves from ${swap.from} to ${swap.to}, because a half-filled or filled subshell costs less than the order predicts.`;
    },
    (s) => {
      const charge = Math.round(s.params.charge);
      if (charge <= 0) return null;
      const shell = outermostShell(neutralConfiguration(Math.round(s.params.atomicNumber)));
      return `Electrons leave from shell ${shell} first, not in reverse filling order. That is why the outer s electrons go before the d electrons that filled after them.`;
    },
    (s) => {
      const config = currentConfiguration(s);
      const d = dElectrons(config);
      if (d === 0) return null;
      return `An incomplete d subshell holds ${d} electron${d === 1 ? '' : 's'}. Those take part in bonding too, which is why a transition metal has more oxidation states than its valence count suggests.`;
    },
    (s) => {
      const config = currentConfiguration(s);
      const valence = valenceElectrons(config);
      const unpaired = unpairedElectrons(config);
      if (unpaired === 0) return `Every electron is paired, so ${speciesLabel(s)} is diamagnetic and has a closed outer shell arrangement.`;
      return `${valence} electron${valence === 1 ? '' : 's'} sit in the outermost shell and ${unpaired} of the atom's electrons are unpaired.`;
    },
  ],
  explanation(s: SimState) {
    const z = Math.round(s.params.atomicNumber);
    const charge = Math.round(s.params.charge);
    const element = elementOf(z);
    const config = currentConfiguration(s);
    const swap = EXCEPTIONS[z];
    const ionNote =
      charge > 0
        ? ` Removing ${charge} electron${charge === 1 ? '' : 's'} takes them from the outermost shell first, so the result is not simply the filling order run backwards.`
        : charge < 0
          ? ` The extra ${Math.abs(charge)} electron${Math.abs(charge) === 1 ? '' : 's'} continue down the filling order.`
          : '';
    const exceptionNote = swap && charge === 0
      ? ` This element is one of the twenty ground states that do not follow aufbau: an electron moves from ${swap.from} to ${swap.to}.`
      : '';
    return `${element.name} has ${z} protons, so ${speciesLabel(s)} carries ${totalElectrons(config)} electrons. They fill in the order 1s, 2s, 2p, 3s, 3p, 4s, 3d and onward, which is why the fourth shell starts before the third finishes.${exceptionNote}${ionNote} The configuration is ${shorthandString(config, z)}, leaving ${valenceElectrons(config)} in the outermost shell.`;
  },
  draw: drawElectronConfiguration,
};

export default electronConfigurationSim;
