import { describe, it, expect } from 'vitest';
import { parseColor, toAllFormats, rgbToHex, rgbToHsl, rgbToOklch, rgbToCmyk } from './convert';
import { contrastRatio, wcagLevels, suggestAccessible } from './contrast';
import { color } from './registry';

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    expect(parseColor('#3366ff').rgb).toEqual({ r: 51, g: 102, b: 255, a: 1 });
  });
  it('parses shorthand hex and bare hex', () => {
    expect(parseColor('#36f').rgb).toEqual({ r: 51, g: 102, b: 255, a: 1 });
    expect(parseColor('3366ff').rgb).toEqual({ r: 51, g: 102, b: 255, a: 1 });
  });
  it('parses 8-digit hex with alpha', () => {
    const p = parseColor('#00000080');
    expect(p.rgb!.a).toBeCloseTo(0.5, 1);
  });
  it('parses rgb() and hsl()', () => {
    expect(parseColor('rgb(51, 102, 255)').rgb).toEqual({ r: 51, g: 102, b: 255, a: 1 });
    expect(parseColor('hsl(0, 100%, 50%)').rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });
  it('parses named colors', () => {
    expect(parseColor('white').rgb).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('rebeccapurple').ok).toBe(false); // not in our subset
  });
  it('returns an error, never throws, on garbage', () => {
    expect(parseColor('not-a-color').ok).toBe(false);
    expect(parseColor('').ok).toBe(false);
    expect(() => parseColor(undefined as unknown as string)).not.toThrow();
  });
});

describe('conversions', () => {
  it('round-trips white and black to hex', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255, a: 1 })).toBe('#ffffff');
    expect(rgbToHex({ r: 0, g: 0, b: 0, a: 1 })).toBe('#000000');
  });
  it('computes HSL for pure red', () => {
    const { h, s, l } = rgbToHsl({ r: 255, g: 0, b: 0, a: 1 });
    expect(Math.round(h)).toBe(0);
    expect(s).toBeCloseTo(1, 2);
    expect(l).toBeCloseTo(0.5, 2);
  });
  it('OKLCH lightness is ~1 for white and ~0 for black', () => {
    expect(rgbToOklch({ r: 255, g: 255, b: 255, a: 1 }).l).toBeCloseTo(1, 2);
    expect(rgbToOklch({ r: 0, g: 0, b: 0, a: 1 }).l).toBeCloseTo(0, 2);
  });
  it('CMYK of pure red is 0,100,100,0', () => {
    expect(rgbToCmyk({ r: 255, g: 0, b: 0, a: 1 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
  });
  it('emits all six formats', () => {
    const ids = toAllFormats({ r: 51, g: 102, b: 255, a: 1 }).map(f => f.id);
    expect(ids).toEqual(['hex', 'rgb', 'hsl', 'hsv', 'oklch', 'cmyk']);
  });
});

describe('WCAG contrast', () => {
  it('black on white is 21:1', () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(21, 1);
  });
  it('identical colors are 1:1', () => {
    expect(contrastRatio({ r: 128, g: 128, b: 128, a: 1 }, { r: 128, g: 128, b: 128, a: 1 })).toBeCloseTo(1, 5);
  });
  it('flags AA/AAA levels correctly', () => {
    const l = wcagLevels({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
    expect(l.aaNormal && l.aaaNormal && l.aaLarge && l.aaaLarge).toBe(true);
    const weak = wcagLevels({ r: 150, g: 150, b: 150, a: 1 }, { r: 255, g: 255, b: 255, a: 1 });
    expect(weak.aaaNormal).toBe(false);
  });
  it('suggests an accessible color that passes', () => {
    const bg = '#ffffff';
    const fixed = suggestAccessible('#999999', bg, 4.5);
    const p = parseColor(fixed);
    expect(contrastRatio(p.rgb!, parseColor(bg).rgb!)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('color runtime namespace', () => {
  it('check() returns levels for two valid colors', () => {
    const r = color.check('#000', '#fff');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.levels.aaNormal).toBe(true);
  });
  it('check() reports which input failed', () => {
    const r = color.check('nope', '#fff');
    expect(r.ok).toBe(false);
  });
  it('formats() returns six formats for valid input', () => {
    const r = color.formats('#3366ff');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.formats).toHaveLength(6);
  });
});
