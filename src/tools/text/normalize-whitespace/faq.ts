import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'nw-faq-1',
    question: 'What does normalizing whitespace do?',
    answer:
      'It replaces every run of whitespace (spaces, tabs, and line breaks) with a single space, then trims the ends. Any mix of messy spacing collapses into one clean, single-spaced line.',
  },
  {
    id: 'nw-faq-2',
    question: 'How is this different from Remove Extra Spaces?',
    answer:
      'Remove Extra Spaces collapses runs of spaces and tabs but keeps your line breaks. Normalize Whitespace goes further: it also flattens line breaks, turning multi-line text into a single line.',
  },
  {
    id: 'nw-faq-3',
    question: 'When should I use it?',
    answer:
      'Use it to turn copy-pasted, multi-line content into one tidy line, for example before putting a value into a CSV cell, a search box, a single-line database field, or a URL parameter.',
  },
  {
    id: 'nw-faq-4',
    question: 'Will it keep my paragraphs separate?',
    answer:
      'No. Because it removes line breaks, all text becomes one line. If you need to keep paragraphs, use Remove Extra Spaces or Trim Text instead.',
  },
];
