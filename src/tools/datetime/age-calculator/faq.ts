import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'age-calculator-faq-1',
    question: 'How is my exact age calculated?',
    answer: 'Your age is the whole number of years, months, and days from your date of birth to the reference date. The tool counts the most whole months it can add to your birth date without passing the reference date, then the days left over. When your birth day does not exist in a shorter month, it uses that month\'s last day, so one month after 31 January is 28 February (29 in a leap year). For example, born 31 January, on 1 March you are 1 month and 1 day older. The days are never negative, and leap years follow the real calendar.',
  },
  {
    id: 'age-calculator-faq-2',
    question: 'Can I find my age on a past or future date?',
    answer: 'Yes. Leave the second date blank to use today, or enter any date in the "Age at date" field to see how old you were, or will be, on that day. This is useful for checking eligibility dates or planning around a milestone.',
  },
  {
    id: 'age-calculator-faq-3',
    question: 'How does the calculator handle a February 29 birthday?',
    answer: 'In a year with no February 29, a leap-day birthday falls on February 28, which is the standard civil convention. The age and the next-birthday countdown follow the same rule, so someone born on 29 February 2000 turns 27 on 28 February 2027: the result reads 27 years, 0 months, 0 days, and the page wishes them a happy birthday that day.',
  },
  {
    id: 'age-calculator-faq-4',
    question: 'Why is age not just the current year minus the birth year?',
    answer: 'That subtraction is correct only after the birthday has passed this year. Before it, the answer is one year too high. An exact age compares the month and day as well as the year, so it is right on every day of the year.',
  },
];
