// Reaction Rate Simulator — a single reactant A turning into product B, at whatever rate the
// Arrhenius equation says, with the reaction order deciding the shape of the curve.
//
// Two things about chemical kinetics make a naive simulator useless, and both are handled here
// rather than hidden:
//
//   THE RANGE. A rate constant runs from about 10^-38 to 10^15 across ordinary activation energies
//     and temperatures. Nothing readable comes out of printing k or a half-life directly, so both
//     are reported as base-10 logarithms, which is the same axis an Arrhenius plot uses. A time
//     lapse slider multiplies the chemical clock by a power of ten, so a reaction with a half-life
//     of a century is watchable without pretending its half-life is a century.
//
//   THE INTEGRATION. Every order integrates in closed form, so each substep is solved exactly
//     rather than stepped numerically: zero order is linear, first order is exponential, and second
//     order is the exact hyperbolic update. That keeps the state finite at k values a numerical
//     integrator would blow up on.
//
// The graph plots concentration against time in HALF-LIVES rather than seconds. Measured that way
// the three orders have universal shapes, independent of k, which is what makes their difference
// visible at a glance.
//
// Pure model + config. All canvas work lives in reaction-kinetics.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { snapshotGraph } from '../graphs';
import { GAS_CONSTANT_R } from '../render/units';
import { drawReactionKinetics } from './reaction-kinetics.draw';

/** Gas constant in kJ/(mol K), matching the kJ/mol activation energies chemists quote. */
export const R_KJ = GAS_CONSTANT_R / 1000;

/** ln(10), the conversion between the exponential and base-10 forms of the Arrhenius equation. */
export const LN10 = Math.LN10;

/** How far the graph runs, in half-lives. Five is enough to see zero order finish and first order
 *  reach 97 percent. */
export const GRAPH_HALF_LIVES = 5;

/** Base-10 log of the rate constant, from the linear form of the Arrhenius equation. Computed in
 *  log space so neither end of the slider range overflows or underflows to zero. */
export function logRateConstant(s: SimState): number {
  return s.params.logA - s.params.activationEnergy / (LN10 * R_KJ * s.params.temperature);
}

/** The rate constant itself. Units depend on the order: /s, L/(mol s), or mol/(L s). */
export function rateConstant(s: SimState): number {
  return Math.pow(10, logRateConstant(s));
}

/** The reaction order as an integer, whatever the slider hands over. */
export const orderOf = (s: SimState): number => Math.round(s.params.order);

/**
 * Half-life in seconds. Only first order is independent of the starting concentration; zero order
 * shortens as the reactant runs out and second order lengthens, which is the standard way to tell
 * the three apart from data.
 */
export function halfLife(s: SimState): number {
  const k = Math.max(rateConstant(s), 1e-300);
  const a0 = s.params.initial;
  const order = orderOf(s);
  if (order === 0) return a0 / (2 * k);
  if (order === 2) return 1 / (k * a0);
  return Math.LN2 / k;
}

/** Base-10 log of the half-life in seconds, which is what the readout shows. */
export function logHalfLife(s: SimState): number {
  return Math.log10(Math.max(halfLife(s), 1e-300));
}

/** Chemical seconds per second of animation. */
export function timeScale(s: SimState): number {
  return Math.pow(10, Math.round(s.params.timeLapse));
}

/** Exact closed-form update of the reactant concentration over one chemical time step. */
export function advanceConcentration(a: number, k: number, order: number, dt: number): number {
  if (order === 0) return Math.max(0, a - k * dt);
  if (order === 2) {
    const denominator = 1 + k * a * dt;
    return denominator > 0 ? a / denominator : 0;
  }
  const decayed = a * Math.exp(-k * dt);
  return Number.isFinite(decayed) ? decayed : 0;
}

/**
 * Concentration after `x` half-lives, in closed form. Every order passes through half the starting
 * concentration at x = 1 by definition, so plotting on this axis strips k out and leaves only the
 * shape the order gives.
 */
export function concentrationAtHalfLives(a0: number, order: number, x: number): number {
  const t = Math.max(0, x);
  if (order === 0) return Math.max(0, a0 * (1 - t / 2));
  if (order === 2) return a0 / (1 + t);
  return a0 * Math.pow(2, -t);
}

