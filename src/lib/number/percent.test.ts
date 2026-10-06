import { describe, it, expect } from 'vitest';
import { percentChange } from './percent';

describe('percentChange: (B - A) / |A|', () => {
  it('is +350% from -20 to 50 (an increase from a negative baseline)', () => {
    expect(percentChange(-20, 50)).toBe(350);
  });
  it('is +60% from -50 to -20 (less negative is an increase)', () => {
    expect(percentChange(-50, -20)).toBe(60);
  });
  it('is -100% from -20 to -40 (more negative is a decrease)', () => {
    expect(percentChange(-20, -40)).toBe(-100);
  });
  it('is unchanged for positive baselines', () => {
    expect(percentChange(80, 100)).toBe(25);
    expect(percentChange(100, 75)).toBe(-25);
  });
  it('is NaN from zero', () => {
    expect(percentChange(0, 5)).toBeNaN();
  });
});
