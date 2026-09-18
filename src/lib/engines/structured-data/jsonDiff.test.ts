import { describe, expect, it } from 'vitest';
import { diffJson, VALUE_MATCH_NOTE } from './jsonDiff';

function parseError(raw: string): string {
  try {
    JSON.parse(raw);
    return '';
  } catch (err) {
    return err instanceof Error ? err.message : '';
  }
}

describe('diffJson empty and invalid', () => {
  it('stays quiet when both sides are blank', () => {
    expect(diffJson('', '   \n\t')).toEqual({
      status: 'empty',
      summary: '',
      craftNote: '',
      lines: [],
      errors: [],
    });
  });

  it('names the side and the parse error, and does not invent a diff', () => {
    const left = diffJson('{bad}', '{"a":1}');
    expect(left.status).toBe('invalid');
    expect(left.lines).toEqual([]);
    expect(left.craftNote).toBe('');
    expect(left.summary).toBe(`Left is not valid JSON: ${parseError('{bad}')}`);
    expect(left.errors).toEqual([{ side: 'left', message: parseError('{bad}') }]);

    const right = diffJson('1', '');
    expect(right.status).toBe('invalid');
    expect(right.lines).toEqual([]);
    expect(right.summary.startsWith('Right is not valid JSON:')).toBe(true);
    expect(right.summary).toContain(parseError(''));
  });

  it('reports both sides when both fail', () => {
    const result = diffJson('{', '[');
    expect(result.status).toBe('invalid');
    expect(result.errors.map((e) => e.side)).toEqual(['left', 'right']);
    expect(result.lines).toEqual([]);
    expect(result.summary).toContain('Left is not valid JSON:');
    expect(result.summary).toContain('Right is not valid JSON:');
  });
});

describe('diffJson values', () => {
  it('treats 1 and 1.0 as equal, and a string 1 as a change', () => {
    const same = diffJson('1', '1.0');
    expect(same.status).toBe('match');
    expect(same.lines).toEqual([]);
    expect(same.craftNote).toBe(VALUE_MATCH_NOTE);

    const strict = diffJson('1', '"1"');
    expect(strict.status).toBe('diff');
    expect(strict.craftNote).toBe('');
    expect(strict.lines).toEqual(['changed $: 1 → "1"']);
  });

  it('compares booleans and null strictly', () => {
    expect(diffJson('true', 'true').status).toBe('match');
    expect(diffJson('null', 'null').craftNote).toBe('');
    expect(diffJson('true', 'false').lines).toEqual(['changed $: true → false']);
    expect(diffJson('null', '0').lines).toEqual(['changed $: null → 0']);
    expect(diffJson('false', 'null').lines).toEqual(['changed $: false → null']);
  });

  it('treats -0 and 0 as the same number', () => {
    const result = diffJson('-0', '0');
    expect(result.status).toBe('match');
    expect(result.craftNote).toBe(VALUE_MATCH_NOTE);
  });

  it('ignores object key order and reports added, removed, and changed keys', () => {
    const left = '{"b":1,"a":{"z":true,"y":"old"}}';
    const right = '{"a":{"y":"new","z":true},"c":null}';
    const result = diffJson(left, right);
    expect(result.status).toBe('diff');
    expect(result.craftNote).toBe('');
    expect(result.lines).toEqual([
      'removed b: 1',
      'changed a.y: "old" → "new"',
      'added c: null',
    ]);
    expect(result.summary).toBe('1 added, 1 removed, 1 changed');
  });

  it('says the values match when only key order, spacing, or formatting differs', () => {
    const result = diffJson('{"b":1,"a":2}', '{\n  "a": 2,\n  "b": 1\n}');
    expect(result.status).toBe('match');
    expect(result.lines).toEqual([]);
    expect(result.summary).toBe(VALUE_MATCH_NOTE);
    expect(result.craftNote).toBe(VALUE_MATCH_NOTE);
  });

  it('stays silent when the text is already the same', () => {
    const result = diffJson('{"a":1}', '{"a":1}');
    expect(result).toMatchObject({ status: 'match', summary: 'No differences.', craftNote: '', lines: [] });
  });

  it('counts array order as a change and recurses into objects', () => {
    const result = diffJson(
      '{"tags":["a","b"],"n":[1]}',
      '{"tags":["b","a"],"n":[1,2]}',
    );
    expect(result.lines).toEqual([
      'changed tags[0]: "a" → "b"',
      'changed tags[1]: "b" → "a"',
      'added n[1]: 2',
    ]);
  });

  it('removes extra array indexes instead of walking them', () => {
    expect(diffJson('[1,2,{"k":true}]', '[1]').lines).toEqual([
      'removed [1]: 2',
      'removed [2]: {"k":true}',
    ]);
  });

  it('reports a type change at that path, not a fake deep diff', () => {
    expect(diffJson('{"a":{"b":1}}', '{"a":[1]}').lines).toEqual([
      'changed a: {"b":1} → [1]',
    ]);
    expect(diffJson('[]', '{}').lines).toEqual(['changed $: [] → {}']);
  });

  it('uses bracket paths for keys that are not identifiers', () => {
    const left = '{"a.b":1,"foo-bar":2,"0":3,"":4,"quote\\"":5}';
    const right = '{"a.b":9,"foo-bar":2,"0":3,"":4,"quote\\"":5}';
    expect(diffJson(left, right).lines).toEqual(['changed ["a.b"]: 1 → 9']);
  });

  it('treats unicode escapes as the parsed string', () => {
    expect(diffJson('"A"', '"\\u0041"').status).toBe('match');
    expect(diffJson('"A"', '"\\u0041"').craftNote).toBe(VALUE_MATCH_NOTE);
  });

  it('truncates a long value and caps the path list', () => {
    const long = 'x'.repeat(80);
    const clipped = diffJson(JSON.stringify(long), '"y"');
    expect(clipped.lines[0]?.startsWith('changed $: "')).toBe(true);
    expect(clipped.lines[0]?.endsWith('... → "y"')).toBe(true);
    expect((clipped.lines[0] ?? '').length).toBeLessThan(120);

    const left: Record<string, number> = {};
    const right: Record<string, number> = {};
    for (let i = 0; i < 45; i++) {
      left[`k${i}`] = 1;
      right[`k${i}`] = 2;
    }
    const many = diffJson(JSON.stringify(left), JSON.stringify(right));
    expect(many.lines).toHaveLength(40);
    expect(many.summary).toBe('45 changed. Showing 40 of 45 paths');
    expect(many.craftNote).toBe('');
  });
});
