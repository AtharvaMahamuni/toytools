import { describe, it, expect } from 'vitest';
import { runStructuredData, STRUCTURED_TOOLS } from './registry';

const MESSY = '{"b":2,"a":[1,2,{"x":true}],"c":null}';

describe('runStructuredData', () => {
  it('returns a result error for an unknown id', () =>
    expect(runStructuredData('nope', '{}')).toEqual({
      ok: false,
      output: '',
      error: 'Unknown tool',
    }));
  it('resolves and runs a known tool', () =>
    expect(runStructuredData('json-minifier', '{ "a": 1 }')).toEqual({ ok: true, output: '{"a":1}' }));
  it('surfaces a tool error through the resolver', () =>
    expect(runStructuredData('json-validator', '{bad}').ok).toBe(false));
});

describe('json-formatter', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-formatter'].execute(s);
  it('pretty-prints with 2-space indent', () => {
    const r = run('{"a":1,"b":[2,3]}');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
  });
  it('returns empty output for empty input', () => expect(run('   ')).toEqual({ ok: true, output: '' }));
  it('reports an error for invalid JSON', () => {
    const r = run('{bad}');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });
  it('handles nested structures', () => expect(run(MESSY).ok).toBe(true));
});

describe('json-minifier', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-minifier'].execute(s);
  it('strips whitespace', () =>
    expect(run('{\n  "a": 1,\n  "b": 2\n}').output).toBe('{"a":1,"b":2}'));
  it('round-trips with the formatter', () => {
    const formatted = STRUCTURED_TOOLS['json-formatter'].execute(MESSY).output;
    expect(run(formatted).output).toBe(JSON.stringify(JSON.parse(MESSY)));
  });
  it('reports an error for invalid JSON', () => expect(run('[1,2,').ok).toBe(false));
  it('returns empty output for empty input', () => expect(run('   ')).toEqual({ ok: true, output: '' }));
});

describe('json-validator', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-validator'].execute(s);
  it('reports valid JSON', () => expect(run('{"a":1}')).toEqual({ ok: true, output: 'Valid JSON' }));
  it('reports invalid JSON with a message', () => {
    const r = run('{"a":}');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });
  it('treats empty input as ok with no output', () => expect(run('')).toEqual({ ok: true, output: '' }));
  it('validates arrays and primitives', () => {
    expect(run('[1,2,3]').ok).toBe(true);
    expect(run('"hello"').ok).toBe(true);
    expect(run('42').ok).toBe(true);
  });
});

