import type { TextProcessor } from '../types';

// Trim leading/trailing whitespace from each line.
export const trimLines: TextProcessor = {
  id: 'trimLines',
  family: 'cleanup',
  process: (text) => text.split('\n').map((line) => line.trim()).join('\n'),
};
