// Phase C batch C2: big integers survive the converters, CSV repeated columns are all kept.
import { describe, it, expect } from 'vitest';
import { runStructuredData } from './registry';
import { parseJsonLossless } from './losslessJson';
import { LosslessInt, stringifyLossless } from '@lib/json/losslessInt';
import { uniqueHeaders } from '@lib/csv/csv';

const run = async (id: string, input: string) => {
  const r = await runStructuredData(id, input);
  expect(r.ok, r.error).toBe(true);
  return r.output;
};

describe('big integers stay exact (item 7)', () => {
  it('parseJsonLossless keeps unsafe integers and leaves the rest alone', () => {
    const v = parseJsonLossless('{"a":9007199254740993,"b":[-12345678901234567890,1.5,2],"s":"12345678901234567890"}') as Record<string, unknown>;
    expect(v.a).toBeInstanceOf(LosslessInt);
    expect(String(v.a)).toBe('9007199254740993');
    expect(stringifyLossless(v)).toBe('{"a":9007199254740993,"b":[-12345678901234567890,1.5,2],"s":"12345678901234567890"}');
    expect(parseJsonLossless('{"a":1}')).toEqual({ a: 1 });
    expect(() => parseJsonLossless('{"a":')).toThrow(SyntaxError);
  });

  it('JSON to CSV', async () => {
    const out = await run('json-to-csv', '[{"id":9007199254740993,"n":{"big":12345678901234567890}}]');
    expect(out).toBe('id,n\n9007199254740993,"{""big"":12345678901234567890}"');
  });

  it('JSON to YAML', async () => {
    const out = await run('json-to-yaml', '{"id":9007199254740993,"list":[12345678901234567890,1]}');
    expect(out).toContain('id: 9007199254740993');
    expect(out).toContain('12345678901234567890');
    expect(out).not.toContain('12345678901234567000');
  });

  it('CSV to JSON', async () => {
    const out = await run('csv-to-json', 'id,big,small\n9007199254740993,12345678901234567890,42');
    expect(JSON.parse(out.replace(/(\d{16,})/g, '"$1"'))).toEqual([{ id: '9007199254740993', big: '12345678901234567890', small: 42 }]);
    expect(out).toContain('"id": 9007199254740993');
    expect(out).toContain('"big": 12345678901234567890');
  });

  it('YAML to JSON', async () => {
    const out = await run('yaml-to-json', 'id: 9007199254740993\nbig: -12345678901234567890\nsmall: 7\nhex: 0x1F');
    expect(out).toBe('{\n  "id": 9007199254740993,\n  "big": -12345678901234567890,\n  "small": 7,\n  "hex": 31\n}');
  });
});

describe('CSV to JSON keeps repeated columns (item 9)', () => {
  it('renames repeats as x, x_2, x_3', async () => {
    const out = JSON.parse(await run('csv-to-json', 'x,y,x,x\n1,2,3,4'));
    expect(out).toEqual([{ x: 1, y: 2, x_2: 3, x_3: 4 }]);
  });

  it('skips a name the file already uses', () => {
    expect(uniqueHeaders(['x', 'x_2', 'x'])).toEqual(['x', 'x_2', 'x_3']);
    expect(uniqueHeaders(['a', 'b'])).toEqual(['a', 'b']);
  });
});

import { vi } from 'vitest';

describe('a lazy chunk that fails to load (PR 2 item 5b)', () => {
  it('becomes a clear result error', async () => {
    vi.resetModules();
    vi.doMock('./jsonToCsv', () => { throw new Error('chunk 404'); });
    const { runStructuredData: run2 } = await import('./registry');
    const r = await run2('json-to-csv', '[{"a":1}]');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/could not finish loading/);
    vi.doUnmock('./jsonToCsv');
  });
});
