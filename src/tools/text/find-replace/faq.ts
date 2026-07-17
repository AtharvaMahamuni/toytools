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
    id: 'fr-faq-8',
    question: 'What is case-sensitive matching?',
    answer:
      'Case-sensitive matching treats uppercase and lowercase letters as different characters, so the search only matches text with the exact capitalisation you typed. For example, replacing "Email" with case sensitivity on skips "email" and "EMAIL", so differently-cased copies survive the replacement untouched. Leave the Aa toggle off, the default, when you want every casing changed. Turn it on when capitalisation carries meaning, such as renaming the variable "Count" in code without touching the word "count" in comments.',
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
    id: 'fr-faq-9',
    question: 'Does replace all change matches inside other words?',
    answer:
      'Yes. Replace all substitutes every occurrence of the find string, including where it appears inside longer words. For example, replacing "cat" with "dog" also turns "category" into "dogegory" and "concatenate" into "condogenate". Enable the \\b whole word toggle to match "cat" only when it stands alone, or add surrounding spaces to the find term. Diff the result against the original with Text Compare before pasting it back anywhere important.',
  },
  {
    id: 'fr-faq-5',
    question: 'Can I use capture groups in the replacement?',
    answer:
      'Yes, when the regex toggle is enabled. Use $1, $2, and so on in the replacement field to refer to capture groups in the pattern. For example, a pattern of (\\w+)\\s(\\w+) with replacement $2 $1 will swap two words.',
  },
  {
    id: 'fr-faq-7',
    question: 'What happens if my regex is invalid?',
    answer:
      'An error message appears below the Find field explaining what is wrong with the pattern. The source text is displayed unchanged in the result area until you correct the regex.',
  },
  {
    id: 'fr-faq-10',
    question: 'Is find and replace better than manual editing?',
    answer:
      'For three or more identical changes, find and replace beats manual editing because it applies one rule to every match and skips nothing. For example, renaming a product across a 5,000 word document takes one pass here versus dozens of error-prone hand edits. Manual editing wins when each occurrence needs individual judgment, like rewording only some sentences. Narrow a bulk replace with the whole word or case toggles when a blanket rule would touch too much.',
  },
  {
    id: 'fr-faq-6',
    question: 'Is my text uploaded to a server?',
    answer:
      'No. All processing happens entirely in your browser. Your text is never sent anywhere. This tool runs offline once loaded, so it works without an internet connection.',
  },
];
