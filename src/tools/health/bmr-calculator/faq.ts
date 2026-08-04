import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'bmr-calculator-faq-1',
    question: 'What is a normal BMR?',
    answer: 'There is no single normal figure, because BMR scales with body size. For example, a 30 year old man of 175 cm and 70 kg lands near 1,650 kcal a day, while a woman of the same age at 165 cm and 60 kg lands near 1,320. Larger and taller bodies burn more at rest simply because there is more tissue to keep running. A figure that looks low next to a friend usually means you are smaller or older, not that your metabolism is broken.',
  },
  {
    id: 'bmr-calculator-faq-2',
    question: 'What is the difference between BMR and TDEE?',
    answer: 'BMR is what your body spends at complete rest: circulation, breathing, temperature, and tissue repair. TDEE adds everything else, from walking to the kitchen to digesting food to training. TDEE is always the larger number, typically 1.2 to 1.9 times BMR depending on how active you are, and it is the one that answers how much to eat. This calculator shows both, so you can see exactly what the multiplier is adding.',
  },
  {
    id: 'bmr-calculator-faq-3',
    question: 'Should I eat my BMR to lose weight?',
    answer: 'No. Eating at your BMR means eating nothing for the activity you actually did, which is a much steeper deficit than most people intend. For example, if your BMR is 1,650 and a moderately active day costs 2,560, eating 1,650 leaves a gap of more than 900 kcal a day. Set the target against maintenance instead, and keep BMR as the floor you do not go under without medical supervision.',
  },
  {
    id: 'bmr-calculator-faq-4',
    question: 'Why is Mifflin-St Jeor used instead of Harris-Benedict?',
    answer: 'Harris-Benedict was derived in 1919 and tends to overestimate resting energy for modern body compositions, often by around 5 percent. Mifflin-St Jeor was published in 1990 against a larger and more representative sample, and validation work since has found it closer for most adults. Neither knows your muscle mass, which is the biggest source of individual error, so both are starting estimates rather than measurements.',
  },
  {
    id: 'bmr-calculator-faq-5',
    question: 'Does more muscle raise my BMR?',
    answer: 'Yes, but less dramatically than gym folklore suggests. Muscle burns roughly 13 kcal per kilogram per day at rest, against about 4.5 for fat, so adding 5 kg of muscle adds perhaps 45 kcal a day. That is real and worth having, but it is small next to the difference activity makes. The formula here works from height, weight, age, and sex only, so it cannot see your composition either way.',
  },
  {
    id: 'bmr-calculator-faq-6',
    question: 'Is BMR the same as RMR?',
    answer: 'They are close but not identical. BMR is measured under strict conditions: fully rested, fasted, and lying still in a controlled room. RMR, resting metabolic rate, is measured under looser conditions and comes out around 10 percent higher. Most calculators, including this one, quote a Mifflin-St Jeor figure that sits between the two definitions, which is why you often see the terms used interchangeably.',
  },
];
