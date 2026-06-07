import type { TextProcessor } from '../types';

// Capitalize the first letter of every word. Mirrors the proven regex from the
// original case-converter widget.
export const titleCase: TextProcessor = {
  id: 'titleCase',
  family: 'transform',
  process: (text) => text.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase()),
};
