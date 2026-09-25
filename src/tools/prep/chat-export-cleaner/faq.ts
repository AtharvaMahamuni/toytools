import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cc-faq-1',
    question: 'What does Chat Export Cleaner remove?',
    answer:
      'With the default options it removes leading timestamps, speaker labels such as User or Assistant, empty code fences, fullwidth citation chips like 【1†source】, and extra blank lines. You can turn any of those off.',
  },
  {
    id: 'cc-faq-2',
    question: 'Will it keep only my messages or only the model replies?',
    answer:
      'Yes. Choose User messages or Assistant messages. The page says that the other turns are dropped. If the paste has no speaker labels, the filter leaves the text in place and says so.',
  },
  {
    id: 'cc-faq-3',
    question: 'Does it understand every chat export format?',
    answer:
      'No. It looks for a speaker name it knows, a leading time in brackets, a fullwidth citation chip, and fenced code. A transcript that uses none of those is returned with whitespace tidied, not guessed at.',
  },
  {
    id: 'cc-faq-4',
    question: 'Does Chat Export Cleaner use AI?',
    answer:
      'No. It applies the rules on the page. It does not call a model, and it does not rewrite the sentences.',
  },
  {
    id: 'cc-faq-5',
    question: 'Is the transcript uploaded?',
    answer:
      'No. Cleaning runs in your browser. Runs entirely on your device. Nothing is uploaded. Reloading the page clears the text.',
  },
];
