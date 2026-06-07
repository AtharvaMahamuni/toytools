import type { TextProcessor } from '../types';

export const lowercase: TextProcessor = {
  id: 'lowercase',
  family: 'transform',
  process: (text) => text.toLowerCase(),
};
