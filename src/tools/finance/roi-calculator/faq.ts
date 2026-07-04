import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'roi-faq-1',
    question: 'How is ROI calculated?',
    answer:
      'ROI is the net gain divided by the cost, expressed as a percentage: (final value minus amount invested) divided by amount invested, times 100. If you put in $10,000 and the position is now worth $15,000, the gain is $5,000 and the ROI is 50%. The same formula handles losses; selling at $8,000 would be an ROI of minus 20%.',
  },
  {
    id: 'roi-faq-2',
    question: 'What is a good ROI?',
    answer:
      'It depends entirely on how long the money was invested. A 50% ROI is exceptional over one year and mediocre over fifteen. That is why this calculator adds the annualized return when you enter a holding period: broad stock index funds have averaged roughly 7 to 10% a year over long stretches, so an annualized figure above that beat the passive alternative, and one below it did not.',
  },
  {
    id: 'roi-faq-3',
    question: 'What is the difference between ROI and annualized return?',
    answer:
      'ROI is the total percentage gain over the whole holding period, however long that was. The annualized return restates the same result as a constant yearly rate, which makes investments of different lengths comparable. A 50% ROI over 3 years is about 14.5% a year; over 10 years it is only about 4.1% a year. The annualized figure is the honest one to compare against benchmarks.',
  },
  {
    id: 'roi-faq-4',
    question: 'Does this ROI calculator handle losses?',
    answer:
      'Yes. Enter a final value below what you invested and the result shows a negative ROI and the net loss in money terms. A final value of zero shows an ROI of minus 100%. Losses have no meaningful annualized rate when the value hits zero, so that card is hidden in that case.',
  },
  {
    id: 'roi-faq-5',
    question: 'Should I include fees, taxes, and dividends in the numbers?',
    answer:
      'For a true picture, yes. Use the all-in cost including purchase fees as the amount invested, and the net amount you actually keep as the final value. If the investment paid dividends or rent along the way, add what you received to the final value, otherwise the ROI understates the real return.',
  },
  {
    id: 'roi-faq-6',
    question: 'What is the difference between ROI and CAGR?',
    answer:
      'ROI answers "how much did I make in total" while CAGR answers "what steady yearly rate does that equal". They are two views of the same numbers: the annualized return this tool shows for your holding period is the CAGR of the investment. Use the CAGR calculator when you want to start from yearly growth, and this one when you are starting from cost and proceeds.',
  },
  {
    id: 'roi-faq-7',
    question: 'Is my financial data uploaded anywhere?',
    answer:
      'No. Your cost, sale value, and results exist only in your browser tab. There is no server-side calculation, no account, and no analytics on the numbers you enter, so details of your investments never leave your machine.',
  },
];
