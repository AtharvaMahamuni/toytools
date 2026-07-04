// CSV Engine — educational metadata (insight / technical / example) per tool.
//
// Kept separate from the execute() implementations so the pure transform logic stays
// minimal, and so the shared CsvWidget can render the reusable EducationalInsight /
// TechnicalDetails / ExampleLoader blocks at build time (JS-free, indexable). Keyed by
// the same id used in the registry (a tool config's `processorId`). Never throws.

import type { TechnicalEntry } from '../transform/types';

export interface CsvInfo {
  displayName: string;
  insight?: string | string[];
  technical?: TechnicalEntry[];
  sample?: string;
  /** Second-pane sample for two-input tools (csv-diff). */
  sampleSecond?: string;
  inputLabel?: string;
  placeholder?: string;
  /** Second-pane label/placeholder for two-input tools. */
  secondLabel?: string;
  secondPlaceholder?: string;
  /** Download extension for the output (default '.csv'). */
  downloadExt?: string;
}

const SAMPLE_CSV = 'id,name,email\n1,Ada,ada@example.com\n2,Bob,bob@example.com\n3,Carol,carol@example.com';

const CSV_INFO: Record<string, CsvInfo> = {
  'csv-to-tsv': {
    displayName: 'CSV to TSV',
    insight:
      'Converting CSV to TSV is not a find-and-replace: commas inside quoted fields must stay, and quoting has to be rebuilt around tabs. This converter parses the CSV properly first, so quoted fields, embedded commas, and escaped quotes survive the trip.',
    technical: [
      { term: 'Parsing', detail: 'RFC 4180: quoted fields, embedded delimiters and newlines, "" escapes' },
      { term: 'Output', detail: 'Tab-separated values, quoted only where a cell needs it' },
      { term: 'Fidelity', detail: 'Cell text is preserved exactly; blank lines are kept' },
    ],
    sample: 'id,name,notes\n1,Ada,"loves CSV, and TSV"\n2,Bob,"said ""hi"""',
    inputLabel: 'CSV input',
    placeholder: 'Paste CSV here',
    downloadExt: '.tsv',
  },
  'csv-clean': {
    displayName: 'CSV Cleaner',
    insight:
      'Most import failures trace back to invisible mess: blank rows, whitespace padding inside cells, trailing commas that create phantom columns, and rows with the wrong number of fields. Cleaning normalizes all of it in one pass, using the header row as the column contract.',
    technical: [
      { term: 'Removes', detail: 'Blank rows, cell-edge whitespace, trailing-comma phantom cells' },
      { term: 'Squares rows', detail: 'Pads short rows to the header width; never deletes non-empty cells' },
      { term: 'Quoting', detail: 'Re-serialized to the RFC 4180 minimum' },
    ],
    sample: 'name , email ,\nAda , ada@example.com,\n\nBob,bob@example.com\nCarol,carol@example.com,extra',
    inputLabel: 'Messy CSV input',
    placeholder: 'Paste messy CSV here',
  },
  'csv-diff': {
    displayName: 'CSV Diff',
    insight:
      'A line diff treats a reordered export as 100% changed. A CSV diff compares rows by key instead: when the first column uniquely identifies rows on both sides, it reports added, removed, and changed rows with per-column detail, no matter the order. Both files stay in your browser.',
    technical: [
      { term: 'Key mode', detail: 'First column as row key when unique on both sides' },
      { term: 'Fallback', detail: 'Whole-row comparison when keys repeat or are missing' },
      { term: 'Report', detail: '+ added, − removed, ~ changed (column: old → new)' },
      { term: 'Privacy', detail: 'Nothing is uploaded; both files are compared locally' },
    ],
    sample: SAMPLE_CSV,
    sampleSecond: 'id,name,email\n1,Ada,ada@example.com\n3,Carol,carol@new-domain.com\n4,Dave,dave@example.com',
    inputLabel: 'Original CSV',
    placeholder: 'Paste the original CSV here',
    secondLabel: 'Changed CSV',
    secondPlaceholder: 'Paste the changed CSV here',
    downloadExt: '.txt',
  },
};

/** Educational info for a CSV tool. Never throws; unknown ids return a stub. */
export function csvInfo(id: string): CsvInfo {
  return CSV_INFO[id] ?? { displayName: id };
}
