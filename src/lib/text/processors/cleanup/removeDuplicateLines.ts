import type { TextProcessor } from '../types';

// Remove duplicate lines globally; the first occurrence wins, order preserved.
export const removeDuplicateLines: TextProcessor = {
  id: 'removeDuplicateLines',
  family: 'cleanup',
  process: (text) => {
    const seen = new Set<string>();
    return text
      .split('\n')
      .filter((line) => {
        if (seen.has(line)) return false;
        seen.add(line);
        return true;
      })
      .join('\n');
  },
};
