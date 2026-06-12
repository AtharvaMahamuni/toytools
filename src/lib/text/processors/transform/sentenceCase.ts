import type { TextProcessor } from '../types';

// Capitalize the first letter of each sentence (start of text, or after . ! ?).
// Unicode-aware (\p{L}, not ASCII \w) so accented sentence starts capitalize too.
export const sentenceCase: TextProcessor = {
  id: 'sentenceCase',
  family: 'transform',
  process: (text) =>
    text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (m) => m.toUpperCase()),
};
