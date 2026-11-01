import { describe, expect, it } from 'vitest';
import { boundsOf, boxMessage, clampTo, isWhole, niceStep, readBox, reclampAll, unitOf } from './live-params';
import type { ParamDef } from './types';
import fractionBars, { capNote, liveFractionParam } from './simulations/fraction-bars';
import decay, { elapsedBounds, ISOTOPES } from './simulations/radioactive-decay';
import chair from './simulations/cyclohexane-chair';

const param = (sim: { params: ParamDef[] }, id: string) => sim.params.find((p) => p.id === id)!;

describe('live-params helpers', () => {
  it('narrows the static range and never widens it', () => {
    const p: ParamDef = { id: 'x', label: 'X', unit: 'm', min: 0, max: 10, step: 1, default: 1 };
    expect(boundsOf({}, p, {})).toEqual({ min: 0, max: 10, step: 1, unit: 'm' });
    expect(boundsOf({ liveParam: () => ({ max: 4, step: 0.5, unit: 'cm' }) }, p, {})).toEqual({ min: 0, max: 4, step: 0.5, unit: 'cm' });
    expect(boundsOf({ liveParam: () => ({ min: -5, max: 99 }) }, p, {})).toEqual({ min: 0, max: 10, step: 1, unit: 'm' });
  });

  it('clamps, and falls back on a non-finite value', () => {
    expect(clampTo({ min: 200, max: 600 }, 1000, 298)).toBe(600);
    expect(clampTo({ min: 200, max: 600 }, -5, 298)).toBe(200);
    expect(clampTo({ min: 200, max: 600 }, NaN, 298)).toBe(298);
  });

  it('reads a number box: out of range or empty is invalid, and the used value is in range', () => {
    const b = { min: 200, max: 600 };
    expect(readBox('1000', b, 298)).toEqual({ value: 600, invalid: true, problem: 'range' });
    expect(readBox('-5', b, 298)).toEqual({ value: 200, invalid: true, problem: 'range' });
    expect(readBox('', b, 298)).toEqual({ value: 298, invalid: true, problem: 'empty' });
    expect(readBox('abc', b, 298)).toEqual({ value: 298, invalid: true, problem: 'nan' });
    expect(readBox(' 350 ', b, 298)).toEqual({ value: 350, invalid: false, problem: null });
  });

  it('a whole-number box rounds 1.5 to 2 and flags it; a decimal box keeps 1.5', () => {
    const b = { min: 0, max: 24 };
    expect(readBox('1.5', b, 1, true)).toEqual({ value: 2, invalid: true, problem: 'whole' });
    expect(readBox('30.4', b, 1, true)).toEqual({ value: 24, invalid: true, problem: 'range' });
    expect(readBox('1.5', b, 1, false)).toEqual({ value: 1.5, invalid: false, problem: null });
    expect(isWhole(param(fractionBars, 'numA'))).toBe(true);
    expect(isWhole(param(decay, 'elapsed'))).toBe(false);
  });

  it('error messages name the value in use', () => {
    const b = { min: 200, max: 600, unit: 'K' };
    expect(boxMessage('range', b, 600, true)).toBe('Use a whole number from 200 to 600 K. Using 600 K.');
    expect(boxMessage('whole', { min: 0, max: 2, unit: '' }, 2, true)).toBe('Use a whole number. Using 2.');
    expect(boxMessage('empty', b, 298, false)).toBe('Enter a number. Using 298 K.');
    expect(boxMessage('nan', b, 298, true)).toBe('Enter a whole number. Using 298 K.');
  });

  it('picks round steps', () => {
    expect(niceStep(109.77)).toBe(1);
    expect(niceStep(8.04)).toBe(0.1);
    expect(niceStep(5.27)).toBe(0.05);
    expect(niceStep(5730)).toBe(50);
    expect(niceStep(0)).toBe(1);
    expect(niceStep(250)).toBe(2);
  });

  it('unitOf falls back to the static unit', () => {
    expect(unitOf({}, { id: 'a', unit: 'K' }, {})).toBe('K');
    expect(unitOf({ liveUnit: () => 'days' }, { id: 'a', unit: '' }, {})).toBe('days');
  });
});

