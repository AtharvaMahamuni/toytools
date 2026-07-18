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
  {
    id: 'lc-faq-8',
    question: 'How do I check that a text field contains only letters?',
    answer:
      'Paste the value and compare the letter count to the total character count. When both numbers match, the field is purely alphabetic with no digits, spaces, or punctuation hiding inside it. For example, "Firstname" shows 9 letters and 9 characters, so it passes. "First Name" shows 9 letters but 10 characters, revealing the space, so it fails an alphabetic-only rule.',
  },
  {
    id: 'lc-faq-9',
    question: 'Why did my letter count drop after I deleted the numbers?',
    answer:
      'Deleting digits alone never changes the letter count, because this tool counts only alphabetic characters and never included the numbers to begin with. If your total fell, you removed letters at the same time. For example, "abc123" and "abc" both report 3 letters, but trimming to "ab" drops the total to 2. Check that you deleted only the 0 through 9 characters and left every alphabetic character in place.',
  },
  {
    id: 'lc-faq-10',
    question: 'Why do accented letters count the same as regular letters?',
    answer:
      'Accented letters each count as one letter, the same as any A through Z character, because the tool matches Unicode\'s letter category rather than plain ASCII. A standalone combining accent mark is not a letter, so it never adds to the total. For example, "café" reports 4 letters whether the é is a single character or an e followed by a separate accent mark, even though its character count changes.',
  },
];
