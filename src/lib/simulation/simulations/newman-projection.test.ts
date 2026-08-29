import { describe, it, expect } from 'vitest';
import newmanProjection, {
  E_HH,
  METHYL_SIZE,
  curvature,
  describeRotationRate,
  displayAngle,
  eclipseBump,
  eclipseRH,
  eclipseRR,
  gaucheStrain,
  highestBarrier,
  librationRms,
  offsetFromEclipsed,
  populations,
  rotationsPerSecond,
  sizeFraction,
  stericAt,
  strainAt,
  torsionalAt,
  wrapAngle360,
  wrapSigned,
} from './newman-projection';
import type { SimState } from '../types';

const BUTANE = sizeFraction(METHYL_SIZE);
const ETHANE = 0;

function stateAt(dihedral: number, size = METHYL_SIZE, temperature = 298): SimState {
  const params = { dihedral, size, temperature };
  return { t: 0, params, vars: newmanProjection.init(params) };
}

describe('newman-projection pairwise strain fits', () => {
  it('reproduces the textbook eclipsing costs at methyl', () => {
    expect(eclipseRH(BUTANE)).toBeCloseTo(6, 6);
    expect(eclipseRR(BUTANE)).toBeCloseTo(11, 6);
    expect(gaucheStrain(BUTANE)).toBeCloseTo(3.8, 6);
  });

  it('collapses to plain H/H eclipsing when the substituents are hydrogens', () => {
    expect(eclipseRH(ETHANE)).toBeCloseTo(E_HH, 6);
    expect(eclipseRR(ETHANE)).toBeCloseTo(E_HH, 6);
    expect(gaucheStrain(ETHANE)).toBe(0);
  });
});

describe('newman-projection strain curve', () => {
  it('gives ethane a 12 kJ/mol barrier and three identical staggered minima', () => {
    expect(strainAt(0, ETHANE)).toBeCloseTo(3 * E_HH, 6);
    expect(strainAt(120, ETHANE)).toBeCloseTo(3 * E_HH, 6);
    expect(strainAt(60, ETHANE)).toBeCloseTo(0, 6);
    expect(strainAt(180, ETHANE)).toBeCloseTo(0, 6);
    expect(strainAt(300, ETHANE)).toBeCloseTo(0, 6);
  });

  it('reproduces butane: 19 syn, 16 eclipsed, 3.8 gauche, 0 anti', () => {
    expect(strainAt(0, BUTANE)).toBeCloseTo(19, 6);
    expect(strainAt(120, BUTANE)).toBeCloseTo(16, 6);
    expect(strainAt(240, BUTANE)).toBeCloseTo(16, 6);
    expect(strainAt(60, BUTANE)).toBeCloseTo(3.8, 6);
    expect(strainAt(180, BUTANE)).toBeCloseTo(0, 6);
  });

  it('splits butane strain into a torsional and a steric part that add back up', () => {
    for (const deg of [0, 37, 60, 120, 180, 245, 310]) {
      expect(torsionalAt(deg, BUTANE) + stericAt(deg, BUTANE)).toBeCloseTo(strainAt(deg, BUTANE), 9);
    }
    // Ethane has no steric term at all: the whole curve is bond eclipsing.
    for (const deg of [0, 45, 90, 180]) expect(stericAt(deg, ETHANE)).toBe(0);
  });

  it('is periodic in 360 degrees and symmetric about anti', () => {
    for (const deg of [0, 25, 60, 130, 180]) {
      expect(strainAt(deg + 360, BUTANE)).toBeCloseTo(strainAt(deg, BUTANE), 9);
      expect(strainAt(360 - deg, BUTANE)).toBeCloseTo(strainAt(deg, BUTANE), 9);
    }
  });

  it('never dips below the anti conformer, whatever the substituent size', () => {
    for (let size = 0; size <= 100; size += 5) {
      const b = sizeFraction(size);
      for (let deg = 0; deg < 360; deg += 3) expect(strainAt(deg, b)).toBeGreaterThanOrEqual(-1e-9);
    }
  });

  it('reports the syn conformation as the tallest barrier once the groups differ', () => {
    expect(highestBarrier(BUTANE)).toBeCloseTo(19, 6);
    expect(highestBarrier(ETHANE)).toBeCloseTo(12, 6);
    expect(highestBarrier(1)).toBeGreaterThan(highestBarrier(BUTANE));
  });
});

describe('newman-projection torsional bump', () => {
  it('peaks eclipsed, vanishes staggered, and stays flat beyond', () => {
    expect(eclipseBump(0)).toBeCloseTo(1, 9);
    expect(eclipseBump(60)).toBeCloseTo(0, 9);
    expect(eclipseBump(-60)).toBeCloseTo(0, 9);
    expect(eclipseBump(90)).toBe(0);
    expect(eclipseBump(180)).toBe(0);
    expect(eclipseBump(360)).toBeCloseTo(1, 9);
  });
});

