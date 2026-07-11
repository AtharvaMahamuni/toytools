import { describe, expect, it } from 'vitest';
import projectileMotionSim, {
  flightTau,
  flightTime,
  heightAtX,
  horizontalVelocity,
  LANDING_PAUSE_S,
  maxHeight,
  posX,
  posY,
  range,
} from './projectile-motion';
import type { SimState } from '../types';

const params = (over: Partial<Record<'speed' | 'angle' | 'gravity', number>> = {}) => ({
  speed: 25,
  angle: 45,
  gravity: 9.81,
  ...over,
});

const stateAt = (t: number, p = params()): SimState => ({ t, params: p, vars: {} });

describe('projectile-motion model', () => {
  it('computes range R = v²·sin(2θ)/g', () => {
    // 45° gives the maximum range v²/g for a given speed.
    expect(range(params())).toBeCloseTo((25 * 25) / 9.81);
    // Complementary angles (30° and 60°) share the same range.
    expect(range(params({ angle: 30 }))).toBeCloseTo(range(params({ angle: 60 })));
  });

  it('computes peak height H = (v·sinθ)²/(2g)', () => {
    const p = params();
    expect(maxHeight(p)).toBeCloseTo((25 * Math.sin(Math.PI / 4)) ** 2 / (2 * 9.81));
    // A steeper launch reaches higher.
    expect(maxHeight(params({ angle: 75 }))).toBeGreaterThan(maxHeight(params({ angle: 30 })));
  });

  it('computes time of flight T = 2·v·sinθ/g', () => {
    const p = params();
    expect(flightTime(p)).toBeCloseTo((2 * 25 * Math.sin(Math.PI / 4)) / 9.81);
  });

  it('lands exactly at the range after the full flight time', () => {
    const p = params({ angle: 37, speed: 30 });
    const T = flightTime(p);
    expect(posX(p, T)).toBeCloseTo(range(p));
    expect(posY(p, T)).toBeCloseTo(0);
  });

  it('keeps horizontal velocity constant and reaches the apex at mid-flight', () => {
    const p = params();
    expect(horizontalVelocity(p)).toBeCloseTo(25 * Math.cos(Math.PI / 4));
    // Peak height occurs at half the flight time, directly above the range midpoint.
    const T = flightTime(p);
    expect(posY(p, T / 2)).toBeCloseTo(maxHeight(p));
    expect(posX(p, T / 2)).toBeCloseTo(range(p) / 2);
  });

  it('never returns a below-ground height', () => {
    const p = params();
    // Past the flight time the closed form would go negative; posY clamps at the ground.
    expect(posY(p, flightTime(p) * 2)).toBe(0);
    expect(heightAtX(p, range(p) * 2)).toBe(0);
  });

  it('matches the y(x) trajectory to the parametric path at the apex', () => {
    const p = params({ angle: 50, speed: 20 });
    expect(heightAtX(p, range(p) / 2)).toBeCloseTo(maxHeight(p));
  });

  it('replays the flight then rests on the ground during the landing pause', () => {
    const p = params();
    const T = flightTime(p);
    // Mid-cycle time inside the flight returns that same in-flight tau.
    expect(flightTau(p, T / 2)).toBeCloseTo(T / 2);
    // During the pause after landing, tau is clamped to T (the projectile sits at the range).
    expect(flightTau(p, T + LANDING_PAUSE_S / 2)).toBeCloseTo(T);
    // The cycle repeats: one full cycle later matches the start of flight.
    expect(flightTau(p, T + LANDING_PAUSE_S)).toBeCloseTo(0);
  });

  it('step() advances only time — position is a pure function of t', () => {
    const s = stateAt(0);
    projectileMotionSim.step(s, 0.25);
    expect(s.t).toBeCloseTo(0.25);
    expect(s.vars).toEqual({});
  });

  it('lets you drag from the launcher to set angle and speed, clamped to range', () => {
    const s = stateAt(0);
    // A short, steep drag → high angle, low speed (both clamped into range).
    const steep = projectileMotionSim.pointer!.handle(s, { type: 'move', x: 0.1, y: 0.7, t: 0 });
    expect(steep!.angle).toBeGreaterThan(80);
    expect(steep!.speed).toBeGreaterThanOrEqual(5);
    // A long, shallow drag → low angle, high speed clamped to the max.
    const flat = projectileMotionSim.pointer!.handle(s, { type: 'move', x: 0.95, y: 0.88, t: 0 });
    expect(flat!.angle).toBeLessThan(20);
    expect(flat!.speed).toBeLessThanOrEqual(60);
    // Taps and releases are ignored.
    expect(projectileMotionSim.pointer!.handle(s, { type: 'tap', x: 0.5, y: 0.5, t: 0 })).toBeNull();
    expect(projectileMotionSim.pointer!.handle(s, { type: 'up', x: 0.5, y: 0.5, t: 0 })).toBeNull();
  });

  it('fires each observation and explanation branch for the right state', () => {
    // Always-on range observation.
    expect(projectileMotionSim.observations[0](stateAt(0))).toMatch(/downrange/);
    // 45° → max-range branch in both the observation and the explanation.
    expect(projectileMotionSim.observations[1](stateAt(0, params({ angle: 45 })))).toMatch(/maximum/i);
    expect(projectileMotionSim.explanation(stateAt(0, params({ angle: 45 })))).toMatch(/greatest possible range/i);
    // Steep launch branch.
    const steep = stateAt(0, params({ angle: 78 }));
    expect(projectileMotionSim.observations[2](steep)).toMatch(/steep/i);
    expect(projectileMotionSim.explanation(steep)).toMatch(/steep/i);
    // Shallow launch branch.
    const shallow = stateAt(0, params({ angle: 15 }));
    expect(projectileMotionSim.observations[3](shallow)).toMatch(/shallow/i);
    expect(projectileMotionSim.explanation(shallow)).toMatch(/shallow/i);
    // Low-gravity branch.
    expect(projectileMotionSim.observations[4](stateAt(0, params({ gravity: 1.62 })))).toMatch(/weak gravity/i);
    // A mid-angle default hits the generic explanation and silences the conditional observations.
    const mid = stateAt(0, params({ angle: 55 }));
    expect(projectileMotionSim.observations[1](mid)).toBeNull();
    expect(projectileMotionSim.observations[4](mid)).toBeNull();
    expect(projectileMotionSim.explanation(mid)).toMatch(/symmetric parabola/i);
  });

  it('exposes finite measurements and non-empty narrative for the default state', () => {
    const s = stateAt(0.8);
    for (const m of projectileMotionSim.measurements) {
      expect(Number.isFinite(m.compute(s)), m.id).toBe(true);
    }
    expect(projectileMotionSim.explanation(s).length).toBeGreaterThan(20);
    expect(projectileMotionSim.observations.some((rule) => rule(s) !== null)).toBe(true);
  });
});
