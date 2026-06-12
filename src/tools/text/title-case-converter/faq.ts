import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tc-faq-1',
    question: 'What is Title Case?',
    answer:
      'Title Case capitalizes the first letter of each word: "the quick brown fox" becomes "The Quick Brown Fox". It is used for headings, article titles, book titles, and film titles.',
  },
  {
    id: 'tc-faq-2',
    question: 'Which words should be capitalized in a title?',
    answer:
      'Traditional style guides capitalize nouns, verbs, adjectives, and adverbs, and keep articles (a, an, the), short prepositions (in, on, at, of), and coordinating conjunctions (and, but, or) lowercase, unless they begin the title. This tool capitalizes the first letter of every word, which is the most common convention and a reliable starting point you can fine-tune.',
  },
  {
    id: 'tc-faq-3',
    question: 'What is the difference between Title Case and sentence case?',
    answer:
      'Title Case capitalizes the first letter of each word ("The Quick Brown Fox"), while sentence case capitalizes only the first word and proper nouns ("The quick brown fox"). Title Case suits headings; sentence case suits body text and UI labels.',
  },
  {
    id: 'tc-faq-4',
    question: 'Should I use Title Case for body text?',
    answer:
      'No. Title Case is designed for short headings and titles. Using it for full paragraphs looks overly formal and is harder to read. Use sentence case for body copy.',
  },
  {
    id: 'tc-faq-5',
    question: 'Does it change my numbers or punctuation?',
    answer:
      'No. Only the first letter of each word is affected. Numbers, punctuation, and symbols are left exactly as they are.',
  },
];
