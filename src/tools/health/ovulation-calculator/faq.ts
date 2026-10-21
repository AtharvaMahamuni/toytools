import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ovulation-calculator-faq-1',
    question: 'When am I ovulating?',
    answer:
      'Ovulation is the cycle length minus the luteal phase, in days after the first day of the last period. A last period on 1 January 2026, a 28 day cycle, and a 14 day luteal phase land on 15 January 2026. Leave "Count on" blank to use today. The fertile window is the five days before that date through 15 January.',
  },
  {
    id: 'ovulation-calculator-faq-2',
    question: 'What is a fertile window?',
    answer:
      'The fertile window on this page is five days before ovulation through the day of ovulation. For the 1 January 2026 example that is 10 January 2026 to 15 January 2026. Sperm can still be present from the earlier days. The egg is counted on the ovulation day. The day after is outside this window.',
  },
  {
    id: 'ovulation-calculator-faq-3',
    question: 'What if my luteal phase is not 14 days?',
    answer:
      'Each day shorter than 14 moves ovulation one day later. Each day longer moves it one day earlier. A 12 day luteal phase from 1 January 2026 puts ovulation on 17 January 2026, two days after the 14 day date, and the note under the date says so. A 16 day phase puts it on 13 January 2026, two days earlier. At 14 the note stays hidden, because nothing moved. The next period does not move with the luteal phase.',
  },
  {
    id: 'ovulation-calculator-faq-4',
    question: 'When does the next period start?',
    answer:
      'One cycle length after the first day of the last period. A 28 day cycle from 1 January 2026 starts the next period on 29 January 2026. A 32 day cycle starts it on 2 February 2026. Changing the luteal phase does not change that date. The luteal phase moves ovulation inside the cycle. The cycle length sets where the cycle ends.',
  },
  {
    id: 'ovulation-calculator-faq-5',
    question: 'Is the ovulation date a conception date?',
    answer:
      'It is the estimated conception date this page can make from a cycle. A 14 day luteal phase and a 28 day cycle give 15 January 2026, which is the same estimate the pregnancy due date page uses for that cycle. It is not a conception date calculator that reads a test. The card says ovulation. A test is the thing that confirms it.',
  },
  {
    id: 'ovulation-calculator-faq-6',
    question: 'Can I count a date that is already past the window?',
    answer:
      'Yes. A last period on 1 January 2026 and a 14 day luteal phase, counted on 16 January 2026, is 1 day after the window that ended on 15 January. The last period still has to be on or before the date you are counting from. A later period is an error, not a negative cycle day.',
  },
  {
    id: 'ovulation-calculator-faq-7',
    question: 'Does this replace an ovulation test?',
    answer:
      'No. The page does date arithmetic so you can see an ovulation date, a fertile window, and the next period change together. It does not read a test strip, it does not confirm a temperature shift, and it does not predict a pregnancy. If a test and this date disagree, the test is the one to trust.',
  },
  {
    id: 'ovulation-calculator-faq-8',
    question: 'Are these dates uploaded?',
    answer:
      'No. Runs entirely on your device. Nothing is uploaded. The last period, the cycle length, the luteal phase, and the count date stay in the browser. A chat can recite day 14 once. It will not keep the window and the luteal shift on one screen while you change a field.',
  },
];
