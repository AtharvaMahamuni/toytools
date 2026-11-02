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
      'Yes. Undo erases the last X or O placed on the 3x3 grid. When that placement had completed a row, column, or diagonal line, the awarded point is deducted and the previous state is restored.',
  },
  {
    id: 'ttt-faq-4',
    question: 'Does rematch wipe the score?',
    answer:
      'No. Choosing Rematch empties the 9 squares for a new round while retaining your cumulative X vs O match record. Player turn order rotates so the second player moves first.',
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
