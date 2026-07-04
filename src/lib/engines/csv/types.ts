// CSV Engine — types.
//
// Every CSV tool follows: CSV text in → operate → CSV/report text out. Like the
// structured-data engine, execute() returns a result object so failures render as a status
// line instead of throwing. Unlike it, a tool may take a second input (csv-diff compares
// two files), declared via `inputs` so the shared CsvWidget renders the right panes.

export type CsvFamily = 'convert' | 'clean' | 'compare';

export interface CsvResult {
  ok: boolean;
  output: string;
  error?: string;
  /** One-line result summary for the status line, e.g. "5 rows · 3 columns". */
  summary?: string;
}

export interface CsvTool {
  /** Stable lookup id, referenced by a tool config's `processorId` (e.g. 'csv-to-tsv'). */
  id: string;
  family: CsvFamily;
  /** How many text panes the tool reads (csv-diff takes 2). */
  inputs: 1 | 2;
  /** Pure, synchronous, never throws — failures become a result error. */
  execute(input: string, second?: string): CsvResult;
}
