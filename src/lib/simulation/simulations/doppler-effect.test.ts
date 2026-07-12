import { describe, it, expect } from 'vitest';
import dopplerEffect, {
  approachingFrequency,
  recedingFrequency,
  machNumber,
} from './doppler-effect';

describe('doppler-effect model', () => {
  it('approaching frequency is higher than the source frequency', () => {
    const p = { frequency: 440, sourceSpeed: 60, waveSpeed: 340 };
    expect(approachingFrequency(p)).toBeGreaterThan(440);
    expect(approachingFrequency(p)).toBeCloseTo((440 * 340) / (340 - 60), 6);
  });

  it('receding frequency is lower than the source frequency', () => {
    const p = { frequency: 440, sourceSpeed: 60, waveSpeed: 340 };
    expect(recedingFrequency(p)).toBeLessThan(440);
    expect(recedingFrequency(p)).toBeCloseTo((440 * 340) / (340 + 60), 6);
  });

  it('no shift when the source is at rest', () => {
    const p = { frequency: 440, sourceSpeed: 0, waveSpeed: 340 };
    expect(approachingFrequency(p)).toBeCloseTo(440, 6);
    expect(recedingFrequency(p)).toBeCloseTo(440, 6);
  });

  it('mach number is source speed over wave speed', () => {
    expect(machNumber({ frequency: 440, sourceSpeed: 170, waveSpeed: 340 })).toBeCloseTo(0.5, 6);
  });

  it('every preset is within its parameter range', () => {
    for (const preset of dopplerEffect.presets) {
      for (const param of dopplerEffect.params) {
        const v = preset.values[param.id];
        if (v === undefined) continue;
        expect(v).toBeGreaterThanOrEqual(param.min);
        expect(v).toBeLessThanOrEqual(param.max);
      }
    }
  });

  it('keeps the source speed safely below the wave speed in every preset', () => {
    for (const preset of dopplerEffect.presets) {
      const vs = preset.values.sourceSpeed ?? dopplerEffect.params.find((p) => p.id === 'sourceSpeed')!.default;
      const v = preset.values.waveSpeed ?? dopplerEffect.params.find((p) => p.id === 'waveSpeed')!.default;
      expect(vs).toBeLessThan(v);
    }
  });
});
