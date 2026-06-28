import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'btc-faq-1',
    question: 'How is text converted to binary?',
    answer:
      'Each character is first turned into its UTF-8 byte value, and each byte is written as eight binary digits (bits). The letter "H", for example, is byte 72, which is 01001000. The converter shows one 8-bit group per byte, separated by spaces.',
  },
  {
    id: 'btc-faq-2',
    question: 'Why do some characters produce more than eight bits?',
    answer:
      'Plain English letters and digits fit in a single byte, so they are eight bits each. Accented letters, symbols, and emoji are encoded by UTF-8 as two, three, or four bytes, so they produce that many 8-bit groups.',
  },
  {
    id: 'btc-faq-3',
    question: 'How do I convert binary back to text?',
    answer:
      'Paste the 0s and 1s into the converter and it decodes them. It reads the bits in groups of eight, turns each group into a byte, and decodes the bytes as UTF-8. Spaces and other separators are ignored, so grouped or ungrouped binary both work.',
  },
  {
    id: 'btc-faq-4',
    question: 'Why do I get an error about a multiple of eight?',
    answer:
      'Every byte is exactly eight bits, so the total number of 0s and 1s must be divisible by eight. If you are one or two digits off, a group is incomplete and cannot be decoded — check for a missing or extra bit.',
  },
  {
    id: 'btc-faq-5',
    question: 'Is binary a way to encrypt or hide text?',
    answer:
      'No. Binary is just another way to write the same data, and anyone can convert it straight back. It offers no secrecy. Use a hash or real encryption if you need to protect information.',
  },
  {
    id: 'btc-faq-6',
    question: 'Does the conversion happen on my device?',
    answer:
      'Yes. The conversion runs entirely in your browser with JavaScript. Nothing you type is uploaded or stored on a server.',
  },
];
