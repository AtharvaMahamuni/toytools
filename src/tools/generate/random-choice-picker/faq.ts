import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'choicepick-faq-1',
    question: 'Why did my whole list count as one option?',
    answer:
      'Because it arrived on one line. The picker reads one option per line, so "pizza, sushi, tacos" is a single choice with commas in it, and picking from a list of one is a confident wrong answer. The tool spots that case and offers to split the line into separate options in one tap. It stays quiet once a second line exists, which keeps an option that genuinely contains a comma safe.',
  },
  {
    id: 'choicepick-faq-2',
    question: 'How do I put a list in a random order?',
    answer:
      'Switch the mode to "put them all in a random order" and the pick count disappears, because ranking uses the whole list. Every option comes out exactly once, numbered from the top. That is the mode for demo running order, presentation slots, or deciding who does the washing up first, second and third without three separate draws.',
  },
  {
    id: 'choicepick-faq-3',
    question: 'Is the pick actually random?',
    answer:
      'Yes. The list gets shuffled with a Fisher-Yates pass driven by your browser\'s cryptographic random number generator, and the tool rejects the values that would bias the shuffle rather than taking the usual shortcut. Every ordering of your options is equally likely, so every option is equally likely to come out on top.',
  },
  {
    id: 'choicepick-faq-4',
    question: 'What if I keep re-rolling until I like the answer?',
    answer:
      'Then you have already decided, and that is worth knowing. Noticing your own disappointment at a result is the most useful thing a random picker does, and it works on the first roll rather than the fifth. If you want the chance to be binding, draw once and commit before you look. If you want the information, draw once and pay attention to your reaction.',
  },
  {
    id: 'choicepick-faq-5',
    question: 'Does a repeated option change the odds?',
    answer:
      'Yes. An option listed twice holds two slots, so it comes out twice as often as the rest. Sometimes that is what you want, because weighting a list by repeating entries is a reasonable trick when one option deserves more weight. When it is accidental, run the list through the duplicate line remover first and paste the clean version back.',
  },
  {
    id: 'choicepick-faq-6',
    question: 'How many options can I paste in?',
    answer:
      'Up to 2000 options, and up to 50 picks in one draw. Blank lines are dropped and surrounding spaces are trimmed, so a column pasted out of a spreadsheet works as it is. Everything runs in your browser, nothing is uploaded, and your list persists on this device so it survives a refresh.',
  },
];
