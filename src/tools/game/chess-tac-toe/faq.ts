import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ctt-faq-1',
    question: 'Does checkmate win the game?',
    answer:
      'No. Four of your own pieces in a line wins.\nCheck is not scored. The page has one ruleset and no mode for checkmate.',
  },
  {
    id: 'ctt-faq-2',
    question: 'Can I capture by placing a piece?',
    answer:
      'No. A piece from your hand lands only on an empty square.\nThe note says you cannot capture by placing from your hand, and the turn stays put.',
  },
  {
    id: 'ctt-faq-3',
    question: 'When do the pieces start moving?',
    answer:
      'After you have placed all four.\nYour later turns are chess moves even if the other player still has a piece in hand.',
  },
  {
    id: 'ctt-faq-4',
    question: 'What happens to a captured piece?',
    answer:
      'It returns to that player hand.\nTheir next turn is a placement again. They pick the piece, then tap an empty square.',
  },
  {
    id: 'ctt-faq-5',
    question: 'How does a knight move?',
    answer:
      'A knight moves in an L.\nFrom a corner that is two squares one way and one square the other. It can jump. A rook or a bishop cannot pass through a piece.',
  },
  {
    id: 'ctt-faq-6',
    question: 'Does undo remove a winning line?',
    answer:
      'Yes. Undo takes back one placement or one move.\nIf that ply won, the point comes off the score and the banner matches the board.',
  },
];
