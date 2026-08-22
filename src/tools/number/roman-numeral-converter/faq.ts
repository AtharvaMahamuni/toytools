import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'roman-faq-1',
    question: 'What year is MCMXCIX?',
    answer:
      'It is 1999. Read it in pieces: M is 1000, CM is 900 because C sits before M and gets subtracted, XC is 90 on the same rule, and IX is 9. Add them and you get 1999. Film credits and book title pages carry dates in this form, and breaking the numeral into its subtractive pairs is the whole trick to reading one at a glance.',
  },
  {
    id: 'roman-faq-2',
    question: 'Why do clock faces use IIII instead of IV?',
    answer:
      'Tradition, symmetry and a bit of casting convenience. IIII balances the VIII opposite it on a dial, and a clockmaker casting numerals in metal needs twenty I shapes for a IIII face, which divides neatly into moulds. Big Ben uses IV and most other public clocks use IIII. Both read as four, so the converter accepts either and then offers you the standard spelling.',
  },
  {
    id: 'roman-faq-3',
    question: 'Why do Roman numerals stop at 3999?',
    answer:
      'Because the next value needs a mark you cannot type. M is the largest letter, so 3999 is MMMCMXCIX and 4000 would need four Ms, which the subtractive rules forbid. Romans wrote larger values with a vinculum, a bar over a letter that multiplies it by a thousand. There is no plain-text way to draw that bar, so every ASCII Roman numeral converter stops where this one does.',
  },
  {
    id: 'roman-faq-4',
    question: 'Is IC a valid way to write 99?',
    answer:
      'No. Only six subtractive pairs are standard: IV, IX, XL, XC, CD and CM. A letter can only be subtracted from the next two values up in its own family, so I comes before V and X but never before C. Ninety-nine is XCIX, which is ninety plus nine rather than a hundred minus one. IC turns up in modern signage and in puzzles, and no Roman inscription uses it.',
  },
  {
    id: 'roman-faq-5',
    question: 'Why does the tool say my numeral is not standard?',
    answer:
      'Because it read the value but the spelling is additive rather than subtractive. IIII, VIIII and MDCCCCX are all perfectly readable and all pre-modern. The converter accepts them, tells you the value, and offers the modern spelling in one tap, which is the version that will match anything you compare it against later. A numeral already written the modern way gets no message at all.',
  },
  {
    id: 'roman-faq-6',
    question: 'Is there a Roman numeral for zero?',
    answer:
      'No, and that is a real gap rather than an oversight in the tool. The system was built for counting and tallying, where nothing needs no symbol. Medieval scribes writing in Latin used the word nulla when they needed the idea. Negative numbers have no numeral either, so the converter refuses both instead of inventing something.',
  },
];
