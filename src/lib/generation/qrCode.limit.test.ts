// Too much text gets a clear message instead of "Generation failed" (followups #246 S6).
import { describe, it, expect } from 'vitest';
import { getGenerator } from './registry';
import { QR_MAX_BYTES } from './generators/qrCode';

const gen = () => getGenerator('qr-code')!;

describe('QR too much text', () => {
  it('fits the byte limit exactly and refuses one byte more, per level', () => {
    for (const level of ['L', 'M', 'Q', 'H'] as const) {
      const max = QR_MAX_BYTES[level];
      const ok = gen().generate({ contentType: 'text', text: 'a'.repeat(max), errorCorrection: level } as never);
      expect(ok.ok, level).toBe(true);
      const over = gen().generate({ contentType: 'text', text: 'a'.repeat(max + 1), errorCorrection: level } as never);
      expect(over.ok).toBe(false);
      expect(over.error).toContain('Too much text for one QR code');
      expect(over.error).toContain(`limit at ${level} error correction is ${max} bytes`);
    }
  });

  it('counts UTF-8 bytes, so emoji hit the limit sooner', () => {
    const r = gen().generate({ contentType: 'text', text: '😀'.repeat(600), errorCorrection: 'M' } as never);
    expect(r.ok).toBe(false);
    expect(r.error).toContain('2400 bytes');
    expect(r.error).toContain('Lower error correction fits more.');
  });
});
