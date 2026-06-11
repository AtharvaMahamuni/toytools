import type { TextProcessor } from '../types';

// Capitalize the first Unicode letter of each whitespace-delimited token, plus
// letters after hyphens (compound words: "well-known" → "Well-Known"). Token-based
// rather than \b\w so apostrophes don't break words ("don't" → "Don't", not "Don'T")
// and accented letters capitalize correctly ("élan" → "Élan").
export const titleCase: TextProcessor = {
  id: 'titleCase',
  family: 'transform',
  process: (text) =>
    text.toLowerCase().replace(/\S+/g, (word) =>
      word
        .replace(/\p{L}/u, (c) => c.toUpperCase())
        .replace(/-(\p{L})/gu, (_, c: string) => `-${c.toUpperCase()}`),
    ),
};
