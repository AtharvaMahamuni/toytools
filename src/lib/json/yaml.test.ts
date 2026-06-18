import { describe, it, expect } from 'vitest';
import { serializeToYaml, DEFAULT_YAML_OPTIONS } from './yaml';

const y = (v: unknown, opts: Parameters<typeof serializeToYaml>[1] = {}) =>
  serializeToYaml(v, opts);

describe('DEFAULT_YAML_OPTIONS', () => {
  it('exports expected defaults', () =>
    expect(DEFAULT_YAML_OPTIONS).toEqual({
      indent: 2,
      sortKeys: false,
      docMarker: false,
      flowScalars: false,
    }));
});

describe('serializeToYaml — scalars', () => {
  it('null', () => expect(y(null)).toBe('null'));
  it('undefined', () => expect(y(undefined)).toBe('null'));
  it('true', () => expect(y(true)).toBe('true'));
  it('false', () => expect(y(false)).toBe('false'));
  it('integer', () => expect(y(42)).toBe('42'));
  it('float', () => expect(y(3.14)).toBe('3.14'));
  it('NaN → null', () => expect(y(NaN)).toBe('null'));
  it('Infinity → null', () => expect(y(Infinity)).toBe('null'));
  it('-Infinity → null', () => expect(y(-Infinity)).toBe('null'));
  it('plain string — no quotes', () => expect(y('hello')).toBe('hello'));
});

describe('serializeToYaml — needsQuote branches', () => {
  it('empty string', () => expect(y({ x: '' })).toBe('x: ""'));
  it('reserved: true', () => expect(y({ x: 'true' })).toBe('x: "true"'));
  it('reserved: FALSE (uppercase)', () => expect(y({ x: 'FALSE' })).toBe('x: "FALSE"'));
  it('reserved: yes', () => expect(y({ x: 'yes' })).toBe('x: "yes"'));
  it('reserved: ON', () => expect(y({ x: 'ON' })).toBe('x: "ON"'));
  it('reserved: ~', () => expect(y({ x: '~' })).toBe('x: "~"'));
  it('integer-like string', () => expect(y({ x: '42' })).toBe('x: "42"'));
  it('float-like string', () => expect(y({ x: '3.14' })).toBe('x: "3.14"'));
  it('scientific notation string', () => expect(y({ x: '1e5' })).toBe('x: "1e5"'));
  it('hex literal string', () => expect(y({ x: '0xFF' })).toBe('x: "0xFF"'));
  it('octal literal string', () => expect(y({ x: '0o777' })).toBe('x: "0o777"'));
  it('leading whitespace', () => expect(y({ x: ' hello' })).toBe('x: " hello"'));
  it('trailing whitespace', () => expect(y({ x: 'hello ' })).toBe('x: "hello "'));
  it('contains colon', () => expect(y({ x: 'a:b' })).toBe('x: "a:b"'));
  it('contains #', () => expect(y({ x: 'a#b' })).toBe('x: "a#b"'));
  it('contains {', () => expect(y({ x: '{obj}' })).toBe('x: "{obj}"'));
  it('contains [', () => expect(y({ x: '[arr]' })).toBe('x: "[arr]"'));
  it('starts with "- " (block indicator)', () => expect(y({ x: '- item' })).toBe('x: "- item"'));
  it('is lone "-"', () => expect(y({ x: '-' })).toBe('x: "-"'));
  it('is lone "?"', () => expect(y({ x: '?' })).toBe('x: "?"'));
  it('contains ": " (colon-space)', () => expect(y({ x: 'key: val' })).toBe('x: "key: val"'));
  it('contains " #" (space-hash)', () => expect(y({ x: 'text # comment' })).toBe('x: "text # comment"'));
  it('starts with "? " (mapping key indicator)', () => expect(y({ x: '? k' })).toBe('x: "? k"'));
});

describe('serializeToYaml — doubleQuote escaping', () => {
  it('escapes embedded double-quote', () => {
    expect(y({ x: 'say "hi"' })).toContain('\\"hi\\"');
  });
  it('escapes backslash (string also has " to trigger needsQuote)', () => {
    const result = y({ x: '"a\\b"' });
    expect(result).toContain('\\\\');
  });
  it('escapes \\n in a key that also contains : (triggers needsQuote)', () => {
    const result = y({ ['a:b\nc']: 1 });
    expect(result).toContain('\\n');
  });
  it('escapes \\r (string also has " to trigger needsQuote)', () => {
    const result = y({ x: '"a\rb"' });
    expect(result).toContain('\\r');
  });
  it('escapes \\t (string also has " to trigger needsQuote)', () => {
    const result = y({ x: '"a\tb"' });
    expect(result).toContain('\\t');
  });
  it('escapes control character as \\uXXXX (string also has " to trigger needsQuote)', () => {
    const result = y({ x: '"a\x01b"' });
    expect(result).toContain('\\u0001');
  });
});

