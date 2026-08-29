import { describe, it, expect } from 'vitest';
import reactionKinetics, {
  GRAPH_HALF_LIVES,
  LN10,
  R_KJ,
  advanceConcentration,
  concentrationAtHalfLives,
  conversion,
  describeSeconds,
  halfLife,
  logHalfLife,
  logRateConstant,
  orderOf,
  rateConstant,
  tenKelvinFactor,
  timeScale,
} from './reaction-kinetics';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

function stateFor(overrides: Partial<Record<string, number>> = {}): SimState {
  const params = {
    order: 1,
    activationEnergy: 60,
    temperature: 298,
    logA: 11,
    initial: 1,
    timeLapse: 0,
    ...overrides,
  };
  return { t: 0, params, vars: reactionKinetics.init(params) };
}

describe('reaction-kinetics arrhenius', () => {
  it('matches the exponential form of the Arrhenius equation', () => {
    const s = stateFor();
    const expected = Math.pow(10, 11) * Math.exp(-60 / (R_KJ * 298));
    expect(rateConstant(s)).toBeCloseTo(expected, 6);
    expect(logRateConstant(s)).toBeCloseTo(Math.log10(expected), 9);
  });

  it('stays finite at both ends of the slider range', () => {
    const slowest = logRateConstant(stateFor({ logA: 4, activationEnergy: 200, temperature: 250 }));
    const fastest = logRateConstant(stateFor({ logA: 16, activationEnergy: 10, temperature: 600 }));
    expect(Number.isFinite(slowest)).toBe(true);
    expect(Number.isFinite(fastest)).toBe(true);
    expect(slowest).toBeLessThan(-30);
    expect(fastest).toBeGreaterThan(14);
  });

  it('uses the base-10 form consistently with ln 10', () => {
    const s = stateFor({ activationEnergy: 85, temperature: 350 });
    expect(logRateConstant(s)).toBeCloseTo(s.params.logA - 85 / (LN10 * R_KJ * 350), 9);
  });

  it('reports how much a ten degree rise is worth', () => {
    const s = stateFor();
    const direct = rateConstant(stateFor({ temperature: 308 })) / rateConstant(s);
    expect(tenKelvinFactor(s)).toBeCloseTo(direct, 6);
    // The classic rule of thumb: around 50 kJ/mol at room temperature, ten degrees roughly doubles.
    expect(tenKelvinFactor(stateFor({ activationEnergy: 50 }))).toBeGreaterThan(1.8);
    expect(tenKelvinFactor(stateFor({ activationEnergy: 50 }))).toBeLessThan(2.2);
  });

  it('makes activation energy dominate the pre-exponential factor', () => {
    const raised = rateConstant(stateFor({ activationEnergy: 80 })) / rateConstant(stateFor());
    const doubled = rateConstant(stateFor({ logA: 11 + Math.log10(2) })) / rateConstant(stateFor());
    expect(raised).toBeLessThan(1e-3);
    expect(doubled).toBeCloseTo(2, 6);
  });
});

describe('reaction-kinetics half-life', () => {
  it('uses the right formula for each order', () => {
    const first = stateFor({ order: 1 });
    expect(halfLife(first)).toBeCloseTo(Math.LN2 / rateConstant(first), 9);
    const zero = stateFor({ order: 0, initial: 0.8 });
    expect(halfLife(zero)).toBeCloseTo(0.8 / (2 * rateConstant(zero)), 9);
    const second = stateFor({ order: 2, initial: 0.8 });
    expect(halfLife(second)).toBeCloseTo(1 / (rateConstant(second) * 0.8), 9);
  });

  it('is independent of starting concentration only for first order', () => {
    expect(halfLife(stateFor({ order: 1, initial: 0.5 }))).toBeCloseTo(halfLife(stateFor({ order: 1, initial: 2 })), 9);
    expect(halfLife(stateFor({ order: 0, initial: 2 }))).toBeGreaterThan(halfLife(stateFor({ order: 0, initial: 0.5 })));
    expect(halfLife(stateFor({ order: 2, initial: 2 }))).toBeLessThan(halfLife(stateFor({ order: 2, initial: 0.5 })));
  });

  it('reports a finite log half-life across the whole parameter space', () => {
    for (const order of [0, 1, 2]) {
      for (const activationEnergy of [10, 200]) {
        for (const temperature of [250, 600]) {
          for (const logA of [4, 16]) {
            const value = logHalfLife(stateFor({ order, activationEnergy, temperature, logA }));
            expect(Number.isFinite(value), `${order}/${activationEnergy}/${temperature}/${logA}`).toBe(true);
          }
        }
      }
    }
  });
});