/** How much faster the reaction runs after a 10 K rise. The rule of thumb, made a live number. */
export function tenKelvinFactor(s: SimState): number {
  const t = s.params.temperature;
  const ea = s.params.activationEnergy;
  return Math.exp((ea / R_KJ) * (1 / t - 1 / (t + 10)));
}

/** Fraction of the reactant consumed so far, 0 to 1. */
export function conversion(s: SimState): number {
  const a0 = s.params.initial;
  if (!(a0 > 0)) return 0;
  return Math.min(1, Math.max(0, (a0 - s.vars.a) / a0));
}

const TIME_UNITS: { limit: number; divisor: number; name: string }[] = [
  { limit: 1e-9, divisor: 1e-12, name: 'picoseconds' },
  { limit: 1e-6, divisor: 1e-9, name: 'nanoseconds' },
  { limit: 1e-3, divisor: 1e-6, name: 'microseconds' },
  { limit: 1, divisor: 1e-3, name: 'milliseconds' },
  { limit: 90, divisor: 1, name: 'seconds' },
  { limit: 5400, divisor: 60, name: 'minutes' },
  { limit: 172800, divisor: 3600, name: 'hours' },
  { limit: 5.4e6, divisor: 86400, name: 'days' },
  { limit: 3.2e9, divisor: 3.156e7, name: 'years' },
];

/** A duration in words, across the forty orders of magnitude a rate constant can reach. */
export function describeSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'no time at all';
  for (const unit of TIME_UNITS) {
    if (seconds < unit.limit) return `${(seconds / unit.divisor).toPrecision(2)} ${unit.name}`;
  }
  const years = seconds / 3.156e7;
  return `${years.toExponential(1)} years`;
}

