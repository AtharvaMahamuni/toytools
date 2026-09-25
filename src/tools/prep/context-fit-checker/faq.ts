import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cf-faq-1',
    question: 'Is the token count exact?',
    answer:
      'No. Estimated tokens are the number of characters divided by 4, rounded up. A model tokenizer can split the same text differently. The page says estimate on purpose.',
  },
  {
    id: 'cf-faq-2',
    question: 'Where do the context windows come from?',
    answer:
      'Each model row names the vendor page it was copied from, and the date that page was read. ToyTools does not guess a window that is not on that list. Windows change, so the date matters.',
  },
  {
    id: 'cf-faq-3',
    question: 'Does this pick a model for me?',
    answer:
      'No. You choose a model. The page only compares the estimate with that model\'s published window. It does not rank models or call one.',
  },
  {
    id: 'cf-faq-4',
    question: 'Is my text uploaded?',
    answer:
      'No. The estimate runs in your browser. Runs entirely on your device. Nothing is uploaded. Reloading the page clears the text.',
  },
];
