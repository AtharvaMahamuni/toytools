import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'trm-faq-1',
    question: 'What does trimming text do?',
    answer:
      'It removes whitespace — spaces and tabs — from the start and end of every line, while leaving the words and the spacing between them untouched. "  hello world  " becomes "hello world".',
  },
  {
    id: 'trm-faq-2',
    question: 'Why are trailing spaces a problem?',
    answer:
      'They are invisible but real. A trailing space can break an exact text match, fail a password or coupon-code check, create misaligned data in a spreadsheet column, or trigger linter warnings in code.',
  },
  {
    id: 'trm-faq-3',
    question: 'Does it collapse double spaces in the middle of a line?',
    answer:
      'No. Trimming only affects the start and end of each line. To collapse repeated spaces inside the text, use Remove Extra Spaces.',
  },
  {
    id: 'trm-faq-4',
    question: 'Does it remove blank lines?',
    answer:
      'A line that contained only spaces becomes empty after trimming, but it is not deleted. If you want those empty lines removed as well, follow up with Remove Blank Lines.',
  },
];
