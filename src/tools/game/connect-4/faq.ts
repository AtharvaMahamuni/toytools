import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'c4-faq-1',
    question: 'Can I play Connect 4 against the computer?',
    answer:
      'No. Both colors are people on this phone.\nX starts, then you pass the phone. The page has no computer opponent and no network match.',
  },
  {
    id: 'c4-faq-2',
    question: 'How does the disc drop?',
    answer:
      'The disc falls to the lowest empty cell in that column.\nA tap or a release on the column drops one disc. It does not drop twice.',
  },
  {
    id: 'c4-faq-3',
    question: 'Does undo remove the point as well as the disc?',
    answer:
      'Yes. Undo takes back the last disc only.\nIf that disc won or drew, the score returns to the earlier tally and the banner matches the board.',
  },
  {
    id: 'c4-faq-4',
    question: 'Does rematch wipe the score?',
    answer:
      'No. Rematch keeps the tally.\nIt clears the grid and the other color drops first. Nothing is saved, so refreshing the page starts the tally at zero, and Reset score zeroes it at any time.',
  },
  {
    id: 'c4-faq-5',
    question: 'What counts as four in a row?',
    answer:
      'Four of one color in any straight line.\nA row, a column, or a diagonal all count. A full board with no line of four is a draw.',
  },
  {
    id: 'c4-faq-6',
    question: 'Why does the column light up before the disc drops?',
    answer:
      'So you can see the column under your finger before the disc commits.\nThe highlight is a preview. The disc lands only when you release and the pointer is still on that column.',
  },
];
