import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'csv-diff-faq-1',
    question: 'How does this CSV diff compare rows?',
    answer:
      'When the first column uniquely identifies rows on both sides, the tool compares by that key: rows present only in the original are removed, rows present only in the changed file are added, and rows with the same key but different cells are reported as changed, column by column. If the first column is not a unique key, it falls back to comparing whole rows.',
  },
  {
    id: 'csv-diff-faq-2',
    question: 'Why not just use a regular text diff on the two files?',
    answer:
      'A line diff compares files position by position, so a re-sorted export looks 100% different even when no data changed. A row-aware diff matches rows by key regardless of order, which is what you actually want when comparing two exports of the same table. It also pinpoints which column changed inside a row instead of flagging the whole line.',
  },
  {
    id: 'csv-diff-faq-3',
    question: 'Are my CSV files uploaded to a server?',
    answer:
      'No. Both files are parsed and compared entirely in your browser. Nothing is uploaded, stored, or shared, which matters because CSV exports routinely contain customer lists, financials, and other data that should not be pasted into an unknown server-side tool. The page keeps working if you go offline after loading it.',
  },
  {
    id: 'csv-diff-faq-4',
    question: 'How do I read the diff output?',
    answer:
      'The first line summarizes the counts: rows added, removed, changed, and unchanged. Below it, lines starting with + are rows that exist only in the changed file, lines starting with - exist only in the original, and lines starting with ~ are keyed rows whose cells changed, shown as column "old" → "new". Column additions and removals are listed separately by name.',
  },
  {
    id: 'csv-diff-faq-5',
    question: 'What happens if my first column has duplicate values?',
    answer:
      'The diff falls back to whole-row comparison and says so in the output. In that mode a cell edit shows up as one removed row plus one added row, because there is no reliable key to pair the old and new versions. For the best results, put a unique identifier in the first column of both files.',
  },
  {
    id: 'csv-diff-faq-6',
    question: 'Does row order matter when comparing?',
    answer:
      'Not in key mode. Two files with the same rows in a different order compare as identical, which is exactly right for database and spreadsheet exports where sort order is arbitrary. In whole-row fallback mode order is also ignored; rows are matched as a multiset.',
  },
  {
    id: 'csv-diff-faq-7',
    question: 'Can it compare files with different columns?',
    answer:
      'Yes. Columns are matched by header name, so added and removed columns are reported by name, and changed-row detection runs over the columns the two files share. Renaming a column reads as one column removed and one added.',
  },
];
