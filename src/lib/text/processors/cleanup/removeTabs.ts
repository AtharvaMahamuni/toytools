import type { TextProcessor } from '../types';

// Replace tab characters with a single space (avoids merging adjacent tokens).
export const removeTabs: TextProcessor = {
  id: 'removeTabs',
  family: 'cleanup',
  process: (text) => text.replace(/\t/g, ' '),
};
