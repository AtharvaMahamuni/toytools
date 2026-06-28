import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tax-faq-1',
    question: 'How do I add sales tax to a price?',
    answer:
      'Multiply the price by the tax rate to get the tax, then add it on. For a $100 item at 8.25%, the tax is $8.25 and the total is $108.25. The calculator does both and shows the tax amount separately.',
  },
  {
    id: 'tax-faq-2',
    question: 'How do I find the price before tax from a total?',
    answer:
      'Switch to "Remove tax from a total" and enter the tax-inclusive amount and the rate. The tool divides by one plus the rate: $108.25 ÷ 1.0825 = $100.00. The difference, $8.25, is the tax that was included.',
  },
  {
    id: 'tax-faq-3',
    question: 'Why is removing tax not just subtracting the percentage?',
    answer:
      'Because the tax was charged on the smaller pre-tax price, not on the total. Subtracting 8.25% of $108.25 removes $8.93, which is too much. You must divide by 1.0825 instead, which correctly returns the original $100.',
  },
  {
    id: 'tax-faq-4',
    question: 'Does this work for VAT and GST too?',
    answer:
      'Yes. VAT, GST, and sales tax all work the same arithmetically: a percentage of the net price. Enter your local rate and the calculator adds or removes it the same way. It does not apply country-specific rules like exemptions or tiered rates.',
  },
  {
    id: 'tax-faq-5',
    question: 'Why might the total be a cent off from a receipt?',
    answer:
      'Rounding. Stores round each line or the tax total to the nearest cent, and rules differ by jurisdiction. This calculator rounds the displayed figures to two decimals, so a result can land a cent away from a specific till that rounds differently.',
  },
];
