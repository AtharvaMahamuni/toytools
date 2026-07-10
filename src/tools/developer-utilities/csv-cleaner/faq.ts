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
    question: 'Is my file uploaded anywhere?',
    answer:
      'No. Cleaning runs entirely in your browser; nothing you paste is sent to a server, stored, or shared. Exports full of customer or financial data never leave your machine, and the page keeps working offline once loaded.',
  },
];
