import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'reverse-text-faq-1',
    question: 'What does reversing text do?',
    answer:
      'It flips the order of every character so the last character comes first and the first comes last. "hello" becomes "olleh". The letters themselves are unchanged; only their order is reversed.',
  },
  {
    id: 'reverse-text-faq-2',
    question: 'Does it reverse line order too?',
    answer:
      'Yes. The whole text is reversed as one sequence, so a line break near the end of your input ends up near the start of the output. If you only want the characters within each line flipped, reverse one line at a time.',
  },
  {
    id: 'reverse-text-faq-3',
    question: 'Does reversing handle emoji and accented letters correctly?',
    answer:
      'Yes. The tool reverses by whole characters rather than raw code units, so emoji and accented letters stay intact instead of being split into broken fragments.',
  },
  {
    id: 'reverse-text-faq-4',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. Reversing runs entirely in your browser. Nothing you paste is sent to a server, so it is safe to use with private notes or drafts.',
  },
];
