import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'uc-faq-1',
    question: 'How do I convert text to uppercase?',
    answer:
      'Paste or type your text into the input box and the uppercase version appears instantly in the result panel. Every lowercase letter is replaced with its capital equivalent: for example "hello world" becomes "HELLO WORLD". Then click Copy to use it anywhere.',
  },
  {
    id: 'uc-faq-2',
    question: 'Does converting to uppercase change numbers or punctuation?',
    answer:
      'No. Only alphabetic letters change case. Numbers, spaces, punctuation, and symbols stay exactly as they are. Converting "order #42 ready!" to uppercase gives "ORDER #42 READY!".',
  },
  {
    id: 'uc-faq-3',
    question: 'When should I use all-uppercase text?',
    answer:
      'Uppercase is appropriate for acronyms (HTML, NASA), constants in code (MAX_SIZE), short labels, and occasional emphasis. Avoid using it for long passages of body text: all-caps is harder to read at length and is often read as shouting.',
  },
  {
    id: 'uc-faq-4',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. The conversion runs entirely in your browser using JavaScript. Your text never leaves your device: there is no server, no account, and no upload.',
  },
];
