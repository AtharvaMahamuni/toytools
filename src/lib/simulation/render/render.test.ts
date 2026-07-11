import { describe, expect, it } from 'vitest';
import { clamp, lerp, mapRange, normalize } from './math';
import { add, angleOf, fromAngle, length, normalized, scale, sub } from './vector';
import { degToRad, radToDeg, wrapAngle } from './angle';
import { celsiusToKelvin, GAS_CONSTANT_R, litersToCubicMeters, pascalsToKilopascals } from './units';
import { gravitationalPotential, kineticEnergy, resolveCollision1D, springPotential } from './physics';

describe('math', () => {
  it('clamps into range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
  it('lerp / normalize / mapRange', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(normalize(5, 0, 10)).toBe(0.5);
    expect(normalize(1, 3, 3)).toBe(0); // zero-width guard
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
  });
});

describe('vector', () => {
  it('add/sub/scale/length', () => {
    expect(add({ x: 1, y: 2 }, { x: 3, y: 4 })).toEqual({ x: 4, y: 6 });
    expect(sub({ x: 3, y: 4 }, { x: 1, y: 2 })).toEqual({ x: 2, y: 2 });
    expect(scale({ x: 2, y: 3 }, 2)).toEqual({ x: 4, y: 6 });
    expect(length({ x: 3, y: 4 })).toBe(5);
  });
  it('normalized guards the zero vector', () => {
    expect(normalized({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(length(normalized({ x: 3, y: 4 }))).toBeCloseTo(1);
  });
  it('angleOf / fromAngle round-trip', () => {
    const a = Math.PI / 3;
    expect(angleOf(fromAngle(a, 2))).toBeCloseTo(a);
    expect(length(fromAngle(a, 2))).toBeCloseTo(2);
  });
});

describe('angle', () => {
  it('degrees <-> radians', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(radToDeg(Math.PI)).toBeCloseTo(180);
  });
  it('wraps into (-PI, PI]', () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(wrapAngle(-3 * Math.PI)).toBeCloseTo(Math.PI);
    expect(wrapAngle(0)).toBe(0);
  });
});

describe('units', () => {
  it('temperature and volume and pressure', () => {
    expect(celsiusToKelvin(0)).toBeCloseTo(273.15);
    expect(litersToCubicMeters(1000)).toBe(1);
    expect(pascalsToKilopascals(1000)).toBe(1);
    expect(GAS_CONSTANT_R).toBeCloseTo(8.314);
  });
});

describe('physics kernels', () => {
  it('conserves momentum for any restitution', () => {
    for (const e of [0, 0.5, 1]) {
      const [v1, v2] = resolveCollision1D(2, 3, 1, -2, e);
      // p_before = 2*3 + 1*-2 = 4; p_after must equal 4.
      expect(2 * v1 + 1 * v2).toBeCloseTo(4);
    }
  });
  it('elastic collision (e=1) conserves kinetic energy', () => {
    const [v1, v2] = resolveCollision1D(2, 3, 1, -2, 1);
    const before = kineticEnergy(2, 3) + kineticEnergy(1, -2);
    const after = kineticEnergy(2, v1) + kineticEnergy(1, v2);
    expect(after).toBeCloseTo(before);
  });
  it('perfectly inelastic collision (e=0) yields a shared velocity', () => {
    const [v1, v2] = resolveCollision1D(2, 3, 1, -2, 0);
    expect(v1).toBeCloseTo(v2);
  });
  it('energy terms', () => {
    expect(kineticEnergy(2, 3)).toBe(9);
    expect(gravitationalPotential(2, 10, 5)).toBe(100);
    expect(springPotential(20, 0.5)).toBeCloseTo(2.5);
  });
});
