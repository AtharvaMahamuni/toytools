import { describe, it, expect } from 'vitest';
import chemicalBond, {
  BOUNDARY_MARGIN,
  IONIC_LIMIT,
  MAX_BOND_Z,
  NONMETALS,
  NONPOLAR_LIMIT,
  bondLabel,
  bondType,
  chargeOffset,
  deltaEN,
  distanceToBoundary,
  electronegativityOf,
  ionicCharacter,
  ionicCharacterOf,
  isDefined,
  isMisclassifiedNonmetalPair,
  polarityDirection,
} from './chemical-bond';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

function bond(elementA: number, elementB: number): SimState {
  const params = { elementA, elementB };
  return { t: 0, params, vars: chemicalBond.init(params) };
}

describe('electronegativity difference', () => {
  it('reads Pauling values off the shared element table', () => {
    expect(electronegativityOf(9)).toBe(3.98); // fluorine, the most electronegative
    expect(electronegativityOf(55)).toBe(0.79); // caesium, the least
    expect(electronegativityOf(2)).toBeNull(); // helium has no accepted value
  });

  it('is symmetric and never negative', () => {
    expect(deltaEN(bond(11, 17))).toBeCloseTo(2.23, 6);
    expect(deltaEN(bond(17, 11))).toBeCloseTo(2.23, 6);
    expect(deltaEN(bond(8, 8))).toBe(0);
  });

  it('reports zero and flags the gap when a value is undefined', () => {
    const s = bond(2, 9);
    expect(isDefined(s)).toBe(false);
    expect(deltaEN(s)).toBe(0);
    expect(ionicCharacter(s)).toBe(0);
    expect(bondType(s)).toBe('undefined');
  });
});

describe('Pauling ionic character', () => {
  it('is zero at no difference and rises monotonically', () => {
    expect(ionicCharacterOf(0)).toBe(0);
    let previous = -1;
    for (let d = 0; d <= 3.3; d += 0.1) {
      const value = ionicCharacterOf(d);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('passes through 50 percent at the 1.7 cutoff, which is where the cutoff comes from', () => {
    expect(ionicCharacterOf(IONIC_LIMIT)).toBeCloseTo(51.4, 1);
  });

  it('matches the closed form', () => {
    for (const d of [0.4, 1.0, 1.78, 2.23, 3.19]) {
      expect(ionicCharacterOf(d)).toBeCloseTo(100 * (1 - Math.exp(-(d * d) / 4)), 9);
    }
  });

  it('never leaves the 0 to 100 range across the whole slider space', () => {
    for (let a = 1; a <= MAX_BOND_Z; a += 5) {
      for (let b = 1; b <= MAX_BOND_Z; b += 5) {
        const value = ionicCharacter(bond(a, b));
        expect(Number.isFinite(value), `${a}-${b}`).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('bond type', () => {
  it('classifies the textbook cases', () => {
    expect(bondType(bond(8, 8))).toBe('nonpolar covalent');
    expect(bondType(bond(1, 17))).toBe('polar covalent'); // HCl, delta 0.96
    expect(bondType(bond(11, 17))).toBe('ionic'); // NaCl, delta 2.23
  });

  it('uses the conventional boundaries', () => {
    expect(NONPOLAR_LIMIT).toBe(0.4);
    expect(IONIC_LIMIT).toBe(1.7);
  });

  it('measures the distance to the nearer boundary', () => {
    expect(distanceToBoundary(0.4)).toBeCloseTo(0, 9);
    expect(distanceToBoundary(1.7)).toBeCloseTo(0, 9);
    expect(distanceToBoundary(1.0)).toBeCloseTo(0.6, 9);
  });
});

describe('where the cutoff fails', () => {
  it('catches hydrogen fluoride, which the cutoff calls ionic and is not', () => {
    const hf = bond(1, 9);
    expect(deltaEN(hf)).toBeCloseTo(1.78, 6);
    expect(deltaEN(hf)).toBeGreaterThan(IONIC_LIMIT);
    expect(bondType(hf)).toBe('ionic');
    expect(isMisclassifiedNonmetalPair(hf)).toBe(true);
  });

  it('does not flag a genuine metal and nonmetal pair', () => {
    expect(isMisclassifiedNonmetalPair(bond(11, 17))).toBe(false); // NaCl really is ionic
    expect(isMisclassifiedNonmetalPair(bond(55, 9))).toBe(false); // CsF, the extreme case
  });

  it('does not flag a nonmetal pair below the threshold', () => {
    expect(isMisclassifiedNonmetalPair(bond(1, 17))).toBe(false); // HCl sits at 0.96
  });

  it('keeps the nonmetal set to elements that really are nonmetals', () => {
    for (const z of [1, 6, 7, 8, 9, 16, 17, 35, 53]) expect(NONMETALS.has(z), `Z=${z}`).toBe(true);
    for (const z of [3, 11, 12, 20, 26, 55]) expect(NONMETALS.has(z), `Z=${z}`).toBe(false);
  });

  it('flags a boundary case within the margin', () => {
    // Carbon and hydrogen differ by 0.35, just inside the 0.4 boundary.
    expect(distanceToBoundary(deltaEN(bond(1, 6)))).toBeLessThanOrEqual(BOUNDARY_MARGIN);
  });
});

describe('polarity direction', () => {
  it('points at the more electronegative partner', () => {
    expect(polarityDirection(bond(11, 17))).toBe(1); // Cl pulls
    expect(polarityDirection(bond(17, 11))).toBe(-1);
    expect(polarityDirection(bond(8, 8))).toBe(0);
  });

  it('offsets the shared pair toward that partner, capped at the atom itself', () => {
    expect(chargeOffset(bond(8, 8))).toBe(0);
    expect(chargeOffset(bond(11, 17))).toBeGreaterThan(0.7);
    expect(chargeOffset(bond(17, 11))).toBeLessThan(-0.7);
    for (let a = 1; a <= MAX_BOND_Z; a += 9) {
      for (let b = 1; b <= MAX_BOND_Z; b += 9) {
        const offset = chargeOffset(bond(a, b));
        expect(Math.abs(offset), `${a}-${b}`).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('presentation and animation', () => {
  it('labels the bond the way a chemist writes it', () => {
    expect(bondLabel(bond(11, 17))).toBe('Na-Cl');
    expect(bondLabel(bond(1, 9))).toBe('H-F');
  });

  it('cycles the shared pair without drifting', () => {
    const s = bond(11, 17);
    for (let i = 0; i < 600; i++) chemicalBond.step(s, SUBSTEP);
    expect(s.vars.phase).toBeGreaterThanOrEqual(0);
    expect(s.vars.phase).toBeLessThan(1);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of chemicalBond.presets) {
      for (const param of chemicalBond.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });

  it('ships the preset spread the teaching needs', () => {
    expect(bondType(bond(8, 8))).toBe('nonpolar covalent');
    expect(bondType(bond(1, 17))).toBe('polar covalent');
    expect(bondType(bond(11, 17))).toBe('ionic');
    expect(isMisclassifiedNonmetalPair(bond(1, 9))).toBe(true);
    expect(deltaEN(bond(55, 9))).toBeCloseTo(3.19, 6);
  });
});
