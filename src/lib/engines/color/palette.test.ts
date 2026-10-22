import { describe, expect, it } from 'vitest';
import { extractPalette } from './palette';

function image(
  width: number,
  height: number,
  paint: (x: number, y: number) => [number, number, number, number],
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = paint(x, y);
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }
  return data;
}

function solid(width: number, height: number, r: number, g: number, b: number, a = 255): Uint8ClampedArray {
  return image(width, height, () => [r, g, b, a]);
}

describe('extractPalette', () => {
  it('returns one stop for a flat color and stays quiet about gamut', () => {
    const result = extractPalette(solid(8, 8, 51, 102, 153), 8, 8);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.swatches).toHaveLength(1);
    expect(result.swatches[0]!.hex).toBe('#336699');
    expect(result.swatches[0]!.share).toBe(1);
    expect(result.clamped).toBe(false);
    expect(result.swatches[0]!.clamped).toBe(false);
  });

  it('keeps a logo red instead of averaging it into the background', () => {
    const data = image(2, 2, (x, y) => (x === 1 && y === 1 ? [225, 6, 0, 255] : [255, 255, 255, 255]));
    const result = extractPalette(data, 2, 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.swatches.length).toBeGreaterThan(1);
    const red = result.swatches.find((swatch) => swatch.hex === '#e10600');
    const white = result.swatches.find((swatch) => swatch.hex === '#ffffff');
    expect(red).toBeTruthy();
    expect(white).toBeTruthy();
    expect(result.swatches.some((swatch) => swatch.hex !== '#e10600' && swatch.hex !== '#ffffff')).toBe(false);
  });

  it('collapses a near-identical wall into one share and still returns the subject', () => {
    const grays: [number, number, number][] = [
      [244, 244, 244],
      [246, 246, 246],
      [242, 242, 242],
    ];
    const data = image(10, 10, (x, y) => {
      const i = y * 10 + x;
      if (i >= 90) return [225, 6, 0, 255];
      return [...grays[i % 3]!, 255];
    });
    const result = extractPalette(data, 10, 10);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const red = result.swatches.find((swatch) => swatch.hex === '#e10600');
    expect(red?.share).toBeCloseTo(0.1, 2);
    const wall = result.swatches.filter((swatch) => swatch.hex !== '#e10600');
    expect(wall).toHaveLength(1);
    expect(wall[0]!.share).toBeCloseTo(0.9, 2);
    expect(wall[0]!.hex).toBe('#f4f4f4');
  });

  it('still finds a thin red strip after nearest-neighbor sampling', () => {
    const data = image(400, 2, (x) => (x >= 390 ? [225, 6, 0, 255] : [255, 255, 255, 255]));
    const result = extractPalette(data, 400, 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const red = result.swatches.find((swatch) => swatch.hex === '#e10600');
    expect(red).toBeTruthy();
    expect(red!.share).toBeGreaterThan(0.01);
    expect(red!.share).toBeLessThan(0.1);
  });

  it('keeps a color that exists only in the last column', () => {
    const data = image(400, 2, (x) => (x === 399 ? [225, 6, 0, 255] : [255, 255, 255, 255]));
    const result = extractPalette(data, 400, 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.swatches.some((swatch) => swatch.hex === '#e10600')).toBe(true);
    expect(result.swatches).not.toEqual([{ hex: '#ffffff', share: 1, clamped: false }]);
  });

  it('keeps a color that exists only in the first column', () => {
    const data = image(400, 2, (x) => (x === 0 ? [225, 6, 0, 255] : [255, 255, 255, 255]));
    const result = extractPalette(data, 400, 2);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.swatches.some((swatch) => swatch.hex === '#e10600')).toBe(true);
  });

  it('marks a display-p3 red as clamped and leaves an in-gamut gray quiet', () => {
    const wide = extractPalette(solid(2, 2, 255, 0, 0), 2, 2, { space: 'display-p3' });
    expect(wide.ok).toBe(true);
    if (!wide.ok) return;
    expect(wide.clamped).toBe(true);
    expect(wide.swatches[0]!.clamped).toBe(true);
    // Display-P3 red clamps onto sRGB red. The hex is that clamped value, so the page has to say so.
    expect(wide.swatches[0]!.hex).toBe('#ff0000');

    const gray = extractPalette(solid(2, 2, 128, 128, 128), 2, 2, { space: 'display-p3' });
    expect(gray.ok).toBe(true);
    if (!gray.ok) return;
    expect(gray.clamped).toBe(false);
  });

  it('does not flag an in-gamut sRGB color that round-trips through 8-bit display-p3', () => {
    // Chrome stores sRGB #0000ff in a display-p3 canvas as (0, 0, 245). Linear blue
    // comes back about 1.003, which is quantization, and the hex is still #0000ff.
    const cases: Array<{ bytes: [number, number, number]; hex: string }> = [
      { bytes: [0, 0, 245], hex: '#0000ff' },
      { bytes: [234, 51, 247], hex: '#ff00ff' },
      { bytes: [55, 126, 247], hex: '#0080ff' },
    ];
    for (const { bytes, hex } of cases) {
      const result = extractPalette(solid(2, 2, bytes[0], bytes[1], bytes[2]), 2, 2, { space: 'display-p3' });
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.clamped, hex).toBe(false);
      expect(result.swatches[0]!.clamped, hex).toBe(false);
      expect(result.swatches[0]!.hex, hex).toBe(hex);
    }
  });

  it('ignores transparent pixels and refuses an empty read', () => {
    const clear = extractPalette(solid(4, 4, 255, 0, 0, 0), 4, 4);
    expect(clear).toEqual({ ok: false, error: 'This image has no visible pixels.' });
    expect(extractPalette(new Uint8ClampedArray(0), 0, 0)).toEqual({
      ok: false,
      error: 'This image could not be read.',
    });
  });
});
