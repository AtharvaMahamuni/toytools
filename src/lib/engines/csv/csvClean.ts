// CSV Cleaner. Fixes the mess that breaks imports: blank rows, stray whitespace inside
// cells, trailing commas (phantom empty columns), and ragged row lengths. Re-serializes
// through the shared CSV core, which also normalizes quoting to the RFC 4180 minimum.

import type { CsvTool } from './types';
import { csvToMatrix, escapeCell } from '@lib/csv/csv';

// Drop trailing empty cells (the artifact of trailing commas).
function trimRowEnd(row: string[]): string[] {
  let end = row.length;
  while (end > 0 && row[end - 1] === '') end--;
  return row.slice(0, end);
}

export const csvClean: CsvTool = {
  id: 'csv-clean',
  family: 'clean',
  inputs: 1,

  execute(input) {
    const raw = csvToMatrix(input, { keepEmptyRows: true });
    if (raw.length === 0) {
      return { ok: false, output: '', error: 'Nothing to clean' };
    }

    let emptyRows = 0;
    let trimmedCells = 0;
    const cleaned: string[][] = [];
    for (const row of raw) {
      if (row.every(c => c.trim() === '')) { emptyRows++; continue; }
      cleaned.push(row.map(cell => {
        const t = cell.trim();
        if (t !== cell) trimmedCells++;
        return t;
      }));
    }
    if (cleaned.length === 0) {
      return { ok: false, output: '', error: 'Every row is empty' };
    }

    // Column count comes from the header row after trailing-comma cleanup; every row is
    // then squared to it (short rows padded, phantom trailing cells dropped).
    const width = Math.max(1, trimRowEnd(cleaned[0]).length);
    let raggedRows = 0;
    const squared = cleaned.map((row, i) => {
      const t = trimRowEnd(row);
      if (i > 0 && t.length !== width) raggedRows++;
      const out = t.slice(0, Math.max(width, t.length));
      // Keep genuine overflow cells (data beyond the header) rather than deleting data:
      // only pad, never truncate non-empty cells.
      while (out.length < width) out.push('');
      return out;
    });

    const output = squared
      .map(row => row.map(cell => escapeCell(cell, ',')).join(','))
      .join('\n');

    const parts: string[] = [];
    if (emptyRows > 0) parts.push(`${emptyRows} empty ${emptyRows === 1 ? 'row' : 'rows'} removed`);
    if (trimmedCells > 0) parts.push(`${trimmedCells} ${trimmedCells === 1 ? 'cell' : 'cells'} trimmed`);
    if (raggedRows > 0) parts.push(`${raggedRows} ${raggedRows === 1 ? 'row' : 'rows'} squared to ${width} columns`);
    const dataRows = squared.length - 1;
    parts.push(`${dataRows} data ${dataRows === 1 ? 'row' : 'rows'} kept`);

    return { ok: true, output, summary: parts.join(' · ') };
  },
};
