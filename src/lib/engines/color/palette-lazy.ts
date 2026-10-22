// Browser-only loader for the image palette. The color engine chunk imports this file, not
// palette.ts. The literal import() is what keeps the quantizer off every other color page.
// scripts/check-budget.ts follows the key only when the page has data-palette="image-palette".

import type { PaletteOptions, PaletteResult } from './palette';

const LOADERS = {
  'image-palette': () => import('./palette'),
};

type ExtractFn = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: PaletteOptions,
) => PaletteResult;

let extract: ExtractFn | null = null;

export async function loadImagePalette(id: string): Promise<void> {
  if (id !== 'image-palette' || extract) return;
  try {
    const mod = await LOADERS['image-palette']();
    extract = mod.extractPalette;
  } catch {
    extract = null;
  }
}

export function extractLoadedPalette(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: PaletteOptions,
): PaletteResult {
  if (!extract) return { ok: false, error: 'The palette could not be read in this browser.' };
  return extract(data, width, height, options);
}
