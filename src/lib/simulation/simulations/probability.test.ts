// Numeric assertions for the Probability Lab model. Contract/narrative sweeps cover totality;
// this file pins the seeded determinism, the trial pacing, the tap-to-trial pointer, and the
// empirical/theoretical bookkeeping.

import { describe, expect, it } from 'vitest';
import type { SimState } from '../types';
import probability, { empirical, faceFor, gap, nextSeed, runTrial, theoretical } from './probability';

function stateFor(sides = 2, rate = 8): SimState {
  const params = { sides, rate };
  return { t: 0, params, vars: probability.init(params) };
}

describe('probability model', () => {
  it('advances the LCG deterministically and maps seeds to valid faces', () => {
    const a = nextSeed(20260716);
    expect(nextSeed(20260716)).toBe(a); // pure
    let seed = 1;
    for (let i = 0; i < 1000; i++) {
      seed = nextSeed(seed);
      const face = faceFor(seed, 6);
      expect(face).toBeGreaterThanOrEqual(1);
      expect(face).toBeLessThanOrEqual(6);
      expect(Number.isInteger(face)).toBe(true);
    }
  });

  it('runs trials at the configured rate', () => {
    const s = stateFor(2, 8);
    probability.step(s, 1); // 8 trials/s × 1 s
    expect(s.vars.trials).toBe(8);
    probability.step(s, 0.5);
    expect(s.vars.trials).toBe(12);
    expect(s.t).toBeCloseTo(1.5);
  });

  it('keeps identical runs identical (platform determinism contract)', () => {
    const a = stateFor(6, 60);
    const b = stateFor(6, 60);
    for (let i = 0; i < 50; i++) {
      probability.step(a, 0.1);
      probability.step(b, 0.1);
    }
    expect(a.vars).toEqual(b.vars);
  });

  it('tracks empirical vs theoretical and their gap', () => {
    const s = stateFor(2, 8);
    expect(empirical(s)).toBe(0); // no trials yet — finite, not NaN
    expect(theoretical(s)).toBe(0.5);
    s.vars.trials = 100;
    s.vars.successes = 47;
    expect(empirical(s)).toBeCloseTo(0.47, 12);
    expect(gap(s)).toBeCloseTo(0.03, 12);
  });

  it('converges roughly to 1/n over many trials (sanity, not statistics)', () => {
    const s = stateFor(6, 60);
    for (let i = 0; i < 200; i++) probability.step(s, 1);
    expect(s.vars.trials).toBe(12000);
    expect(empirical(s)).toBeGreaterThan(1 / 6 - 0.02);
    expect(empirical(s)).toBeLessThan(1 / 6 + 0.02);
  });

  it('tap runs exactly one trial; other pointer events are ignored', () => {
    const s = stateFor(2, 8);
    expect(probability.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toBeNull();
    expect(s.vars.trials).toBe(1);
    expect(s.vars.last === 1 || s.vars.last === 2).toBe(true);
    probability.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.5, t: 0 });
    expect(s.vars.trials).toBe(1);
  });

  it('narrates small samples and the law of large numbers', () => {
    const s = stateFor(2, 8);
    runTrial(s);
    const early = probability.observations.map((o) => o(s)).filter(Boolean).join(' ');
    expect(early).toContain('streaks dominate');
    s.vars.trials = 1000;
    s.vars.successes = 505;
    const late = probability.observations.map((o) => o(s)).filter(Boolean).join(' ');
    expect(late).toContain('law of large numbers');
    expect(probability.explanation(s)).toContain('1000 trials');
  });
});
