import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'qtt-faq-1',
    question: 'What is a move in quantum tic tac toe?',
    answer:
      'A move marks two different squares with the same number.\nX1 is the first move. Those two squares stay linked until a cycle collapses. Tap the first square again to deselect it.',
  },
  {
    id: 'qtt-faq-2',
    question: 'Who chooses the collapse?',
    answer:
      'The player who did not close the cycle.\nBoth resolutions are listed. That player picks one, and the choice is its own step.',
  },
  {
    id: 'qtt-faq-3',
    question: 'Does a spooky three in a row win?',
    answer:
      'No. Only a classical line wins.\nLetters that still share squares are entangled. They do not score.',
  },
  {
    id: 'qtt-faq-4',
    question: 'What if both players get a line from one collapse?',
    answer:
      'The earlier line takes the point.\nThe line whose highest move number is smaller wins. The later line does not take a half point. This page plays a simplified variant and does not use Goff\'s half-point scoring.',
  },
  {
    id: 'qtt-faq-5',
    question: 'Can I mark a square that already collapsed?',
    answer:
      'No. A classical square takes no further mark.\nThe note says that square already has a classical mark, and the turn stays put.',
  },
  {
    id: 'qtt-faq-6',
    question: 'Does undo restore the links?',
    answer:
      'Yes. Undo takes back one ply.\nUndoing a collapse puts the links and the two choices back. The score follows that ply.',
  },
];
