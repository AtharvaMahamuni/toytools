import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'fr-faq-1',
    question: 'How does find and replace work?',
    answer:
      'You type a search pattern in the Find field and a replacement string in the Replace field, then paste your text. The tool finds every occurrence of the pattern in the text and replaces them all simultaneously, showing the result instantly. You can then copy or download the result.',
  },
  {
    id: 'fr-faq-2',
    question: 'What is the Aa (case sensitive) toggle?',
    answer:
      'When Aa is enabled, the search matches the exact capitalisation you typed: "Hello" will not match "hello". When disabled (the default), the search is case-insensitive and "Hello", "hello", and "HELLO" all match.',
  },
  {
    id: 'fr-faq-3',
    question: 'What is the .* (regex) toggle?',
    answer:
      'When .* is enabled, the Find field accepts a regular expression. For example, \\d+ matches any number, \\s+ matches one or more whitespace characters, and ^Line matches "Line" only at the start of a line. When disabled, the find term is treated as plain text and special characters like . and * are matched literally.',
  },
  {
    id: 'fr-faq-4',
    question: 'What is the \\b (whole word) toggle?',
    answer:
      'When \\b is enabled, the tool only matches the search term when it appears as a whole word, not as part of a longer word. For example, searching for "cat" with whole word enabled matches "cat" and "cat," but not "category" or "concatenate".',
  },
  {
    id: 'fr-faq-5',
    question: 'Can I use capture groups in the replacement?',
    answer:
      'Yes, when the regex toggle is enabled. Use $1, $2, and so on in the replacement field to refer to capture groups in the pattern. For example, a pattern of (\\w+)\\s(\\w+) with replacement $2 $1 will swap two words.',
  },
  {
    id: 'fr-faq-6',
    question: 'Is my text uploaded to a server?',
    answer:
      'No. All processing happens entirely in your browser. Your text is never sent anywhere. This tool runs offline once loaded, so it works without an internet connection.',
  },
  {
    id: 'fr-faq-7',
    question: 'What happens if my regex is invalid?',
    answer:
      'An error message appears below the Find field explaining what is wrong with the pattern. The source text is displayed unchanged in the result area until you correct the regex.',
  },
];
