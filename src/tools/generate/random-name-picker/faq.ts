import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'namepick-faq-1',
    question: 'How do I draw more than one name without repeats?',
    answer:
      'Raise the pick count and leave the no-repeat option on, which is how it starts. The tool shuffles the whole list and takes the first few, so each slot comes out once and the result is numbered in draw order. Turning the option off puts every name back in the hat between picks, which is what you want for something like a nightly prize where the same person can win twice.',
  },
  {
    id: 'namepick-faq-2',
    question: 'Does a duplicate in my list matter?',
    answer:
      'It doubles that person\'s chance, and nothing on screen would show it. A list of twelve names with one person entered twice gives them two slots in twelve while everyone else holds one, so they are twice as likely to win a draw that was announced as fair. The tool checks for this after every draw, names who benefits, and offers to strip the extra entries in one tap. Case and spacing are ignored, so Ana and ana count as the same person.',
  },
  {
    id: 'namepick-faq-3',
    question: 'Why does the same name keep coming up?',
    answer:
      'Two causes, and they need different fixes. If that name sits in the list more than once, the odds really are tilted and the duplicate warning will say so. If the list is clean, this is ordinary clustering: with twelve names, the same one repeating across three separate draws happens roughly once in every 144 attempts, which is common enough over a term. Draw several at once with repeats off when you need a genuine rotation.',
  },
  {
    id: 'namepick-faq-4',
    question: 'What happened to my comma-separated list?',
    answer:
      'It became one entry. The tool reads one name per line, because names contain commas more often than people expect, and splitting on them would break every list with a surname first. Paste your names as separate lines, or run the text through find and replace first to turn each comma into a line break.',
  },
  {
    id: 'namepick-faq-5',
    question: 'How many names can I paste in?',
    answer:
      'Up to 2000, and up to 100 picks in one draw. Blank lines are dropped and surrounding spaces are trimmed, so a list copied straight out of a spreadsheet column works without cleaning. If you ask for more picks than the list can supply with repeats off, the tool caps the draw at the list size and says so rather than silently repeating anyone.',
  },
  {
    id: 'namepick-faq-6',
    question: 'Is my list of names uploaded anywhere?',
    answer:
      'No. The draw runs entirely in your browser and no name leaves the page. That matters here because these lists are class registers, staff rotas and competition entrants, which are exactly the kind of personal data nobody should paste into an unfamiliar server. Your list persists on this device so it survives a refresh, and clearing your browser data removes it.',
  },
];
