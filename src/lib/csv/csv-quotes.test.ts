// Mid-field quotes and unterminated quotes, across every tool on the shared tokenizer (Phase C C1).
import { describe, it, expect } from 'vitest';
import { csvToMatrix, parseCsv, CsvQuoteError } from './csv';
import { runCsv } from '@lib/engines/csv/registry';
import { runStructuredData } from '@lib/engines/structured-data/registry';

const MID = 'item,size\nMonitor,27" wide\nCable,"2 m, black"';
const OPEN = 'a,b\n1,"never closed\n2,3';

describe('shared tokenizer', () => {
  it('keeps a quote in the middle of a field literal', () => {
    expect(csvToMatrix(MID)).toEqual([['item', 'size'], ['Monitor', '27" wide'], ['Cable', '2 m, black']]);
    expect(csvToMatrix('f\n=HYPERLINK("http://e")')).toEqual([['f'], ['=HYPERLINK("http://e")']]);
    expect(csvToMatrix('x\nx"y,2')).toEqual([['x'], ['x"y', '2']]);
  });

  it('still reads RFC quoting, escaped quotes and embedded newlines', () => {
    expect(csvToMatrix('a\n"say ""hi"""\n"two\nlines"')).toEqual([['a'], ['say "hi"'], ['two\nlines']]);
  });

  it('throws a clear error for an unterminated quote, naming the line', () => {
    expect(() => csvToMatrix(OPEN)).toThrow(CsvQuoteError);
    expect(() => csvToMatrix(OPEN)).toThrow(/Line 2 opens a quote that is never closed/);
    const r = parseCsv(OPEN);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/never closed/);
  });
});

describe('every CSV tool', () => {
  const tools: [string, string | undefined][] = [
    ['csv-to-tsv', undefined],
    ['csv-clean', undefined],
    ['csv-diff', MID],
    ['csv-pick', 'size'],
  ];
  for (const [id, second] of tools) {
    it(`${id}: a mid-field quote stays literal, an open quote is an error`, () => {
      const ok = runCsv(id, MID, second);
      expect(ok.ok, id).toBe(true);
      if (id !== 'csv-diff') expect(ok.output).toContain('27');
      else expect(ok.output).toMatch(/No differences found. 2 data rows/);
      expect(ok.output).not.toContain('Cable,"2 m, black"\n'); // nothing swallowed
      const bad = runCsv(id, OPEN, id === 'csv-diff' ? 'a,b\n1,2' : second === 'size' ? 'a' : second);
      expect(bad.ok, id).toBe(false);
      expect(bad.error).toMatch(/never closed/);
    });
  }

  it('csv-pick keeps the literal quote and picks past it', () => {
    const r = runCsv('csv-pick', MID, 'size');
    expect(r.output).toBe('size\n"27"" wide"\n"2 m, black"');
  });

  it('csv-pick detects the delimiter past a mid-field quote', () => {
    const r = runCsv('csv-pick', 'a;b\n27" x;2', 'b');
    expect(r.output).toBe('b\n2');
  });

  it('csv-to-json: literal mid-field quote, clear error when open', () => {
    const ok = runStructuredData('csv-to-json', 'size\n27" wide') as { ok: boolean; output: string };
    expect(ok.ok).toBe(true);
    expect(JSON.parse(ok.output)).toEqual([{ size: '27" wide' }]);
    const bad = runStructuredData('csv-to-json', OPEN) as { ok: boolean; error?: string };
    expect(bad.ok).toBe(false);
    expect(bad.error).toMatch(/never closed/);
  });
});
