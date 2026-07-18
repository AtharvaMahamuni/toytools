import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'linec-faq-1',
    question: 'What counts as a line?',
    answer:
      'A line is any sequence of text followed by a line break (newline character). A file with "Hello\\nWorld" has 2 lines. A file with "Hello\\n\\nWorld" has 3 lines: "Hello", an empty line, and "World". Even the last line counts as one line, whether or not it ends with a newline.',
  },
  {
    id: 'linec-faq-2',
    question: 'What is the difference between total lines and non-empty lines?',
    answer:
      'Total lines counts every line including blank ones. Non-empty lines counts only lines that contain at least one non-whitespace character. If your text has blank lines between paragraphs, the total line count will be higher than the non-empty line count. Use non-empty lines when you want to count only lines with actual content.',
  },
  {
    id: 'linec-faq-3',
    question: 'What is the difference between lines and paragraphs?',
    answer:
      'A line is any text terminated by a single newline character. A paragraph is a block of text separated by one or more blank lines (double newlines). A paragraph may span multiple visual lines if it is long. Lines count every individual newline; paragraphs count the grouped blocks of content.',
  },
  {
    id: 'linec-faq-4',
    question: 'Does an empty document have 0 or 1 lines?',
    answer:
      'An empty document has 0 lines in this tool. The line count only activates once you have text. A document with a single word like "Hello" has 1 line. A document with "Hello\\n" (including a trailing newline) also has 1 line.',
  },
  {
    id: 'linec-faq-5',
    question: 'When would I use a line counter?',
    answer:
      'Line counters are useful for developers checking line counts in code files, writers measuring the length of poetry or structured lists, data analysts checking the number of records in CSV or log data, and anyone who needs to verify how many lines a block of text contains.',
  },
  {
    id: 'linec-faq-6',
    question: 'Do blank lines count?',
    answer:
      'Yes, blank lines are included in the total line count. A line that contains only spaces or tabs is counted as one line in the total but is excluded from the non-empty line count. Use the Non-Empty Lines metric to see only lines with actual content.',
  },
  {
    id: 'linec-faq-7',
    question: 'How do I count rows in CSV data?',
    answer:
      'Paste the CSV data and read the line count, then subtract 1 for the header row. Each record sits on its own line ending in a newline character, so the line total equals your data rows plus the header. For example, a customer export with 200 people and one header line shows 201 lines, meaning 200 data rows. Read the non-empty line count to ignore any trailing blank line at the end of the file.',
  },
  {
    id: 'linec-faq-8',
    question: 'Do wrapped lines count as separate lines?',
    answer:
      'No, wrapped lines never count as separate lines. Word wrap is a visual effect where a long line reflows to fit a narrow box, and it inserts no newline character, so the count stays the same. For example, a 300-character sentence that spills across four rows in a slim textarea still counts as 1 line. Only a real newline, added when you press Enter, raises the line total.',
  },
  {
    id: 'linec-faq-9',
    question: 'What is the difference between a hard line break and a wrapped line?',
    answer:
      'A hard line break is a real newline character added when you press Enter, and it starts a new line in the count. A wrapped line is only the editor reflowing text to fit the box width, and it adds nothing to the total. For example, typing "Name" then Enter then "Email" gives 2 lines, but one long address that wraps across three rows stays 1 line. Resizing the window changes wrapping, never the line count.',
  },
];
