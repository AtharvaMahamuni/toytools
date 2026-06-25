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
];
