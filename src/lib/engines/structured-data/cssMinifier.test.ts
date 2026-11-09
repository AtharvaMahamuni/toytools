import { describe, expect, it } from 'vitest';
import { beautifyCss, cssMinifier, MATH_PH_START, MATH_PH_END, minifyCss, stripCssModePrefix } from './cssMinifier';

describe('css-minifier', () => {
  it('minifies whitespace and comments', async () => {
    const res = await cssMinifier.execute('@@minify@@\n/* c */\nbody {\n  color: red;\n}\n');
    expect(res.ok).toBe(true);
    expect(res.output).toBe('body{color:red}');
  });

  it('keeps strings intact while minifying', () => {
    expect(minifyCss('a{content:"  x  ";}')).toBe('a{content:"  x  "}');
  });

  it('beautifies minified CSS', async () => {
    const res = await cssMinifier.execute('@@beautify@@\nbody{color:red;margin:0}');
    expect(res.ok).toBe(true);
    expect(res.output).toContain('body {');
    expect(res.output).toContain('color: red');
    expect(res.output).toContain('margin: 0');
  });

  it('returns empty for blank input', async () => {
    expect(await cssMinifier.execute('   ')).toEqual({ ok: true, output: '' });
  });

  it('stripCssModePrefix defaults to beautify', () => {
    expect(stripCssModePrefix('a{}')).toEqual({ mode: 'beautify', css: 'a{}' });
  });

  it('preserves url() values', () => {
    const out = minifyCss('a{background:url( "a b.png" );}');
    expect(out).toContain('url(');
    expect(out).toContain('a b.png');
  });
});

  it('keeps spaces around + and - inside calc()', () => {
    expect(minifyCss('a{width:calc(1px + 2px)}')).toBe('a{width:calc(1px + 2px)}');
    expect(minifyCss('a{width:calc(100% - 20px)}')).toBe('a{width:calc(100% - 20px)}');
  });

  it('keeps spaces in nested calc and min/max/clamp', () => {
    const nested = minifyCss('a{w:calc(1px + calc(2px - 3px))}');
    expect(nested).toContain('1px +');
    expect(nested).toContain('2px -');
    expect(minifyCss('a{w:min(1px + 2px, 10%)}')).toContain('1px + 2px');
    expect(minifyCss('a{w:max(1px - 2px, 0px)}')).toContain('1px - 2px');
    expect(minifyCss('a{w:clamp(1px, 2px + 3px, 4px)}')).toContain('2px + 3px');
  });

  it('keeps negative values and var() inside calc()', () => {
    expect(minifyCss('a{w:calc(-1px + 2px)}')).toBe('a{w:calc(-1px + 2px)}');
    expect(minifyCss('a{w:calc(var(--x) + 1px)}')).toBe('a{w:calc(var(--x) + 1px)}');
    expect(minifyCss('a{w:calc(var(--gap, 1px) - 2px)}')).toContain('var(--gap, 1px) - 2px');
  });

  it('does not let /* */ comments swallow the next rule', () => {
    const out = minifyCss('a{color:red}/* note */\nb{margin:0}');
    expect(out).toContain('a{color:red}');
    expect(out).toContain('b{margin:0}');
    expect(out).not.toContain('/*');
  });


  it('round-trips a literal __TTMATH0__ through minify and beautify', () => {
    const input = 'a{content:__TTMATH0__;width:calc(1px + 2px)}';
    const min = minifyCss(input);
    expect(min).toContain('__TTMATH0__');
    expect(min).toContain('calc(1px + 2px)');
    const pretty = beautifyCss(input);
    expect(pretty).toContain('__TTMATH0__');
    expect(pretty).toContain('1px + 2px');
    // Minify then beautify still keeps the literal marker.
    expect(beautifyCss(min)).toContain('__TTMATH0__');
  });

  it('round-trips private-use sentinel characters in user CSS', () => {
    const input = `a{content:${MATH_PH_START}x${MATH_PH_END};w:calc(1px + 2px)}`;
    const min = minifyCss(input);
    expect(min).toContain(`${MATH_PH_START}x${MATH_PH_END}`);
    expect(min).toContain('calc(1px + 2px)');
    expect(beautifyCss(min)).toContain(`${MATH_PH_START}x${MATH_PH_END}`);
  });