const reactionKineticsSim: SimulationDef = {
  id: 'reaction-kinetics',
  aspect: 16 / 9,
  // Restart: every parameter here is an experimental condition, so changing one is setting up a new
  // run rather than nudging the one in progress. Reset returns the flask to its starting mixture.
  paramBehavior: 'restart',
  params: [
    { id: 'order', label: 'Reaction order', unit: '', min: 0, max: 2, step: 1, default: 1, decimals: 0 },
    { id: 'activationEnergy', label: 'Activation energy Ea', unit: 'kJ/mol', min: 10, max: 200, step: 1, default: 60, decimals: 0 },
    { id: 'temperature', label: 'Temperature', unit: 'K', min: 250, max: 600, step: 1, default: 298, decimals: 0 },
    { id: 'logA', label: 'Pre-exponential log₁₀ A', unit: '', min: 4, max: 16, step: 0.1, default: 11, decimals: 1 },
    { id: 'initial', label: 'Starting [A]', unit: 'mol/L', min: 0.1, max: 2, step: 0.05, default: 1, decimals: 2 },
    { id: 'timeLapse', label: 'Time lapse (10ⁿ ×)', unit: '', min: 0, max: 12, step: 1, default: 0, decimals: 0 },
  ],
  presets: [
    { id: 'room', label: 'Runs in seconds', values: { order: 1, activationEnergy: 60, temperature: 298, logA: 11, initial: 1, timeLapse: 0 } },
    { id: 'slow', label: 'Too slow to see', values: { order: 1, activationEnergy: 120, temperature: 298, logA: 11, initial: 1, timeLapse: 0 } },
    { id: 'heated', label: 'Same reaction, heated', values: { order: 1, activationEnergy: 120, temperature: 500, logA: 11, initial: 1, timeLapse: 0 } },
    { id: 'zero-order', label: 'Zero order', values: { order: 0, activationEnergy: 60, temperature: 298, logA: 11, initial: 1, timeLapse: 0 } },
    { id: 'second-order', label: 'Second order', values: { order: 2, activationEnergy: 60, temperature: 298, logA: 11, initial: 1, timeLapse: 0 } },
  ],
  init: (params) => ({ a: params.initial, elapsed: 0 }),
  step(s: SimState, dt: number) {
    s.t += dt;
    const chemicalDt = dt * timeScale(s);
    s.vars.elapsed += chemicalDt;
    s.vars.a = advanceConcentration(s.vars.a, rateConstant(s), orderOf(s), chemicalDt);
  },
  measurements: [
    { id: 'logRate', label: 'Rate constant, log₁₀ k', unit: '', decimals: 2, compute: logRateConstant },
    { id: 'logHalfLife', label: 'Half-life, log₁₀ s', unit: '', decimals: 2, compute: logHalfLife },
    { id: 'concentration', label: '[A] remaining', unit: 'mol/L', decimals: 3, compute: (s) => s.vars.a },
    { id: 'conversion', label: 'Conversion', unit: '%', decimals: 1, compute: (s) => conversion(s) * 100 },
    { id: 'tenKelvin', label: 'Rate change per +10 K', unit: '×', decimals: 2, compute: tenKelvinFactor },
  ],
  formula: {
    expression: 'log₁₀ k = log₁₀ A − Ea / (2.303 × R × T)',
    substitution: '{logA} − {activationEnergy} / (2.303 × 0.008314 × {temperature})',
    terms: [
      { symbol: 'log₁₀ k', label: 'Rate constant, log₁₀', measurementId: 'logRate' },
      { symbol: 'log₁₀ A', label: 'Pre-exponential, log₁₀', paramId: 'logA' },
      { symbol: 'Ea', label: 'Activation energy', paramId: 'activationEnergy' },
      { symbol: 'T', label: 'Temperature', paramId: 'temperature' },
    ],
  },
  graph: snapshotGraph({
    xLabel: 'Time (half-lives)',
    yLabel: 'Concentration (mol/L)',
    xRange: () => [0, GRAPH_HALF_LIVES],
    yRange: (s) => [0, s.params.initial * 1.1],
    series: [
      {
        id: 'reactant',
        label: 'Reactant A',
        color: 'accent',
        sample: (s, x) => concentrationAtHalfLives(s.params.initial, orderOf(s), x),
      },
      {
        id: 'product',
        label: 'Product B',
        color: 'danger',
        sample: (s, x) => s.params.initial - concentrationAtHalfLives(s.params.initial, orderOf(s), x),
      },
    ],
  }),
  observations: [
    (s) => `The half-life is ${describeSeconds(halfLife(s))}, so a run takes roughly five times that to finish.`,
    (s) => {
      const order = orderOf(s);
      if (order === 0) return 'Zero order: the rate ignores concentration entirely, so [A] falls in a straight line and hits zero rather than tailing off.';
      if (order === 2) return 'Second order: the rate falls with the square of concentration, so the tail drags out and each half-life is twice as long as the one before.';
      return 'First order: the half-life does not depend on concentration, so every equal interval removes the same fraction of what is left.';
    },
    (s) => `A 10 K rise multiplies the rate by ${tenKelvinFactor(s).toFixed(2)} here, which is where the rule about ten degrees doubling a rate comes from.`,
    (s) => {
      const scale = timeScale(s);
      if (scale === 1) return null;
      return `The clock is running ${scale.toExponential(0)} times faster than real time, so one second on screen is ${describeSeconds(scale)} in the flask.`;
    },
    (s) => {
      const done = conversion(s) * 100;
      if (done < 0.01 && s.t > 2) return 'Nothing visible is happening, and that is the result: at this activation energy and temperature the barrier is too high to cross on any timescale you would wait for.';
      if (done > 99.9) return 'The reactant is spent. Press Reset, or move any slider, to run the experiment again under new conditions.';
      return null;
    },
  ],
  explanation(s: SimState) {
    const order = orderOf(s);
    const done = (conversion(s) * 100).toFixed(1);
    const orderText =
      order === 0
        ? 'rate = k, independent of how much reactant is left'
        : order === 2
          ? 'rate = k[A]², so the reaction slows down faster than it uses reactant up'
          : 'rate = k[A], so the reaction slows in proportion to what remains';
    return `A single reactant is turning into product with ${orderText}. The Arrhenius equation sets k from the ${s.params.activationEnergy.toFixed(0)} kJ/mol activation energy and the ${s.params.temperature.toFixed(0)} K temperature, giving a half-life of ${describeSeconds(halfLife(s))} and ${done}% conversion so far. Activation energy sits in an exponent, so it is the dominant control: raising Ea by 20 kJ/mol at room temperature slows the reaction by a factor of about three thousand, while doubling the pre-exponential factor only doubles it.`;
  },
  draw: drawReactionKinetics,
};

export default reactionKineticsSim;
