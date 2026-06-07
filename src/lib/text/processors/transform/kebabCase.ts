import type { TextProcessor } from '../types';
import { splitWords, perLine } from './_words';

// all lowercase, words joined by hyphens: "hello-world". Per line.
export const kebabCase: TextProcessor = {
  id: 'kebabCase',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      splitWords(line).map((w) => w.toLowerCase()).join('-')
    ),
};
