import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'llms-faq-1',
    question: 'What does the llms.txt Generator produce?',
    answer:
      'A text file with a title, a one-line purpose, and the optional sections you filled in: tools, contact, usage, and a crawler note. Blank sections are left out.',
  },
  {
    id: 'llms-faq-2',
    question: 'Is this an official llms.txt standard?',
    answer:
      'No. The file uses the same H1, blockquote, and H2 layout ToyTools publishes, which follows the llmstxt.org convention. This page does not claim that layout is a formal standard.',
  },
  {
    id: 'llms-faq-3',
    question: 'How do I list tools?',
    answer:
      'One per line, as Name | URL. A path such as /format/ is joined to the site URL. A full https URL is kept as written.',
  },
  {
    id: 'llms-faq-4',
    question: 'Does ToyTools upload the description or call a model?',
    answer:
      'No. The file is built in your browser. Runs entirely on your device. Nothing is uploaded. It does not call an AI model. You copy or download the result yourself.',
  },
];
