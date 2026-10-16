import { describe, expect, it } from 'vitest';
import { buildClientIndex } from './index';
import { normalizeQuery, rankEntries } from './rank';

// PR #254 review: pruning terms that sit inside a longer term of the same tool took away the
// exact-phrase tier and changed the top result for these queries. Each is pinned to its top
// result on main so a payload trim cannot move them again.
const PINS: [query: string, slug: string][] = [
  ['developer', 'jwt-decoder'],
  ['html entity', 'character-map'],
  ['color converter', 'color-format-converter'],
  ['checksum', 'file-hash-verifier'],
  ['schedule', 'cron-expression-parser'],
  ['compare', 'csv-diff'],
  ['days calculator', 'date-difference-calculator'],
  ['ramp', 'inclined-plane-calculator'],
  ['fat free mass', 'lean-body-mass-calculator'],
  ['text', 'word-counter'],
  ['habit', 'move-today-tracker'],
  ['random', 'uuid-generator'],
  ['calculate', 'percentage-calculator'],
  ['coin flip', 'probability-calculator'],
  ['url', 'qr-code-generator'],
  ['alphabet', 'random-string-generator'],
  ['capitalize first letter', 'sentence-case-converter'],
  ['url slug', 'slugify-text'],
  ['calorie calculator', 'tdee-calculator'],
  ['diff tool', 'text-compare'],
  ['identifier', 'uuid-generator'],
  ['words', 'word-counter'],
];

describe('top result pins', () => {
  const entries = buildClientIndex().t;
  for (const [query, slug] of PINS) {
    it(`"${query}" ranks ${slug} first`, () => {
      expect(rankEntries(entries, normalizeQuery(query), 1)[0]?.s).toBe(slug);
    });
  }
});
