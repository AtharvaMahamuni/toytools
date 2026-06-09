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
