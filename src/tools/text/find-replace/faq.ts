import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'fr-faq-1',
    question: 'How do I find text in a document and replace it?',
    answer:
      'Paste your document, type the text to find, type the replacement, and run replace. Every match updates at once and the match count updates live. Then copy or download the result.',
  },
  {
    id: 'fr-faq-2',
    question: 'Can I find and replace with regex?',
    answer:
      'Yes. Enable the .* (regex) toggle so the Find field accepts a regular expression. For example, \\d+ matches any number, \\s+ matches one or more whitespace characters, and ^Line matches "Line" only at the start of a line. When the toggle is off, special characters like . and * are matched literally.',
  },
  {
    id: 'fr-faq-3',
    question: 'Does replace change matches inside other words?',
    answer:
      'Yes. Replace all substitutes every occurrence of the find string, including where it appears inside longer words. For example, replacing "cat" with "dog" also turns "category" into "dogegory" and "concatenate" into "condogenate". Enable the \\b whole word toggle to match "cat" only when it stands alone, or add surrounding spaces to the find term.',
  },
  {
    id: 'fr-faq-4',
    question: 'Is my text uploaded?',
    answer:
      'No. All processing happens entirely in your browser. Your text is never sent anywhere. This tool runs offline once loaded, so it works without an internet connection.',
  },
  {
    id: 'fr-faq-5',
    question: 'What is the Aa (case sensitive) toggle?',
    answer:
      'When Aa is enabled, the search matches the exact capitalisation you typed: "Hello" will not match "hello". When disabled (the default), the search is case-insensitive and "Hello", "hello", and "HELLO" all match.',
  },
  {
    id: 'fr-faq-6',
    question: 'What is the \\b (whole word) toggle?',
    answer:
      'When \\b is enabled, the tool only matches the search term when it appears as a whole word, not as part of a longer word. For example, searching for "cat" with whole word enabled matches "cat" and "cat," but not "category" or "concatenate".',
  },
  {
    id: 'fr-faq-7',
    question: 'Can I use capture groups in the replacement?',
    answer:
      'Yes, when the regex toggle is enabled. Use $1, $2, and so on in the replacement field to refer to capture groups in the pattern. For example, a pattern of (\\w+)\\s(\\w+) with replacement $2 $1 will swap two words.',
  },
  {
    id: 'fr-faq-8',
    question: 'What happens if my regex is invalid?',
    answer:
      'An error message appears below the Find field explaining what is wrong with the pattern. The source text is displayed unchanged in the result area until you correct the regex.',
  },
  {
    id: 'fr-faq-9',
    question: 'Is find and replace better than manual editing?',
    answer:
      'For three or more identical changes, find and replace beats manual editing because it applies one rule to every match and skips nothing. For example, renaming a product across a 5,000 word document takes one pass here versus dozens of error-prone hand edits. Manual editing wins when each occurrence needs individual judgment, like rewording only some sentences.',
  },
];
