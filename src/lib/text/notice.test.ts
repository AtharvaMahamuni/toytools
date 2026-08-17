import { describe, expect, it } from 'vitest';
import { analyzeText } from './analysis';
import { textNotice, type NoticeId } from './notice';

const n = (id: NoticeId, text: string) => textNotice(id, text, analyzeText(text));

describe('textNotice — what it exists to surface', () => {
  it('names invisible trailing whitespace, the one thing you cannot proofread', () => {
    expect(n('space-counter', 'alpha \nbeta')).toContain('invisible whitespace');
  });

  it('counts tabs separately, the documented space-vs-tab confusion', () => {
    expect(n('space-counter', 'a\tb')).toContain('tab');
  });

  it('separates letters from characters, which people read as one number', () => {
    const r = n('letter-counter', 'abc 123');
    expect(r).toContain('3 letters of 7 characters');
  });

  it('says the same thing on the character counter, where a limit is the point', () => {
    expect(n('character-counter', 'hi!')).toContain('characters');
  });

  it('reports blank lines, so a 500-line file is not read as 500 lines of content', () => {
    expect(n('line-counter', 'a\n\n\nb')).toContain('blank');
  });

  it('flags abbreviations that inflate a sentence count', () => {
    expect(n('sentence-counter', 'Ship it e.g. now and see.')).toContain('abbreviation');
  });

  it('explains why a wall of text counts as one paragraph', () => {
    expect(n('paragraph-counter', 'one\ntwo\nthree')).toContain('not a paragraph break');
  });

  it('warns that stop words dominate a frequency list', () => {
    expect(n('word-frequency-counter', 'the cat and the dog and the bird')).toContain('stop words');
  });

  it('names the words-per-minute assumption behind a reading time', () => {
    expect(n('reading-time-calculator', 'word '.repeat(60))).toContain('200 words a minute');
  });
});

// Silence carries the same weight as firing. A notice on every input is a tip strip, not craft.
describe('textNotice — silence', () => {
  it('says nothing for empty input, on every counter', () => {
    const ids: NoticeId[] = [
      'space-counter', 'letter-counter', 'character-counter', 'line-counter',
      'sentence-counter', 'paragraph-counter', 'word-frequency-counter', 'reading-time-calculator',
    ];
    for (const id of ids) expect(n(id, '')).toBeNull();
  });

  it('says nothing about whitespace when there is none to see', () => {
    expect(n('space-counter', 'alpha beta')).toBeNull();
  });

  it('says nothing when letters and characters agree', () => {
    expect(n('letter-counter', 'abc')).toBeNull();
  });

  it('says nothing about blank lines when there are none', () => {
    expect(n('line-counter', 'a\nb')).toBeNull();
  });

  it('says nothing about abbreviations in ordinary prose', () => {
    expect(n('sentence-counter', 'One sentence. Then another one.')).toBeNull();
  });

  it('says nothing about paragraph breaks once there really are paragraphs', () => {
    expect(n('paragraph-counter', 'one\n\ntwo')).toBeNull();
  });

  it('says nothing about stop words below a tenth of the text', () => {
    expect(n('word-frequency-counter', 'kestrel osprey merlin harrier falcon hobby')).toBeNull();
  });

  it('says nothing about reading assumptions for a short snippet', () => {
    expect(n('reading-time-calculator', 'just a few words here')).toBeNull();
  });
});
