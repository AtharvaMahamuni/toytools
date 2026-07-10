import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'cron-expression-parser-faq-1',
    question: 'What does this cron expression mean?',
    answer: 'Paste the expression and the tool translates it to plain English, such as "Every 15 minutes" or "At 09:30 on Monday". It reads all five fields (minute, hour, day-of-month, month, day-of-week) and supports stars, lists, ranges, steps, and month or weekday names. For example, */15 * * * * means every 15 minutes.',
  },
  {
    id: 'cron-expression-parser-faq-2',
    question: 'When does this cron job run next?',
    answer: 'The result lists the next five run times, calculated in UTC so they do not depend on your zone. It steps forward minute by minute from now and shows each matching time with its date and weekday. If nothing matches within four years, it says so rather than guessing.',
  },
  {
    id: 'cron-expression-parser-faq-3',
    question: 'What are the five cron fields?',
    answer: 'In order they are minute (0-59), hour (0-23), day-of-month (1-31), month (1-12 or names), and day-of-week (0-6, where 0 and 7 are Sunday). A star means "every" value for that field. Standard cron has five fields; a six-field variant that adds seconds is a different format this tool does not use.',
  },
  {
    id: 'cron-expression-parser-faq-4',
    question: 'How do steps and ranges work?',
    answer: 'A range like 1-5 means every value from 1 through 5. A step like */15 means every 15th value starting at the minimum, so 0, 15, 30, 45 for minutes. You can combine them: 0-30/10 means 0, 10, 20, 30. Lists join values with commas, as in 0,30 for the top and half of each hour.',
  },
  {
    id: 'cron-expression-parser-faq-5',
    question: 'Why does my cron run on days I did not expect?',
    answer: 'When both day-of-month and day-of-week are set to specific values, cron runs when either matches, not only when both do. So 0 0 1 * 1 fires on the 1st of the month and on every Monday. If only one of the two day fields is restricted, it behaves the way you would expect.',
  },
];
