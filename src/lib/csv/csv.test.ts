import { describe, it, expect } from 'vitest';
import { parseCsv, serializeCsv } from './csv';

describe('parseCsv — basics', () => {
  it('parses a header row and data rows', () => {
    const res = parseCsv('name,age\nAlice,30\nBob,28');
    expect(res.ok).toBe(true);
    expect(res.headers).toEqual(['name', 'age']);
    expect(res.rows).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 28 },
    ]);
  });

  it('returns empty result for blank input', () => {
    expect(parseCsv('')).toEqual({ ok: true, rows: [], headers: [] });
    expect(parseCsv('   \n  ')).toEqual({ ok: true, rows: [], headers: [] });
  });

  it('handles CRLF line endings and a trailing newline', () => {
    const res = parseCsv('a,b\r\n1,2\r\n');
    expect(res.rows).toEqual([{ a: 1, b: 2 }]);
  });

  it('fills missing trailing cells with empty string', () => {
    const res = parseCsv('a,b,c\n1,2');
    expect(res.rows).toEqual([{ a: 1, b: 2, c: '' }]);
  });
});

describe('parseCsv — quoting', () => {
  it('keeps delimiters and newlines inside quoted fields', () => {
    const res = parseCsv('name,note\n"Smith, Jr.","line1\nline2"');
    expect(res.rows).toEqual([{ name: 'Smith, Jr.', note: 'line1\nline2' }]);
  });

  it('unescapes doubled quotes', () => {
    const res = parseCsv('q\n"He said ""Hello"""');
    expect(res.rows).toEqual([{ q: 'He said "Hello"' }]);
  });
});

describe('parseCsv — smart typing', () => {
  it('coerces numbers, booleans, and null by default', () => {
    const res = parseCsv('n,b,x\n42,true,null');
    expect(res.rows[0]).toEqual({ n: 42, b: true, x: null });
  });

  it('preserves leading-zero strings (zip codes)', () => {
    const res = parseCsv('zip\n00501');
    expect(res.rows[0]).toEqual({ zip: '00501' });
  });

  it('keeps everything as strings when smartTypes is false', () => {
    const res = parseCsv('n,b\n42,true', { smartTypes: false });
    expect(res.rows[0]).toEqual({ n: '42', b: 'true' });
  });
});

describe('serializeCsv', () => {
  it('serializes rows back to CSV, escaping special characters', () => {
    const csv = serializeCsv(
      [{ name: 'Smith, Jr.', age: 30 }],
      ['name', 'age'],
    );
    expect(csv).toBe('name,age\n"Smith, Jr.",30');
  });

  it('round-trips through parse → serialize', () => {
    const src = 'name,age\nAlice,30\nBob,28';
    const { rows, headers } = parseCsv(src);
    expect(serializeCsv(rows, headers)).toBe(src);
  });

  it('returns empty string with no headers', () => {
    expect(serializeCsv([], [])).toBe('');
  });
});
