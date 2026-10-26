import { describe, it, expect } from 'vitest';
import { analyzeText, isNumberToken, wordTokens } from './analysis';

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
      'dog\u2014tired', 'a\u2013b', '\u2015', 'red,green', '1,000,000', ',', 'x, y',
      'https://ex.com/?a=1,b=2', 'www.a-b.com/x,y', 'HTTP://X.IO/\u2014z', 'http:/bad,url',
      'https://ex.com\u2014and', 'https://ex.com,next', 'https://a.com,https://b.com', '"https://q.com/a,b"', 'foo,www.x.com/a,b', 'HTTPS://EX.COM/A,B',
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

  it('splits on en dashes, em dashes and the horizontal bar, not on hyphen-minus', () => {
    expect(wordTokens('The dog\u2014tired\u2014slept')).toEqual(['the', 'dog', 'tired', 'slept']);
    expect(analyzeText('The dog\u2014tired\u2014slept').words).toBe(4);
    expect(wordTokens('pages 3\u20135 \u2015 end')).toEqual(['pages', '3', '5', 'end']);
    expect(analyzeText('a \u2014 b').words).toBe(2);
    expect(wordTokens('well-known')).toEqual(['well-known']);
    expect(analyzeText('well-known').words).toBe(1);
  });

  it('splits on a comma that is not between digits', () => {
    expect(wordTokens('red,green')).toEqual(['red', 'green']);
    expect(analyzeText('red,green').words).toBe(2);
    expect(wordTokens('1,000 and 1,000,000 and 3.14')).toEqual(['1,000', 'and', '1,000,000', 'and', '3.14']);
    expect(analyzeText('1,000,000').words).toBe(1);
    expect(wordTokens('one, two,three')).toEqual(['one', 'two', 'three']);
    expect(wordTokens('5,apples')).toEqual(['5', 'apples']);
  });

  it('keeps a URL as one word, commas and all', () => {
    expect(analyzeText('https://ex.com/?a=1,b=2').words).toBe(1);
    expect(wordTokens('see https://ex.com/?a=1,b=2 and www.ex.com/a,b')).toEqual(['see', 'https://ex.com/?a=1,b=2', 'and', 'www.ex.com/a,b']);
    expect(analyzeText('see https://ex.com/?a=1,b=2 now').words).toBe(3);
    // Not a URL start, so the comma rule still applies.
    expect(wordTokens('ex.com/a,b')).toEqual(['ex.com/a', 'b']);
  });

  it('URL chunks: case-insensitive, anchored, quoted, and still split at dashes, host commas and a second URL', () => {
    const w = (t: string) => analyzeText(t).words;
    expect(w('HTTPS://EX.COM/A,B')).toBe(1);
    expect(w('WWW.EX.COM/A,B')).toBe(1);
    expect(wordTokens('foo,www.x.com/a,b')).toEqual(['foo', 'www.x.com/a', 'b']);
    expect(w('foo,www.x.com/a,b')).toBe(3);
    expect(wordTokens('https://ex.com\u2014and')).toEqual(['https://ex.com', 'and']);
    expect(wordTokens('https://ex.com,next')).toEqual(['https://ex.com', 'next']);
    expect(wordTokens('https://a.com,https://b.com')).toEqual(['https://a.com', 'https://b.com']);
    expect(wordTokens('https://ex.com/a,www.b.com')).toEqual(['https://ex.com/a', 'www.b.com']);
    expect(w('https://ex.com/?a=1,b=2')).toBe(1);
    expect(wordTokens('"https://ex.com/a,b"')).toEqual(['https://ex.com/a,b']);
    expect(wordTokens('(www.x.com/a,b),')).toEqual(['www.x.com/a,b']);
    expect(w('"https://ex.com/a,b" said')).toBe(2);
  });

  it('stays linear on long comma and punctuation runs', () => {
    const inputs = [
      'https://x' + ','.repeat(100000),
      '"https://x/' + ','.repeat(100000) + '"',
      'www.' + ',('.repeat(50000),
      'a' + '-'.repeat(100000) + 'a',
    ];
    for (const text of inputs) {
      const t0 = performance.now();
      analyzeText(text);
      wordTokens(text);
      expect(performance.now() - t0, text.slice(0, 12)).toBeLessThan(1000);
    }
    expect(analyzeText('https://x' + ','.repeat(100000)).words).toBe(1);
  });

  it('trims edge punctuation the same way, including astral characters', () => {
    expect(wordTokens('(dog.) \u{1F600}cat\u{1F600} "a-b" ...')).toEqual(['dog', 'cat', 'a-b']);
    expect(wordTokens('\u{1D400}!')).toEqual(['\u{1D400}']);
  });

  it('never splits a surrogate pair while trimming, even on malformed input', () => {
    // A lone low surrogate after an ASCII letter: the letter must survive the trim.
    expect(wordTokens('a\uDE00')).toEqual(['a']);
    // A lone low surrogate after a real pair stays out, the pair stays whole.
    expect(wordTokens('\u{1D400}\uDE00')).toEqual(['\u{1D400}']);
    // A lone high surrogate at the start is trimmed without touching the word.
    expect(wordTokens('\uD835word')).toEqual(['word']);
  });

  it("treats don't with a straight or curly apostrophe as one word", () => {
    expect(wordTokens('don\u2019t don\'t DON\u02BCT')).toEqual(["don't", "don't", "don't"]);
    expect(analyzeText('don\u2019t don\'t').uniqueWords).toBe(1);
    // A closing curly quote at the end is still trimmed as punctuation.
    expect(wordTokens('\u2018quoted\u2019')).toEqual(['quoted']);
  });
});

describe('Word Frequency decisions (26 Oct 2026)', () => {
  it('every apostrophe form folds to one word', () => {
    expect(wordTokens("don't don\u2019t don\u2018t don\u02bct don\uff07t DON\u2019T")).toEqual(Array(6).fill("don't"));
    expect(analyzeText("don't don\u2019t").uniqueWords).toBe(1);
  });

  it('isNumberToken: digits with no letters are numbers', () => {
    for (const t of ['1', '2026', '1,000', '3.14', '50%', '10:30', '1/2', '-5', '\u0967\u0968']) {
      expect(isNumberToken(t), t).toBe(true);
    }
    for (const t of ['1st', 'mp3', 'covid-19', 'b2b', 'dog', "don't", 'café', '']) {
      expect(isNumberToken(t), t).toBe(false);
    }
  });

  it('filtering numbers out of real tokens keeps the words', () => {
    const toks = wordTokens('In 2026, 1,000 people paid 3.14 each; the 1st one left at 10:30.');
    expect(toks.filter(t => !isNumberToken(t))).toEqual(['in', 'people', 'paid', 'each', 'the', '1st', 'one', 'left', 'at']);
  });
});
