import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'r72-faq-1',
    question: 'What is the Rule of 72?',
    answer:
      'The Rule of 72 is a mental shortcut for estimating how long an investment takes to double. You divide 72 by the annual growth rate written as a percent. At 8% a year, money doubles in roughly 72 / 8 = 9 years. It works in reverse too: to double in 6 years you need about 72 / 6 = 12% a year.',
  },
  {
    id: 'r72-faq-2',
    question: 'How accurate is the Rule of 72?',
    answer:
      'It is a close approximation for the rates most people use, roughly 6% to 10%. At very high or very low rates it drifts from the exact answer. The precise doubling time is ln(2) / ln(1 + r). This tool shows both the Rule of 72 estimate and the exact figure so you can see how close they are.',
  },
  {
    id: 'r72-faq-3',
    question: 'Why does dividing by 72 work?',
    answer:
      'It comes from the mathematics of compounding. The exact doubling time is ln(2) / ln(1 + r), and 72 is a convenient round number that approximates the result well across common rates while being easy to divide by 2, 3, 4, 6, 8, 9, and 12. Some people use 70 or 69.3 for slightly more accuracy at low rates.',
  },
  {
    id: 'r72-faq-4',
    question: 'What rate do I need to double my money in 10 years?',
    answer:
      'Rearrange the rule: divide 72 by the number of years. To double in 10 years you need about 72 / 10 = 7.2% a year. To double in 5 years you need about 14.4%. This is a quick way to judge whether a target is realistic before running exact numbers.',
  },
  {
    id: 'r72-faq-5',
    question: 'Does the Rule of 72 work for inflation?',
    answer:
      'Yes, in reverse. You can use it to estimate how long inflation takes to halve your purchasing power. At 3% inflation, prices double in about 72 / 3 = 24 years, which means money buys roughly half as much. For a precise figure, use the inflation calculator instead.',
  },
  {
    id: 'r72-faq-6',
    question: 'Is the Rule of 72 the same as compound interest?',
    answer:
      'No, it is a shortcut derived from compound interest. Compound interest gives you the exact future value from a rate and time. The Rule of 72 only estimates one specific thing: the time to double. For a full projection with contributions, use the compound interest calculator.',
  },
  {
    id: 'r72-faq-7',
    question: 'What growth rate should I assume?',
    answer:
      'That depends on the investment. Historically, broad stock market returns have averaged around 7% to 10% a year before inflation over long periods, while cash savings earn far less. Use a conservative figure, and remember the rule assumes a constant rate, which real markets do not deliver year to year.',
  },
];
