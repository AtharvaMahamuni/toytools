import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'loan-faq-payment',
    question: 'How is the monthly payment calculated?',
    answer:
      'The payment is the fixed amount that clears the borrowed balance in equal months. The yearly rate is divided by 12 to get the monthly rate. For 100,000 at 12% a year over 5 years, that payment is 2,224.44 and the interest comes to 33,466.83.',
  },
  {
    id: 'loan-faq-rate-unit',
    question: 'What does a 2% rate mean on this page?',
    answer:
      '2 means 2% a year, not 2% a month. A monthly rate of 2% is 24% a year. When the yearly rate is under 3%, or over 36%, the result says which reading it used.',
  },
  {
    id: 'loan-faq-extra',
    question: 'Does an extra payment reduce interest?',
    answer:
      'Yes. The extra amount is added on top of the installment and taken off the principal, so total interest falls while the installment stays the same. On 100,000 at 12% for 5 years, an extra 500 a month finishes the loan in 3 years 10 months and saves 8,239.19 of interest.',
  },
  {
    id: 'loan-faq-home',
    question: 'Does a home loan use a different formula?',
    answer:
      'The formula is the same. Enter the price, the down payment, and the term in years. A 500,000 price with 100,000 down borrows 400,000. At 8.5% for 20 years the payment is 3,471.29 a month.',
  },
  {
    id: 'loan-faq-left-out',
    question: 'Does this include taxes, insurance, or a lender fee?',
    answer:
      'No. The result is principal and interest on a fixed yearly rate. Property tax, insurance, and a fee quoted by a lender are separate, and this page does not fetch a rate.',
  },
  {
    id: 'loan-faq-high-rate',
    question: 'Why does a very high rate fail to pay the balance down?',
    answer:
      'At 100% a year over 40 years the monthly interest uses the whole payment, so the balance never falls. Lower the yearly rate, shorten the term, or add an extra payment that covers more than the interest.',
  },
  {
    id: 'loan-faq-privacy',
    question: 'Are my loan amount and rate uploaded?',
    answer:
      'No. The amount, the rate, the term, and the extra payment stay in the browser, and the page does not fetch a rate. Runs entirely on your device. Nothing is uploaded.',
  },
];
