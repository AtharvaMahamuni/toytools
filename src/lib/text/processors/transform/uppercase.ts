import type { TextProcessor } from '../types';

export const uppercase: TextProcessor = {
  id: 'uppercase',
  family: 'transform',
  process: (text) => text.toUpperCase(),
};
