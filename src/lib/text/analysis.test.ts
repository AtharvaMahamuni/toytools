import { describe, it, expect } from 'vitest';
import { analyzeText, wordTokens } from './analysis';

describe('analyzeText', () => {
  it('returns all zeros for empty string', () => {
    const r = analyzeText('');
    expect(r.words).toBe(0);
    expect(r.characters).toBe(0);
    expect(r.charactersNoSpaces).toBe(0);
    expect(r.sentences).toBe(0);
    expect(r.paragraphs).toBe(0);
    expect(r.lines).toBe(0);
    expect(r.letters).toBe(0);
    expect(r.spaces).toBe(0);
    expect(r.nonEmptyLines).toBe(0);
    expect(r.readingTime).toBe(0);
    expect(r.speakingTime).toBe(0);
    expect(r.uniqueWords).toBe(0);
    expect(r.averageWordLength).toBe(0);
    expect(r.averageSentenceLength).toBe(0);
  });

  it('counts whitespace-only text as characters, with no words or sentences', () => {
    const r = analyzeText('   ');
    expect(r.characters).toBe(3);
    expect(r.spaces).toBe(3);
    expect(r.charactersNoSpaces).toBe(0);
    expect(r.lines).toBe(1);
    expect(r.words).toBe(0);
    expect(r.sentences).toBe(0);
    expect(r.paragraphs).toBe(0);
    expect(r.nonEmptyLines).toBe(0);
    expect(r.readingTime).toBe(0);
    expect(r.speakingTime).toBe(0);
    expect(r.averageWordLength).toBe(0);
    expect(r.averageSentenceLength).toBe(0);
  });

  it('counts mixed whitespace with a newline (bug-log repro "  \\n ")', () => {
    const r = analyzeText('  \n ');
    expect(r.characters).toBe(4);
    expect(r.spaces).toBe(3);
    expect(r.lines).toBe(2);
    expect(r.words).toBe(0);
  });

  it('returns all zeros for newline-only string', () => {
    expect(analyzeText('\n').words).toBe(0);
    expect(analyzeText('\n\n').words).toBe(0);
  });

  it('counts a single word', () => {
    expect(analyzeText('hello').words).toBe(1);
  });

  it('counts multiple words', () => {
    expect(analyzeText('hello world').words).toBe(2);
  });

  it('counts lines correctly', () => {
    expect(analyzeText('a\nb\nc').lines).toBe(3);
  });

  it('counts paragraphs separated by blank lines', () => {
    expect(analyzeText('first paragraph\n\nsecond paragraph').paragraphs).toBe(2);
  });

  it('counts sentences by punctuation groups', () => {
    expect(analyzeText('Hello. World! Test?').sentences).toBe(3);
  });

  it('treats ellipsis as a single sentence boundary', () => {
    expect(analyzeText('Hello... World').sentences).toBe(1);
  });

  it('treats text with no punctuation as one sentence', () => {
    expect(analyzeText('Hello world').sentences).toBe(1);
  });

  it('counts characters including spaces', () => {
    expect(analyzeText('hi there').characters).toBe(8);
  });

  it('counts characters without spaces', () => {
    expect(analyzeText('hi there').charactersNoSpaces).toBe(7);
  });

  it('counts unique words case-insensitively', () => {
    expect(analyzeText('The the THE').uniqueWords).toBe(1);
  });

  it('treats accented words as single tokens (unicode-aware)', () => {
    expect(analyzeText('Café café').uniqueWords).toBe(1);
    expect(analyzeText('café cafe').uniqueWords).toBe(2);
  });

  it('counts numeric tokens as words for uniqueness', () => {
    expect(analyzeText('2024 2024 2025').uniqueWords).toBe(2);
  });

  it('counts accented letters in averageWordLength', () => {
    expect(analyzeText('café').averageWordLength).toBe(4);
  });

  it('returns readingTime of at least 1 for non-empty text', () => {
    expect(analyzeText('hello').readingTime).toBe(1);
  });

  it('returns speakingTime of at least 1 for non-empty text', () => {
    expect(analyzeText('hello').speakingTime).toBe(1);
  });

  it('counts only alphabetic characters as letters', () => {
    expect(analyzeText('abc 123 !@#').letters).toBe(3);
  });

  it('counts unicode letters correctly', () => {
    expect(analyzeText('café').letters).toBe(4);
  });

  it('returns 0 letters for digits and punctuation only', () => {
    expect(analyzeText('123 !@#').letters).toBe(0);
  });

  it('counts literal space characters', () => {
    expect(analyzeText('a b c').spaces).toBe(2);
  });

  it('does not count tabs or newlines as spaces', () => {
    expect(analyzeText('a\tb\nc').spaces).toBe(0);
  });

  it('counts non-empty lines correctly', () => {
    expect(analyzeText('a\n\nb\nc').nonEmptyLines).toBe(3);
  });

  it('counts blank lines as empty (not non-empty)', () => {
    expect(analyzeText('a\n\n\nb').nonEmptyLines).toBe(2);
  });

  it('counts whitespace-only lines as empty', () => {
    expect(analyzeText('a\n   \nb').nonEmptyLines).toBe(2);
  });
});

