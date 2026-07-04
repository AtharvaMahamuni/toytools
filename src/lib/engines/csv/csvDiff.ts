// CSV Diff. Row-aware comparison of two CSV files: which rows were added, removed, or
// changed, with per-column detail for changed rows. When the first column is a unique key
// on both sides it compares by key (so reordering and cell edits are tracked); otherwise
// it falls back to whole-row comparison. Runs entirely in the browser — the point of this
// tool is that neither file is uploaded anywhere.

import type { CsvTool } from './types';
import { csvToMatrix, escapeCell } from '@lib/csv/csv';

function rowText(row: string[]): string {
  return row.map(c => escapeCell(c, ',')).join(',');
}

// Map header name → cell value for one row (missing cells read as '').
function byHeader(headers: string[], row: string[]): Record<string, string> {
  const o: Record<string, string> = {};
  headers.forEach((h, i) => { o[h] = row[i] ?? ''; });
  return o;
}

function uniqueKeys(rows: string[][]): Map<string, string[]> | null {
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const key = row[0] ?? '';
    if (key === '' || map.has(key)) return null;
    map.set(key, row);
  }
  return map;
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export const csvDiff: CsvTool = {
  id: 'csv-diff',
  family: 'compare',
  inputs: 2,

  execute(input, second) {
    const a = csvToMatrix(input);
    const b = csvToMatrix(second ?? '');
    if (a.length === 0) return { ok: false, output: '', error: 'Paste the original CSV' };
    if (b.length === 0) return { ok: false, output: '', error: 'Paste the changed CSV to compare' };

    const headersA = a[0].map(h => h.trim());
    const headersB = b[0].map(h => h.trim());
    const rowsA = a.slice(1);
    const rowsB = b.slice(1);

    const colsAdded = headersB.filter(h => !headersA.includes(h));
    const colsRemoved = headersA.filter(h => !headersB.includes(h));
    const sharedCols = headersA.filter(h => headersB.includes(h));

    const lines: string[] = [];
    let added = 0, removed = 0, changed = 0, unchanged = 0;

    // Key mode needs the same first column on both sides with unique, non-empty values.
    const keysA = uniqueKeys(rowsA);
    const keysB = uniqueKeys(rowsB);
    const keyed = keysA !== null && keysB !== null && headersA[0] === headersB[0];

    if (keyed) {
      const keyName = headersA[0];
      for (const [key, rowA] of keysA!) {
        const rowB = keysB!.get(key);
        if (!rowB) { removed++; lines.push(`- ${rowText(rowA)}`); continue; }
        const cellsA = byHeader(headersA, rowA);
        const cellsB = byHeader(headersB, rowB);
        const edits = sharedCols
          .filter(col => cellsA[col] !== cellsB[col])
          .map(col => `${col} "${cellsA[col]}" → "${cellsB[col]}"`);
        if (edits.length > 0) { changed++; lines.push(`~ ${keyName} ${key}: ${edits.join('; ')}`); }
        else unchanged++;
      }
      for (const [key, rowB] of keysB!) {
        if (!keysA!.has(key)) { added++; lines.push(`+ ${rowText(rowB)}`); }
      }
    } else {
      // Whole-row multiset comparison: cell edits show up as one removed + one added row.
      const counts = new Map<string, number>();
      for (const row of rowsA) {
        const t = rowText(row);
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
      for (const row of rowsB) {
        const t = rowText(row);
        const n = counts.get(t) ?? 0;
        if (n > 0) { counts.set(t, n - 1); unchanged++; }
        else { added++; lines.push(`+ ${t}`); }
      }
      for (const [t, n] of counts) {
        for (let i = 0; i < n; i++) { removed++; lines.push(`- ${t}`); }
      }
    }

    const header: string[] = [];
    const summary = keyed
      ? `${plural(added, 'row')} added · ${removed} removed · ${changed} changed`
      : `${plural(added, 'row')} added · ${removed} removed`;
    header.push(summary + ` · ${unchanged} unchanged`);
    header.push(keyed
      ? `Compared by "${headersA[0]}" (first column) across ${plural(sharedCols.length, 'shared column')}.`
      : 'Compared by whole row (first column is not a unique key on both sides).');
    if (colsAdded.length > 0) header.push(`Columns added: ${colsAdded.join(', ')}`);
    if (colsRemoved.length > 0) header.push(`Columns removed: ${colsRemoved.join(', ')}`);

    if (lines.length === 0 && colsAdded.length === 0 && colsRemoved.length === 0) {
      return {
        ok: true,
        output: `No differences found. ${plural(unchanged, 'data row')} and ${plural(sharedCols.length, 'column')} match.`,
        summary: 'identical',
      };
    }

    return { ok: true, output: [...header, '', ...lines].join('\n'), summary };
  },
};
