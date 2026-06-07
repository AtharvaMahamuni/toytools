import type { TextProcessor } from '../types';

// Collapse all whitespace (spaces, tabs, newlines) to single spaces and trim the result.
export const normalizeWhitespace: TextProcessor = {
  id: 'normalizeWhitespace',
  family: 'cleanup',
  process: (text) => text.replace(/\s+/g, ' ').trim(),
};