describe('Fraction Bars inputs match what is drawn (audit F-1)', () => {
  it('bounds each numerator at twice its denominator', () => {
    expect(liveFractionParam('numA', { denA: 1, denB: 3 })).toEqual({ max: 2 });
    expect(liveFractionParam('numB', { denA: 1, denB: 12 })).toEqual({ max: 24 });
    expect(liveFractionParam('denA', { denA: 1 })).toBeNull();
    expect(boundsOf(fractionBars, param(fractionBars, 'numA'), { denA: 4 }).max).toBe(8);
  });

  it('24/1 is clamped to 2/1 in the params themselves, so the input shows 2 and says why', () => {
    const params = { mode: 2, view: 0, numA: 24, denA: 1, numB: 1, denB: 3 };
    expect(reclampAll(fractionBars, params)).toEqual(['numA']);
    expect(params.numA).toBe(2);
    expect(capNote(params)).toMatch(/at most 2 wholes/);
    expect(capNote({ numA: 1, denA: 2, numB: 1, denB: 3 })).toBeNull();
  });

  it('a denominator change re-clamps the numerator after it', () => {
    const params = { mode: 0, view: 0, numA: 20, denA: 12, numB: 1, denB: 3 };
    expect(reclampAll(fractionBars, params)).toEqual([]);
    params.denA = 5;
    expect(reclampAll(fractionBars, params)).toEqual(['numA']);
    expect(params.numA).toBe(10);
  });
});

describe('Decay elapsed time follows the isotope (audit D-1, D-2)', () => {
  it('uses the isotope unit, ten half-lives of range and a round step', () => {
    expect(elapsedBounds(ISOTOPES[0]!)).toEqual({ min: 0, max: 1098, step: 1, unit: 'minutes' });
    expect(elapsedBounds(ISOTOPES[1]!)).toEqual({ min: 0, max: 80.4, step: 0.1, unit: 'days' });
    expect(elapsedBounds(ISOTOPES[2]!)).toEqual({ min: 0, max: 52.7, step: 0.05, unit: 'years' });
    expect(elapsedBounds(ISOTOPES[3]!)).toEqual({ min: 0, max: 57300, step: 50, unit: 'years' });
  });

  it('every live range sits inside the static param range', () => {
    const p = param(decay, 'elapsed');
    for (const iso of ISOTOPES) expect(elapsedBounds(iso).max).toBeLessThanOrEqual(p.max);
  });

  it('switching from carbon-14 to fluorine-18 re-clamps elapsed time', () => {
    const params = { isotope: 3, pace: 0.25, elapsed: 11460 };
    expect(reclampAll(decay, params)).toEqual([]);
    params.isotope = 0;
    expect(reclampAll(decay, params)).toEqual(['elapsed']);
    expect(params.elapsed).toBe(1098);
  });

  it('labels carry no placeholder unit, and the half-life card shows the isotope unit', () => {
    expect(param(decay, 'elapsed').label).toBe('Elapsed time');
    expect(JSON.stringify(decay.formula)).not.toContain('isotope unit');
    expect(decay.measurements.find((m) => m.id === 'halfLife')!.label).toBe('Half-life');
    expect(unitOf(decay, { id: 'halfLife', unit: '' }, { isotope: 1 })).toBe('days');
    expect(boundsOf(decay, param(decay, 'elapsed'), { isotope: 3 }).unit).toBe('years');
  });
});

describe('Chair temperature box clamps (audit C-1)', () => {
  it('uses 600 K for 1000 and 200 K for -5, and marks both invalid', () => {
    const b = boundsOf(chair, param(chair, 'temperature'), {});
    expect(readBox('1000', b, 298)).toEqual({ value: 600, invalid: true, problem: 'range' });
    expect(readBox('-5', b, 298)).toEqual({ value: 200, invalid: true, problem: 'range' });
  });
});
