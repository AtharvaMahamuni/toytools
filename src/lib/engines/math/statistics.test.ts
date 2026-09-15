import { describe, expect, it } from 'vitest';
import {
  descriptiveStats,
  formatStat,
  histogramBins,
  parseNumberList,
  MAX_STATS_VALUES,
} from './statistics';

describe('parseNumberList', () => {
  it('splits on commas, spaces, semicolons, pipes, and new lines', () => {
    expect(parseNumberList('1, 2;3|4\n5')).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns null for empty or non-numeric tokens', () => {
    expect(parseNumberList('')).toBeNull();
    expect(parseNumberList('1, two, 3')).toBeNull();
  });
});

describe('descriptiveStats', () => {
  it('matches the classic population teaching set', () => {
    const stats = descriptiveStats([2, 4, 4, 4, 5, 5, 7, 9], 'population');
    expect(stats).not.toBeNull();
    expect(stats!.mean).toBe(5);
    expect(stats!.median).toBe(4.5);
    expect(stats!.modes).toEqual([4]);
    expect(stats!.stdev).toBeCloseTo(2, 10);
    expect(stats!.variance).toBeCloseTo(4, 10);
  });

  it('requires two values for sample standard deviation', () => {
    expect(descriptiveStats([3], 'sample')).toBeNull();
    expect(descriptiveStats([3], 'population')!.stdev).toBe(0);
  });

  it('flags Tukey outliers', () => {
    const stats = descriptiveStats([1, 2, 2, 2, 3, 3, 100], 'sample');
    expect(stats!.outliers).toEqual([100]);
  });
});

describe('histogramBins', () => {
  it('emits a single bin when every value is identical', () => {
    const bins = histogramBins([7, 7, 7]);
    expect(bins).toHaveLength(1);
    expect(bins[0]!.count).toBe(3);
  });

  it('counts every value across equal-width bins', () => {
    const bins = histogramBins([0, 1, 2, 3, 4, 5, 6, 7], 4);
    expect(bins).toHaveLength(4);
    expect(bins.reduce((s, b) => s + b.count, 0)).toBe(8);
  });
});

describe('formatStat', () => {
  it('keeps small integers plain and trims trailing zeros', () => {
    expect(formatStat(5)).toBe('5');
    expect(formatStat(2.5)).toBe('2.5');
  });
});

describe('caps', () => {
  it('documents the paste size ceiling', () => {
    expect(MAX_STATS_VALUES).toBe(10_000);
  });
});
