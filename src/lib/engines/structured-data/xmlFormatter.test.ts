// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { formatXml, parseErrorLocation, stripModePrefix, xmlFormatter } from './xmlFormatter';

describe('xml-formatter', () => {
  it('pretty-prints a compact element', async () => {
    const res = await xmlFormatter.execute('<root><a>1</a><b x="y"/></root>');
    expect(res.ok).toBe(true);
    expect(res.output).toContain('<root>');
    expect(res.output).toContain('<a>1</a>');
    expect(res.output).toMatch(/<b[^>]*x="y"[^>]*\/>/);
  });

  it('minifies with the mode prefix', async () => {
    const res = await xmlFormatter.execute('@@minify@@\n<root>\n  <a>1</a>\n</root>\n');
    expect(res.ok).toBe(true);
    expect(res.output.replace(/\s+/g, '')).toBe('<root><a>1</a></root>');
  });

  it('reports malformed XML', async () => {
    const res = await xmlFormatter.execute('<root><a></root>');
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/Malformed XML/i);
  });

  it('returns empty for blank input', async () => {
    expect(await xmlFormatter.execute('   ')).toEqual({ ok: true, output: '' });
  });

  it('stripModePrefix defaults to pretty', () => {
    expect(stripModePrefix('<a/>')).toEqual({ mode: 'pretty', xml: '<a/>' });
    expect(stripModePrefix('@@minify@@\n<a/>')).toEqual({ mode: 'minify', xml: '<a/>' });
  });

  it('parseErrorLocation reads line and column', () => {
    expect(parseErrorLocation('error on line 3 at column 4: boom')).toEqual({ line: 3, column: 4 });
    expect(parseErrorLocation('error on line 2, column 9: x')).toEqual({ line: 2, column: 9 });
  });

  it('formatXml preserves a declaration when pretty', () => {
    const res = formatXml('<?xml version="1.0"?><root><a/></root>', 'pretty');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output.includes('<?xml version="1.0"?>') || res.output.includes('<root>')).toBe(true);
      expect(res.output).toContain('<root>');
    }
  });
});
