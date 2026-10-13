// Phase C PR 2 item 5e: csv-to-tsv counts columns without a spread, so a huge file cannot throw.
import { describe, it, expect } from 'vitest';
import { csvToTsv } from './csvToTsv';

describe('csv-to-tsv on many rows (item 5e)', () => {
  it('handles 300,000 rows', () => {
    const input = 'a,b\n' + '1,2\n'.repeat(300_000) + '1,2,3';
    const r = csvToTsv.execute(input) as { ok: boolean; summary?: string };
    expect(r.ok).toBe(true);
    expect(r.summary).toBe('300001 data rows · 3 columns');
  });
});
