import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'water-intake-tracker-faq-1',
    question: 'How many glasses of water should I drink a day?',
    answer: 'A common starting point is around eight glasses, roughly two litres, but the right amount varies with your body size, activity, climate, and diet. The tracker defaults to a goal of eight glasses and lets you change it. Think of the goal as a target to aim at consistently rather than a strict medical rule, and adjust it up on hot or active days.',
  },
  {
    id: 'water-intake-tracker-faq-2',
    question: 'How does the streak work?',
    answer: 'Your streak counts the consecutive days you hit your daily goal. Today is given grace: the streak does not reset just because you have not finished logging yet, so an in-progress day never breaks it. Miss a full day below your goal, though, and the streak starts again. The longest streak you have ever reached is shown next to the current one.',
  },
  {
    id: 'water-intake-tracker-faq-3',
    question: 'Can I change the daily goal or count in millilitres?',
    answer: 'You can set any daily goal in the control at the bottom. This tracker counts in glasses to keep tapping quick and friction-free, where one glass is about 250 millilitres, so eight glasses is roughly two litres. Logging by the glass is deliberately simple: the easier it is to tap, the more likely you are to keep the habit.',
  },
  {
    id: 'water-intake-tracker-faq-4',
    question: 'What does the weekly chart show?',
    answer: 'The chart plots the last seven days as bars, with a dashed line marking your daily goal. Bars that reach the line are highlighted, so you can see at a glance which days you hit the target and whether this week is trending up or down. It is a quick visual nudge rather than a detailed report.',
  },
  {
    id: 'water-intake-tracker-faq-5',
    question: 'Is my hydration data private?',
    answer: 'Completely. Everything is stored only in your browser on this device, with no account, no sign-in, and nothing sent to a server. That also means your history lives on this one device and browser. Clearing your browser storage, or using the clear-all button, erases it for good.',
  },
  {
    id: 'water-intake-tracker-faq-6',
    question: 'Does drinking more water have real benefits?',
    answer: 'Staying adequately hydrated supports energy, concentration, temperature regulation, and kidney function, and mild dehydration is a common hidden cause of afternoon fatigue and headaches. You do not need to overdo it: once your urine is pale straw-coloured you are generally well hydrated. The tracker just helps you stay consistent rather than pushing an extreme target.',
  },
];
