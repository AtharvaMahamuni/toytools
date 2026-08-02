import { describe, it, expect } from 'vitest';
import { boundedDistance, normalizeQuery, scoreEntry, rankEntries } from './rank';
import { buildClientIndex, entryUrl } from './index';
import { searchAliases } from '@data/search-aliases';

const entry = (n: string, k: string[] = []) => ({ n, k });

describe('boundedDistance', () => {
  it('is zero for identical strings', () => expect(boundedDistance('json', 'json', 2)).toBe(0));

  it('counts single edits', () => {
    expect(boundedDistance('celcius', 'celsius', 2)).toBe(1); // substitution
    expect(boundedDistance('json', 'jsonn', 2)).toBe(1);      // insertion
    expect(boundedDistance('color', 'colour', 2)).toBe(1);
  });

  it('abandons early instead of computing a large distance', () => {
    // Over budget returns max + 1 rather than the true distance.
    expect(boundedDistance('abc', 'zzzzzzzzzzzz', 2)).toBe(3);
  });

  it('handles empty strings', () => {
    expect(boundedDistance('', 'abc', 5)).toBe(3);
    expect(boundedDistance('abc', '', 5)).toBe(3);
  });
});

describe('normalizeQuery', () => {
  it('trims, lowercases and collapses whitespace', () =>
    expect(normalizeQuery('  JSON   Formatter ')).toBe('json formatter'));
});

describe('scoreEntry', () => {
  it('returns 0 for an empty query', () => expect(scoreEntry(entry('Word Counter'), '  ')).toBe(0));

  it('returns 0 when nothing matches', () =>
    expect(scoreEntry(entry('Word Counter'), 'mortgage')).toBe(0));

  it('ranks an exact name above a prefix above a substring', () => {
    const exact = scoreEntry(entry('Word Counter'), 'word counter');
    const prefix = scoreEntry(entry('Word Frequency Counter'), 'word');
    const substring = scoreEntry(entry('Reverse Word Order'), 'ord');
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(substring);
  });

  it('prefers the shorter name inside a tier', () => {
    const short = scoreEntry(entry('Word Counter'), 'word');
    const long = scoreEntry(entry('Word Frequency Counter'), 'word');
    expect(short).toBeGreaterThan(long);
  });

  it('matches an alias term', () => {
    const score = scoreEntry(entry('Discount Calculator', ['percent off']), 'percent off');
    expect(score).toBeGreaterThan(0);
  });

  it('forgives a typo in a long enough term', () => {
    expect(scoreEntry(entry('Celsius Converter'), 'celcius')).toBeGreaterThan(0);
  });

  it('does not fuzzy-match very short terms', () => {
    // Three characters are within one edit of far too much to be useful.
    expect(scoreEntry(entry('Word Counter'), 'xyz')).toBe(0);
  });

  it('requires every word of a multi-term query to match', () => {
    expect(scoreEntry(entry('JSON Formatter', ['developer']), 'json csv')).toBe(0);
    expect(scoreEntry(entry('JSON to CSV Converter', []), 'json csv')).toBeGreaterThan(0);
  });

  it('scores a whole-phrase name match above a per-word match', () => {
    const phrase = scoreEntry(entry('JSON Formatter'), 'json formatter');
    const perWord = scoreEntry(entry('Formatter for JSON payloads'), 'json formatter');
    expect(phrase).toBeGreaterThan(perWord);
  });
});

describe('rankEntries', () => {
  const entries = [
    entry('Word Counter'),
    entry('Word Frequency Counter'),
    entry('Character Counter', ['char count']),
    entry('JSON Formatter'),
  ];

  it('drops non-matches', () => {
    const out = rankEntries(entries, 'word');
    expect(out.map(e => e.n)).toEqual(['Word Counter', 'Word Frequency Counter']);
  });

  it('honours the limit', () => expect(rankEntries(entries, 'counter', 1)).toHaveLength(1));

  it('returns nothing for an empty query', () => expect(rankEntries(entries, '')).toHaveLength(0));

  it('finds a tool by alias alone', () => {
    const out = rankEntries(entries, 'char count');
    expect(out[0]!.n).toBe('Character Counter');
  });
});

describe('buildClientIndex', () => {
  const index = buildClientIndex();

  it('covers every alias target and ranks it first', () => {
    for (const [slug, phrases] of Object.entries(searchAliases)) {
      for (const phrase of phrases) {
        const top = rankEntries(index.t, phrase, 1)[0];
        expect(top, `no result for alias "${phrase}"`).toBeTruthy();
        expect(top!.s, `alias "${phrase}" did not rank ${slug} first`).toBe(slug);
      }
    }
  });

  it('rebuilds a real tool URL for every entry', () =>
    index.t.forEach(e => {
      expect(entryUrl(index, e)).toMatch(/^.*\/tool\/[^/]+\/[^/]+\/$/);
      expect(index.c[e.c]).toBeTruthy();
      expect(index.g[e.g]).toBeTruthy();
      expect(e.n).toBeTruthy();
    }));

  it('interns categories instead of repeating them', () => {
    expect(index.c.length).toBeLessThan(index.t.length);
    expect(index.g.length).toBeLessThan(index.t.length);
  });

  it('omits terms the name already contains', () => {
    const counter = index.t.find(e => e.s === 'word-counter')!;
    expect(counter.k).not.toContain('word counter');
    counter.k.forEach(term => expect(counter.n.toLowerCase()).not.toContain(term));
  });

  it('stays small enough to fetch on an interaction', () => {
    const bytes = Buffer.byteLength(JSON.stringify(index), 'utf8');
    expect(bytes).toBeLessThan(40_000);
  });
});
