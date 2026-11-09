import { describe, expect, it } from 'vitest';
import { beautifyCss, cssMinifier, minifyCss, stripCssModePrefix } from './cssMinifier';

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
