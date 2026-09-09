import { describe, expect, it } from 'vitest';

import { crossedTick, isAtRest, restOmega, wrapAngle } from './spinner';

describe('spinner rest and ticks', () => {
  it('snaps a dying spin to rest', () => {
    expect(isAtRest(0.1)).toBe(true);
    expect(isAtRest(2)).toBe(false);
    expect(restOmega(0.1)).toBe(0);
    expect(restOmega(4)).toBe(4);
  });

  it('wraps angles into 0..2π', () => {
    expect(wrapAngle(0)).toBe(0);
    expect(wrapAngle(Math.PI * 2)).toBe(0);
    expect(wrapAngle(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
  });

  it('ticks when an arm crosses 12 o\'clock, not on elapsed time', () => {
    expect(crossedTick(0, 0.1)).toBe(false);
    expect(crossedTick((2 * Math.PI) / 3 - 0.05, (2 * Math.PI) / 3 + 0.05)).toBe(true);
    expect(crossedTick(-0.05, 0.05)).toBe(true);
  });
});
