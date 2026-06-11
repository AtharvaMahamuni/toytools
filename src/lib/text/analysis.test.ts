import { describe, it, expect } from 'vitest';
import { analyzeText } from './analysis';

describe('analyzeText', () => {
  it('returns all zeros for empty string', () => {
    const r = analyzeText('');
    expect(r.words).toBe(0);
    expect(r.characters).toBe(0);
    expect(r.charactersNoSpaces).toBe(0);
    expect(r.sentences).toBe(0);
    expect(r.paragraphs).toBe(0);
    expect(r.lines).toBe(0);
    expect(r.readingTime).toBe(0);
    expect(r.speakingTime).toBe(0);
    expect(r.uniqueWords).toBe(0);
    expect(r.averageWordLength).toBe(0);
    expect(r.averageSentenceLength).toBe(0);
  });

  it('returns all zeros for whitespace-only string', () => {
    const r = analyzeText('     ');
    expect(r.words).toBe(0);
    expect(r.sentences).toBe(0);
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
});
