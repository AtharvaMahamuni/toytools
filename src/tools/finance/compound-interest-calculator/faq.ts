import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ci-faq-1',
    question: 'What is compound interest?',
    answer:
      'Compound interest is interest calculated on both your original principal and the interest already earned. Because each period earns interest on a slightly larger balance, growth accelerates over time. This is what people mean by "interest on interest," and it is the main reason long term saving and investing can grow so much.',
  },
  {
    id: 'ci-faq-2',
    question: 'How do I calculate compound interest?',
    answer:
      'The future value formula is FV = P (1 + r/n)^(n·t), where P is the principal, r is the annual rate as a decimal, n is the number of compounding periods per year, and t is the number of years. For example, $10,000 at 7% compounded monthly for 20 years grows to about $40,387. This tool runs the formula for you and adds any monthly contributions.',
  },
  {
    id: 'ci-faq-3',
    question: 'What is the difference between monthly and yearly compounding?',
    answer:
      'More frequent compounding means interest is added to the balance sooner, so the next period earns slightly more. Monthly compounding produces a higher result than yearly compounding at the same stated annual rate, but the difference is small. Time and the rate matter far more than how frequently interest compounds.',
  },
  {
    id: 'ci-faq-4',
    question: 'Is compound interest the same as CAGR?',
    answer:
      'They are closely related. Compound interest projects a future value from a known rate. CAGR (compound annual growth rate) works backwards: it is the single constant annual rate that would take a value from its start to its end over a period. If you know the start, end, and number of years, you can solve for CAGR, and feeding that rate into a compound interest calculation reproduces the end value.',
  },
  {
    id: 'ci-faq-5',
    question: 'Can compound interest lose money?',
    answer:
      'The compound interest formula itself only grows a balance, but the rate of return on a real investment is not guaranteed. Stocks and funds can fall in value, which is a negative return for that period, so an actual portfolio can lose money even though the math of compounding assumes a steady positive rate. Use a conservative rate and remember the result is an estimate, not a promise.',
  },
  {
    id: 'ci-faq-6',
    question: 'How much difference do monthly contributions make?',
    answer:
      'A lot, especially over long periods. Each contribution compounds for the time remaining, so regular monthly amounts end up contributing more to the final balance than the starting lump sum. Adding even a modest amount every month and leaving it to compound is one of the most reliable ways to build wealth.',
  },
  {
    id: 'ci-faq-7',
    question: 'Does this calculator account for taxes or fees?',
    answer:
      'No. It shows gross compound growth at the rate you enter, with no taxes, fees, or inflation. To see the result in today purchasing power, run the final amount through the inflation calculator. To allow for fees, simply lower the rate of return you enter.',
  },
];
