import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cagr-faq-1',
    question: 'What is CAGR?',
    answer:
      'CAGR, or compound annual growth rate, is the constant yearly rate that would take a value from its start to its end over a given number of years. Real growth is bumpy; CAGR smooths the whole journey into one comparable rate. Growing $10,000 into $25,000 over ten years is 150% in total, but a CAGR of about 9.6% a year.',
  },
  {
    id: 'cagr-faq-2',
    question: 'How is CAGR calculated?',
    answer:
      'Divide the ending value by the starting value, raise the result to the power of one over the number of years, and subtract one: CAGR = (End / Start)^(1/t) minus 1. This calculator runs the formula live as you type, so you can nudge any input and watch the rate respond.',
  },
  {
    id: 'cagr-faq-3',
    question: 'Why is CAGR lower than total growth divided by years?',
    answer:
      'Because growth compounds. 150% total growth over ten years is not 15% a year: each year builds on the previous year, so a smaller steady rate reaches the same destination. The simple division always overstates the yearly rate, and the gap widens the longer the period and the larger the growth.',
  },
  {
    id: 'cagr-faq-4',
    question: 'What is the difference between CAGR and ROI?',
    answer:
      'ROI reports the total percentage gain over the whole period, however long it was. CAGR converts that same result into a per-year rate. ROI answers "how much did I make", CAGR answers "how fast did it grow". Use ROI to size a result, and CAGR to compare results of different lengths against each other or against a benchmark.',
  },
  {
    id: 'cagr-faq-5',
    question: 'Can CAGR be negative?',
    answer:
      'Yes. If the ending value is below the starting value, the CAGR is negative: the steady yearly rate of decline that produces the overall drop. A fall from $10,000 to $8,000 over five years is a CAGR of about minus 4.4% a year.',
  },
  {
    id: 'cagr-faq-6',
    question: 'What are the limits of CAGR?',
    answer:
      'CAGR assumes smooth growth and no cash flows in between. It hides volatility, since a wild ride and a steady climb can share the same rate, and it becomes misleading when money is added or withdrawn during the period, because the formula credits deposits as growth. It also exaggerates when annualizing periods shorter than a year.',
  },
  {
    id: 'cagr-faq-7',
    question: 'What is doubling time and how does it relate to CAGR?',
    answer:
      'Doubling time is how long a value takes to double at a constant growth rate. This calculator shows the exact figure, ln(2) divided by ln(1 + rate). The Rule of 72 gives a quick mental estimate of the same number: 72 divided by the rate as a percent. At 9.6% a year, both land near 7.5 years.',
  },
  {
    id: 'cagr-faq-8',
    question: 'Is my financial data uploaded anywhere?',
    answer:
      'No. The formula runs locally on this page, so portfolio values and growth figures stay on your device. Nothing is transmitted or stored remotely, and the calculator continues to work if you lose your connection after loading it.',
  },
];
