import { color } from '@lib/engines/color/registry';
import { extractLoadedPalette, loadImagePalette } from '@lib/engines/color/palette-lazy';
import type { AttachFn } from '../types';

/** ToyTools.color.parse/formats/check/wcag/suggest — color math namespace.
 *  extractPalette is attached only on a page that asks for it, so the quantizer stays out of
 *  the shared color chunk that every other color tool downloads. */
export const attach: AttachFn = async (TT) => {
  const ids = new Set<string>();
  for (const el of document.querySelectorAll('[data-palette]')) {
    const id = el.getAttribute('data-palette');
    if (id) ids.add(id);
  }
  await Promise.all([...ids].map((id) => loadImagePalette(id)));
  TT.color = ids.size > 0 ? { ...color, extractPalette: extractLoadedPalette } : color;
};
