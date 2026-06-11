import type { TextProcessor } from '../types';

// Collapse runs of spaces/tabs within each line to a single space. Line breaks preserved.
// Intentional: a single leading/trailing space per line is kept (collapse, don't trim) —
// trimming line edges is trim-text's job.
export const removeExtraSpaces: TextProcessor = {
  id: 'removeExtraSpaces',
  family: 'cleanup',
  process: (text) => text.replace(/[ \t]+/g, ' '),
};
