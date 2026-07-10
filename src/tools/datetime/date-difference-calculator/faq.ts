import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'date-difference-calculator-faq-1',
    question: 'How many days are between two dates?',
    answer: 'Enter a start date and an end date, and the tool reports the whole number of days between them, along with the same gap expressed in weeks and in years, months, and days. The count is exact: it steps through the calendar and accounts for leap years and each month’s real length.',
  },
  {
    id: 'date-difference-calculator-faq-2',
    question: 'How many weekdays are between two dates?',
    answer: 'The result includes a weekday count, sometimes called business days, which is the number of Monday-to-Friday days in the range. It is worked out by counting whole weeks and then checking the leftover days one by one, so weekends are excluded. Public holidays are not removed, since those vary by country.',
  },
  {
    id: 'date-difference-calculator-faq-3',
    question: 'How many weeks and months is that span?',
    answer: 'Total weeks is the number of complete seven-day weeks in the range. The years-months-days breakdown is the same gap shown the way people usually say it, for example "6 months and 7 days". Both describe the identical span, just in different units.',
  },
  {
    id: 'date-difference-calculator-faq-4',
    question: 'Does the order of the dates matter?',
    answer: 'No. The calculator measures the length of the span whichever way round you enter the dates, so a start after the end gives the same duration. It notes when the dates are reversed so you can double-check the direction if it matters for your use.',
  },
  {
    id: 'date-difference-calculator-faq-5',
    question: 'Are the dates sent anywhere?',
    answer: 'No. The calculation runs entirely in your browser using your device clock. Nothing you type is uploaded, stored on a server, or shared, so it works offline once the page has loaded.',
  },
];
