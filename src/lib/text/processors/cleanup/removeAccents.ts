import type { TextProcessor } from '../types';

// Combining diacritical marks (U+0300..U+036F). Built from an escaped string so no literal
// combining characters live in the source.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

// Strip accents/diacritics while preserving case, spacing, and everything else: decompose to base
// letter + combining mark (NFD), then drop the marks. "Crème Brûlée" becomes "Creme Brulee".
export const removeAccents: TextProcessor = {
  id: 'removeAccents',
  family: 'cleanup',
  process: (text) => text.normalize('NFD').replace(COMBINING_MARKS, ''),
};
