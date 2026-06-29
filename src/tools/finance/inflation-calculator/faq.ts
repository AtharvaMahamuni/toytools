import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'inf-faq-1',
    question: 'What will my money be worth after inflation?',
    answer:
      'Inflation reduces what a fixed amount of money can buy. To find the future purchasing power, divide the amount by (1 + inflation rate) raised to the number of years. For example, at 3% inflation, $100,000 will buy what about $47,761 buys today after 25 years. The dollars are still there, but each one buys less.',
  },
  {
    id: 'inf-faq-2',
    question: 'What is the difference between real and nominal value?',
    answer:
      'Nominal value is the face amount of money, the number of dollars. Real value is that amount adjusted for inflation, expressed in the purchasing power of a base year. A salary that rises in nominal terms can still fall in real terms if prices rise faster. This calculator shows both the real value and the future nominal cost of the same goods.',
  },
  {
    id: 'inf-faq-3',
    question: 'How does inflation affect savings?',
    answer:
      'Money sitting in cash loses real value every year that inflation runs above the interest it earns. If your savings earn 1% but inflation is 3%, your purchasing power falls by about 2% a year. This is why keeping long term savings in assets that aim to beat inflation, rather than only in cash, matters.',
  },
  {
    id: 'inf-faq-4',
    question: 'How do I calculate the future cost of something?',
    answer:
      'Multiply today price by (1 + inflation rate) raised to the number of years. At 3% inflation, something that costs $100,000 today would nominally cost about $209,378 in 25 years. This is the flip side of purchasing power: the same goods cost more in future dollars.',
  },
  {
    id: 'inf-faq-5',
    question: 'What inflation rate should I use?',
    answer:
      'Many developed economies target around 2% to 3% long term, but actual inflation varies year to year and country to country. For planning, a rate of 2% to 4% is a common assumption. If you want to be cautious about long horizons, model a slightly higher rate and see how sensitive the result is.',
  },
  {
    id: 'inf-faq-6',
    question: 'How do I beat inflation?',
    answer:
      'You beat inflation when your after tax return is higher than the inflation rate, which preserves or grows real purchasing power. Historically that has meant investing in assets like diversified stocks rather than holding only cash. Use the compound interest calculator to compare an expected return against the inflation figure here.',
  },
  {
    id: 'inf-faq-7',
    question: 'Why does a small inflation rate matter so much?',
    answer:
      'Because inflation compounds. A 3% annual rate sounds small, but over 25 years it more than halves purchasing power. Just like compound interest works in your favor when saving, inflation compounds against you, which is why long horizons make even modest rates significant.',
  },
];
