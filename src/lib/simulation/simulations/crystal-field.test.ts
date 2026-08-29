import { describe, it, expect } from 'vitest';
import crystalField, {
  CM1_TO_KJ,
  TETRAHEDRAL_RATIO,
  absorptionNm,
  colourFor,
  configurationEnergy,
  crystalFieldEnergy,
  freeIonPairs,
  hasSpinChoice,
  hasTransition,
  highSpinOccupancy,
  isLowSpin,
  lowSpinOccupancy,
  occupancyOf,
  orbitalEnergies,
  orbitalSets,
  setLabels,
  spinOnlyMoment,
  splittingCm,
  unpairedIn,
} from './crystal-field';
import type { SimState } from '../types';

function stateFor(dElectrons: number, fieldStrength = 20000, pairingEnergy = 19000, geometry = 0): SimState {
  const params = { dElectrons, fieldStrength, pairingEnergy, geometry };
  return { t: 0, params, vars: crystalField.init(params) };
}

describe('crystal-field orbital sets', () => {
  it('swaps the sets and their energies between the two geometries', () => {
    expect(orbitalSets(false)).toEqual({ lower: 3, upper: 2 });
    expect(orbitalSets(true)).toEqual({ lower: 2, upper: 3 });
    expect(orbitalEnergies(false)).toEqual({ lower: -0.4, upper: 0.6 });
    expect(orbitalEnergies(true)).toEqual({ lower: -0.6, upper: 0.4 });
    expect(setLabels(false)).toEqual({ lower: 't2g', upper: 'eg' });
    expect(setLabels(true)).toEqual({ lower: 'e', upper: 't2' });
  });

  it('keeps every set at its barycentre: the weighted energies cancel', () => {
    for (const tet of [false, true]) {
      const sets = orbitalSets(tet);
      const e = orbitalEnergies(tet);
      expect(sets.lower * e.lower + sets.upper * e.upper).toBeCloseTo(0, 9);
    }
  });
});

describe('crystal-field electron filling', () => {
  it('counts unpaired electrons by Hund\'s rule within a set', () => {
    expect(unpairedIn(0, 3)).toBe(0);
    expect(unpairedIn(2, 3)).toBe(2);
    expect(unpairedIn(3, 3)).toBe(3);
    expect(unpairedIn(5, 3)).toBe(1);
    expect(unpairedIn(6, 3)).toBe(0);
  });

  it('fills octahedral d6 as t2g4 eg2 high spin and t2g6 low spin', () => {
    expect(highSpinOccupancy(6, 3, 2)).toEqual({ lower: 4, upper: 2, unpaired: 4, pairs: 1 });
    expect(lowSpinOccupancy(6, 3, 2)).toEqual({ lower: 6, upper: 0, unpaired: 0, pairs: 3 });
  });

  it('fills octahedral d7 as t2g5 eg2 high spin and t2g6 eg1 low spin', () => {
    expect(highSpinOccupancy(7, 3, 2).unpaired).toBe(3);
    expect(lowSpinOccupancy(7, 3, 2).unpaired).toBe(1);
  });

  it('leaves d1 to d3 and d8 to d10 with only one arrangement', () => {
    for (const n of [0, 1, 2, 3, 8, 9, 10]) {
      expect(highSpinOccupancy(n, 3, 2).unpaired, `d${n}`).toBe(lowSpinOccupancy(n, 3, 2).unpaired);
    }
  });

  it('conserves electrons in every configuration and geometry', () => {
    for (let n = 0; n <= 10; n++) {
      for (const sets of [orbitalSets(false), orbitalSets(true)]) {
        for (const occ of [highSpinOccupancy(n, sets.lower, sets.upper), lowSpinOccupancy(n, sets.lower, sets.upper)]) {
          expect(occ.lower + occ.upper, `d${n}`).toBe(n);
          expect(occ.unpaired + 2 * occ.pairs, `d${n}`).toBe(n);
          expect(occ.lower).toBeLessThanOrEqual(2 * sets.lower);
          expect(occ.upper).toBeLessThanOrEqual(2 * sets.upper);
        }
      }
    }
  });

  it('matches free-ion pairing to a half-filled-first shell', () => {
    expect(freeIonPairs(5)).toBe(0);
    expect(freeIonPairs(6)).toBe(1);
    expect(freeIonPairs(10)).toBe(5);
  });
});

