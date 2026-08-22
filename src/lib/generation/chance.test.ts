// The four chance generators, and their craft notes.
//
// Each note is tested twice and deliberately so: that it FIRES on the input it exists for, and
// that it stays SILENT otherwise. The silence half is the one that gets lost, and a suite that only
// checks the happy path cannot tell a thoughtful touch from a permanent banner.

import { describe, it, expect } from 'vitest';
import { runGeneration, generatorInfo } from './registry';
import { dice, parseNotation, formatNotation, distribution, atLeast, oddsNote } from './generators/dice';
import { coinFlip, lopsidedness, evenSplitChance, streakNote } from './generators/coinFlip';
import { namePicker, parseNames, findDuplicates, duplicateNote } from './generators/namePicker';
import { choicePicker, parseOptions, detectCompound, compoundNote } from './generators/choicePicker';

describe('dice notation', () => {
  it('parses the forms a rulebook prints', () => {
    expect(parseNotation('2d6')).toEqual({ count: 2, sides: 6, modifier: 0 });
    expect(parseNotation('d20')).toEqual({ count: 1, sides: 20, modifier: 0 });
    expect(parseNotation('4d8+3')).toEqual({ count: 4, sides: 8, modifier: 3 });
    expect(parseNotation(' 3D6 - 1 ')).toEqual({ count: 3, sides: 6, modifier: -1 });
  });

  it('rejects what it cannot roll', () => {
    expect(parseNotation('')).toBeNull();
    expect(parseNotation('two d six')).toBeNull();
    expect(parseNotation('2d1')).toBeNull();
    expect(parseNotation('0d6')).toBeNull();
    expect(parseNotation('101d6')).toBeNull();
    expect(parseNotation('1d1001')).toBeNull();
  });

  it('round-trips through its printed form', () => {
    expect(formatNotation({ count: 2, sides: 6, modifier: 0 })).toBe('2d6');
    expect(formatNotation({ count: 1, sides: 20, modifier: 3 })).toBe('1d20+3');
    expect(formatNotation({ count: 3, sides: 8, modifier: -2 })).toBe('3d8-2');
  });
});

