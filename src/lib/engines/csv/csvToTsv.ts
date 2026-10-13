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
    // A reduce, not Math.max(...spread): a 10 MB file can have more rows than the engine allows
    // as call arguments, and the spread then throws a RangeError.
    const cols = matrix.reduce((m, r) => (r.length > m ? r.length : m), 0);
    const dataRows = Math.max(0, matrix.length - 1);
    return {
      ok: true,
      output,
      summary: `${dataRows} data ${dataRows === 1 ? 'row' : 'rows'} · ${cols} ${cols === 1 ? 'column' : 'columns'}`,
    };
  },
};
