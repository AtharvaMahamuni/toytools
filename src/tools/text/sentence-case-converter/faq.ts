import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sc-faq-1',
    question: 'What is sentence case?',
    answer:
      'Sentence case capitalizes only the first letter of each sentence, just like ordinary writing: "the quick brown fox. it runs." becomes "The quick brown fox. It runs." It is the default format for body text, UI labels, and button text because it mirrors natural speech.',
  },
  {
    id: 'sc-faq-2',
    question: 'How does the tool know where a sentence starts?',
    answer:
      'It capitalizes the very first letter of the text and the first letter after sentence-ending punctuation (a period, question mark, or exclamation mark followed by a space). This handles the vast majority of everyday text reliably.',
  },
  {
    id: 'sc-faq-3',
    question: 'Will it capitalize proper nouns like names?',
    answer:
      'No. Automatic sentence case cannot tell that "london" is a place or "sarah" is a name, so it only fixes sentence starts. After converting, give proper nouns a quick manual pass if your text contains them.',
  },
  {
    id: 'sc-faq-4',
    question: 'Is sentence case better than Title Case for most writing?',
    answer:
      'For body text, UI copy, and subheadings, yes, sentence case reads more naturally and is easier on the eye. Reserve Title Case for short headings and titles.',
  },
];
