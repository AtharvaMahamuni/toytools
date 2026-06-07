import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rdl-faq-1',
    question: 'How are duplicate lines detected?',
    answer:
      'Two lines are duplicates when they match exactly, character for character. The first time a line appears it is kept; any later identical line is removed. The original order of the surviving lines is preserved.',
  },
  {
    id: 'rdl-faq-2',
    question: 'Does it only remove lines that are next to each other?',
    answer:
      'No. Duplicates are removed across the whole text, not just consecutive ones. A line near the bottom that matches a line near the top is still removed.',
  },
  {
    id: 'rdl-faq-3',
    question: 'Is the comparison case-sensitive?',
    answer:
      'Yes. "Apple" and "apple" are treated as different lines. If you want them to match, convert your text to lowercase first, then remove duplicates.',
  },
  {
    id: 'rdl-faq-4',
    question: 'Do leading or trailing spaces affect matching?',
    answer:
      'Yes. "  apple" and "apple" differ because of the spaces. Run Trim Text first if you want lines that differ only in surrounding whitespace to be treated as duplicates.',
  },
];
