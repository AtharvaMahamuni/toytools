import { describe, it, expect } from 'vitest';
import molecularGeometry, {
  LINEAR_IDEAL,
  RIGHT_ANGLE,
  TETRAHEDRAL_COMPRESSION,
  TETRAHEDRAL_IDEAL,
  TRIGONAL_IDEAL,
  anglesCompressed,
  axeNotation,
  compressedAngle,
  electronGeometry,
  geometriesDiffer,
  idealAngle,
  idealAngleAtSteric,
  isValid,
  lonePairs,
  molecularShape,
  sitesFor,
  stericNumber,
  wrapAngle,
} from './molecular-geometry';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

function molecule(bonding: number, lone: number): SimState {
  const params = { bondingPairs: bonding, lonePairs: lone };
  return { t: 0, params, vars: molecularGeometry.init(params) };
}

describe('steric number', () => {
  it('is bonding pairs plus lone pairs', () => {
    expect(stericNumber(molecule(2, 2))).toBe(4);
    expect(stericNumber(molecule(4, 0))).toBe(4);
    expect(stericNumber(molecule(4, 2))).toBe(6);
    expect(stericNumber(molecule(6, 0))).toBe(6);
  });

  it('is valid only for steric numbers 2 through 6', () => {
    expect(isValid(molecule(1, 0))).toBe(false);
    expect(isValid(molecule(2, 0))).toBe(true);
    expect(isValid(molecule(6, 0))).toBe(true);
    expect(isValid(molecule(6, 1))).toBe(false);
    expect(isValid(molecule(3, 4))).toBe(false);
  });
});

describe('electron geometry', () => {
  it('follows steric number, not the bonded-atom count', () => {
    expect(electronGeometry(molecule(2, 0))).toBe('linear');
    expect(electronGeometry(molecule(3, 0))).toBe('trigonal planar');
    expect(electronGeometry(molecule(2, 2))).toBe('tetrahedral');
    expect(electronGeometry(molecule(4, 1))).toBe('trigonal bipyramidal');
    expect(electronGeometry(molecule(4, 2))).toBe('octahedral');
    expect(electronGeometry(molecule(1, 0))).toBe('none');
  });
});

describe('molecular shape', () => {
  it('matches the textbook AXE table', () => {
    expect(molecularShape(molecule(2, 0))).toBe('linear');
    expect(molecularShape(molecule(2, 1))).toBe('bent');
    expect(molecularShape(molecule(2, 2))).toBe('bent');
    expect(molecularShape(molecule(3, 0))).toBe('trigonal planar');
    expect(molecularShape(molecule(3, 1))).toBe('trigonal pyramidal');
    expect(molecularShape(molecule(4, 0))).toBe('tetrahedral');
    expect(molecularShape(molecule(4, 1))).toBe('see-saw');
    expect(molecularShape(molecule(3, 2))).toBe('T-shaped');
    expect(molecularShape(molecule(2, 3))).toBe('linear');
    expect(molecularShape(molecule(5, 0))).toBe('trigonal bipyramidal');
    expect(molecularShape(molecule(5, 1))).toBe('square pyramidal');
    expect(molecularShape(molecule(4, 2))).toBe('square planar');
    expect(molecularShape(molecule(6, 0))).toBe('octahedral');
  });

  it('writes AXE the way a course writes it', () => {
    expect(axeNotation(molecule(2, 2))).toBe('AX2E2');
    expect(axeNotation(molecule(4, 0))).toBe('AX4');
    expect(axeNotation(molecule(4, 2))).toBe('AX4E2');
    expect(axeNotation(molecule(6, 0))).toBe('AX6');
  });
});

describe('the split the tool exists to show', () => {
  it('splits water: tetrahedral electron geometry, bent molecular shape', () => {
    const water = molecule(2, 2);
    expect(electronGeometry(water)).toBe('tetrahedral');
    expect(molecularShape(water)).toBe('bent');
    expect(geometriesDiffer(water)).toBe(true);
  });

  it('splits ammonia the same way', () => {
    const ammonia = molecule(3, 1);
    expect(electronGeometry(ammonia)).toBe('tetrahedral');
    expect(molecularShape(ammonia)).toBe('trigonal pyramidal');
    expect(geometriesDiffer(ammonia)).toBe(true);
  });

  it('splits XeF4: octahedral electron geometry, square planar shape', () => {
    const xef4 = molecule(4, 2);
    expect(electronGeometry(xef4)).toBe('octahedral');
    expect(molecularShape(xef4)).toBe('square planar');
    expect(geometriesDiffer(xef4)).toBe(true);
  });

  it('stays silent when there are no lone pairs to split the names', () => {
    expect(geometriesDiffer(molecule(2, 0))).toBe(false);
    expect(geometriesDiffer(molecule(4, 0))).toBe(false);
    expect(geometriesDiffer(molecule(6, 0))).toBe(false);
  });
});

