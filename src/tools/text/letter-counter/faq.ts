import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'lc-faq-1',
    question: 'What counts as a letter?',
    answer:
      'A letter is any alphabetic character: A through Z and a through z in English, plus accented and Unicode letters from other scripts (é, ñ, ü, Arabic, Chinese characters, etc.). Digits (0–9), spaces, punctuation, and symbols are not letters. "Hello, World!" contains 10 letters.',
  },
  {
    id: 'lc-faq-2',
    question: 'What is the difference between letters and characters?',
    answer:
      'Characters include everything: letters, digits, spaces, punctuation, and special symbols. Letters are a subset of characters that are strictly alphabetic. For "Hello, World!" the character count is 13 (with space) but the letter count is 10, because the comma, space, and exclamation mark are not letters.',
  },
  {
    id: 'lc-faq-3',
    question: 'Do numbers count as letters?',
    answer:
      'No. Digits (0–9) are not letters. They are numeric characters. "abc123" has 3 letters and 6 total characters. If you need a count that includes digits as well as letters, use the Character Counter instead.',
  },
  {
    id: 'lc-faq-4',
    question: 'Do spaces count as letters?',
    answer:
      'No. Spaces are whitespace characters, not letters. This tool counts only alphabetic characters, so spaces are excluded from the letter count. Use the Space Counter to count spaces specifically.',
  },
  {
    id: 'lc-faq-5',
    question: 'Do punctuation marks count as letters?',
    answer:
      'No. Commas, periods, exclamation marks, hyphens, apostrophes, and other punctuation are not letters and are excluded from the letter count. Only alphabetic characters are counted.',
  },
  {
    id: 'lc-faq-6',
    question: 'Does this count letters in non-English text?',
    answer:
      'Yes. This tool uses Unicode-aware matching and correctly counts letters from any script, including accented Latin characters (café), Arabic, Chinese, Japanese, Korean, Cyrillic, Greek, and more. Any character classified as a Unicode letter is counted.',
  },
  {
    id: 'lc-faq-7',
    question: 'When would I need to count letters instead of characters?',
    answer:
      'Letter counting is useful when you need to measure only the alphabetic content of text: checking a password policy that requires a minimum number of letters, analysing the alphabetic density of text, or comparing how much of a text is composed of letters versus other characters.',
  },
];
