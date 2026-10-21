import { describe, expect, it } from 'vitest';
import { extractLoadedPalette, loadImagePalette } from './palette-lazy';

describe('loadImagePalette', () => {
  it('refuses a read until the image-palette chunk is loaded', async () => {
    const pixels = new Uint8ClampedArray([51, 102, 153, 255]);
    expect(extractLoadedPalette(pixels, 1, 1)).toEqual({
      ok: false,
      error: 'The palette could not be read in this browser.',
    });

    await loadImagePalette('other');
    expect(extractLoadedPalette(pixels, 1, 1).ok).toBe(false);

    await loadImagePalette('image-palette');
    const result = extractLoadedPalette(pixels, 1, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.swatches[0]?.hex).toBe('#336699');

    await loadImagePalette('image-palette');
    expect(extractLoadedPalette(pixels, 1, 1).ok).toBe(true);
  });
});
