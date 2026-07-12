import { describe, it, expect } from 'vitest';
import momentumCollision, { collision, positions, totalMomentum, totalKineticEnergy } from './momentum-collision';
import type { SimState } from '../types';

function stateAfter(params: Record<string, number>, t: number): SimState {
  const vars = momentumCollision.init(params);
  return { t, params, vars };
}

describe('momentum-collision model', () => {
  it('equal masses, elastic: cart 1 stops and cart 2 takes its velocity', () => {
    const { v1, v2 } = collision({ mass1: 2, mass2: 2, speed1: 4, restitution: 1 });
    expect(v1).toBeCloseTo(0, 6);
    expect(v2).toBeCloseTo(4, 6);
  });

  it('perfectly inelastic: both carts share one final velocity', () => {
    const { v1, v2 } = collision({ mass1: 2, mass2: 2, speed1: 4, restitution: 0 });
    expect(v1).toBeCloseTo(2, 6);
    expect(v2).toBeCloseTo(2, 6);
  });

  it('conserves momentum before and after the collision', () => {
    const params = { mass1: 3, mass2: 1, speed1: 5, restitution: 0.6 };
    const before = totalMomentum(stateAfter(params, 0.01));
    const after = totalMomentum(stateAfter(params, collision(params).tc + 1));
    expect(after).toBeCloseTo(before, 6);
    expect(before).toBeCloseTo(3 * 5, 6);
  });

  it('elastic collision conserves kinetic energy; inelastic loses it', () => {
    const elastic = { mass1: 3, mass2: 1, speed1: 5, restitution: 1 };
    const ke0 = totalKineticEnergy(stateAfter(elastic, 0.01));
    const ke1 = totalKineticEnergy(stateAfter(elastic, collision(elastic).tc + 1));
    expect(ke1).toBeCloseTo(ke0, 4);

    const inelastic = { mass1: 3, mass2: 1, speed1: 5, restitution: 0 };
    const ki0 = totalKineticEnergy(stateAfter(inelastic, 0.01));
    const ki1 = totalKineticEnergy(stateAfter(inelastic, collision(inelastic).tc + 1));
    expect(ki1).toBeLessThan(ki0);
  });

  it('cart 1 advances toward cart 2 before the collision', () => {
    const params = { mass1: 2, mass2: 1, speed1: 4, restitution: 1 };
    const early = positions(stateAfter(params, 0.05));
    expect(early.x1).toBeGreaterThan(1.6);
    expect(early.v2).toBe(0);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of momentumCollision.presets) {
      for (const param of momentumCollision.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
