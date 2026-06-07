import type { TextProcessor } from '../types';
import { splitWords, perLine } from './_words';

// all lowercase, words joined by underscores: "hello_world". Per line.
export const snakeCase: TextProcessor = {
  id: 'snakeCase',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      splitWords(line).map((w) => w.toLowerCase()).join('_')
    ),
};
