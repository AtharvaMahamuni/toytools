import type { StructuredDataTool } from './types';
import { parseCsv } from '@lib/csv/csv';
import { stringifyLossless } from '@lib/json/losslessInt';
import { clientStr } from '@lib/i18n/client';

// Convert CSV (header row + data rows) to a pretty-printed JSON array of objects.
// Smart typing is on by default here (the widget exposes a toggle for finer control).
export const csvToJson: StructuredDataTool = {
  id: 'csv-to-json',
  family: 'json',
  execute: (input) => {
    if (!input.trim()) return { ok: true, output: '' };
    const res = parseCsv(input, { smartTypes: true });
    if (!res.ok) return { ok: false, output: '', error: res.error || clientStr('errInvalidCsv', 'Invalid CSV.') };
    if (res.headers.length === 0) {
      return { ok: false, output: '', error: clientStr('errNoHeaders', 'No header row found: the first line must contain column names.') };
    }
    if (res.rows.length === 0) {
      return { ok: false, output: '', error: clientStr('errNoRows', 'No data rows found: add at least one row beneath the header.') };
    }
    try {
      return { ok: true, output: stringifyLossless(res.rows, 2) };
    } catch (e) {
      return { ok: false, output: '', error: (e as Error).message };
    }
  },
};
