import { describe, it, expect } from 'vitest';
import { runProcessor, PROCESSORS } from './registry';

// Unit tests for the processors added from Research Intelligence Engine recommendations:
// reverseText, removeLineBreaks, slugify, removeAccents.

describe('reverseText', () => {
  it('reverses characters', () => expect(runProcessor('reverseText', 'hello')).toBe('olleh'));
  it('reverses the whole block including line order', () =>
    expect(runProcessor('reverseText', 'ab\ncd')).toBe('dc\nba'));
  it('keeps emoji intact (reverses by character, not code unit)', () =>
    expect(runProcessor('reverseText', 'a🚀b')).toBe('b🚀a'));
  it('is its own inverse', () => {
    const s = 'Café 123!';
    expect(runProcessor('reverseText', runProcessor('reverseText', s))).toBe(s);
  });
});

describe('removeLineBreaks', () => {
  it('joins lines with a single space', () =>
    expect(runProcessor('removeLineBreaks', 'line one\nline two')).toBe('line one line two'));
  it('collapses runs of breaks and surrounding spaces to one space', () =>
    expect(runProcessor('removeLineBreaks', 'a  \n\n  b')).toBe('a b'));
  it('trims the edges', () => expect(runProcessor('removeLineBreaks', '\n\nhi\n\n')).toBe('hi'));
  it('handles CRLF', () => expect(runProcessor('removeLineBreaks', 'a\r\nb')).toBe('a b'));
});

describe('slugify', () => {
  it('lowercases, strips accents, hyphenates', () =>
    expect(runProcessor('slugify', 'Café Menu!')).toBe('cafe-menu'));
  it('trims leading/trailing separators', () =>
    expect(runProcessor('slugify', '  --Hello, World--  ')).toBe('hello-world'));
  it('slugifies each line independently', () =>
    expect(runProcessor('slugify', 'First Post\nSecond Post')).toBe('first-post\nsecond-post'));
});

describe('removeAccents', () => {
  it('strips diacritics but keeps the base letters and case', () =>
    expect(runProcessor('removeAccents', 'Crème Brûlée')).toBe('Creme Brulee'));
  it('leaves plain ASCII unchanged', () =>
    expect(runProcessor('removeAccents', 'plain text 123')).toBe('plain text 123'));
  it('preserves spacing and punctuation', () =>
    expect(runProcessor('removeAccents', 'naïve, café!')).toBe('naive, cafe!'));
});

describe('registry wiring', () => {
  it('registers all four new processors with matching ids', () => {
    for (const id of ['reverseText', 'removeLineBreaks', 'slugify', 'removeAccents']) {
      expect(PROCESSORS[id]?.id).toBe(id);
    }
  });
});
