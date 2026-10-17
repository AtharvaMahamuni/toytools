import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'sleep-hours-tracker-faq-1',
    question: 'What does the sleep log store?',
    answer: `One number of hours for each calendar day, on this device.

A 7.5 hour night is a normal entry, and the streak counts a day you logged.
Nothing is uploaded.`,
  },
  {
    id: 'sleep-hours-tracker-faq-2',
    question: 'Does this show a weekly sleep average?',
    answer: `No. Expecting a labeled weekly sleep average will not match the chart.

The solid line is the hours logged. A dashed line is a three-point moving average. The summary is the change from the first logged night to the latest.
There is no weekly average label.`,
  },
  {
    id: 'sleep-hours-tracker-faq-3',
    question: 'What is the week-over-week change?',
    answer: `The summary is the latest logged value minus the first one in the window.

Log 7.0 hours, then later log 7.5, and the change reads upward by 0.5 hours.
That is the week-over-week change, not an average.`,
  },
  {
    id: 'sleep-hours-tracker-faq-4',
    question: 'Why does a long night mention time awake in bed?',
    answer: `Logging time in bed as if every hour were sleep inflates the trend.

Above 9 hours the note says the log still counts every hour as sleep.
At 8 hours, and at exactly 9, the note stays hidden.`,
  },
  {
    id: 'sleep-hours-tracker-faq-5',
    question: 'Can I log a nap as a second entry?',
    answer: `No. Trying to store a nap as a second entry on the same day replaces the number already stored for that day.

One value per calendar day is the whole log.
Sleep stages are not recorded.`,
  },
  {
    id: 'sleep-hours-tracker-faq-6',
    question: 'Is this a sleep diary template?',
    answer: `It is a sleep diary for hours slept: one number, a streak, and the change across the week.

It is not a form for bed time, wake time, or how you felt.
The sleep cycle calculator answers a different question, in ninety minute blocks.`,
  },
];