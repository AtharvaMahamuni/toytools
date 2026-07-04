import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'csv-cleaner-faq-1',
    question: 'What exactly does the CSV cleaner fix?',
    answer:
      'Four things in one pass: fully-empty rows are removed, whitespace around cell values is trimmed, trailing commas that create phantom empty columns are dropped, and every row is squared to the header row’s column count, padding short rows with empty cells. Quoting is also normalized, so cells are quoted only where the CSV format requires it.',
  },
  {
    id: 'csv-cleaner-faq-2',
    question: 'Why does my CSV import keep failing?',
    answer:
      'The usual culprits are invisible: a blank line the exporter added, a row with a trailing comma so it has one column too many, or spaces padded around values so "Ada " no longer matches "Ada". Importers that validate column counts reject the whole file over a single ragged row. Cleaning normalizes all of these before you retry the import.',
  },
  {
    id: 'csv-cleaner-faq-3',
    question: 'Will cleaning delete any of my data?',
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
