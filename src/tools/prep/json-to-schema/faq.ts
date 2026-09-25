import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'jts-faq-1',
    question: 'What does JSON to JSON Schema infer?',
    answer:
      'The JSON types in the example. A string stays a string, a whole number is integer, a fraction is number, and true or false is boolean. An object lists the keys that appear. An empty array has no items schema.',
  },
  {
    id: 'jts-faq-2',
    question: 'Will a name field be marked as a person name?',
    answer:
      'No. "Atharva" only shows that the value is a string. The page does not add a format, an enum, or a description.',
  },
  {
    id: 'jts-faq-3',
    question: 'Are fields marked required?',
    answer:
      'No. One example cannot show that a field must always be present. Required is left unset.',
  },
  {
    id: 'jts-faq-4',
    question: 'Does this send my JSON to a server or a model?',
    answer:
      'No. The schema is built in your browser. Runs entirely on your device. Nothing is uploaded. It does not call an AI model.',
  },
];