describe('serializeToYaml — yamlString (literal block scalar)', () => {
  it('uses |- (strip chomping) when string has no trailing newline', () => {
    expect(y({ x: 'line1\nline2' })).toContain('|-\n');
  });
  it('uses | (clip chomping) when string ends with a newline', () => {
    const result = y({ x: 'line1\nline2\n' });
    expect(result).toMatch(/x: \|\n/);
    expect(result).not.toContain('|-');
  });
  it('indents block scalar content at depth+1', () => {
    expect(y({ x: 'a\nb' })).toBe('x: |-\n  a\n  b');
  });
});

describe('serializeToYaml — empty collections', () => {
  it('top-level empty array → []', () => expect(y([])).toBe('[]'));
  it('top-level empty object → {}', () => expect(y({})).toBe('{}'));
  it('object with empty array value', () => expect(y({ x: [] })).toBe('x: []'));
  it('object with empty object value', () => expect(y({ x: {} })).toBe('x: {}'));
});

describe('serializeToYaml — flowScalars option', () => {
  it('renders scalar array in flow style', () => {
    expect(y([1, 2, 3], { flowScalars: true })).toBe('[1, 2, 3]');
  });
  it('quotes strings that need quoting inside flow array', () => {
    expect(y(['true', 'hello'], { flowScalars: true })).toBe('["true", hello]');
  });
  it('flow array with null and booleans', () => {
    expect(y([null, true, false], { flowScalars: true })).toBe('[null, true, false]');
  });
  it('flow array with non-finite numbers → null', () => {
    expect(y([1, NaN, Infinity], { flowScalars: true })).toBe('[1, null, null]');
  });
  it('object property with scalar array in flow style', () => {
    expect(y({ tags: ['a', 'b', 'c'] }, { flowScalars: true })).toBe('tags: [a, b, c]');
  });
  it('mixed array (not all scalars) is NOT rendered in flow style', () => {
    const result = y([1, { x: 1 }], { flowScalars: true });
    expect(result).not.toMatch(/^\[/);
    expect(result).toContain('- 1');
  });
  it('scalar array inside object-in-array item rendered as flow', () => {
    expect(y([{ tags: ['a', 'b'] }], { flowScalars: true })).toContain('[a, b]');
  });
});

describe('serializeToYaml — sortKeys option', () => {
  it('sorts object keys alphabetically', () => {
    expect(y({ z: 1, a: 2, m: 3 }, { sortKeys: true })).toBe('a: 2\nm: 3\nz: 1');
  });
  it('sorts keys inside objects in arrays', () => {
    expect(y([{ z: 1, a: 2 }], { sortKeys: true })).toBe('- a: 2\n  z: 1');
  });
  it('preserves insertion order without sortKeys', () => {
    expect(y({ z: 1, a: 2 })).toBe('z: 1\na: 2');
  });
});

describe('serializeToYaml — docMarker option', () => {
  it('prepends --- when docMarker=true', () => {
    expect(y({ a: 1 }, { docMarker: true })).toBe('---\na: 1');
  });
  it('no --- by default', () => {
    expect(y({ a: 1 })).not.toContain('---');
  });
});

describe('serializeToYaml — indent option', () => {
  it('uses 4-space indent', () => {
    expect(y({ a: { b: 1 } }, { indent: 4 })).toBe('a:\n    b: 1');
  });
});

describe('serializeToYaml — array of arrays', () => {
  it('empty inner array → - []', () => expect(y([[]])).toBe('- []'));
  it('non-empty inner array', () => expect(y([[1, 2]])).toBe('-\n  - 1\n  - 2'));
});

describe('serializeToYaml — array-of-objects edge cases', () => {
  it('empty object item → - {}', () => expect(y([{}])).toBe('- {}'));
  it('object item with nested empty array value', () => {
    expect(y([{ x: [] }])).toBe('- x: []');
  });
  it('object item with nested empty object value', () => {
    expect(y([{ x: {} }])).toBe('- x: {}');
  });
  it('object item with nested non-empty object value', () => {
    expect(y([{ meta: { active: true } }])).toBe('- meta:\n  active: true');
  });
  it('object item with multi-line string value', () => {
    expect(y([{ note: 'line1\nline2' }])).toContain('|-');
  });
  it('multi-line string as bare array item', () => {
    expect(y(['line1\nline2'])).toContain('- |-');
  });
});
