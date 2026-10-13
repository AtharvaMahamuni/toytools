import type { TextProcessor } from '../types';
import { graphemes } from '../../graphemes';

// Reverse the whole text by user-perceived character (grapheme cluster), so emoji, flags and a
// letter written with a combining accent ("e" + U+0301) stay whole. "abc\n123" becomes "321\ncba".
export const reverseText: TextProcessor = {
  id: 'reverseText',
  family: 'transform',
  process: (text) => graphemes(text).reverse().join(''),
};
