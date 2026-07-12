import { describe, it, expect } from 'vitest';
import idealGasLaw, { pressureKpa } from './ideal-gas-law';
import { GAS_CONSTANT_R } from '../render/units';

describe('ideal-gas-law model', () => {
  it('pressure follows P = nRT / V (kPa with V in litres)', () => {
    const p = { amount: 1, temperature: 300, volume: 25 };
    expect(pressureKpa(p)).toBeCloseTo((1 * GAS_CONSTANT_R * 300) / 25, 6);
  });

  it('halving the volume doubles the pressure (Boyle)', () => {
    const a = { amount: 1, temperature: 300, volume: 20 };
    const b = { amount: 1, temperature: 300, volume: 10 };
    expect(pressureKpa(b)).toBeCloseTo(pressureKpa(a) * 2, 6);
  });

  it('doubling the temperature doubles the pressure (Gay-Lussac)', () => {
    const a = { amount: 1, temperature: 250, volume: 20 };
    const b = { amount: 1, temperature: 500, volume: 20 };
    expect(pressureKpa(b)).toBeCloseTo(pressureKpa(a) * 2, 6);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of idealGasLaw.presets) {
      for (const param of idealGasLaw.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });
});
