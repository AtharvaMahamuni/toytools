import type { TextProcessor } from '../types';

// Reverse the whole text character by character (Unicode-aware via the spread operator, so
// multi-code-unit characters like emoji are not split). "abc\n123" becomes "321\ncba".
export const reverseText: TextProcessor = {
  id: 'reverseText',
  family: 'transform',
  process: (text) => [...text].reverse().join(''),
};
