import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ttt-faq-1',
    question: 'Can I play against the computer?',
    answer:
      'No. Both seats are people on this phone.\nX starts, then you pass the phone. The other seat is not a program, and the page has no single-player mode.',
  },
  {
    id: 'ttt-faq-2',
    question: 'What happens if I tap the same square twice?',
    answer:
      'The second tap does nothing.\nA square that already has a mark stays as it is, the turn does not change, and the note says that square already has a mark.',
  },
  {
    id: 'ttt-faq-3',
    question: 'Does undo remove the point as well as the mark?',
    answer:
      'Yes. Undo takes back the last move only.\nIf that move won or drew, the score returns to the earlier tally and the banner matches the board.',
  },
  {
    id: 'ttt-faq-4',
    question: 'Does rematch wipe the score?',
    answer:
      'No. Rematch keeps the tally.\nIt clears the nine squares and the other seat moves first. Nothing is saved, so refreshing the page starts the tally at zero, and Reset score zeroes it at any time.',
  },
  {
    id: 'ttt-faq-5',
    question: 'Is this the same game as noughts and crosses?',
    answer:
      'Yes. It is the same 3 by 3 game.\nThree in a row wins in any direction, including a diagonal. A full board with no line of three is a draw.',
  },
  {
    id: 'ttt-faq-6',
    question: 'How do we tell X from O without the colors?',
    answer:
      'X is a cross with the letter X.\nO is a ring with the letter O. Both use the same ink, so shape and letter separate them.',
  },
];
