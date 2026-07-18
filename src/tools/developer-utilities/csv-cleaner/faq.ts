import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'csv-cleaner-faq-1',
    question: 'How do I remove empty rows from a CSV?',
    answer:
      'Paste the CSV into the input pane. Any row where every cell is blank is removed automatically, which clears the separator rows that exporters and reporting tools insert. The same pass also trims whitespace, drops trailing-comma columns, and squares ragged rows, so removing empty rows is one part of a full cleanup rather than a separate step.',
  },
  {
    id: 'csv-cleaner-faq-2',
    question: 'Why does my CSV import fail with a column count error?',
    answer:
      'A column-count error means one row has more or fewer fields than the header. The usual causes are invisible: a trailing comma that adds a phantom column, or a short row missing a value. Importers that validate column counts reject the whole file over a single ragged row. Squaring every row to the header width fixes it, so retry the import with the cleaned output.',
  },
  {
    id: 'csv-cleaner-faq-3',
    question: 'Does cleaning delete any data?',
    answer:
      'No non-empty cell is ever deleted. Rows are only removed when every cell in them is empty, and rows longer than the header keep their extra cells rather than being truncated. Trimming only strips whitespace at the edges of a value, never characters inside it.',
  },
  {
    id: 'csv-cleaner-faq-4',
    question: 'How are quoted cells handled?',
    answer:
      'The file is parsed as real CSV first, so quotes, embedded commas, and multi-line cells are understood rather than mangled. On output, quoting is rebuilt to the RFC 4180 minimum: a cell is quoted only if it contains a comma, a quote, or a line break, and whitespace inside quoted values is trimmed the same as everywhere else.',
  },
  {
    id: 'csv-cleaner-faq-5',
    question: 'What does the summary line tell me?',
    answer:
      'It is a receipt of what changed: how many empty rows were removed, how many cells were trimmed, how many ragged rows were squared to the header width, and how many data rows remain. If the summary reports nothing removed or trimmed, your file was already clean.',
  },
  {
    id: 'csv-cleaner-faq-6',
    question: 'What makes a CSV file invalid?',
    answer:
      'A CSV is invalid when its rows disagree about how many columns exist: a trailing comma declares a phantom column, a short row is missing a value, or a blank separator row carries no columns at all. For example, a header ending in name,email, announces three columns while every data row holds two, so a strict importer rejects the whole file. Cleaning squares each row to the header width, drops the phantom columns, and removes the blank rows so every row agrees.',
  },
  {
    id: 'csv-cleaner-faq-7',
    question: 'Why does my CSV open fine in Excel but fail to import?',
    answer:
      'Because spreadsheets are forgiving and importers are strict. Excel pads short rows, ignores trailing commas, and hides stray whitespace, so a structurally broken file still renders as a tidy grid. A database importer reads the same file literally and rejects it over an inconsistent column count. For example, a header with a trailing comma declares four columns while the data rows carry three: Excel shows nothing wrong, yet the import fails on every row. Cleaning squares the shape so both agree.',
  },
  {
    id: 'csv-cleaner-faq-8',
    question: 'Should I clean a CSV by hand in Excel or use an automated cleaner?',
    answer:
      'Use an automated csv normalizer when the job is repairing format, because opening and re-saving a CSV in Excel or Google Sheets rewrites values you never touched. For example, a spreadsheet save can strip the leading zeros from a ZIP code, rewrite dates, or switch the delimiter, so fixing one blank row creates three invisible changes. This pass only removes empty rows, trims edge whitespace, and squares ragged lines, leaving every real value byte-for-byte identical. Reserve the spreadsheet for editing data.',
  },
  {
    id: 'csv-cleaner-faq-9',
    question: 'What is the difference between cleaning a CSV and converting it?',
    answer:
      'Cleaning keeps the file as CSV and repairs its shape in place; converting changes the format entirely. This tool cleans: it removes blank rows, trims whitespace, drops trailing-comma columns, and squares ragged rows, and the output is a clean CSV file. When you need a different format, clean first, then hand the result to the CSV to JSON converter or the CSV to TSV tool, because a converter inherits every blank row and ragged line you leave in its input.',
  },
  {
    id: 'csv-cleaner-faq-10',
    question: 'Why did my lookups stop matching after a CSV export?',
    answer:
      'Whitespace padding added during the export is the cause: "ACME " with a trailing space no longer equals "ACME", so joins, VLOOKUPs, and dictionary keys miss silently even though both files look identical on screen. Run the file through the cleaner and read the trimmed-cells count in the summary. For example, a summary reporting 240 cells trimmed explains exactly why a join that matched last week now returns nothing. Trimming strips only edge whitespace, never characters inside a value.',
  },
  {
    id: 'csv-cleaner-faq-11',
    question: 'Is my file uploaded anywhere?',
    answer:
      'No. Cleaning runs entirely in your browser; nothing you paste is sent to a server, stored, or shared. Exports full of customer or financial data never leave your machine, and the page keeps working offline once loaded.',
  },
];
