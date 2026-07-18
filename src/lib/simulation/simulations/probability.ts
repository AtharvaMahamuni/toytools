// Probability Lab — animated coin/dice trials converging on theory. The state is a trial counter
// pair (trials, successes for face 1) advanced at `rate` trials per second by a SEEDED LCG kept in
// vars, so runs are deterministic (the platform contract requires identical states to step
// identically) yet look random. The stream graph traces the empirical frequency against the
// theoretical 1/n line: the law of large numbers, live. Pure model + config; canvas work lives in
// probability.draw.ts.

import type { SimState, SimulationDef } from '../types';
import { streamGraph } from '../graphs';
import { drawProbability } from './probability.draw';

const LCG_MOD = 4294967296; // 2^32 (exact in doubles; products stay below 2^53)

/** One LCG step (Numerical Recipes constants). Deterministic and exact in float64. */
export function nextSeed(seed: number): number {
  return (seed * 1664525 + 1013904223) % LCG_MOD;
}

/** Map a seed to a face 1..sides. */
export function faceFor(seed: number, sides: number): number {
  return 1 + Math.floor((seed / LCG_MOD) * sides);
}

/** Run exactly one trial against s.vars (seed, trials, successes, last). */
export function runTrial(s: SimState): void {
  s.vars.seed = nextSeed(s.vars.seed);
  const face = faceFor(s.vars.seed, s.params.sides);
  s.vars.trials += 1;
  if (face === 1) s.vars.successes += 1;
  s.vars.last = face;
}

export function empirical(s: SimState): number {
  return s.vars.trials > 0 ? s.vars.successes / s.vars.trials : 0;
}

export function theoretical(s: SimState): number {
  return 1 / s.params.sides;
}

export function gap(s: SimState): number {
  return Math.abs(empirical(s) - theoretical(s));
}

const probabilitySim: SimulationDef = {
  id: 'probability',
  aspect: 16 / 9,
  paramBehavior: 'restart',
  params: [
    { id: 'sides', label: 'Sides (2 = coin)', unit: '', min: 2, max: 12, step: 1, default: 2, decimals: 0 },
    { id: 'rate', label: 'Trials per second', unit: '/s', min: 1, max: 60, step: 1, default: 8, decimals: 0 },
  ],
  presets: [
    { id: 'coin', label: 'Coin', values: { sides: 2, rate: 8 } },
    { id: 'die', label: 'Six-sided die', values: { sides: 6, rate: 8 } },
    { id: 'slow', label: 'Slow motion', values: { rate: 1 } },
    { id: 'fast', label: 'Fast', values: { rate: 60 } },
  ],
  init: () => ({ seed: 20260716, acc: 0, trials: 0, successes: 0, last: 0 }),
  step(s: SimState, dt: number): void {
    s.vars.acc += dt * s.params.rate;
    while (s.vars.acc >= 1) {
      s.vars.acc -= 1;
      runTrial(s);
    }
    s.t += dt;
  },
  measurements: [
    { id: 'trials', label: 'Trials', unit: '', decimals: 0, compute: (s) => s.vars.trials },
    { id: 'successes', label: 'Face 1 count', unit: '', decimals: 0, compute: (s) => s.vars.successes },
    { id: 'empirical', label: 'Empirical frequency', unit: '', decimals: 3, compute: empirical },
    { id: 'theoretical', label: 'Theoretical P', unit: '', decimals: 3, compute: theoretical },
    { id: 'gap', label: 'Gap |empirical - P|', unit: '', decimals: 3, compute: gap },
  ],
  formula: {
    expression: 'P(face 1) = 1 / n',
    substitution: '1 / {sides}',
    terms: [
      { symbol: 'P', label: 'Theoretical P', measurementId: 'theoretical' },
      { symbol: 'n', label: 'Sides', paramId: 'sides' },
    ],
  },
  graph: streamGraph({
    yLabel: 'Frequency of face 1',
    window: 30,
    yRange: (s) => [0, Math.min(1, 3 / s.params.sides)],
    series: [
      { id: 'empirical', label: 'empirical', color: 'accent', sample: empirical },
      { id: 'theoretical', label: 'theoretical', color: 'danger', sample: theoretical },
    ],
  }),
  observations: [
    (s) =>
      s.vars.trials === 0
        ? 'Press Play, or tap the canvas, to run the first trial. Face 1 counts as a success (heads on a coin).'
        : null,
    (s) =>
      s.vars.trials > 0 && s.vars.trials < 30
        ? `Only ${s.vars.trials} trial${s.vars.trials === 1 ? '' : 's'} so far: streaks dominate small samples, so expect the empirical frequency to swing wildly.`
        : null,
    (s) =>
      s.vars.trials >= 30 && gap(s) <= 0.02
        ? `After ${s.vars.trials} trials the empirical frequency sits within 0.02 of the theoretical value: the law of large numbers pulling the average home.`
        : null,
    (s) =>
      s.vars.trials >= 30 && gap(s) > 0.05
        ? `The empirical frequency is still ${gap(s).toFixed(3)} away from theory after ${s.vars.trials} trials. Nothing is broken: convergence is slow and never owes you a correction.`
        : null,
    (s) =>
      s.params.sides === 2 && s.vars.trials >= 30
        ? 'With 2 sides this is a fair coin flip experiment: face 1 is heads and its long-run frequency heads toward 0.5.'
        : null,
  ],
  pointer: {
    hint: 'Tap to run one trial',
    handle(s, ev) {
      if (ev.type !== 'tap') return null;
      runTrial(s);
      return null;
    },
  },
  explanation(s: SimState) {
    const n = s.params.sides;
    const p = theoretical(s);
    if (s.vars.trials === 0) {
      return `Each trial rolls a fair ${n === 2 ? 'coin' : `${n}-sided die`}: every face has the same theoretical probability, 1/${n} = ${p.toFixed(3)}. The graph will trace how often face 1 actually shows up against that line.`;
    }
    return `In ${s.vars.trials} trials, face 1 appeared ${s.vars.successes} times: an empirical frequency of ${empirical(s).toFixed(3)} against the theoretical 1/${n} = ${p.toFixed(3)}. The law of large numbers says the gap tends to shrink as trials pile up, not by correcting past streaks but by drowning them in new data.`;
  },
  draw: drawProbability,
};

export default probabilitySim;
