import { describe, expect, it } from 'vitest';
import { tokenize } from './tokenizer';
import { MathError } from './errors';

const types = (expr: string) => tokenize(expr).map((t) => `${t.type}:${t.value}`);

describe('tokenizer', () => {
  it('normalizes unicode operator glyphs', () => {
    expect(types('2×3')).toEqual(['number:2', 'operator:*', 'number:3']);
    expect(types('6÷2')).toEqual(['number:6', 'operator:/', 'number:2']);
    expect(types('5−1')).toEqual(['number:5', 'operator:-', 'number:1']); // U+2212
    expect(types('2·3')).toEqual(['number:2', 'operator:*', 'number:3']);
  });

  it('reads the π glyph as the pi constant', () => {
    expect(types('π')).toEqual(['constant:pi']);
  });

  it('skips whitespace and reads leading-dot / scientific numbers', () => {
    expect(types('  .5 + 1.5e3 ')).toEqual(['number:.5', 'operator:+', 'number:1.5e3']);
  });

  it('classifies identifiers case-insensitively', () => {
    expect(types('SIN(PI)')).toEqual(['function:sin', 'lparen:(', 'constant:pi', 'rparen:)']);
  });

  it('distinguishes unary from binary minus', () => {
    expect(types('-3')).toEqual(['operator:u-', 'number:3']);
    expect(types('2-3')).toEqual(['number:2', 'operator:-', 'number:3']);
    expect(types('(-3)')).toEqual(['lparen:(', 'operator:u-', 'number:3', 'rparen:)']);
  });

  it('rejects unknown characters and names', () => {
    expect(() => tokenize('@')).toThrow(MathError);
    expect(() => tokenize('foo(1)')).toThrow(/unknown name/i);
  });
});
