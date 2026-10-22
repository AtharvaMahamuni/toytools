import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'pregnancy-due-date-calculator-faq-1',
    question: 'How many weeks pregnant am I?',
    answer:
      'Count whole days from the first day of your last period to the date you care about, then divide by 7. A last period on 1 January 2026 counted on 1 March 2026 is 59 days, which is 8 weeks and 3 days. Leave "Weeks pregnant on" blank to use today. The week count stays tied to the last period even when you change the cycle length.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-2',
    question: 'What is the Naegele rule?',
    answer:
      'Add 280 days to the first day of the last period when the cycle is 28 days. That lands a 1 January 2026 period on 8 October 2026. 2026 is not a leap year, so the count does not pick up an extra February day. A 1 January 2024 period, in a leap year, lands on 7 October 2024 instead. The page uses that day count, not "plus one year, minus three months, plus seven days," because the month shortcut drifts at the ends of months.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-3',
    question: 'What if my cycle is not 28 days?',
    answer:
      'Each day longer than 28 moves the due date one day later. Each day shorter moves it one day earlier. A 32 day cycle from 1 January 2026 is due 12 October 2026, four days after the 28 day date, and the note under the date says so. A 21 day cycle is due 1 October 2026, seven days earlier. At 28 the note stays hidden, because nothing moved. The weeks pregnant do not move with the cycle.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-4',
    question: 'When do the trimesters start?',
    answer:
      'On this page the second trimester starts 98 days after the last period, which is 14 weeks, and the third starts at 196 days, which is 28 weeks. From 1 January 2026 those dates are 9 April 2026 and 16 July 2026. They follow the last period, not the shifted due date. A longer cycle does not slide the trimester dates.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-5',
    question: 'What is the estimated conception date?',
    answer:
      'The page estimates conception as the cycle length minus 14 days after the last period. A 28 day cycle puts that on day 14, so 1 January 2026 gives 15 January 2026. A 32 day cycle gives 19 January 2026. The card says it is an estimate. It is not an ovulation test and it is not a scan.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-6',
    question: 'Can I count a date that is already past the due date?',
    answer:
      'Yes. A last period on 1 January 2026 and a 28 day cycle, counted on 10 October 2026, is 2 days past the 8 October due date, and 40 weeks and 2 days pregnant, in the third trimester. The last period still has to be on or before the date you are counting from. A later period is an error, not a negative week count.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-7',
    question: 'Does this replace a prenatal visit?',
    answer:
      'No. The page does date arithmetic so you can see a due date, a week count, and trimester dates change together. It does not read a scan, it does not diagnose a pregnancy, and it does not know a clinician has already dated the pregnancy a different way. If a scan date and this date disagree, the scan is the one to take to the visit. If cycles vary by more than a few days, or with PCOS, a calendar date can be off by a week or more; an ultrasound or a clinician gives a better date.',
  },
  {
    id: 'pregnancy-due-date-calculator-faq-8',
    question: 'Are these dates uploaded?',
    answer:
      'No. The last period, the cycle length, and the count date stay in the browser. Runs entirely on your device. Nothing is uploaded.',
  },
];
