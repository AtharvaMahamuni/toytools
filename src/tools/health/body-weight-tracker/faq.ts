import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'body-weight-tracker-faq-1',
    question: 'Why does my weight go up and down day to day?',
    answer: 'Most short-term change is water, food still in your system, and glycogen, not fat. A salty meal, a hard workout, or a poor night of sleep can swing the scale a kilogram or more overnight, and none of it is real fat gain. That is exactly why this tracker draws a smoothed trend line: the direction over two weeks tells the truth that any single morning cannot.',
  },
  {
    id: 'body-weight-tracker-faq-2',
    question: 'How often should I weigh myself?',
    answer: 'Once a day, first thing in the morning after using the bathroom and before eating or drinking, is the sweet spot. Same time, same conditions, minimal clothing. Weighing more often than that just feeds anxiety over noise, while weighing less often makes the trend harder to read. Daily logging under consistent conditions gives the moving average enough data to be meaningful.',
  },
  {
    id: 'body-weight-tracker-faq-3',
    question: 'What is the moving average line for?',
    answer: 'The moving average takes the last few readings and averages them, so a single high or low day barely moves it. It cuts through daily water noise and shows the underlying direction of your weight. When you are losing or gaining, the average line trending steadily is a far better signal of progress than watching individual dots bounce around.',
  },
  {
    id: 'body-weight-tracker-faq-4',
    question: 'Can I track in pounds instead of kilograms?',
    answer: 'Yes. Switch the unit control to pounds or kilograms; it changes the label the tracker displays. Pick one unit and stay with it so your history stays consistent, since the tool records the numbers you enter rather than converting between systems. If you switch units midway, earlier entries keep the number you originally logged.',
  },
  {
    id: 'body-weight-tracker-faq-5',
    question: 'Can I set a goal weight?',
    answer: 'Yes. Enter an optional goal weight in the control at the bottom and the chart draws it as a dashed reference line, so you can see how your trend is closing in on it. The goal is purely a visual guide here; the tracker does not judge or nag, it just shows you the line and lets the trend do the talking.',
  },
  {
    id: 'body-weight-tracker-faq-6',
    question: 'Is my weight history private?',
    answer: 'Yes, entirely. Your entries are saved only in this browser on this device, with no account and nothing sent to a server. That keeps your weight completely private, and it also means the history stays on this one device. The clear-all button, or clearing your browser storage, removes everything permanently.',
  },
];