describe('json-to-csv', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-to-csv'].execute(s);

  it('converts a flat array of objects to CSV', () => {
    const r = run('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name,age\nAlice,30\nBob,25');
  });

  it('returns empty output for empty input', () =>
    expect(run('   ')).toEqual({ ok: true, output: '' }));

  it('returns error for invalid JSON', () => {
    const r = run('{bad}');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('returns error for non-array JSON', () => {
    const r = run('{"users":[]}');
    expect(r.ok).toBe(false);
    expect(r.error).toBe('Input must be a JSON array.');
  });

  it('returns error for empty array', () => {
    const r = run('[]');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('wraps cells containing commas in double quotes', () => {
    const r = run('[{"note":"Hello, World"}]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('note\n"Hello, World"');
  });

  it('doubles embedded double-quotes per CSV spec', () => {
    const r = run('[{"q":"He said \\"Hi\\""}]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('q\n"He said ""Hi"""');
  });

  it('handles sparse rows — union of headers, missing cells blank', () => {
    const r = run('[{"name":"Alice","age":30},{"name":"Bob","city":"NYC"}]');
    expect(r.ok).toBe(true);
    const lines = r.output.split('\n');
    expect(lines[0]).toBe('name,age,city');
    expect(lines[1]).toBe('Alice,30,');
    expect(lines[2]).toBe('Bob,,NYC');
  });

  it('converts an array of primitives to a single value column', () => {
    const r = run('["apple","banana","orange"]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('value\napple\nbanana\norange');
  });

  it('JSON.stringifies nested objects in cells', () => {
    const r = run('[{"name":"Alice","address":{"city":"NYC"}}]');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('name,address');
    expect(r.output).toContain('Alice');
  });

  it('resolves json-to-csv through runStructuredData', () => {
    const r = runStructuredData('json-to-csv', '[{"x":1}]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('x\n1');
  });
});

describe('json-to-yaml', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-to-yaml'].execute(s);

  it('returns empty output for empty input', () =>
    expect(run('   ')).toEqual({ ok: true, output: '' }));

  it('returns error for invalid JSON', () => {
    const r = run('{bad}');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('serializes a flat object', () => {
    const r = run('{"name":"Alice","age":30}');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name: Alice\nage: 30');
  });

  it('serializes nested objects with 2-space indent', () => {
    const r = run('{"a":{"b":{"c":1}}}');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('a:\n  b:\n    c: 1');
  });

  it('serializes arrays of primitives', () => {
    const r = run('[1,2,3]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('- 1\n- 2\n- 3');
  });

  it('serializes arrays of objects', () => {
    const r = run('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('- name: Alice\n  age: 30\n- name: Bob\n  age: 25');
  });

  it('quotes strings that look like YAML reserved words', () => {
    const r = run('{"flag":"true","empty":"null"}');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('"true"');
    expect(r.output).toContain('"null"');
  });

  it('quotes strings that look numeric', () => {
    const r = run('{"zip":"10001"}');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('"10001"');
  });

  it('uses literal block scalar for multi-line strings', () => {
    const r = run('{"notes":"line one\\nline two"}');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('|-\n');
  });

  it('serializes null and booleans', () => {
    const r = run('{"x":null,"y":true,"z":false}');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('x: null\ny: true\nz: false');
  });

  it('resolves through runStructuredData', () => {
    const r = runStructuredData('json-to-yaml', '{"a":1}');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('a: 1');
  });
});

describe('yaml-to-json', () => {
  const run = (s: string) => STRUCTURED_TOOLS['yaml-to-json'].execute(s);

  it('returns empty output for empty input', () =>
    expect(run('   ')).toEqual({ ok: true, output: '' }));

  it('returns error for invalid YAML', () => {
    const r = run('key: [unclosed');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });

  it('converts a flat YAML mapping to JSON', () => {
    const r = run('name: Alice\nage: 30');
    expect(r.ok).toBe(true);
    const parsed = JSON.parse(r.output);
    expect(parsed).toEqual({ name: 'Alice', age: 30 });
  });

  it('converts a YAML list to a JSON array', () => {
    const r = run('- 1\n- 2\n- 3');
    expect(r.ok).toBe(true);
    expect(JSON.parse(r.output)).toEqual([1, 2, 3]);
  });

  it('converts nested YAML to JSON', () => {
    const r = run('a:\n  b:\n    c: 1');
    expect(r.ok).toBe(true);
    expect(JSON.parse(r.output)).toEqual({ a: { b: { c: 1 } } });
  });

  it('handles YAML booleans and null', () => {
    const r = run('flag: true\nempty: null');
    expect(r.ok).toBe(true);
    expect(JSON.parse(r.output)).toEqual({ flag: true, empty: null });
  });

  it('round-trips JSON through YAML', () => {
    const original = { name: 'Alice', tags: ['a', 'b'], meta: { active: true } };
    const yaml = runStructuredData('json-to-yaml', JSON.stringify(original));
    expect(yaml.ok).toBe(true);
    const back = run(yaml.output);
    expect(back.ok).toBe(true);
    expect(JSON.parse(back.output)).toEqual(original);
  });

  it('resolves through runStructuredData', () => {
    const r = runStructuredData('yaml-to-json', 'a: 1');
    expect(r.ok).toBe(true);
    expect(JSON.parse(r.output)).toEqual({ a: 1 });
  });
});

describe('json-tree-viewer', () => {
  const run = (s: string) => STRUCTURED_TOOLS['json-tree-viewer'].execute(s);
  it('pretty-prints valid JSON for the copy/download payload', () =>
    expect(run('{"a":1,"b":[2,3]}').output).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}'));
  it('returns empty output for empty input', () => expect(run('   ')).toEqual({ ok: true, output: '' }));
  it('reports an error for invalid JSON', () => {
    const r = run('{bad}');
    expect(r.ok).toBe(false);
    expect(r.error).toBeTruthy();
  });
});
