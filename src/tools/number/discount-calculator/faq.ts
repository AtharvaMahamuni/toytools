import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'disc-faq-1',
    question: 'How do I calculate a percentage discount?',
    answer:
      'Multiply the original price by the discount percentage, then divide by 100 to get the saving. Subtract that from the original price to get the sale price. For a 25% discount on $80: saving = (25 × 80) ÷ 100 = $20; sale price = $80 − $20 = $60. Alternatively, multiply by 0.75 (1 − 0.25) to get $60 directly.',
  },
  {
    id: 'disc-faq-2',
    question: 'What is the difference between percent off and amount off?',
    answer:
      'A percent-off discount scales with the price: 20% off $50 saves $10, while 20% off $200 saves $40. A fixed-amount-off discount gives the same saving regardless of price: $10 off is $10 off whether the item costs $50 or $200. Percent-off deals are more valuable on higher-priced items.',
  },
  {
    id: 'disc-faq-3',
    question: 'How much will I save?',
    answer:
      'Enter the original price and the discount (as a percentage or fixed amount) into the calculator. The saving amount appears instantly alongside the sale price. For a 30% discount on a $150 item: saving = $45; sale price = $105.',
  },
  {
    id: 'disc-faq-4',
    question: 'How do stacked discounts work?',
    answer:
      'Stacked discounts apply one after another, not added together. A 20% discount followed by a further 10% discount does not equal 30% off. On a $100 item: 20% off gives $80; then 10% off $80 gives $72. The combined saving is 28%, not 30%. Each discount applies to the already-reduced price.',
  },
  {
    id: 'disc-faq-5',
    question: 'Should the discount apply before or after tax?',
    answer:
      'Retailers apply discounts to the listed price before tax in most cases. Tax then applies to the discounted price. If a $100 item is 20% off, the sale price is $80, and tax is calculated on $80. Applying the discount after tax would give a different (and usually incorrect) result.',
  },
  {
    id: 'disc-faq-6',
    question: 'How do I find the original price from a sale price and discount?',
    answer:
      'Divide the sale price by (1 − discount rate). If an item costs $60 after a 25% discount: original price = $60 ÷ (1 − 0.25) = $60 ÷ 0.75 = $80. This formula reverses the discount calculation to recover the original value.',
  },
  {
    id: 'disc-faq-7',
    question: 'What does "buy one get one 50% off" mean in percentage terms?',
    answer:
      'For two equal-priced items, one full price and one at 50% off, the total saving is 25% off the combined price. If each item costs $40: total = $40 + $20 = $60 instead of $80. That is a $20 saving on $80, which is exactly 25%. BOGO 50% is a marketing phrasing for a 25% combined discount.',
  },
  {
    id: 'disc-faq-8',
    question: 'Is a discount on sale price the same as a markup reduction?',
    answer:
      'No. A 25% discount reduces the price by 25% of the sale price. A 25% markup reduction reduces the selling price by 25% of the cost price. These produce different results unless the markup percentage equals the discount percentage by coincidence. Discount and markup use different bases: sale price vs cost price.',
  },
];
