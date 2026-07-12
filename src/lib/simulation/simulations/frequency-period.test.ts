import { describe, expect, it } from 'vitest';
import frequencyPeriodSim, {
  angularFrequency,
  cyclesCompleted,
  OSC_AMPLITUDE,
  oscillation,
  period,
} from './frequency-period';
import type { SimState } from '../types';

const params = (frequency = 1) => ({ frequency });
const stateAt = (t: number, frequency = 1): SimState => ({ t, params: params(frequency), vars: {} });

describe('frequency-period model', () => {
  it('period and frequency are exact reciprocals', () => {
    expect(period(params(2))).toBeCloseTo(0.5);
    expect(period(params(0.25))).toBeCloseTo(4);
    expect(period(params(1.3)) * 1.3).toBeCloseTo(1);
  });

  it('computes ω = 2πf', () => {
    expect(angularFrequency(params(1))).toBeCloseTo(2 * Math.PI);
    expect(angularFrequency(params(3))).toBeCloseTo(6 * Math.PI);
  });

  it('oscillates with the display amplitude and the requested period', () => {
    const p = params(2);
    expect(oscillation(p, 0)).toBeCloseTo(0);
    // A quarter period in, the oscillator is at +A.
    expect(oscillation(p, period(p) / 4)).toBeCloseTo(OSC_AMPLITUDE);
    // One period later the value repeats.
    expect(oscillation(p, 0.21)).toBeCloseTo(oscillation(p, 0.21 + period(p)));
  });

  it('counts whole completed cycles', () => {
    expect(cyclesCompleted(params(1), 0)).toBe(0);
    expect(cyclesCompleted(params(1), 2.9)).toBe(2);
    expect(cyclesCompleted(params(2), 2.5)).toBe(5);
  });

  it('step() advances only time', () => {
    const s = stateAt(0);
    frequencyPeriodSim.step(s, 0.5);
    expect(s.t).toBeCloseTo(0.5);
    expect(s.vars).toEqual({});
  });

  it('derives frequency from tap tempo', () => {
    const s = stateAt(0);
    // First tap only primes the clock — no change yet.
    expect(frequencyPeriodSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 10 })).toBeNull();
    // Second tap 0.5 s later → ~2 Hz.
    const two = frequencyPeriodSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 10.5 });
    expect(two!.frequency).toBeCloseTo(2);
    // A long gap (>3 s) resets rather than reporting an absurdly low frequency.
    expect(frequencyPeriodSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 20 })).toBeNull();
  });

  it('clamps tapped frequency into the slider range', () => {
    const s = stateAt(0);
    frequencyPeriodSim.pointer!.handle(s, { type: 'down', x: 0.5, y: 0.5, t: 0 });
    const fast = frequencyPeriodSim.pointer!.handle(s, { type: 'down', x: 0.5, y: 0.5, t: 0.05 });
    expect(fast!.frequency).toBeLessThanOrEqual(3);
  });

  it('exposes finite measurements and non-empty narrative across the frequency range', () => {
    for (const f of [0.2, 1, 3]) {
      const s = stateAt(1.5, f);
      for (const m of frequencyPeriodSim.measurements) {
        expect(Number.isFinite(m.compute(s)), `${m.id} at ${f} Hz`).toBe(true);
      }
      expect(frequencyPeriodSim.explanation(s).length).toBeGreaterThan(20);
      expect(frequencyPeriodSim.observations.some((rule) => rule(s) !== null)).toBe(true);
    }
  });
});
