import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'lc-faq-1',
    question: 'How do I convert text to lowercase?',
    answer:
      'Paste or type your text and the lowercase version appears instantly. Every capital letter becomes its small equivalent: "HELLO World" becomes "hello world". Click Copy to reuse the result.',
  },
  {
    id: 'lc-faq-2',
    question: 'Where is lowercase text required?',
    answer:
      'Lowercase is the convention for email addresses, URL slugs, hashtags, and many code identifiers (such as Python module names). Normalising input to lowercase also makes text comparisons reliable, since "Email@x.com" and "email@x.com" should usually be treated as the same address.',
  },
  {
    id: 'lc-faq-3',
    question: 'Does it change numbers or symbols?',
    answer:
      'No. Only letters are affected. Digits, punctuation, and symbols are preserved exactly, so "ID-2024!" becomes "id-2024!".',
  },
  {
    id: 'lc-faq-4',
    question: 'Does the tool work offline?',
    answer:
      'Yes. After the page loads once, the conversion runs entirely in your browser and needs no internet connection. Your text never leaves your device.',
  },
];