describe('newman-projection populations', () => {
  it('splits ethane evenly across its three identical basins', () => {
    const p = populations(stateAt(60, 0));
    expect(p.anti).toBeCloseTo(1 / 3, 2);
    expect(p.gauche).toBeCloseTo(2 / 3, 2);
  });

  it('favours anti for butane and always sums to one', () => {
    const p = populations(stateAt(180, METHYL_SIZE, 298));
    expect(p.anti).toBeGreaterThan(0.6);
    expect(p.anti + p.gauche).toBeCloseTo(1, 9);
  });

  it('evens out as the temperature rises and sharpens as it falls', () => {
    const hot = populations(stateAt(180, METHYL_SIZE, 600)).anti;
    const warm = populations(stateAt(180, METHYL_SIZE, 298)).anti;
    const cold = populations(stateAt(180, METHYL_SIZE, 100)).anti;
    expect(hot).toBeLessThan(warm);
    expect(warm).toBeLessThan(cold);
    expect(cold).toBeGreaterThan(0.95);
  });

  it('drives the gauche basins out entirely as the groups grow', () => {
    const small = populations(stateAt(180, 10)).gauche;
    const large = populations(stateAt(180, 100)).gauche;
    expect(large).toBeLessThan(small);
  });
});

describe('newman-projection thermal libration', () => {
  it('finds a positive curvature in a well and a non-positive one on a barrier', () => {
    expect(curvature(stateAt(180))).toBeGreaterThan(0);
    expect(curvature(stateAt(60))).toBeGreaterThan(0);
    expect(curvature(stateAt(0))).toBeLessThan(0);
  });

  it('widens with temperature and caps where there is no well', () => {
    expect(librationRms(stateAt(180, METHYL_SIZE, 600))).toBeGreaterThan(
      librationRms(stateAt(180, METHYL_SIZE, 100)),
    );
    expect(librationRms(stateAt(0))).toBe(60);
  });

  it('wobbles the drawn angle around the set one without moving the readout', () => {
    const s = stateAt(180);
    newmanProjection.step(s, 0.16);
    expect(s.vars.wobble).not.toBe(0);
    expect(s.params.dihedral).toBe(180);
    expect(displayAngle(s)).not.toBeCloseTo(180, 6);
  });
});

describe('newman-projection rotation rate', () => {
  it('crosses a butane barrier billions of times a second at room temperature', () => {
    expect(rotationsPerSecond(19, 298)).toBeGreaterThan(1e9);
    expect(describeRotationRate(19, 298)).toBe('billions of times a second');
  });

  it('slows right down for a tall barrier, and stops entirely when it is cold', () => {
    expect(describeRotationRate(40, 298)).toBe('millions of times a second');
    expect(describeRotationRate(40, 100)).toBe('so rarely that these conformers could be separated and bottled');
  });

  it('never claims a rate the Arrhenius factor does not support', () => {
    for (let size = 0; size <= 100; size += 10) {
      for (const temperature of [100, 298, 600]) {
        const rate = rotationsPerSecond(highestBarrier(sizeFraction(size)), temperature);
        expect(Number.isFinite(rate)).toBe(true);
        expect(rate).toBeGreaterThan(0);
      }
    }
  });
});

describe('newman-projection angle helpers', () => {
  it('folds angles into their canonical ranges', () => {
    expect(wrapSigned(190)).toBeCloseTo(-170, 9);
    expect(wrapSigned(-190)).toBeCloseTo(170, 9);
    expect(wrapSigned(180)).toBeCloseTo(180, 9);
    expect(wrapAngle360(-30)).toBeCloseTo(330, 9);
    expect(wrapAngle360(390)).toBeCloseTo(30, 9);
  });

  it('measures the distance to the nearest eclipsed conformation', () => {
    expect(offsetFromEclipsed(0)).toBeCloseTo(0, 9);
    expect(offsetFromEclipsed(60)).toBeCloseTo(60, 9);
    expect(offsetFromEclipsed(130)).toBeCloseTo(10, 9);
  });
});

describe('newman-projection interaction', () => {
  it('drags relative to where the grab started, never snapping to the finger', () => {
    const s = stateAt(180);
    expect(newmanProjection.pointer!.handle(s, { type: 'down', x: 0.5, y: 0.5, t: 0 })).toBeNull();
    const patch = newmanProjection.pointer!.handle(s, { type: 'move', x: 0.75, y: 0.5, t: 0.1 });
    expect(patch!.dihedral).toBeCloseTo(270, 6);
  });

  it('keeps a dragged angle inside the slider range by wrapping it', () => {
    const s = stateAt(350);
    newmanProjection.pointer!.handle(s, { type: 'down', x: 0.1, y: 0.5, t: 0 });
    const patch = newmanProjection.pointer!.handle(s, { type: 'move', x: 0.9, y: 0.5, t: 0.1 });
    expect(patch!.dihedral).toBeGreaterThanOrEqual(0);
    expect(patch!.dihedral).toBeLessThanOrEqual(360);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of newmanProjection.presets) {
      for (const param of newmanProjection.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
