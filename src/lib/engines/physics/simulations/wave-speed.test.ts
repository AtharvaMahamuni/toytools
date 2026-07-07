import { describe, expect, it } from 'vitest';
import waveSpeedSim, {
  crestX,
  displacement,
  energyIndex,
  period,
  WAVE_DOMAIN_M,
  waveSpeed,
} from './wave-speed';
import type { SimState } from '../types';

const params = (over: Partial<Record<'frequency' | 'wavelength' | 'amplitude', number>> = {}) => ({
  frequency: 1,
  wavelength: 2,
  amplitude: 0.5,
  ...over,
});

const stateAt = (t: number, p = params()): SimState => ({ t, params: p, vars: {} });

describe('wave-speed model', () => {
  it('computes v = f × λ', () => {
    expect(waveSpeed(params())).toBeCloseTo(2);
    expect(waveSpeed(params({ frequency: 3, wavelength: 0.8 }))).toBeCloseTo(2.4);
  });

  it('computes T = 1 / f', () => {
    expect(period(params())).toBeCloseTo(1);
    expect(period(params({ frequency: 0.25 }))).toBeCloseTo(4);
  });

  it('evaluates the travelling-wave displacement y(x,t) = A·sin(2π(x/λ − f·t))', () => {
    const p = params();
    expect(displacement(p, 0, 0)).toBeCloseTo(0);
    // Quarter wavelength at t=0 is a crest.
    expect(displacement(p, p.wavelength / 4, 0)).toBeCloseTo(p.amplitude);
    // One full period later the pattern repeats exactly.
    expect(displacement(p, 1.3, 0)).toBeCloseTo(displacement(p, 1.3, period(p)));
  });

  it('is periodic in space with wavelength λ', () => {
    const p = params({ wavelength: 1.5 });
    expect(displacement(p, 0.4, 0.3)).toBeCloseTo(displacement(p, 0.4 + p.wavelength, 0.3));
  });

  it('advances the tracked crest at exactly v', () => {
    const p = params();
    const dt = 0.5;
    const moved = crestX(p, dt) - crestX(p, 0);
    expect(moved).toBeCloseTo(waveSpeed(p) * dt);
    // The crest is genuinely on a crest: displacement there equals +A.
    expect(displacement(p, crestX(p, 0.77), 0.77)).toBeCloseTo(p.amplitude);
  });

  it('wraps the crest marker into the visible domain', () => {
    const x = crestX(params({ frequency: 3, wavelength: 4 }), 1000);
    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(WAVE_DOMAIN_M);
  });

  it('scales the energy index with f² and A², normalized to 1 at defaults', () => {
    expect(energyIndex(params())).toBeCloseTo(1);
    expect(energyIndex(params({ frequency: 2 }))).toBeCloseTo(4);
    expect(energyIndex(params({ amplitude: 1 }))).toBeCloseTo(4);
  });

  it('step() advances only time — the wave is a pure function of t', () => {
    const s = stateAt(0);
    waveSpeedSim.step(s, 0.25);
    expect(s.t).toBeCloseTo(0.25);
    expect(s.vars).toEqual({});
  });

  it('lets you drag the wave to set amplitude, clamped to range', () => {
    const s = stateAt(0);
    const flat = waveSpeedSim.pointer!.handle(s, { type: 'move', x: 0.5, y: 0.5, t: 0 });
    expect(flat!.amplitude).toBeCloseTo(0.1); // at the mid-line → minimum amplitude
    const tall = waveSpeedSim.pointer!.handle(s, { type: 'move', x: 0.5, y: 0, t: 0 });
    expect(tall!.amplitude).toBe(1); // dragged to the top → clamped to max
    expect(waveSpeedSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0, t: 0 })).toBeNull();
  });

  it('fires each observation and explanation branch for the right state', () => {
    // Default: moderate wave → base explanation, the always-on speed observation.
    expect(waveSpeedSim.observations[0](stateAt(0))).toMatch(/pass any fixed point/);
    // High frequency, short wavelength → the "oscillates rapidly" explanation branch.
    const fast = stateAt(0, params({ frequency: 2.5, wavelength: 0.8 }));
    expect(waveSpeedSim.observations[1](fast)).toMatch(/high frequency/i);
    expect(waveSpeedSim.explanation(fast)).toMatch(/rapidly/i);
    // Long wavelength + high amplitude, large v → those observations and the v ≥ 6 branch.
    const big = stateAt(0, params({ frequency: 2, wavelength: 4, amplitude: 0.9 }));
    expect(waveSpeedSim.observations[2](big)).toMatch(/long wavelength/i);
    expect(waveSpeedSim.observations[3](big)).toMatch(/amplitude/i);
    expect(waveSpeedSim.explanation(big)).toMatch(/sweeps by/i);
    // Silent branches return null when their condition is not met.
    const slow = stateAt(0, params({ frequency: 1, wavelength: 2, amplitude: 0.3 }));
    expect(waveSpeedSim.observations[1](slow)).toBeNull();
    expect(waveSpeedSim.observations[2](slow)).toBeNull();
    expect(waveSpeedSim.observations[3](slow)).toBeNull();
    expect(waveSpeedSim.explanation(slow)).toMatch(/one wavelength/i);
  });

  it('exposes finite measurements and non-empty narrative for the default state', () => {
    const s = stateAt(1.2);
    for (const m of waveSpeedSim.measurements) {
      expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    }
    expect(waveSpeedSim.explanation(s).length).toBeGreaterThan(20);
    expect(waveSpeedSim.observations.some((rule) => rule(s) !== null)).toBe(true);
  });
});
