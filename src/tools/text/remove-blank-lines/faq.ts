import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rbl-faq-1',
    question: 'What counts as a blank line?',
    answer:
      'Any line that is empty or contains only spaces and tabs is treated as blank and removed. Lines with visible content are always kept, in their original order.',
  },
  {
    id: 'rbl-faq-2',
    question: 'Why would I want to remove blank lines?',
    answer:
      'Pasted text, exported data, and double-spaced documents often carry empty lines between every paragraph or row. Removing them compacts lists, tidies code, and prepares data for import where blank rows would cause errors.',
  },
  {
    id: 'rbl-faq-3',
    question: 'Does it remove duplicate or extra spaces too?',
    answer:
      'No. This tool only removes whole blank lines. To collapse repeated spaces use Remove Extra Spaces, and to drop repeated lines use Remove Duplicate Lines.',
  },
  {
    id: 'rbl-faq-4',
    question: 'Will it merge my remaining lines together?',
    answer:
      'No. The lines that contain content keep their own line breaks: only the empty lines between them are deleted.',
  },
];
