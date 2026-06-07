import type { TextProcessor } from '../types';

// Drop empty and whitespace-only lines.
export const removeBlankLines: TextProcessor = {
  id: 'removeBlankLines',
  family: 'cleanup',
  process: (text) =>
    text.split('\n').filter((line) => line.trim() !== '').join('\n'),
};
