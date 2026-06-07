import type { TextProcessor } from '../types';
import { splitWords, perLine } from './_words';

// first word lowercase, subsequent words capitalized, no separators: "helloWorld".
// Applied per line so multi-line input keeps its structure.
export const camelCase: TextProcessor = {
  id: 'camelCase',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      splitWords(line)
        .map((word, i) => {
          const lower = word.toLowerCase();
          return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('')
    ),
};
