import { describe, expect, it } from 'vitest';
import decay, {
  DEFAULT_SEED,
  N0,
  caption,
  clockLine,
  daughterCount,
  expectedParent,
  halvesFromTrack,
  parentCount,
  restartSample,
} from './radioactive-decay';

const defaults = { isotope: 0, pace: 0.25 };

function stateAt(halves: number, isotope = 0, seed = DEFAULT_SEED) {
  return {
    t: 0,
    params: { ...defaults, isotope },
    vars: { ...decay.init(), halves, seed },
  };
}

describe('radioactive decay', () => {
  it('starts with every nucleus still a parent', () => {
    expect(parentCount(DEFAULT_SEED, 0)).toBe(N0);
    expect(expectedParent(0)).toBe(N0);
    expect(daughterCount(N0)).toBe(0);
    expect(caption(stateAt(0))).toBe('Expected 400. This run has 400.');
  });

  it('expects 200 at one half-life and lets this sample miss it', () => {
    expect(expectedParent(1)).toBe(200);
    const live = parentCount(DEFAULT_SEED, 1);
    expect(live).toBeGreaterThanOrEqual(160);
    expect(live).toBeLessThanOrEqual(240);
    expect(live).not.toBe(200);
    expect(caption(stateAt(1))).toBe(`Expected 200. This run has ${live}.`);
    expect(daughterCount(live)).toBe(N0 - live);
  });

  it('uses the same sample for the same seed, and a tap draws another', () => {
    expect(parentCount(DEFAULT_SEED, 1)).toBe(parentCount(DEFAULT_SEED, 1));
    const s = stateAt(1);
    const first = parentCount(s.vars.seed, 1);
    restartSample(s);
    expect(s.vars.seed).not.toBe(DEFAULT_SEED);
    expect(s.vars.halves).toBe(0);
    expect(parentCount(s.vars.seed, 1)).not.toBe(first);
  });

  it('labels the screen clock as a scale, including carbon-14', () => {
    const fluorine = clockLine(stateAt(0, 0));
    expect(fluorine).toContain('109.77 minutes');
    expect(fluorine).toContain('This screen is not that clock.');
    const carbon = clockLine(stateAt(1, 3));
    expect(carbon).toContain('5730 years');
    expect(carbon).toContain('This screen is not that clock.');
    expect(carbon).not.toContain('5730 years per second');
  });

  it('advances the screen clock and holds still while dragging', () => {
    const s = stateAt(0);
    decay.step(s, 1);
    expect(s.vars.halves).toBeCloseTo(0.25, 5);
    s.vars.holding = 1;
    const held = s.vars.halves;
    decay.step(s, 1);
    expect(s.vars.halves).toBe(held);
  });

  it('scrubs the screen clock from the track', () => {
    expect(halvesFromTrack(0.22)).toBe(1);
    const s = stateAt(0);
    decay.pointer?.handle(s, { type: 'down', x: 0.22, y: 0.5, t: 0 });
    expect(s.vars.halves).toBe(1);
    expect(decay.pointer?.isHolding?.(s)).toBe(true);
    decay.pointer?.handle(s, { type: 'up', x: 0.22, y: 0.5, t: 0 });
    expect(s.vars.halves).toBe(1);
    expect(decay.pointer?.isHolding?.(s)).toBe(false);
  });
});
