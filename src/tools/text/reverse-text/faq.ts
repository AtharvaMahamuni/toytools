import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'reverse-text-faq-1',
    question: 'What does reversing text do?',
    answer:
      'It flips the order of every character so the last character comes first and the first comes last. "hello" becomes "olleh". The letters themselves are unchanged; only their order is reversed.',
  },
  {
    id: 'reverse-text-faq-2',
    question: 'Does reversing text also move line breaks?',
    answer:
      'Yes. Whole-text reversal treats your input as one sequence, so line breaks move along with every other character and the last line ends up first. For example, "ab" on line one and "cd" on line two reverse to "dc" on line one and "ba" on line two. If you want each line flipped in place, reverse one line at a time.',
  },
  {
    id: 'reverse-text-faq-3',
    question: 'Does reversing handle emoji and accented letters correctly?',
    answer:
      'Yes. The tool reverses by whole characters rather than raw code units, so emoji and accented letters stay intact instead of being split into broken fragments.',
  },
  {
    id: 'reverse-text-faq-5',
    question: 'What is backwards text used for?',
    answer:
      'Backwards text is used for word puzzles, palindrome checks, hidden quiz answers, and mirror-style captions on social media. For example, a trivia sheet can print an answer as "nodnoL" so readers only see "London" when they decode it on purpose. Writers flip a phrase like "racecar" to confirm it reads the same in both directions, and social media users paste a reversed line into a bio for a mirror effect.',
  },
  {
    id: 'reverse-text-faq-6',
    question: 'How do I flip a string backwards?',
    answer:
      'Paste or type the string into the input box and the reversed version appears instantly; there is no button to press. Copy the output and you are done. For example, entering "sunset" shows "tesnus" as you type. The reversal works on whole characters, so a string like "a🚀b" flips to "b🚀a" with the emoji intact instead of turning into broken symbols.',
  },
  {
    id: 'reverse-text-faq-7',
    question: 'How do I reverse a word for a puzzle?',
    answer:
      'Type the single word into the tool and copy the flipped output into your puzzle or clue sheet. For example, "stressed" reverses to "desserts", a classic pair for wordplay clues. Reversal is easy to undo in your head, which makes it a good light disguise: solvers can read "elppa" back as "apple" without any tool, so a scavenger hunt stays playful rather than frustrating.',
  },
  {
    id: 'reverse-text-faq-4',
    question: 'Is my text uploaded anywhere?',
    answer:
      'No. Reversing runs entirely in your browser. Nothing you paste is sent to a server, so it is safe to use with private notes or drafts.',
  },
];
