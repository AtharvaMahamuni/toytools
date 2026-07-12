import { describe, it, expect } from 'vitest';
import shmSpring, { period, angularFrequency, displacement, maxSpeed, totalEnergy } from './shm-spring';

describe('shm-spring model', () => {
  it('angular frequency is sqrt(k/m)', () => {
    expect(angularFrequency({ mass: 1, springConstant: 4 })).toBeCloseTo(2, 6);
  });

  it('period is 2 pi sqrt(m/k)', () => {
    expect(period({ mass: 1, springConstant: 4 })).toBeCloseTo(Math.PI, 6);
  });

  it('starts released from rest at +A', () => {
    const p = { mass: 1, springConstant: 20, amplitude: 0.8 };
    expect(displacement(p, 0)).toBeCloseTo(0.8, 6);
  });

  it('returns to +A after one full period', () => {
    const p = { mass: 2, springConstant: 8, amplitude: 0.5 };
    expect(displacement(p, period(p))).toBeCloseTo(0.5, 6);
  });

  it('max speed is A*omega and total energy is 1/2 k A^2', () => {
    const p = { mass: 1, springConstant: 20, amplitude: 0.8 };
    expect(maxSpeed(p)).toBeCloseTo(0.8 * Math.sqrt(20), 6);
    expect(totalEnergy(p)).toBeCloseTo(0.5 * 20 * 0.8 * 0.8, 6);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of shmSpring.presets) {
      for (const param of shmSpring.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
