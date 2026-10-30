import { describe, expect, it } from 'vitest';
import {
  METHYL_A,
  energyAt,
  energyGap,
  orientationAt,
  populations,
  readout,
} from './cyclohexane-chair';

describe('cyclohexane chair', () => {
  it('gives unsubstituted chairs no gap and a 50/50 population', () => {
    expect(energyGap(0)).toBe(0);
    for (const t of [250, 298.15, 500]) {
      const p = populations(0, t);
      expect(p.equatorial).toBeCloseTo(0.5, 6);
      expect(p.axial).toBeCloseTo(0.5, 6);
    }
  });

  it('puts about 95.5 percent of methylcyclohexane equatorial at 298.15 K', () => {
    expect(energyGap(1)).toBe(METHYL_A);
    const p = populations(1, 298.15);
    expect(p.equatorial * 100).toBeCloseTo(95.5, 1);
    expect(p.axial * 100).toBeCloseTo(4.5, 1);
    expect(p.equatorial).toBeGreaterThan(p.axial);
  });

  it('keeps the substituent up and swaps equatorial for axial', () => {
    expect(orientationAt(0)).toEqual({ vertical: 'up', position: 'equatorial' });
    expect(orientationAt(100)).toEqual({ vertical: 'up', position: 'axial' });
    expect(readout(0)).toBe('up, now equatorial');
    expect(readout(100)).toBe('up, now axial');
    expect(readout(50)).toBe('up, at the half-chair');
  });

  it('grows the axial share when the temperature rises', () => {
    const cool = populations(1, 298);
    const hot = populations(1, 500);
    expect(hot.axial).toBeGreaterThan(cool.axial);
    expect(hot.equatorial).toBeLessThan(cool.equatorial);
    expect(hot.equatorial).toBeGreaterThan(0.5);
  });

  it('peaks at the half-chair and ends on the A-value', () => {
    expect(energyAt(0, 1)).toBeCloseTo(0, 6);
    expect(energyAt(100, 1)).toBeCloseTo(METHYL_A, 6);
    expect(energyAt(50, 1)).toBeGreaterThan(energyAt(0, 1));
    expect(energyAt(50, 1)).toBeGreaterThan(energyAt(100, 1));
    expect(energyAt(100, 0)).toBeCloseTo(0, 6);
  });
});
