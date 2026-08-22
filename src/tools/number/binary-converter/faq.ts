import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'binconv-faq-1',
    question: 'How do I convert a decimal number to binary?',
    answer:
      'Halve the number repeatedly and write down each remainder, then read the remainders backwards. Take 11: halving gives 5 remainder 1, then 2 remainder 1, then 1 remainder 0, then 0 remainder 1. Read upward and you get 1011. The tool does the same arithmetic, so you can check a hand conversion against it while you are learning the method.',
  },
  {
    id: 'binconv-faq-2',
    question: 'What is the difference between binary numbers and binary text?',
    answer:
      'This converter turns the number 65 into 1000001. A binary text converter turns the letter A into 01000001, which is the same bits for an entirely different reason: A happens to sit at code point 65. Numbers convert by place value and have no fixed width. Text converts through a character encoding and pads to eight bits per character. Reaching for the wrong one is the most common confusion between the two tools.',
  },
  {
    id: 'binconv-faq-3',
    question: 'Why is hexadecimal used instead of binary?',
    answer:
      'Because one hex digit is exactly four bits, so the translation needs no arithmetic. 1111 is F, 1010 is A, and 11111111 is FF. A 32-bit value takes 32 binary characters or eight hex ones, and eight characters can be read aloud, compared by eye and typed without losing your place. That is why memory dumps, colour codes and MAC addresses are written in hex while the hardware works in bits.',
  },
  {
    id: 'binconv-faq-4',
    question: 'Why does the result keep its leading zeros?',
    answer:
      'The converter reports the value without padding, and shows the bit count separately, because padding depends on the width you are working in. A value of 65 is 1000001, which is seven bits. Written as one byte it becomes 01000001. Written into a 16-bit register it gets nine more zeros. The bits badge tells you where the value naturally ends so you can pad to whatever width your context wants.',
  },
  {
    id: 'binconv-faq-5',
    question: 'My binary had a 0b prefix and spaces in it. Does that work?',
    answer:
      'The tool spots it and offers to clean it in one tap rather than failing quietly. Binary arrives as 0b1010 from source code, as 1010 1100 from a datasheet, and as 1010_1100 from a numeric literal, so a converter that only accepts bare digits rejects most of the binary anyone actually has. Decimal input gets the same treatment for commas, spaces and apostrophes.',
  },
  {
    id: 'binconv-faq-6',
    question: 'Is it exact for very large numbers?',
    answer:
      'Yes, up to 512 bits. The conversion runs on arbitrary-precision integers rather than floating point, so a 64-bit register value or a large key fragment converts digit for digit. Converters built on ordinary JavaScript numbers start silently rounding above 2^53, which is around 9 quadrillion and well inside the range people paste in. Values past 512 bits get rejected instead of truncated.',
  },
];
