import { runCsv } from '@lib/engines/csv/registry';
import { csvSerializer } from '@lib/csv/csv';
import type { AttachFn } from '../types';

export const attach: AttachFn = (TT) => {
  TT.runCsv = runCsv; // (id, input, second?) → { ok, output, error, summary }
  TT.csv = csvSerializer; // ToyTools.csv.parse(text, opts) / .serialize(rows, headers)
};
