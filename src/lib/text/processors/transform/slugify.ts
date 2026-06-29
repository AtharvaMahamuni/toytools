import type { TextProcessor } from '../types';
import { perLine } from './_words';

// Combining diacritical marks (U+0300..U+036F). Built from an escaped string so no literal
// combining characters live in the source; NFKD decomposition moves accents into this range.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g');

// Turn each line into a URL slug: strip accents, lowercase, replace any run of non-alphanumeric
// characters with a single hyphen, and trim leading/trailing hyphens. "Cafe Menu!" -> "cafe-menu".
// Processed per line so a list of titles becomes a list of slugs.
export const slugify: TextProcessor = {
  id: 'slugify',
  family: 'transform',
  process: (text) =>
    perLine(text, (line) =>
      line
        .normalize('NFKD')
        .replace(COMBINING_MARKS, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    ),
};
