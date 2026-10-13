import type { TextProcessor } from '../types';
import { perLine } from './_words';

// Combining diacritical marks (U+0300..U+036F). Built from an escaped string so no literal
// combining characters live in the source; NFKD decomposition moves accents into this range.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

// Latin letters that NFKD does not decompose into base + accent, so the accent strip alone would
// delete them and split the word ("Straße" -> "stra-e"). Mapped to their usual ASCII spelling.
const TRANSLITERATE: Record<string, string> = {
  'ß': 'ss', 'ẞ': 'ss', 'Ø': 'o', 'ø': 'o', 'Ł': 'l', 'ł': 'l', 'Æ': 'ae', 'æ': 'ae',
  'Œ': 'oe', 'œ': 'oe', 'Đ': 'd', 'đ': 'd', 'Ð': 'd', 'ð': 'd', 'Þ': 'th', 'þ': 'th',
  'ı': 'i', 'Ħ': 'h', 'ħ': 'h', 'Ŧ': 't', 'ŧ': 't', 'ĸ': 'k', 'Ŋ': 'ng', 'ŋ': 'ng',
};
const TRANSLITERATE_RE = new RegExp(`[${Object.keys(TRANSLITERATE).join('')}]`, 'g');

// Turn each line into a URL slug: strip accents, lowercase, replace any run of non-alphanumeric
// characters with a single hyphen, and trim leading/trailing hyphens. "Cafe Menu!" -> "cafe-menu".
// Processed per line so a list of titles becomes a list of slugs.
export const slugify: TextProcessor = {
  id: 'slugify',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      line
        .replace(TRANSLITERATE_RE, (ch) => TRANSLITERATE[ch] ?? ch)
        .normalize('NFKD')
        .replace(COMBINING_MARKS, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    ),
};
