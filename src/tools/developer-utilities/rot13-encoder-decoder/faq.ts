import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'rot13-faq-1',
    question: 'What is ROT13?',
    answer:
      'ROT13 is a letter substitution cipher that rotates each Latin letter 13 places around the alphabet: A becomes N, B becomes O, and after Z it wraps back to A. Case is preserved, and anything that is not a Latin letter, such as digits, punctuation, and spaces, stays exactly as it is.',
  },
  {
    id: 'rot13-faq-2',
    question: 'Why are encoding and decoding the same operation?',
    answer:
      'The alphabet has 26 letters and ROT13 shifts by exactly half of that. Shifting a letter 13 places twice moves it 26 places, which lands it back where it started. That makes ROT13 its own inverse: the same pass both encodes and decodes, which is why this tool gives the same result in either direction.',
  },
  {
    id: 'rot13-faq-3',
    question: 'Is ROT13 encryption? Is it secure?',
    answer:
      'No. ROT13 has no key and a fixed, publicly known transformation, so anyone can reverse it instantly. Treat it as obfuscation: it stops text from being read at a glance, nothing more. For anything that needs real confidentiality, use actual encryption; for casual hiding of spoilers or answers, ROT13 is exactly right.',
  },
  {
    id: 'rot13-faq-4',
    question: 'What is ROT13 actually used for?',
    answer:
      'Hiding text from an accidental read while keeping it trivially recoverable. Classic uses include spoilers in forum posts and newsgroup messages, puzzle hints and geocaching clues, punchlines, and quiz answers. It also appears in programming exercises because the algorithm is a neat one-liner over character codes.',
  },
  {
    id: 'rot13-faq-5',
    question: 'What happens to numbers, punctuation, and other alphabets?',
    answer:
      'They pass through unchanged. ROT13 is defined only over the 26 Latin letters in each case. Digits keep their values, emoji and accented characters like e with an acute accent stay as they are, and scripts such as Cyrillic or Chinese are untouched. A variant called ROT47 rotates a wider ASCII range if you need symbols scrambled too.',
  },
  {
    id: 'rot13-faq-6',
    question: 'How is ROT13 related to the Caesar cipher?',
    answer:
      'ROT13 is a Caesar cipher with a shift of 13. Julius Caesar reportedly used a shift of 3 for military messages. Any shift from 1 to 25 works as a Caesar cipher, but 13 is the only one that is its own inverse in a 26-letter alphabet, which is what made it the convention on early internet forums.',
  },
  {
    id: 'rot13-faq-7',
    question: 'Is my text sent anywhere when I use this tool?',
    answer:
      'No. The rotation runs entirely in your browser with a few lines of JavaScript. Nothing you type leaves the page, nothing is stored on a server, and the tool keeps working offline once loaded.',
  },
];
