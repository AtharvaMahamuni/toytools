// Radioactive decay of one species. Each nucleus is an independent coin with
// P(still parent) = 2^(-h). The smooth curve is the expected count. The dots are
// one sample, so at one half-life the count is not forced to N0/2.
//
// h is half-lives on a screen clock. The isotope's real half-life is only a label.
// Carbon-14 does not finish in a few seconds. Pure model; canvas work is in
// radioactive-decay.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { drawRadioactiveDecay } from './radioactive-decay.draw';

export const N0 = 400;
export const MAX_HALVES = 6;
/** Fixed so tests and the first frame see the same sample. A tap draws the next one. */
export const DEFAULT_SEED = 7;

export interface Isotope {
  id: string;
  name: string;
  symbol: string;
  /** Half-life number in `unit`, from IAEA EPR-D Table 26 (ICRP Publication 38). */
  halfLife: number;
  unit: string;
  /** Stable daughter of the ground-state decay. */
  daughter: string;
}

export const ISOTOPES: readonly Isotope[] = [
  { id: 'f18', name: 'fluorine-18', symbol: 'F-18', halfLife: 109.77, unit: 'minutes', daughter: 'oxygen-18' },
  { id: 'i131', name: 'iodine-131', symbol: 'I-131', halfLife: 8.04, unit: 'days', daughter: 'xenon-131' },
  { id: 'co60', name: 'cobalt-60', symbol: 'Co-60', halfLife: 5.27, unit: 'years', daughter: 'nickel-60' },
  { id: 'c14', name: 'carbon-14', symbol: 'C-14', halfLife: 5730, unit: 'years', daughter: 'nitrogen-14' },
];

/** Drag range on the canvas, matching the screen-clock track. */
export const TRACK_X0 = 0.08;
export const TRACK_X1 = 0.92;

const LCG_MOD = 4294967296;

export function isotopeOf(value: number): Isotope {
  const i = Math.min(ISOTOPES.length - 1, Math.max(0, Math.round(value)));
  return ISOTOPES[i];
}

export function formatHalfLife(iso: Isotope): string {
  return `${iso.halfLife} ${iso.unit}`;
}

/** Next sample id. The Numerical Recipes LCG, kept off zero. */
export function nextSeed(seed: number): number {
  const next = ((seed >>> 0) * 1664525 + 1013904223) % LCG_MOD;
  return next === 0 ? 1 : next;
}

/** Uniform in [0, 1) for nucleus `index` of sample `seed`. Deterministic. */
export function unitFor(seed: number, index: number): number {
  let z = (Math.imul((index + 1) | 0, 0x9e3779b1) ^ (seed >>> 0)) >>> 0;
  z = Math.imul(z ^ (z >>> 16), 0x7feb352d) >>> 0;
  z = Math.imul(z ^ (z >>> 15), 0x846ca68b) >>> 0;
  z = (z ^ (z >>> 16)) >>> 0;
  return z / LCG_MOD;
}

/** Expected parent count. N0 * 2^(-h). */
export function expectedParent(halves: number): number {
  return N0 * 2 ** -halves;
}

/** Parent nuclei still undecayed in this sample at `halves` screen half-lives. */
export function parentCount(seed: number, halves: number): number {
  const limit = 2 ** -halves;
  let n = 0;
  for (let i = 0; i < N0; i++) if (unitFor(seed, i) < limit) n++;
  return n;
}

/** Half-lives passed after `elapsed` of real time, in the isotope's own unit. */
export function realHalves(elapsed: number, iso: Isotope): number {
  return Math.max(0, elapsed) / iso.halfLife;
}

/** Expected parent nuclei left from N0 after `elapsed` real time, in the isotope's unit. */
export function leftAfter(elapsed: number, iso: Isotope): number {
  return expectedParent(realHalves(elapsed, iso));
}

/** The typed-time answer in words. */
export function elapsedLine(elapsed: number, iso: Isotope): string {
  const t = Math.max(0, elapsed);
  const left = leftAfter(t, iso);
  return `After ${t} ${iso.unit} of ${iso.name}, ${realHalves(t, iso).toFixed(2)} half-lives pass and ${left.toFixed(1)} of ${N0} nuclei are expected to remain (${((left / N0) * 100).toFixed(1)}%).`;
}

export function daughterCount(parent: number): number {
  return N0 - parent;
}

/** Map a pointer x to screen half-lives, snapped to 0.01. */
export function halvesFromTrack(x: number): number {
  const t = Math.min(1, Math.max(0, (x - TRACK_X0) / (TRACK_X1 - TRACK_X0)));
  return Math.round(t * MAX_HALVES * 100) / 100;
}

export function caption(s: SimState): string {
  const h = s.vars.halves ?? 0;
  const live = parentCount(s.vars.seed ?? DEFAULT_SEED, h);
  return `Expected ${Math.round(expectedParent(h))}. This run has ${live}.`;
}

export function clockLine(s: SimState): string {
  const iso = isotopeOf(s.params.isotope ?? 0);
  const pace = Number.isFinite(s.params.pace) ? s.params.pace : 0.25;
  return `Screen clock: ${pace.toFixed(2)} half-lives pass each second on this page. One half-life of ${iso.name} is ${formatHalfLife(iso)}. This screen is not that clock.`;
}

export function restartSample(s: SimState): void {
  s.vars.seed = nextSeed(s.vars.seed || DEFAULT_SEED);
  s.vars.halves = 0;
  s.vars.holding = 0;
  s.t = 0;
}

export function initDecay(): Record<string, number> {
  return { seed: DEFAULT_SEED, halves: 0, holding: 0 };
}

