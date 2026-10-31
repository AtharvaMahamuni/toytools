import { describe, expect, it } from 'vitest';
import {
  METHYL_A,
  axialOverEquatorial,
  chairGeometry,
  project,
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

  it('draws a puckered chair, not a flat hexagon', () => {
    const g = chairGeometry(0);
    const zs = g.carbons.map((c) => Math.sign(c.z));
    expect(zs).toEqual([-1, 1, -1, 1, -1, 1]);
    // Projected ring zig-zags: neighbouring carbons alternate up and down on screen.
    const ys = g.carbons.map((c) => project(c).y + project({ x: 0, y: -c.y, z: 0 }).y);
    for (let i = 0; i < 6; i++) expect(Math.sign(ys[i]! - ys[(i + 1) % 6]!)).not.toBe(0);
  });

  it('gives every carbon one vertical axial bond and one outward equatorial bond', () => {
    const g = chairGeometry(0);
    expect(g.bonds).toHaveLength(12);
    for (let i = 0; i < 6; i++) {
      const mine = g.bonds.filter((b) => b.carbon === i);
      const ax = mine.find((b) => b.kind === 'axial')!;
      const eq = mine.find((b) => b.kind === 'equatorial')!;
      expect(ax.to.x - ax.from.x).toBeCloseTo(0, 9);
      expect(ax.to.y - ax.from.y).toBeCloseTo(0, 9);
      // Axial points to the carbon's own face; equatorial leans the other way, outward.
      expect(Math.sign(ax.to.z - ax.from.z)).toBe(Math.sign(ax.from.z));
      expect(Math.sign(eq.to.z - eq.from.z)).toBe(-Math.sign(eq.from.z));
      const out = eq.from.x * (eq.to.x - eq.from.x) + eq.from.y * (eq.to.y - eq.from.y);
      expect(out).toBeGreaterThan(0);
    }
  });

  it('swaps every axial and equatorial bond across the flip, with the methyl up both times', () => {
    const before = chairGeometry(0);
    const after = chairGeometry(100);
    for (let k = 0; k < 12; k++) expect(after.bonds[k]!.kind).not.toBe(before.bonds[k]!.kind);
    for (let i = 0; i < 6; i++) expect(Math.sign(after.carbons[i]!.z)).toBe(-Math.sign(before.carbons[i]!.z));
    const m0 = before.bonds.find((b) => b.methyl)!;
    const m1 = after.bonds.find((b) => b.methyl)!;
    expect(m0.kind).toBe('equatorial');
    expect(m1.kind).toBe('axial');
    expect(m0.to.z - m0.from.z).toBeGreaterThan(0);
    expect(m1.to.z - m1.from.z).toBeGreaterThan(0);
  });

  it('exposes K itself, about 0.047 for methyl at 298 K', () => {
    expect(axialOverEquatorial(1, 298)).toBeCloseTo(0.0465, 3);
    expect(axialOverEquatorial(0, 298)).toBe(1);
  });
});
