import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'coin-faq-1',
    question: 'Is a digital coin flip really fifty fifty?',
    answer:
      'Yes, and it is closer to fifty fifty than a real coin. Each flip draws from your browser\'s cryptographic random number generator, and the tool discards the small band of values that would tilt the result rather than taking a shortcut with a remainder. A physical coin has a heavier side, a milled edge and the habits of the thumb that throws it, so a real toss carries a measurable bias that this one does not.',
  },
  {
    id: 'coin-faq-2',
    question: 'Why did I get eight heads out of ten?',
    answer:
      'Because a split that lopsided or worse turns up in about 11 percent of ten-flip runs. That is roughly one attempt in nine. Ten flips is a tiny sample, and tiny samples are lumpy by nature: an exactly even five and five split happens only a quarter of the time, so anything else is the normal case rather than the exception. The line under the result states the share for whatever you just rolled.',
  },
  {
    id: 'coin-faq-3',
    question: 'After four heads, is tails more likely?',
    answer:
      'No. The coin carries no memory of the previous four flips, so the fifth one is a fresh fifty fifty. This is the gambler\'s fallacy, and it survives because the long-run average does even out. What evens it out is volume rather than correction: later flips outnumber the early ones until the early lump stops mattering. Nothing pushes back toward tails at any point.',
  },
  {
    id: 'coin-faq-4',
    question: 'How many flips before the split looks even?',
    answer:
      'Around a thousand before it looks convincing to the eye. At ten flips a 70 to 30 split is unremarkable. At a hundred, a 60 to 40 split is still ordinary. At a thousand, the share of heads sits between 47 and 53 percent about 95 percent of the time. The gap in raw count keeps growing while the gap as a percentage keeps shrinking, and it is the percentage that settles.',
  },
  {
    id: 'coin-faq-5',
    question: 'Can I flip for yes or no instead of heads or tails?',
    answer:
      'Yes. The sides switch to yes and no, true and false, or A and B, and the tally and the fairness line follow the labels you picked. That matters more than it sounds: a decision framed as yes or no is easier to react to than one framed as heads, because you find out instantly whether you are disappointed by the answer.',
  },
  {
    id: 'coin-faq-6',
    question: 'How many flips can I run at once?',
    answer:
      'Up to five hundred in a single press, printed ten to a line with a running tally of each side. That is enough to show a class what a fair coin looks like at scale, and enough to watch the percentage settle while the raw gap between heads and tails keeps widening. Nothing is uploaded and no run is stored, so refreshing the page clears it.',
  },
];
