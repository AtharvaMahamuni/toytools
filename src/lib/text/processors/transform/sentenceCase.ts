import type { TextProcessor } from '../types';

// Capitalize the first letter of each sentence (start of text, or after . ! ?).
// Mirrors the proven regex from the original case-converter widget.
export const sentenceCase: TextProcessor = {
  id: 'sentenceCase',
  family: 'transform',
  process: (text) =>
    text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase()),
};
