// Decodes the generated QR matrix with a real QR reader (jsQR, dev dependency) so the test proves what
// a phone camera would read, not just what we handed the encoder. Phase B PR 2: emoji and CJK used to
// decode as garbage because each UTF-16 code unit was cut to one byte.
import { describe, it, expect } from 'vitest';
import jsQR from 'jsqr';
import { getGenerator } from './registry';
import { utf8ByteString } from './generators/qrCode';

/** Rasterize a module grid to RGBA with a 4-module quiet zone, `scale` px per module. */
function rasterize(modules: boolean[][], scale = 4, quiet = 4) {
  const count = modules.length;
  const size = (count + quiet * 2) * scale;
  const data = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!modules[r][c]) continue;
      for (let y = 0; y < scale; y++) {
        for (let x = 0; x < scale; x++) {
          const px = ((r + quiet) * scale + y) * size + (c + quiet) * scale + x;
          data[px * 4] = 0;
          data[px * 4 + 1] = 0;
          data[px * 4 + 2] = 0;
        }
      }
    }
  }
  return { data, size };
}

function decode(opts: Record<string, unknown>) {
  const r = getGenerator('qr-code')!.generate(opts as never);
  expect(r.ok).toBe(true);
  const { data, size } = rasterize(r.qr!.modules);
  const read = jsQR(data, size, size);
  expect(read, 'jsQR found a code').not.toBeNull();
  return { read: read!, result: r };
}

describe('qr-code decodes exactly (real decoder)', () => {
  it.each([
    ['emoji', 'Héllo 😀'],
    ['CJK', '日本語 测试'],
    ['ASCII', 'hello world'],
    ['URL', 'https://toytoolsapp.com/tool/generate/qr-code-generator/?q=1'],
    ['Latin-1', 'café crème'],
    ['mixed', 'Привет, 世界 👍🏽 مرحبا'],
  ])('%s: %s', (_label, text) => {
    const { read, result } = decode({ contentType: 'text', text, errorCorrection: 'M' });
    expect(read.data).toBe(text);
    // The Byte segment is exactly the UTF-8 encoding of the text.
    expect(read.binaryData).toEqual(Array.from(new TextEncoder().encode(text)));
    // The text shown and copied is still the original string.
    expect(result.qr!.content).toBe(text);
  });

  it('decodes a Wi-Fi payload with a non-ASCII network name', () => {
    const { read } = decode({ contentType: 'wifi', ssid: 'Café 日本', wifiPassword: 'pässwörd', encryption: 'WPA' });
    expect(read.data).toBe('WIFI:T:WPA;S:Café 日本;P:pässwörd;;');
  });

  it('decodes at every error-correction level', () => {
    for (const level of ['L', 'M', 'Q', 'H']) {
      const { read } = decode({ contentType: 'text', text: '日本語 测试 😀', errorCorrection: level });
      expect(read.data).toBe('日本語 测试 😀');
    }
  });
});

describe('utf8ByteString', () => {
  it('maps text to one char per UTF-8 byte', () => {
    expect(utf8ByteString('abc')).toBe('abc');
    expect(utf8ByteString('é')).toBe('\xc3\xa9');
    expect(utf8ByteString('😀')).toBe('\xf0\x9f\x98\x80');
    for (const ch of utf8ByteString('日本語 测试 😀')) expect(ch.charCodeAt(0)).toBeLessThan(256);
  });
});
