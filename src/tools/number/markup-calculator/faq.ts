import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'markup-faq-1',
    question: 'What is the markup formula?',
    answer:
      'Markup percentage is profit divided by cost, times 100. If an item costs $60 and sells for $100, the profit is $40 and the markup is 40 / 60 = 66.7%. The calculator does this for you and also shows the resulting margin.',
  },
  {
    id: 'markup-faq-2',
    question: 'How is markup different from margin?',
    answer:
      'Both describe profit, but against different bases. Markup is profit as a percentage of the cost; margin is profit as a percentage of the selling price. For the $60 → $100 example, markup is 66.7% but margin is 40%. Markup is always the larger number.',
  },
  {
    id: 'markup-faq-3',
    question: 'How do I set a price for a target markup?',
    answer:
      'Switch the calculator to "Selling price from target markup", enter your cost and the markup you want, and it returns the price. The formula is price = cost × (1 + markup ÷ 100), so a $60 cost at 50% markup gives $90.',
  },
  {
    id: 'markup-faq-4',
    question: 'Why is my markup higher than my margin?',
    answer:
      'Because markup is measured against the smaller number (cost) and margin against the larger number (price). The same dollar of profit is a bigger fraction of cost than of price, so the markup percentage is always higher than the margin percentage.',
  },
  {
    id: 'markup-faq-5',
    question: 'What does a 100% markup mean?',
    answer:
      'A 100% markup means you sell for double the cost: a $60 item priced at $120. Note that doubling the price is only a 50% margin, not 100% — another reminder that markup and margin are not interchangeable.',
  },
];