describe('reaction-kinetics integration', () => {
  it('halves the concentration in exactly one half-life, for every order', () => {
    for (const order of [0, 1, 2]) {
      const s = stateFor({ order });
      const k = rateConstant(s);
      const t = halfLife(s);
      expect(advanceConcentration(1, k, order, t), `order ${order}`).toBeCloseTo(0.5, 6);
    }
  });

  it('never lets the concentration go negative or non-finite', () => {
    for (const order of [0, 1, 2]) {
      const out = advanceConcentration(1, 1e15, order, 1e10);
      expect(Number.isFinite(out)).toBe(true);
      expect(out).toBeGreaterThanOrEqual(0);
    }
  });

  it('matches the closed-form half-life curve for every order', () => {
    for (const order of [0, 1, 2]) {
      expect(concentrationAtHalfLives(1, order, 0), `order ${order}`).toBeCloseTo(1, 9);
      expect(concentrationAtHalfLives(1, order, 1), `order ${order}`).toBeCloseTo(0.5, 9);
    }
    expect(concentrationAtHalfLives(1, 0, 2)).toBeCloseTo(0, 9);
    expect(concentrationAtHalfLives(1, 0, 4)).toBe(0);
    expect(concentrationAtHalfLives(1, 1, 3)).toBeCloseTo(0.125, 9);
    expect(concentrationAtHalfLives(1, 2, 3)).toBeCloseTo(0.25, 9);
  });

  it('drains the flask over a run and tracks conversion', () => {
    const s = stateFor();
    for (let i = 0; i < 600; i++) reactionKinetics.step(s, SUBSTEP);
    expect(s.vars.a).toBeLessThan(0.001);
    expect(conversion(s)).toBeGreaterThan(0.99);
    expect(s.vars.elapsed).toBeCloseTo(600 * SUBSTEP, 6);
  });

  it('runs the chemical clock faster under a time lapse', () => {
    const normal = stateFor();
    const lapsed = stateFor({ timeLapse: 3 });
    expect(timeScale(lapsed)).toBe(1000);
    reactionKinetics.step(normal, SUBSTEP);
    reactionKinetics.step(lapsed, SUBSTEP);
    expect(lapsed.vars.elapsed).toBeCloseTo(normal.vars.elapsed * 1000, 9);
  });
});

describe('reaction-kinetics readouts', () => {
  it('describes a duration across forty orders of magnitude', () => {
    expect(describeSeconds(2e-12)).toMatch(/picoseconds/);
    expect(describeSeconds(0.004)).toMatch(/milliseconds/);
    expect(describeSeconds(30)).toMatch(/seconds/);
    expect(describeSeconds(600)).toMatch(/minutes/);
    expect(describeSeconds(7200)).toMatch(/hours/);
    expect(describeSeconds(3e6)).toMatch(/days/);
    expect(describeSeconds(1e9)).toMatch(/years/);
    expect(describeSeconds(1e30)).toMatch(/e\+\d+ years/);
    expect(describeSeconds(0)).toBe('no time at all');
  });

  it('rounds the order slider to an integer', () => {
    expect(orderOf(stateFor({ order: 2 }))).toBe(2);
    expect(orderOf(stateFor({ order: 0 }))).toBe(0);
  });

  it('graphs five half-lives, where zero order has already finished', () => {
    expect(GRAPH_HALF_LIVES).toBe(5);
    expect(concentrationAtHalfLives(1, 0, GRAPH_HALF_LIVES)).toBe(0);
    expect(concentrationAtHalfLives(1, 1, GRAPH_HALF_LIVES)).toBeCloseTo(0.03125, 9);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of reactionKinetics.presets) {
      for (const param of reactionKinetics.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
