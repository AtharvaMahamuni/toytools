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
    question: 'How do I annualize growth over several years?',
    answer:
      'Raise the growth multiple to the power of one over the number of years, then subtract one; that turns any multi-year gain into a per-year rate. For example, revenue growing from $100,000 to $200,000 over five years is a 2x multiple, and 2^(1/5) minus 1 is 14.87% a year, not the 20% that simple division suggests. Enter the start, end, and period here and the calculator annualizes the growth for you.',
  },
  {
    id: 'cagr-faq-9',
    question: 'What is the difference between CAGR and average annual return?',
    answer:
      'Average annual return is the arithmetic mean of the yearly returns, while CAGR is the compound rate that connects the endpoints, and the average reads higher whenever returns vary. For example, $10,000 that doubles to $20,000 in year one and falls back to $10,000 in year two has an average annual return of 25% (plus 100% and minus 50%, averaged) but a CAGR of exactly 0%, because the money went nowhere. Judge results by the CAGR.',
  },
  {
    id: 'cagr-faq-10',
    question: 'Can two investments have the same CAGR but different risk?',
    answer:
      'Yes. CAGR is computed from two snapshots, the start and the end, so everything between them is invisible and two investments with the same CAGR can have very different risk. For example, one fund can climb from $10,000 to $20,000 over ten years in a near-straight line while another crashes to $6,000 in year five before recovering to the same $20,000; both report a 7.2% CAGR. Check drawdowns and volatility separately before treating the rates as equal.',
  },
  {
    id: 'cagr-faq-11',
    question: 'Why does my CAGR look so low compared to the total growth?',
    answer:
      'That gap is expected: each year compounds on the last, so the annual rate sits well below total growth divided by the years, and the difference widens as the period lengthens. For example, 400% total growth over 20 years is a 5x multiple but a CAGR of only 8.4%, nowhere near 20%. If the number still looks wrong, confirm the period is entered in years and that no deposits during the period inflated the ending value.',
  },
  {
    id: 'cagr-faq-12',
    question: 'Is my financial data uploaded anywhere?',
    answer:
      'No. The formula runs locally on this page, so portfolio values and growth figures stay on your device. Nothing is transmitted or stored remotely, and the calculator continues to work if you lose your connection after loading it.',
  },
];
