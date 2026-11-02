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
    question: 'Does undo retract an accidental drop and update the leaderboard?',
    answer:
      'Yes. Tapping Undo pulls back the most recently dropped disc from its column slot. If that disc completed a four-in-a-row diagonal, horizontal, or vertical line, the win tally reverts to the previous count.',
  },
  {
    id: 'c4-faq-4',
    question: 'Does starting a rematch reset the head-to-head disc record?',
    answer:
      'No. Rematch preserves the session win counter while emptying all 42 grid slots. The starting player alternates so red and yellow take turns dropping first. Reset score clears the tally.',
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
