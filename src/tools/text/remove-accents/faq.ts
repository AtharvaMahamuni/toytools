import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'remove-accents-faq-1',
    question: 'What does removing accents do?',
    answer:
      'It strips the diacritical marks from letters while keeping the base letter, so "café" becomes "cafe" and "naïve" becomes "naive". Case, spacing, and punctuation are all left exactly as they were.',
  },
  {
    id: 'remove-accents-faq-2',
    question: 'How does it work under the hood?',
    answer:
      'The text is normalised so each accented letter is split into a base letter plus a separate combining mark, then the combining marks are removed. This keeps the underlying letter intact rather than deleting the whole character.',
  },
  {
    id: 'remove-accents-faq-3',
    question: 'Does it change letters like the German ß or the Polish ł?',
    answer:
      'Letters that are not formed from a base letter plus a combining accent are left unchanged, because there is no diacritic to strip. To map those to ASCII you would need an explicit transliteration step, which this tool does not perform.',
  },
  {
    id: 'remove-accents-faq-4',
    question: 'When would I need plain ASCII text?',
    answer:
      'Legacy databases, file names, usernames, and some import formats only accept unaccented ASCII. Removing accents is a quick way to make accented text compatible without retyping it.',
  },
];
