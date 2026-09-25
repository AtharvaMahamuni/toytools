import { describe, expect, it } from 'vitest';
import {
  MAX_TEST_TEXT,
  explainSummary,
  looksExpensive,
  normalizeFlags,
  runRegexTest,
} from './regex-tester';

describe('looksExpensive', () => {
  it('allows ordinary patterns', () => {
    expect(looksExpensive(String.raw`\d+`)).toBeNull();
    expect(looksExpensive(String.raw`(?<year>\d{4})-(?<month>\d{2})`)).toBeNull();
    expect(looksExpensive('fox')).toBeNull();
  });

  it('refuses nested quantifiers', () => {
    const reason = looksExpensive('(a+)+');
    expect(reason).toMatch(/nests quantifiers/i);
  });

  it('refuses overlapping alternation under a quantifier', () => {
    const reason = looksExpensive('(a|ab)+');
    expect(reason).toMatch(/overlapping alternatives/i);
  });
});

describe('normalizeFlags', () => {
  it('defaults to global so every match is walkable', () => {
    expect(normalizeFlags('').flags).toBe('g');
    expect(normalizeFlags('i').flags).toContain('g');
    expect(normalizeFlags('i').flags).toContain('i');
  });

  it('rejects unknown and duplicate flags', () => {
    expect(normalizeFlags('z').error).toMatch(/Unknown flag/);
    expect(normalizeFlags('ii').error).toMatch(/Duplicate flag/);
  });
});

describe('runRegexTest', () => {
  it('surfaces syntax errors honestly', () => {
    const r = runRegexTest({ pattern: '(', text: 'abc' });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.kind).toBe('syntax');
      expect(r.error).toMatch(/Invalid regular expression/);
    }
  });

  it('returns empty-pattern without throwing', () => {
    const r = runRegexTest({ pattern: '', text: 'abc' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.kind).toBe('empty-pattern');
  });

  it('lists matches with indices and named groups', () => {
    const r = runRegexTest({
      pattern: String.raw`(?<word>\w+)`,
      flags: 'g',
      text: 'one two',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.matchCount).toBe(2);
    expect(r.matches[0].match).toBe('one');
    expect(r.matches[0].start).toBe(0);
    expect(r.matches[0].groups[0]?.name).toBe('word');
    expect(r.matches[0].groups[0]?.value).toBe('one');
  });

  it('caps test text at MAX_TEST_TEXT', () => {
    const text = 'a'.repeat(MAX_TEST_TEXT + 50);
    const r = runRegexTest({ pattern: 'a', flags: 'g', text, maxMatches: 3 });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.cappedText).toBe(true);
    expect(r.textLength).toBe(MAX_TEST_TEXT);
  });

  it('stops on the sync time budget instead of hanging', () => {
    let t = 0;
    const r = runRegexTest({
      pattern: 'a',
      flags: 'g',
      text: 'a'.repeat(1000),
      timeBudgetMs: 5,
      now: () => {
        t += 10;
        return t;
      },
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.kind).toBe('timeout');
  });

  it('refuses expensive patterns before running them', () => {
    const r = runRegexTest({ pattern: '(a+)+$', text: 'aaaaaaaaaaaa!' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.kind).toBe('expensive');
  });

  it('applies optional replace with capture tokens', () => {
    const r = runRegexTest({
      pattern: String.raw`(\w+)\s(\w+)`,
      flags: 'g',
      text: 'hello world',
      replace: '$2 $1',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.replaced).toBe('world hello');
  });

  it('advances past zero-length matches', () => {
    const r = runRegexTest({ pattern: '', text: 'ab' }); // empty already handled
    expect(r.ok).toBe(false);

    const z = runRegexTest({ pattern: 'x?', flags: 'g', text: 'ab', maxMatches: 10 });
    expect(z.ok).toBe(true);
    if (!z.ok) return;
    expect(z.matchCount).toBeGreaterThan(0);
  });
});

describe('explainSummary', () => {
  it('is silent when there is nothing useful to say', () => {
    expect(explainSummary(runRegexTest({ pattern: 'zzz', text: 'abc' }))).toBeNull();
    expect(explainSummary(runRegexTest({ pattern: '', text: 'abc' }))).toBeNull();
  });

  it('names the first match span and groups', () => {
    const r = runRegexTest({
      pattern: String.raw`(?<num>\d+)`,
      flags: 'g',
      text: 'id 42',
    });
    const line = explainSummary(r);
    expect(line).toMatch(/1 match at index/);
    expect(line).toMatch(/\$num=/);
  });
});
