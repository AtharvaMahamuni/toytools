// Search corpus regression — real queries against the REAL catalog.
//
// rank.test.ts already covers the scoring mechanics thoroughly, but it scores synthetic entries:
// it proves the tiers behave, not that typing "yml to json" on the live site finds the right tool.
// Those are different failures, and only the second one is what a visitor experiences.
//
// This file exists because the search index is close to its payload ceiling (9.6K of a 12K gzip
// budget at 132 tools, measured 2026-08-23) and whoever restructures it — sharding it, trimming
// what each tool contributes, moving ranking off the main thread — needs a way to prove they did
// not quietly break retrieval while shrinking bytes. Every case below is a query whose answer a
// person would recognise as right or wrong, so a regression reads as a regression rather than as a
// number moving.
//
// Adding a case: only pin what you would actually defend in review. A query pinned to a tool that
// merely happens to win today turns a legitimate ranking improvement into a red build.

import { describe, it, expect } from 'vitest';
import { buildClientIndex } from './index';
import { rankEntries } from './rank';

const index = buildClientIndex();
const top = (query: string, n = 1): string[] =>
  rankEntries(index.t, query, n).map((e) => e.s);
const first = (query: string): string | undefined => top(query)[0];

describe('search corpus', () => {
  // ── Direction matters. Both of these tools exist and are near-identical in every field except
  // the direction they convert, which is the whole reason "to" and "from" are kept out of the
  // stopword list. This pair caught a real regression once: "yml to json" resolved to the tool
  // that does the exact opposite, via a three-word composite outscoring the curated alias.
  it.each([
    ['yml to json', 'yaml-to-json-converter'],
    ['yaml to json', 'yaml-to-json-converter'],
    ['json to yaml', 'json-to-yaml-converter'],
    ['json to csv', 'json-to-csv-converter'],
    ['csv to json', 'csv-to-json-converter'],
  ])('%s finds %s, not its opposite', (query, slug) => {
    expect(first(query)).toBe(slug);
  });

  // ── A habitually appended noun must not veto the match. "Quadratic Equation Solver" is a
  // *Solver*; nothing in it carries the word "calculator", and requiring every query word to hit
  // returned nothing at all for the most natural phrasing of the query.
  it.each([
    ['quadratic formula calculator', 'quadratic-equation-solver'],
    ['json formatter online', 'json-formatter'],
  ])('%s survives the appended tool-noun', (query, slug) => {
    expect(first(query)).toBe(slug);
  });

  // ── Formula-shaped queries. These arrive full of punctuation, which is why the query is split
  // on the same boundary the targets are, and why a single letter only matches as a whole word:
  // allowing "r" to prefix-match put every "Remove ..." tool above Ohm's law.
  it('a formula query finds the law it describes', () => {
    expect(first('v = i r')).toBe('ohms-law-calculator');
  });

  // ── The plain cases: if these ever break, something fundamental has gone wrong.
  it.each([
    ['word counter', 'word-counter'],
    ['bmi', 'bmi-calculator'],
    ['uuid', 'uuid-generator'],
    ['base64', 'base64-encoder-decoder'],
    ['pomodoro', 'pomodoro-timer'],
    ['password generator', 'password-generator'],
    ['tip calculator', 'tip-calculator'],
  ])('%s finds %s', (query, slug) => {
    expect(first(query)).toBe(slug);
  });

  // ── A natural-language question still lands, because the stopwords that carry no signal
  // ("how", "many", "between", "two") do not veto the terms that do.
  it('a question-shaped query finds the tool that answers it', () => {
    expect(first('how many days between two dates')).toBe('date-difference-calculator');
  });

  // ── Typo forgiveness, and its limit. One edit is forgiven; a query for a tool the catalog does
  // not have must return NOTHING rather than the nearest loose match. This is the direction the
  // ranking is most likely to regress when someone widens fuzzy matching to "improve" recall:
  // both of these have no answer in the catalog today, and inventing one is worse than silence.
  it('forgives a single typo', () => {
    expect(first('celcius')).toBeUndefined();       // no temperature tool exists at all
    expect(first('passwrod generator')).toBe('password-generator');
  });

  it('returns nothing rather than a wrong answer for a tool we do not have', () => {
    expect(top('free fall', 5)).toEqual([]);
    expect(top('mortgage amortization schedule', 5)).toEqual([]);
  });

  // ── Index integrity. Cheap, and the thing most likely to break during a payload restructure.
  it('every entry can rebuild a URL and carries searchable terms', () => {
    expect(index.t.length).toBeGreaterThan(0);
    for (const e of index.t) {
      expect(e.s, 'slug').toBeTruthy();
      expect(e.n, 'display name').toBeTruthy();
      expect(index.g[e.g], `segment for "${e.s}"`).toBeTruthy();
      expect(index.c[e.c], `category for "${e.s}"`).toBeTruthy();
      expect(Array.isArray(e.k), `terms for "${e.s}"`).toBe(true);
    }
  });

  it('finds every tool by its own exact name', () => {
    // The weakest possible retrieval guarantee, and therefore the one worth pinning: whatever else
    // a restructure changes, a tool must remain reachable by the name shown on its own page.
    const unreachable = index.t.filter((e) => first(e.n) !== e.s);
    expect(unreachable.map((e) => e.s)).toEqual([]);
  });
});
