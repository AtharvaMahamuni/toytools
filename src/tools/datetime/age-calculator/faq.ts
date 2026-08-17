import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'age-calculator-faq-1',
    question: 'How is my exact age calculated?',
    answer: 'Your age is the whole number of years, months, and days from your date of birth to the reference date. The tool subtracts the day, then the month, then the year, borrowing the real length of the preceding month whenever the day comes out negative. That keeps the result accurate across months of different lengths and across leap years.',
  },
  {
    id: 'age-calculator-faq-2',
    question: 'Can I find my age on a past or future date?',
    answer: 'Yes. Leave the second date blank to use today, or enter any date in the "Age at date" field to see how old you were, or will be, on that day. This is useful for checking eligibility dates or planning around a milestone.',
  },
  {
    id: 'age-calculator-faq-3',
    question: 'How does the calculator handle a February 29 birthday?',
    answer: 'For the age itself, a leap-day birth is counted exactly using real calendar days. For the next-birthday countdown in a year that has no February 29, the birthday falls on February 28, which is the standard civil convention.',
  },
  {
    id: 'age-calculator-faq-4',
    question: 'Why is age not just the current year minus the birth year?',
    answer: 'That subtraction is correct only after the birthday has passed this year. Before it, the answer is one year too high. An exact age compares the month and day as well as the year, so it is right on every day of the year.',
  },
];