describe('wordTokens: one tokenizer for Words, Unique Words and Top Words (Phase B PR 3)', () => {
  it('keeps hyphenated words, contractions and numbers whole (bug-log repros)', () => {
    expect(wordTokens("don't stop well-known e-mail")).toEqual(["don't", 'stop', 'well-known', 'e-mail']);
    expect(wordTokens('1,000 and 3.14')).toEqual(['1,000', 'and', '3.14']);
    const a = analyzeText("don't stop well-known e-mail");
    expect([a.words, a.uniqueWords]).toEqual([4, 4]);
    const b = analyzeText('1,000 and 3.14');
    expect([b.words, b.uniqueWords]).toEqual([3, 3]);
  });

  it('trims punctuation at either end and folds case', () => {
    expect(wordTokens('Dog. dog, "DOG" (dog)!')).toEqual(['dog', 'dog', 'dog', 'dog']);
    expect(analyzeText('Dog. dog, "DOG" (dog)!').uniqueWords).toBe(1);
    expect(wordTokens("'quoted' end...")).toEqual(['quoted', 'end']);
  });

  it('drops pieces with no letter or digit (dashes, ellipses, emoji)', () => {
    expect(wordTokens('wait - what ... 😀 ok')).toEqual(['wait', 'what', 'ok']);
  });

  it('keeps non-Latin words whole, including trailing combining marks', () => {
    expect(wordTokens('नमस्ते दुनिया Café')).toEqual(['नमस्ते', 'दुनिया', 'café']);
    expect(wordTokens('Привет, мир!')).toEqual(['привет', 'мир']);
  });

  it('returns nothing for empty or whitespace-only text', () => {
    expect(wordTokens('')).toEqual([]);
    expect(wordTokens('  \n\t ')).toEqual([]);
  });

  // Property-style: Unique Words <= Words, and every token comes from one counted word, over a
  // deterministic spread of awkward inputs (hyphens, numbers, punctuation, unicode, whitespace).
  it('Unique Words never exceeds Words over varied generated inputs', () => {
    const parts = [
      'well-known', 'e-mail', "don't", 'don’t', '1,000', '3.14', '-', '--', '...', '😀', '👍🏽',
      'Café', 'café', 'नमस्ते', '日本語', '(dog)', 'dog.', 'DOG', '"quoted"', 'a', 'I', '#tag',
      'https://example.com/a-b', 'x/y', '2024', '$5', '50%', "rock'n'roll", '\u2014', 'e.g.', '¿qué?',
    ];
    const seps = [' ', '  ', '\n', '\t', '\u00a0', ' \n ', ''];
    let seed = 42;
    const rand = (n: number) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
    for (let i = 0; i < 2000; i++) {
      const len = rand(12);
      let text = '';
      for (let j = 0; j < len; j++) text += parts[rand(parts.length)] + seps[rand(seps.length)];
      const r = analyzeText(text);
      const tokens = wordTokens(text);
      expect(r.uniqueWords, JSON.stringify(text)).toBeLessThanOrEqual(r.words);
      expect(tokens.length, JSON.stringify(text)).toBeLessThanOrEqual(r.words);
      expect(r.uniqueWords).toBe(new Set(tokens).size);
      for (const t of tokens) {
        expect(t).toBe(t.toLowerCase());
        expect(/\s/.test(t)).toBe(false);
      }
    }
  });
});
