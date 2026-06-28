import type { TextProcessor } from '../types';

// Join hard-wrapped lines into one continuous paragraph: each run of line breaks (and the
// whitespace around it) collapses to a single space. Leading/trailing whitespace is trimmed.
// "line one\nline two" becomes "line one line two".
export const removeLineBreaks: TextProcessor = {
  id: 'removeLineBreaks',
  family: 'cleanup',
  process: (text) => text.replace(/[ \t]*(?:\r\n?|\n)+[ \t]*/g, ' ').trim(),
};
