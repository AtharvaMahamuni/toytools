import { describe, expect, it } from 'vitest';
import pendulumSim, {
  bobSpeed,
  initPendulum,
  kineticEnergy,
  potentialEnergy,
  smallAnglePeriod,
  stepPendulum,
  totalEnergy,
} from './pendulum';
import { SUBSTEP } from '../loop';
import type { SimState } from '../types';

const params = (over: Partial<Record<'length' | 'angle' | 'gravity', number>> = {}) => ({
  length: 1,
  angle: 20,
  gravity: 9.81,
  ...over,
});

function makeState(over: Partial<Record<'length' | 'angle' | 'gravity', number>> = {}): SimState {
  const p = params(over);
  return { t: 0, params: p, vars: initPendulum(p) };
}

/** Advance by whole seconds at the production substep. */
function run(s: SimState, seconds: number): void {
  const steps = Math.round(seconds / SUBSTEP);
  for (let i = 0; i < steps; i++) stepPendulum(s, SUBSTEP);
}

/** Measure the actual period as the mean interval between downward zero crossings of θ.
 *  Interpolates each crossing time so a coarse substep doesn't bias the estimate. */
function measuredPeriod(s: SimState, cycles = 4): number {
  const crossings: number[] = [];
  let prevTheta = s.vars.theta;
  let prevT = s.t;
  while (crossings.length <= cycles && s.t < 120) {
    stepPendulum(s, SUBSTEP);
    if (prevTheta > 0 && s.vars.theta <= 0) {
      // Linear interpolation to the θ = 0 instant between prevT and s.t.
      const frac = prevTheta / (prevTheta - s.vars.theta);
      crossings.push(prevT + frac * (s.t - prevT));
    }
    prevTheta = s.vars.theta;
    prevT = s.t;
  }
  const intervals = crossings.length - 1;
  return (crossings[crossings.length - 1] - crossings[0]) / intervals;
}

describe('pendulum model', () => {
  it('starts at the release angle with zero angular velocity', () => {
    const s = makeState({ angle: 30 });
    expect(s.vars.theta).toBeCloseTo(Math.PI / 6);
    expect(s.vars.omega).toBe(0);
    expect(kineticEnergy(s)).toBe(0);
    expect(potentialEnergy(s)).toBeGreaterThan(0);
  });

  it('stays exactly at rest when released from equilibrium', () => {
    const s = makeState({ angle: 0 });
    run(s, 2);
    expect(s.vars.theta).toBeCloseTo(0, 12);
    expect(s.vars.omega).toBeCloseTo(0, 12);
  });

  it('conserves total energy to within 0.1% over 10 simulated seconds', () => {
    const s = makeState({ angle: 45 });
    const e0 = totalEnergy(s);
    run(s, 10);
    expect(Math.abs(totalEnergy(s) - e0) / e0).toBeLessThan(0.001);
  });

  it('matches the small-angle period within 1% at a 5° release', () => {
    const s = makeState({ angle: 5 });
    const T = measuredPeriod(s);
    expect(Math.abs(T - smallAnglePeriod(s.params)) / smallAnglePeriod(s.params)).toBeLessThan(0.01);
  });

  it('swings measurably slower than the small-angle formula at 60°', () => {
    const s = makeState({ angle: 60 });
    const T = measuredPeriod(s);
    // The exact 60° correction factor is ~1.073; assert we see genuine nonlinearity.
    expect(T).toBeGreaterThan(smallAnglePeriod(s.params) * 1.05);
  });

  it('period scales with √(L/g): quadruple length doubles it, Moon gravity stretches it', () => {
    expect(smallAnglePeriod(params({ length: 2 })) / smallAnglePeriod(params({ length: 0.5 }))).toBeCloseTo(2);
    expect(smallAnglePeriod(params({ gravity: 1.62 }))).toBeGreaterThan(smallAnglePeriod(params()));
  });

  it('trades potential for kinetic energy through the bottom of the swing', () => {
    const s = makeState({ angle: 40 });
    const pe0 = potentialEnergy(s);
    // Run to roughly a quarter period — near the bottom of the arc.
    run(s, smallAnglePeriod(s.params) / 4);
    expect(kineticEnergy(s)).toBeGreaterThan(pe0 * 0.8);
    expect(bobSpeed(s)).toBeGreaterThan(0);
  });

  it('lets you grab and drag the bob to a signed release angle, then release from rest', () => {
    const s = makeState({ angle: 20 });
    // Drag to the right of the pivot → positive angle, bob held (physics suspended).
    const right = pendulumSim.pointer!.handle(s, { type: 'move', x: 0.62, y: 0.6, t: 0 });
    expect(right!.angle).toBeGreaterThan(5);
    expect(s.vars.theta).toBeGreaterThan(0);
    expect(pendulumSim.pointer!.isHolding!(s)).toBe(true);
    // Drag left of the pivot → negative theta (mirror side), still a positive angle magnitude.
    pendulumSim.pointer!.handle(s, { type: 'move', x: 0.2, y: 0.6, t: 0 });
    expect(s.vars.theta).toBeLessThan(0);
    // Release: hold clears, angular velocity zeroed.
    pendulumSim.pointer!.handle(s, { type: 'up', x: 0.2, y: 0.6, t: 0 });
    expect(pendulumSim.pointer!.isHolding!(s)).toBe(false);
    expect(s.vars.omega).toBe(0);
  });

  it('fires each observation and explanation branch for the right state', () => {
    // Low gravity → the "weak restoring pull" observation and explanation branch.
    const moon = makeState({ gravity: 1.62 });
    expect(pendulumSim.observations.map((r) => r(moon)).join(' ')).toMatch(/low gravity/i);
    expect(pendulumSim.explanation(moon)).toMatch(/weak/i);
    // High gravity → the strong-gravity explanation branch.
    const jupiter = makeState({ gravity: 24.79 });
    expect(pendulumSim.explanation(jupiter)).toMatch(/strong/i);
    // Large angle + long pendulum → the large-angle and long-length observations.
    const wideLong = makeState({ angle: 60, length: 2.5 });
    const wideText = pendulumSim.observations.map((r) => r(wideLong)).join(' ');
    expect(wideText).toMatch(/large angles/i);
    expect(wideText).toMatch(/longer pendulum/i);
    // Energy-state observation: at rest (released), energy is all potential.
    expect(pendulumSim.observations[0](makeState({ angle: 40 }))).toMatch(/potential/i);
    // Moderate earth gravity → the neutral explanation branch.
    expect(pendulumSim.explanation(makeState({ angle: 15 }))).toMatch(/trades height/i);
  });

  it('reports mostly-kinetic energy near the bottom of the swing', () => {
    const s = makeState({ angle: 40 });
    run(s, smallAnglePeriod(s.params) / 4); // near the bottom
    expect(pendulumSim.observations[0](s)).toMatch(/kinetic|shifting/i);
  });

  it('exposes finite measurements and non-empty narrative across presets', () => {
    for (const preset of pendulumSim.presets) {
      const p = params(preset.values as Partial<Record<'length' | 'angle' | 'gravity', number>>);
      const s: SimState = { t: 0, params: p, vars: pendulumSim.init(p) };
      run(s, 1);
      for (const m of pendulumSim.measurements) {
        expect(Number.isFinite(m.compute(s)), `${m.id} for ${preset.id}`).toBe(true);
      }
      expect(pendulumSim.explanation(s).length).toBeGreaterThan(20);
      expect(pendulumSim.observations.some((rule) => rule(s) !== null)).toBe(true);
    }
  });
});