describe('dice distribution', () => {
  it('is a probability mass function', () => {
    const dist = distribution(3, 6);
    expect(dist).toHaveLength(16); // sums 3..18
    expect(dist.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it('matches the known 2d6 shape', () => {
    const dist = distribution(2, 6);
    expect(dist[0]).toBeCloseTo(1 / 36, 10); // a 2
    expect(dist[5]).toBeCloseTo(6 / 36, 10); // a 7, the peak
  });

  it('answers "or higher" against the whole pool', () => {
    const n = { count: 1, sides: 20, modifier: 0 };
    expect(atLeast(n, 1)).toBeCloseTo(1, 10);
    expect(atLeast(n, 20)).toBeCloseTo(0.05, 10);
    expect(atLeast(n, 21)).toBeCloseTo(0, 10);
  });
});

describe('dice roller', () => {
  it('rolls inside the pool it was given', () => {
    for (let i = 0; i < 40; i++) {
      const res = runGeneration('dice', { notation: '3d6+2', rolls: 1, breakdown: false });
      expect(res.ok).toBe(true);
      const total = Number(res.lines![0]);
      expect(total).toBeGreaterThanOrEqual(5);
      expect(total).toBeLessThanOrEqual(20);
    }
  });

  it('shows each die when asked and only when there is more than one', () => {
    const many = runGeneration('dice', { notation: '3d6', rolls: 1, breakdown: true });
    expect(many.lines![0]).toMatch(/^\d+ {3}\(\d+ \+ \d+ \+ \d+\)$/);
    const one = runGeneration('dice', { notation: 'd20', rolls: 1, breakdown: true });
    expect(one.lines![0]).toMatch(/^\d+$/);
  });

  it('returns a readable error rather than throwing on nonsense', () => {
    const res = runGeneration('dice', { notation: 'banana', rolls: 1 });
    expect(res.ok).toBe(false);
    expect(res.error).toContain('2d6');
    expect(res.note).toBeUndefined();
  });

  it('craft: names what the roll was worth against its own pool', () => {
    const note = oddsNote({ count: 1, sides: 20, modifier: 0 }, [20]);
    expect(note?.text).toBe('20 on 1d20. A roll reaches 20 or higher 5% of the time.');
  });

  it('craft: reports the best of a batch as a single-roll chance', () => {
    const note = oddsNote({ count: 1, sides: 20, modifier: 0 }, [3, 20, 11]);
    expect(note?.text).toContain('Best of 3: 20');
    expect(note?.text).toContain('5% of the time');
  });

  it('craft: stays silent for a pool too large to answer exactly', () => {
    expect(oddsNote({ count: 60, sides: 6, modifier: 0 }, [200])).toBeUndefined();
    expect(oddsNote({ count: 2, sides: 500, modifier: 0 }, [400])).toBeUndefined();
  });
});

describe('coin flipper', () => {
  it('flips only the two faces it was given', () => {
    const res = runGeneration('coin-flip', { flips: 40, faces: 'yes-no' });
    expect(res.ok).toBe(true);
    const seen = res.text!.split(/\s+/).filter(Boolean);
    expect(seen).toHaveLength(40);
    expect(new Set(seen).size).toBeLessThanOrEqual(2);
    for (const f of seen) expect(['Yes', 'No']).toContain(f);
  });

  it('computes the two-sided tail exactly', () => {
    // Ten flips landing 8-2 or worse: 2 * (C(10,8)+C(10,9)+C(10,10)) / 1024.
    expect(lopsidedness(10, 8)).toBeCloseTo((2 * (45 + 10 + 1)) / 1024, 10);
    expect(lopsidedness(10, 5)).toBeCloseTo(1, 10);
    expect(evenSplitChance(10)).toBeCloseTo(252 / 1024, 10);
  });

  it('craft: answers the "this coin is rigged" complaint with a number', () => {
    const flips = [...Array(8).fill('Heads'), ...Array(2).fill('Tails')];
    const note = streakNote(['Heads', 'Tails'], flips);
    expect(note?.text).toContain('8 heads, 2 tails');
    expect(note?.text).toContain('11% of 10-flip runs');
  });

  it('craft: has a different thing to say about a dead-even split', () => {
    const flips = [...Array(5).fill('Heads'), ...Array(5).fill('Tails')];
    expect(streakNote(['Heads', 'Tails'], flips)?.text).toContain('dead-even split');
  });

  it('craft: stays silent for a single flip, which has nothing to be surprised by', () => {
    expect(streakNote(['Heads', 'Tails'], ['Heads'])).toBeUndefined();
    expect(runGeneration('coin-flip', { flips: 1, faces: 'heads-tails' }).note).toBeUndefined();
  });
});

describe('name picker', () => {
  it('reads one name per line and drops the blanks', () => {
    expect(parseNames('Ana\n\n  Ben  \nChidi\n')).toEqual(['Ana', 'Ben', 'Chidi']);
  });

  it('draws without replacement by default', () => {
    const res = runGeneration('name-picker', { names: 'Ana\nBen\nChidi\nDara', count: 4, unique: true });
    const picked = res.lines!.map((l) => l.replace(/^\d+\. /, ''));
    expect(new Set(picked).size).toBe(4);
  });

  it('caps a draw at the size of the list', () => {
    const res = runGeneration('name-picker', { names: 'Ana\nBen', count: 10, unique: true });
    expect(res.lines).toHaveLength(2);
    expect(res.meta).toContainEqual({ label: 'Capped', value: 'list holds 2' });
  });

  it('errors rather than picking from nothing', () => {
    const res = runGeneration('name-picker', { names: '   \n\n', count: 1 });
    expect(res.ok).toBe(false);
    expect(res.error).toContain('at least one name');
  });

  it('matches duplicates across case and spacing', () => {
    const report = findDuplicates(['Ana', 'ana', 'Ben', 'A na', 'Ana ']);
    expect(report.repeats[0]).toEqual({ name: 'Ana', count: 3 });
    expect(report.extra).toBe(2);
    expect(report.deduped).toEqual(['Ana', 'Ben', 'A na']);
  });

  it('craft: names who a repeated entry is quietly favouring, and offers the fix', () => {
    const note = duplicateNote(['Ana', 'Ben', 'ana', 'Chidi']);
    expect(note?.text).toBe('Ana is on the list 2 times, so Ana has 2 chances in 4 while everyone else has 1.');
    expect(note?.fix).toEqual({ label: 'Remove 1 duplicate', field: 'names', value: 'Ana\nBen\nChidi' });
  });

  it('craft: counts the other repeated names without listing them all', () => {
    expect(duplicateNote(['Ana', 'Ana', 'Ben', 'Ben', 'Chidi'])?.text).toContain('1 other name is repeated too');
  });

  it('craft: stays silent on a clean list', () => {
    expect(duplicateNote(['Ana', 'Ben', 'Chidi'])).toBeUndefined();
    expect(runGeneration('name-picker', { names: 'Ana\nBen\nChidi', count: 1 }).note).toBeUndefined();
  });
});

describe('choice picker', () => {
  it('reads one option per line', () => {
    expect(parseOptions('Pizza\n\nSushi \n')).toEqual(['Pizza', 'Sushi']);
  });

  it('shuffles the whole list in order mode and ignores the count', () => {
    const res = runGeneration('choice-picker', { options: 'a\nb\nc\nd', mode: 'order', count: 1 });
    expect(res.lines).toHaveLength(4);
    expect(res.lines!.map((l) => l.slice(3)).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('picks a single winner with no numbering', () => {
    const res = runGeneration('choice-picker', { options: 'a\nb\nc', mode: 'pick', count: 1 });
    expect(res.lines).toHaveLength(1);
    expect(res.lines![0]).toMatch(/^[abc]$/);
  });

  it('errors rather than picking from nothing', () => {
    expect(runGeneration('choice-picker', { options: '\n \n', mode: 'pick' }).ok).toBe(false);
  });

  it('craft: catches the one line that is really several options', () => {
    expect(detectCompound(['Pizza, Sushi, Tacos'])).toEqual({
      parts: ['Pizza', 'Sushi', 'Tacos'],
      separator: 'commas',
    });
    expect(detectCompound(['tea or coffee'])?.separator).toBe('"or"');
    expect(detectCompound(['a;b;c'])?.separator).toBe('semicolons');
  });

  it('craft: offers the split as the fix', () => {
    const note = compoundNote(['Pizza, Sushi, Tacos']);
    expect(note?.text).toContain('one option with commas inside it');
    expect(note?.fix).toEqual({
      label: 'Split into 3 options',
      field: 'options',
      value: 'Pizza\nSushi\nTacos',
    });
  });

  it('craft: stays silent once a second line exists, so a comma inside an option is safe', () => {
    expect(detectCompound(['Pizza, extra cheese', 'Sushi'])).toBeNull();
    expect(compoundNote(['Pizza', 'Sushi'])).toBeUndefined();
    expect(detectCompound(['Pizza'])).toBeNull();
  });
});

describe('the chance generators as engine citizens', () => {
  const ids = ['dice', 'coin-flip', 'name-picker', 'choice-picker'];

  it('all register on the chance family and declare notes', () => {
    for (const id of ids) {
      const info = generatorInfo(id);
      expect(info, id).toBeDefined();
      expect(info!.family).toBe('chance');
      expect(info!.notes).toBe(true);
    }
    expect([dice, coinFlip, namePicker, choicePicker].map((g) => g.id)).toEqual(ids);
  });

  it('expose defaults for every field so the widget renders with no JS', () => {
    for (const id of ids) {
      const info = generatorInfo(id)!;
      for (const field of info.fields) expect(info.defaults[field.id], `${id}.${field.id}`).toBeDefined();
    }
  });
});