describe('bond angles', () => {
  it('keeps the ideal when every group is a bonding pair', () => {
    expect(idealAngle(molecule(2, 0))).toBe(LINEAR_IDEAL);
    expect(compressedAngle(molecule(2, 0))).toBe(LINEAR_IDEAL);
    expect(idealAngle(molecule(3, 0))).toBe(TRIGONAL_IDEAL);
    expect(compressedAngle(molecule(4, 0))).toBe(TETRAHEDRAL_IDEAL);
    expect(compressedAngle(molecule(6, 0))).toBe(RIGHT_ANGLE);
    expect(anglesCompressed(molecule(4, 0))).toBe(false);
  });

  it('compresses tetrahedral angles 2.5 degrees per lone pair', () => {
    expect(TETRAHEDRAL_COMPRESSION).toBe(2.5);
    expect(compressedAngle(molecule(3, 1))).toBeCloseTo(107, 6);
    expect(compressedAngle(molecule(2, 2))).toBeCloseTo(104.5, 6);
    expect(anglesCompressed(molecule(2, 2))).toBe(true);
  });

  it('nudges the trigonal-planar bent case just under 120', () => {
    expect(compressedAngle(molecule(2, 1))).toBeCloseTo(119, 6);
  });

  it('feeds the graph from steric number', () => {
    expect(idealAngleAtSteric(2)).toBe(LINEAR_IDEAL);
    expect(idealAngleAtSteric(4)).toBe(TETRAHEDRAL_IDEAL);
    expect(idealAngleAtSteric(5)).toBe(RIGHT_ANGLE);
    expect(idealAngleAtSteric(1)).toBe(0);
  });
});

describe('sites', () => {
  it('puts lone pairs on Bent-rule sites so AX2E3 is axial linear', () => {
    const linear = sitesFor(molecule(2, 3));
    expect(linear.filter((s) => s.kind === 'lone')).toHaveLength(3);
    expect(linear.filter((s) => s.kind === 'bond')).toHaveLength(2);
    const bonds = linear.filter((s) => s.kind === 'bond').map((s) => s.pos);
    // Axial in the TBP template are ±y, so the two bonding sites point opposite.
    expect(bonds[0]!.y * bonds[1]!.y).toBeLessThan(0);
    expect(Math.abs(bonds[0]!.y)).toBeCloseTo(1, 6);
  });

  it('puts the two XeF4 lone pairs trans-axial so the bonds sit square planar', () => {
    const xef4 = sitesFor(molecule(4, 2));
    const lones = xef4.filter((s) => s.kind === 'lone').map((s) => s.pos);
    expect(lones).toHaveLength(2);
    expect(lones[0]!.y * lones[1]!.y).toBeLessThan(0);
    const bonds = xef4.filter((s) => s.kind === 'bond');
    expect(bonds.every((s) => Math.abs(s.pos.y) < 1e-9)).toBe(true);
  });

  it('returns nothing outside the VSEPR table', () => {
    expect(sitesFor(molecule(1, 0))).toEqual([]);
    expect(sitesFor(molecule(6, 1))).toEqual([]);
  });
});

describe('narrative', () => {
  it('names the water split and stays quiet on methane', () => {
    const waterObs = molecularGeometry.observations.map((rule) => rule(molecule(2, 2))).filter(Boolean);
    expect(waterObs.some((line) => /tetrahedral/i.test(line!) && /bent/i.test(line!))).toBe(true);
    expect(waterObs.some((line) => /104\.5/.test(line!))).toBe(true);

    const methaneObs = molecularGeometry.observations.map((rule) => rule(molecule(4, 0))).filter(Boolean);
    expect(methaneObs.some((line) => /The molecular shape is/.test(line!))).toBe(false);
    expect(methaneObs.some((line) => /both tetrahedral/.test(line!))).toBe(true);
  });

  it('explains the invalid ends of the sliders', () => {
    expect(molecularGeometry.explanation(molecule(1, 0)).length).toBeGreaterThan(0);
    expect(molecularGeometry.explanation(molecule(6, 4)).length).toBeGreaterThan(0);
    const tooFew = molecularGeometry.observations.map((rule) => rule(molecule(1, 0))).filter(Boolean);
    expect(tooFew.some((line) => /single pair/i.test(line!))).toBe(true);
  });
});

describe('presets and motion', () => {
  it('defaults to water, which is the split the page exists to show', () => {
    expect(molecularGeometry.params.find((p) => p.id === 'bondingPairs')!.default).toBe(2);
    expect(molecularGeometry.params.find((p) => p.id === 'lonePairs')!.default).toBe(2);
  });

  it('covers the teaching set', () => {
    const byId = Object.fromEntries(molecularGeometry.presets.map((p) => [p.id, p]));
    expect(molecularShape(molecule(byId.water!.values.bondingPairs, byId.water!.values.lonePairs))).toBe('bent');
    expect(molecularShape(molecule(byId.methane!.values.bondingPairs, byId.methane!.values.lonePairs))).toBe('tetrahedral');
    expect(molecularShape(molecule(byId.xef4!.values.bondingPairs, byId.xef4!.values.lonePairs))).toBe('square planar');
    expect(geometriesDiffer(molecule(byId.co2!.values.bondingPairs, byId.co2!.values.lonePairs))).toBe(false);
  });

  it('spins yaw without drifting out of range', () => {
    const s = molecule(2, 2);
    for (let i = 0; i < 600; i++) molecularGeometry.step(s, SUBSTEP);
    expect(s.vars.yaw).toBeGreaterThanOrEqual(0);
    expect(s.vars.yaw).toBeLessThan(Math.PI * 2);
    expect(s.t).toBeCloseTo(600 * SUBSTEP);
  });

  it('wraps a negative yaw', () => {
    expect(wrapAngle(-0.1)).toBeGreaterThan(0);
    expect(wrapAngle(Math.PI * 2 + 0.1)).toBeCloseTo(0.1, 6);
  });

  it('uses both pair counts in every preset', () => {
    for (const preset of molecularGeometry.presets) {
      expect(preset.values.bondingPairs).toBeGreaterThanOrEqual(1);
      expect(preset.values.lonePairs).toBeGreaterThanOrEqual(0);
      expect(lonePairs({ t: 0, params: preset.values, vars: {} })).toBe(preset.values.lonePairs);
    }
  });
});
