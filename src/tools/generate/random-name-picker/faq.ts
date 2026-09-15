import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'namepick-faq-1',
    question: 'How do I pick a random name from a list?',
    answer:
      'Paste one name per line, then draw. The tool picks from the list you pasted and shows the winner. Blank lines are dropped and surrounding spaces are trimmed, so a list copied from a spreadsheet column works without cleaning.',
  },
  {
    id: 'namepick-faq-2',
    question: 'Can I draw several names without repeats?',
    answer:
      'Yes. Raise the pick count and leave the no-repeat option on, which is how it starts. The tool shuffles the whole list and takes the first few, so each slot comes out once and the result is numbered in draw order. Turning the option off puts every name back in the hat between picks.',
  },
  {
    id: 'namepick-faq-3',
    question: 'Do duplicate names in my list change the odds?',
    answer:
      'Yes. A duplicated entry doubles that person\'s chance, and nothing on screen would show it. A list of twelve names with one person entered twice gives them two slots in twelve while everyone else holds one. The tool checks for this after every draw, names who benefits, and offers to strip the extra entries in one tap. Case and spacing are ignored, so Ana and ana count as the same person.',
  },
  {
    id: 'namepick-faq-4',
    question: 'Is my list of names uploaded?',
    answer:
      'No. The draw runs entirely in your browser and no name leaves the page. That matters here because these lists are class registers, staff rotas and competition entrants. Your list persists on this device so it survives a refresh, and clearing your browser data removes it.',
  },
  {
    id: 'namepick-faq-5',
    question: 'Why does the same name keep coming up?',
    answer:
      'Two causes, and they need different fixes. If that name sits in the list more than once, the odds really are tilted and the duplicate warning will say so. If the list is clean, this is ordinary clustering: with twelve names, the same one repeating across three separate draws happens roughly once in every 144 attempts. Draw several at once with repeats off when you need a genuine rotation.',
  },
  {
    id: 'namepick-faq-6',
    question: 'What happened to my comma-separated list?',
    answer:
      'It became one entry. The tool reads one name per line, because names contain commas more often than people expect, and splitting on them would break every list with a surname first. Paste your names as separate lines, or run the text through find and replace first to turn each comma into a line break.',
  },
  {
    id: 'namepick-faq-7',
    question: 'How many names can I paste in?',
    answer:
      'Up to 2000, and up to 100 picks in one draw. If you ask for more picks than the list can supply with repeats off, the tool caps the draw at the list size and says so rather than silently repeating anyone.',
  },
];
