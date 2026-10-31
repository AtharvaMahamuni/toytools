import { describe, expect, it } from 'vitest';
import fractionBars, {
  caption,
  clampedParts,
  diffOf,
  fmtFraction,
  lengthOf,
  numeratorFromTrack,
  sumOf,
  wholesUsed,
  wholeSlots,
  fillOfWhole,
} from './fraction-bars';

const defaults = { mode: 2, view: 0, numA: 1, denA: 2, numB: 1, denB: 3 };

describe('fraction bars', () => {
  it('shades 2/4 and 1/2 to the same length', () => {
    expect(lengthOf(2, 4)).toBe(lengthOf(1, 2));
    expect(lengthOf(2, 4)).toBe(0.5);
  });

  it('adds 1/2 and 1/3 to 5/6, not 2/5', () => {
    const sum = sumOf({ n: 1, d: 2 }, { n: 1, d: 3 });
    expect(fmtFraction(sum)).toBe('5/6');
    expect(fmtFraction(sum)).not.toBe('2/5');
    const s = { t: 0, params: defaults, vars: fractionBars.init(defaults) };
    expect(caption(s)).toBe('1/2 + 1/3 = 5/6. The shaded length matches.');
  });

  it('draws 5/4 across two wholes', () => {
    const parts = clampedParts(5, 4);
    expect(parts).toEqual({ n: 5, d: 4 });
    expect(lengthOf(parts.n, parts.d)).toBe(1.25);
    expect(wholesUsed(1.25)).toBe(2);
    expect(wholesUsed(1)).toBe(1);
  });

  it('refuses a negative difference', () => {
    expect(diffOf({ n: 1, d: 2 }, { n: 1, d: 3 }).blocked).toBe(false);
    expect(fmtFraction(diffOf({ n: 1, d: 2 }, { n: 1, d: 3 }).fraction)).toBe('1/6');
    const blocked = diffOf({ n: 1, d: 3 }, { n: 1, d: 2 });
    expect(blocked.blocked).toBe(true);
    expect(fmtFraction(blocked.fraction)).toBe('0');
  });

  it('snaps a drag to an equal part', () => {
    expect(numeratorFromTrack(0.27, 4)).toBe(2);
    expect(numeratorFromTrack(0.08, 4)).toBe(0);
    expect(numeratorFromTrack(0.46, 4)).toBe(4);
    expect(numeratorFromTrack(0.73, 4)).toBe(6);
  });

  it('moves the shaded edge across about a third of a second', () => {
    const params = { ...defaults, numA: 0, denA: 2 };
    const s = { t: 0, params, vars: fractionBars.init(params) };
    expect(s.vars.shownA).toBe(0);
    s.params.numA = 2;
    fractionBars.step(s, 1 / 30);
    expect(s.vars.shownA).toBeGreaterThan(0);
    expect(s.vars.shownA).toBeLessThan(1);
    fractionBars.step(s, 0.4);
    expect(s.vars.shownA).toBeCloseTo(1, 2);
  });
});

describe('sums above two wholes', () => {
  it('draws three wholes for 3/2 + 3/2 and prints 3, not 3/1', () => {
    const sum = sumOf({ n: 3, d: 2 }, { n: 3, d: 2 });
    expect(fmtFraction(sum)).toBe('3');
    const length = Number(sum.n) / Number(sum.d);
    expect(wholesUsed(length)).toBe(3);
    expect([0, 1, 2].map((i) => fillOfWhole(length, i))).toEqual([1, 1, 1]);
  });

  it('draws four wholes for the largest sum, 2 + 2, and shades a partial last whole', () => {
    expect(wholesUsed(4)).toBe(4);
    expect(wholesUsed(2.5)).toBe(3);
    expect(fillOfWhole(2.5, 2)).toBe(0.5);
    expect(wholesUsed(2)).toBe(2);
  });

  it('lays out non-overlapping wholes inside the bar span', () => {
    for (const n of [1, 2, 3, 4]) {
      const slots = wholeSlots(n);
      expect(slots).toHaveLength(n);
      for (let i = 1; i < n; i++) expect(slots[i]!.x0).toBeGreaterThan(slots[i - 1]!.x1);
      expect(slots[n - 1]!.x1).toBeLessThanOrEqual(0.92 + 1e-9);
    }
  });
});