function stepDecay(s: SimState, dt: number): void {
  s.t += dt;
  if (s.vars.holding === 1) return;
  if (s.vars.halves >= MAX_HALVES) return;
  const pace = s.params.pace;
  s.vars.halves = Math.min(MAX_HALVES, s.vars.halves + pace * dt);
}

const radioactiveDecaySim: SimulationDef = {
  id: 'radioactive-decay',
  aspect: 4 / 3,
  // Isotope and pace are labels and speed. The sample and the screen clock stay.
  paramBehavior: 'continuous',
  params: [
    { id: 'isotope', label: 'Isotope', unit: '', min: 0, max: 3, step: 1, default: 0, decimals: 0 },
    { id: 'pace', label: 'Screen pace', unit: 'half-lives/s', min: 0.05, max: 1, step: 0.05, default: 0.25, decimals: 2 },
    // Real elapsed time in the chosen isotope's own unit (minutes for F-18, days for I-131, years
    // for Co-60 and C-14). This is the calculator input. It does not drive the screen clock.
    { id: 'elapsed', label: 'Elapsed time (isotope unit)', unit: '', min: 0, max: 50000, step: 0.1, default: 0, decimals: 1 },
  ],
  presets: [
    { id: 'f18', label: 'Fluorine-18', values: { isotope: 0, pace: 0.25 } },
    { id: 'i131', label: 'Iodine-131', values: { isotope: 1, pace: 0.25 } },
    { id: 'co60', label: 'Cobalt-60', values: { isotope: 2, pace: 0.25 } },
    { id: 'c14', label: 'Carbon-14', values: { isotope: 3, pace: 0.25 } },
  ],
  init: initDecay,
  step: stepDecay,
  measurements: [
    {
      id: 'leftAfter',
      label: 'Expected left after elapsed time',
      unit: 'nuclei',
      decimals: 1,
      compute: (s) => leftAfter(s.params.elapsed ?? 0, isotopeOf(s.params.isotope)),
    },
    {
      id: 'halfLife',
      label: 'Half-life (isotope unit)',
      unit: '',
      decimals: 2,
      compute: (s) => isotopeOf(s.params.isotope).halfLife,
    },
    { id: 'expected', label: 'Expected parent', unit: 'nuclei', decimals: 1, compute: (s) => expectedParent(s.vars.halves) },
    { id: 'parent', label: 'This run', unit: 'nuclei', decimals: 0, compute: (s) => parentCount(s.vars.seed, s.vars.halves) },
    {
      id: 'daughter',
      label: 'Stable daughter',
      unit: 'nuclei',
      decimals: 0,
      compute: (s) => daughterCount(parentCount(s.vars.seed, s.vars.halves)),
    },
    { id: 'halves', label: 'Screen half-lives', unit: '', decimals: 2, compute: (s) => s.vars.halves },
    {
      id: 'gap',
      label: 'Gap from curve',
      unit: 'nuclei',
      decimals: 1,
      compute: (s) => parentCount(s.vars.seed, s.vars.halves) - expectedParent(s.vars.halves),
    },
  ],
  formula: {
    expression: 'N = N0 * 2^(-t / T)',
    terms: [
      { symbol: 'N', label: 'Expected left after t', measurementId: 'leftAfter' },
      { symbol: 't', label: 'Elapsed time (isotope unit)', paramId: 'elapsed' },
      { symbol: 'T', label: 'Half-life (isotope unit)', measurementId: 'halfLife' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Half-lives on the screen clock',
    yLabel: 'Parent nuclei',
    xRange: () => [0, MAX_HALVES],
    yRange: () => [0, N0],
    series: [
      { id: 'expected', label: 'expected', color: 'muted', sample: (_s, x) => expectedParent(x) },
      { id: 'sample', label: 'this run', color: 'accent', sample: (s, x) => parentCount(s.vars.seed, x) },
    ],
  }),
  pointer: {
    hint: 'Drag to scrub the screen clock. Tap for a new sample.',
    handle(s, ev) {
      if (ev.type === 'tap') {
        restartSample(s);
        return null;
      }
      if (ev.type === 'up') {
        s.vars.holding = 0;
        return null;
      }
      s.vars.holding = 1;
      s.vars.halves = halvesFromTrack(ev.x);
      return null;
    },
    isHolding: (s) => s.vars.holding === 1,
  },
  observations: [
    (s) => caption(s),
    (s) => ((s.params.elapsed ?? 0) > 0 ? elapsedLine(s.params.elapsed, isotopeOf(s.params.isotope)) : null),
    (s) => clockLine(s),
    (s) => {
      if (s.vars.halves < 0.05) return null;
      const live = parentCount(s.vars.seed, s.vars.halves);
      if (live === Math.round(expectedParent(s.vars.halves))) return null;
      return 'The live count is not forced onto the curve. One sample of 400 nuclei can miss it.';
    },
    (s) =>
      isotopeOf(s.params.isotope).id === 'c14'
        ? 'Carbon-14 is not finishing in a few seconds. The dots move on the screen clock only.'
        : null,
    (s) =>
      s.vars.halves >= MAX_HALVES
        ? 'Six screen half-lives have passed. Tap the canvas for a new sample.'
        : null,
  ],
  explanation(s) {
    const iso = isotopeOf(s.params.isotope);
    const live = parentCount(s.vars.seed, s.vars.halves);
    const daughter = daughterCount(live);
    return `The formula is N = N0 * 2^(-h), with N0 = ${N0}. The curve is that expected parent count. This run has ${live} parent nuclei and ${daughter} ${iso.daughter} daughter nuclei, and the two add to ${N0}. The screen clock is a compressed scale: one half-life of ${iso.name} is ${formatHalfLife(iso)}, and this page does not spend that time.`;
  },
  draw: drawRadioactiveDecay,
};

export default radioactiveDecaySim;
