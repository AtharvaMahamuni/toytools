import { describe, it, expect } from 'vitest';
import ohmsLaw, { current, power } from './ohms-law';

describe('ohms-law model', () => {
  it('current follows I = V / R', () => {
    expect(current({ voltage: 9, resistance: 30 })).toBeCloseTo(0.3, 6);
    expect(current({ voltage: 12, resistance: 2 })).toBeCloseTo(6, 6);
  });

  it('power follows P = V * I = V^2 / R', () => {
    expect(power({ voltage: 12, resistance: 2 })).toBeCloseTo(72, 6);
    expect(power({ voltage: 3, resistance: 6 })).toBeCloseTo(1.5, 6);
  });

  it('halving resistance at fixed voltage doubles current and power', () => {
    const a = { voltage: 10, resistance: 20 };
    const b = { voltage: 10, resistance: 10 };
    expect(current(b)).toBeCloseTo(current(a) * 2, 6);
    expect(power(b)).toBeCloseTo(power(a) * 2, 6);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of ohmsLaw.presets) {
      for (const param of ohmsLaw.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
