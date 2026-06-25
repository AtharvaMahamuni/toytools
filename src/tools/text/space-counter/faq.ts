import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sc-faq-1',
    question: 'What counts as a space?',
    answer:
      'This tool counts literal space characters (the character you get when you press the spacebar). Tabs, newlines, carriage returns, and other whitespace characters are not counted as spaces. "Hello World" has 1 space; "Hello  World" (two spaces between) has 2 spaces.',
  },
  {
    id: 'sc-faq-2',
    question: 'What is the difference between spaces and whitespace?',
    answer:
      'Spaces are specifically the space character (ASCII 32). Whitespace is a broader category that includes spaces, tabs (\\t), newlines (\\n), carriage returns (\\r), and other invisible formatting characters. The "Characters Without Spaces" metric on this page subtracts all whitespace (not just spaces) from the total.',
  },
  {
    id: 'sc-faq-3',
    question: 'Do tabs count as spaces?',
    answer:
      'No. Tabs and spaces are different characters. This tool counts only the literal space character. If you want to count tabs, use a text editor with find/replace or the Find & Replace tool on ToyTools.',
  },
  {
    id: 'sc-faq-4',
    question: 'Do newlines count as spaces?',
    answer:
      'No. Newlines (line breaks) are not space characters and are not counted in the space count. They are counted separately in the Line Counter.',
  },
  {
    id: 'sc-faq-5',
    question: 'Why would I need to count spaces?',
    answer:
      'Counting spaces is useful for: debugging text with unexpected whitespace, verifying formatting in code or data files, checking the ratio of spaces to other characters in text analysis, and finding double spaces that should be replaced with single spaces.',
  },
  {
    id: 'sc-faq-6',
    question: 'What is the relationship between spaces and word count?',
    answer:
      'In English prose, the number of spaces is typically close to the number of words minus one (a 5-word sentence has 4 spaces between words, plus possibly punctuation spaces). However, this pattern breaks down with multiple consecutive spaces, leading or trailing spaces, and punctuation like em-dashes that may or may not be surrounded by spaces.',
  },
];
