// CSV → TSV. Quote-aware delimiter conversion via the shared CSV core: quoted fields,
// embedded commas/newlines, and escaped quotes survive the trip (the failure mode of
// doing this with find-and-replace or a spreadsheet save-as).

import type { CsvTool } from './types';
import { csvToMatrix, escapeCell } from '@lib/csv/csv';

export const csvToTsv: CsvTool = {
  id: 'csv-to-tsv',
  family: 'convert',
  inputs: 1,

  execute(input) {
    const matrix = csvToMatrix(input, { keepEmptyRows: true });
    if (matrix.length === 0) {
      return { ok: false, output: '', error: 'Nothing to convert' };
    }
    const output = matrix
      .map(row => row.map(cell => escapeCell(cell, '\t')).join('\t'))
      .join('\n');
    const cols = Math.max(...matrix.map(r => r.length));
    const dataRows = Math.max(0, matrix.length - 1);
    return {
      ok: true,
      output,
      summary: `${dataRows} data ${dataRows === 1 ? 'row' : 'rows'} · ${cols} ${cols === 1 ? 'column' : 'columns'}`,
    };
  },
};
