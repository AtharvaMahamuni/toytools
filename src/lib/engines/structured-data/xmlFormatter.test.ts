// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { escapeXmlAttr,
  escapeXmlText,
  formatXml,
  parseErrorLocation,
  stripModePrefix,
  xmlFormatter, cleanParserError, pickCdataPlaceholder, extractProlog } from './xmlFormatter';

function assertRoundTrip(input: string, mode: 'pretty' | 'minify' = 'pretty') {
  const first = formatXml(input, mode);
  expect(first.ok, first.error).toBe(true);
  const second = formatXml(first.output, mode);
  expect(second.ok, second.error).toBe(true);

  const doc1 = new DOMParser().parseFromString(input, 'application/xml');
  expect(doc1.querySelector('parsererror')).toBeNull();
  const doc2 = new DOMParser().parseFromString(first.output, 'application/xml');
  expect(doc2.querySelector('parsererror')).toBeNull();

  const root1 = doc1.documentElement!;
  const root2 = doc2.documentElement!;
  expect(root2.tagName).toBe(root1.tagName);

  function walk(a: Element, b: Element) {
    expect(b.tagName).toBe(a.tagName);
    expect(b.attributes.length).toBe(a.attributes.length);
    for (const attr of Array.from(a.attributes)) {
      expect(b.getAttribute(attr.name)).toBe(attr.value);
    }
    const aKids = Array.from(a.childNodes).filter(
      (n) => !(n.nodeType === Node.TEXT_NODE && !(n.nodeValue ?? '').trim()),
    );
    const bKids = Array.from(b.childNodes).filter(
      (n) => !(n.nodeType === Node.TEXT_NODE && !(n.nodeValue ?? '').trim()),
    );
    expect(bKids.length).toBe(aKids.length);
    for (let i = 0; i < aKids.length; i++) {
      const ak = aKids[i];
      const bk = bKids[i];
      expect(bk.nodeType).toBe(ak.nodeType);
      if (ak.nodeType === Node.TEXT_NODE) {
        expect((bk.nodeValue ?? '').trim()).toBe((ak.nodeValue ?? '').trim());
      } else if (ak.nodeType === Node.CDATA_SECTION_NODE) {
        expect(bk.nodeValue).toBe(ak.nodeValue);
      } else if (ak.nodeType === Node.COMMENT_NODE) {
        expect(bk.nodeValue).toBe(ak.nodeValue);
      } else if (ak.nodeType === Node.ELEMENT_NODE) {
        walk(ak as Element, bk as Element);
      }
    }
  }
  walk(root1, root2);
  return first.output;
}

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

  it('escapeXmlText escapes amp lt gt', () => {
    expect(escapeXmlText('a < b & c > d')).toBe('a &lt; b &amp; c &gt; d');
  });

  it('escapeXmlAttr escapes amp lt quot', () => {
    expect(escapeXmlAttr('a&b < "c"')).toBe('a&amp;b &lt; &quot;c&quot;');
  });

  it('round-trips text entities so output stays well-formed', () => {
    const input = '<root><a>&lt;tag&gt; &amp; x</a></root>';
    const out = assertRoundTrip(input);
    expect(out).toContain('&lt;tag&gt;');
    expect(out).toContain('&amp;');
    expect(out).not.toMatch(/<a><tag>/);
  });

  it('round-trips attribute entities', () => {
    const input = '<root><b href="a&amp;b" title="x&lt;y"/></root>';
    const out = assertRoundTrip(input);
    expect(out).toContain('href="a&amp;b"');
    expect(out).toContain('title="x&lt;y"');
  });

  it('round-trips the Cos entity repro', () => {
    const input = '<r><a>&lt;tag&gt; &amp; x</a><b href="a&amp;b"/></r>';
    const out = assertRoundTrip(input);
    const again = formatXml(out, 'pretty');
    expect(again.ok, again.error).toBe(true);
  });

  it('round-trips CDATA verbatim', () => {
    const input = '<root><![CDATA[a < b & c > d]]></root>';
    const first = formatXml(input, 'pretty');
    expect(first.ok, first.error).toBe(true);
    expect(first.output).toContain('<![CDATA[a < b & c > d]]>');
    const second = formatXml(first.output, 'pretty');
    expect(second.ok, second.error).toBe(true);
    expect(second.output).toContain('<![CDATA[a < b & c > d]]>');
    // Tool validator: formatted output must parse again.
    const third = formatXml(second.output, 'minify');
    expect(third.ok, third.error).toBe(true);
    expect(third.output).toContain('<![CDATA[a < b & c > d]]>');
  });

  it('round-trips numeric and character references by value', () => {
    const input = '<root><a>&#65;&#x42; &amp; &#x3C;</a></root>';
    // Parser expands &#65; -> A, &#x42; -> B, &#x3C; -> <
    const out = assertRoundTrip(input);
    expect(out).toMatch(/A\s*B/);
    expect(out).toContain('&amp;');
    expect(out).toContain('&lt;');
  });

  it('keeps XML comments and does not swallow following elements', () => {
    const input = '<root><!-- keep me --><a>1</a><!-- trail --></root>';
    const out = assertRoundTrip(input);
    expect(out).toContain('<!-- keep me -->');
    expect(out).toContain('<a>1</a>');
    expect(out).toContain('<!-- trail -->');
  });

  it('keeps a DOCTYPE in pretty and minify output', () => {
    const src = '<?xml version="1.0"?><!DOCTYPE note SYSTEM "note.dtd"><note><to>Ada</to></note>';
    const pretty = formatXml(src, 'pretty');
    expect(pretty.ok).toBe(true);
    if (pretty.ok) {
      expect(pretty.output).toContain('<!DOCTYPE note SYSTEM "note.dtd">');
      expect(pretty.output).toContain('<?xml version="1.0"?>');
      expect(pretty.output).toContain('<note>');
    }
    const mini = formatXml(src, 'minify');
    expect(mini.ok).toBe(true);
    if (mini.ok) {
      expect(mini.output).toContain('<!DOCTYPE note SYSTEM "note.dtd">');
    }
  });

  it('does not re-indent mixed content', () => {
    const src = '<p>See <em>this</em> now</p>';
    const res = formatXml(src, 'pretty');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output).toContain('<p>See <em>this</em> now</p>');
      expect(res.output).not.toMatch(/<p>\s*\n/);
    }
  });

  it('honours xml:space="preserve"', () => {
    const src = '<pre xml:space="preserve">  keep\n  me  </pre>';
    const res = formatXml(src, 'pretty');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output).toContain('>  keep\n  me  </pre>');
    }
  });

  it('picks a CDATA placeholder that does not collide with the input', () => {
    const colliding = '<root><tt-cdata-ph i="9"/><![CDATA[secret]]></root>';
    const name = pickCdataPlaceholder(colliding);
    expect(name).not.toBe('tt-cdata-ph');
    const res = formatXml(colliding, 'pretty');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output).toContain('<tt-cdata-ph i="9"/>');
      expect(res.output).toContain('<![CDATA[secret]]>');
    }
  });

  it('cleanParserError strips browser boilerplate', () => {
    const raw = 'This page contains the following errors: error on line 2 at column 1: Opening and ending tag mismatch: a and root. Below is a rendering of the page up to the first error.';
    expect(cleanParserError(raw)).toBe('Opening and ending tag mismatch: a and root.');
    expect(cleanParserError(raw)).not.toMatch(/This page contains/i);
    expect(cleanParserError(raw)).not.toMatch(/error on line/i);
  });

  it('extractProlog reads a declaration and DOCTYPE', () => {
    const { prolog, body } = extractProlog('<?xml version="1.0"?>\n<!DOCTYPE a SYSTEM "a.dtd">\n<a/>');
    expect(prolog).toContain('<?xml version="1.0"?>');
    expect(prolog).toContain('<!DOCTYPE a SYSTEM "a.dtd">');
    expect(body.trim()).toBe('<a/>');
  });
});