describe('crystal-field spin state', () => {
  it('picks high spin below the pairing energy and low spin above it', () => {
    expect(isLowSpin(stateFor(6, 10400, 19000))).toBe(false);
    expect(isLowSpin(stateFor(6, 33000, 19000))).toBe(true);
    expect(occupancyOf(stateFor(6, 10400)).unpaired).toBe(4);
    expect(occupancyOf(stateFor(6, 33000)).unpaired).toBe(0);
  });

  it('crosses over exactly where the splitting equals the pairing energy, for d4 to d7', () => {
    for (const n of [4, 5, 6, 7]) {
      expect(isLowSpin(stateFor(n, 18900, 19000)), `d${n} just below`).toBe(false);
      expect(isLowSpin(stateFor(n, 19100, 19000)), `d${n} just above`).toBe(true);
    }
  });

  it('offers no spin choice at all outside d4 to d7', () => {
    for (const n of [0, 1, 2, 3, 8, 9, 10]) expect(hasSpinChoice(stateFor(n)), `d${n}`).toBe(false);
    for (const n of [4, 5, 6, 7]) expect(hasSpinChoice(stateFor(n)), `d${n}`).toBe(true);
  });

  it('keeps tetrahedral complexes high spin at a realistic pairing energy', () => {
    // The strongest field on the slider splits a tetrahedral complex by 40000 x 4/9 = 17778 cm^-1,
    // which never reaches a typical 19000 cm^-1 pairing energy. That is the whole reason low-spin
    // tetrahedral complexes are so rare, and the model gets there without a special case.
    for (const n of [4, 5, 6, 7]) {
      expect(isLowSpin(stateFor(n, 40000, 19000, 1)), `d${n}`).toBe(false);
    }
    // Push the pairing energy far enough down and even a tetrahedral field wins, as it should.
    expect(isLowSpin(stateFor(6, 40000, 8000, 1))).toBe(true);
  });
});

describe('crystal-field energies', () => {
  it('shrinks the tetrahedral splitting to four ninths of the octahedral one', () => {
    expect(splittingCm(stateFor(6, 18000, 19000, 1))).toBeCloseTo(18000 * TETRAHEDRAL_RATIO, 6);
    expect(splittingCm(stateFor(6, 18000, 19000, 0))).toBe(18000);
  });

  it('gives octahedral d3 a CFSE of -1.2 delta', () => {
    const s = stateFor(3, 17400);
    expect(crystalFieldEnergy(occupancyOf(s), false, 17400)).toBeCloseTo(-1.2 * 17400 * CM1_TO_KJ, 6);
  });

  it('gives low-spin octahedral d6 a CFSE of -2.4 delta', () => {
    const s = stateFor(6, 33000);
    expect(crystalFieldEnergy(occupancyOf(s), false, 33000)).toBeCloseTo(-2.4 * 33000 * CM1_TO_KJ, 6);
  });

  it('leaves high-spin d5 and every d10 with no crystal field stabilization', () => {
    expect(crystalFieldEnergy(occupancyOf(stateFor(5, 10000)), false, 10000)).toBeCloseTo(0, 9);
    expect(crystalFieldEnergy(occupancyOf(stateFor(10, 20000)), false, 20000)).toBeCloseTo(0, 9);
  });

  it('charges only the pairing a field forces beyond the free ion', () => {
    const hs = highSpinOccupancy(6, 3, 2);
    expect(configurationEnergy(hs, 6, false, 10000, 19000)).toBeCloseTo(-0.4 * 10000 * CM1_TO_KJ, 6);
  });
});

describe('crystal-field observables', () => {
  it('computes the spin-only magnetic moment', () => {
    expect(spinOnlyMoment(0)).toBe(0);
    expect(spinOnlyMoment(4)).toBeCloseTo(Math.sqrt(24), 6);
    expect(spinOnlyMoment(5)).toBeCloseTo(Math.sqrt(35), 6);
  });

  it('turns the splitting into an absorption wavelength', () => {
    expect(absorptionNm(stateFor(6, 20000))).toBeCloseTo(500, 6);
    expect(absorptionNm(stateFor(6, 25000))).toBeCloseTo(400, 6);
  });

  it('pairs absorbed and observed colours the standard way', () => {
    expect(colourFor(520).absorbed).toBe('green');
    expect(colourFor(520).observed).toBe('purple');
    expect(colourFor(450).observed).toBe('yellow');
    expect(colourFor(1200).observed).toBe('colourless');
    expect(colourFor(200).observed).toBe('colourless');
  });

  it('reports no d to d transition for d0 and d10', () => {
    expect(hasTransition(stateFor(0))).toBe(false);
    expect(hasTransition(stateFor(10))).toBe(false);
    expect(hasTransition(stateFor(5))).toBe(true);
  });
});

describe('crystal-field interaction', () => {
  it('toggles the geometry on a tap and ignores everything else', () => {
    const s = stateFor(6);
    expect(crystalField.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.5, t: 0 })).toBeNull();
    expect(crystalField.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toEqual({ geometry: 1 });
    s.params.geometry = 1;
    expect(crystalField.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toEqual({ geometry: 0 });
  });

  it('every preset is within its parameter range', () => {
    for (const preset of crystalField.presets) {
      for (const param of crystalField.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });

  it('ships presets whose spin states are the ones the chemistry is famous for', () => {
    expect(isLowSpin(stateFor(6, 10400, 19000, 0))).toBe(false);
    expect(isLowSpin(stateFor(6, 33000, 19000, 0))).toBe(true);
    expect(occupancyOf(stateFor(8, 10800, 19000, 0)).unpaired).toBe(2);
    expect(occupancyOf(stateFor(7, 9000, 19000, 1)).unpaired).toBe(3);
  });
});
