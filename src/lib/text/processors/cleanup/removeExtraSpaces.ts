import type { TextProcessor } from '../types';

// Collapse runs of spaces/tabs within each line to a single space. Line breaks preserved.
export const removeExtraSpaces: TextProcessor = {
  id: 'removeExtraSpaces',
  family: 'cleanup',
  process: (text) => text.replace(/[ \t]+/g, ' '),
};
