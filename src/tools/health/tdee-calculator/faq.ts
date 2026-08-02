import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'tdee-calculator-faq-1',
    question: 'What is the difference between BMR and TDEE?',
    answer: 'BMR, your Basal Metabolic Rate, is the energy your body uses at complete rest just to stay alive: breathing, circulation, and keeping your organs running. TDEE, Total Daily Energy Expenditure, is BMR plus everything else you do, from walking to the kitchen to a hard gym session. TDEE is always the larger number, and it is the one that matters when planning how much to eat.',
  },
  {
    id: 'tdee-calculator-faq-2',
    question: 'How many calories should I eat to lose weight?',
    answer: 'Eat below your maintenance TDEE. About 7,700 kcal equals a kilogram of body weight, so a daily deficit of 550 kcal moves roughly half a kilogram a week. The calculator shows ready-made targets for a mild loss, a steady loss, and a gain, and it never suggests eating below your BMR, which is the floor you should not cut past without medical guidance.',
  },
  {
    id: 'tdee-calculator-faq-3',
    question: 'Which activity level should I choose?',
    answer: 'Be honest, and if unsure pick the lower option. Sedentary means a desk job and little exercise. Light is one to three workouts a week, moderate is three to five, very active is six to seven, and extra active is hard daily training or a physical job. Most people overestimate here, which inflates the target, so starting one level down and adjusting from real results is safer.',
  },
  {
    id: 'tdee-calculator-faq-4',
    question: 'How accurate is a TDEE calculator?',
    answer: 'The Mifflin-St Jeor equation used here is one of the most accurate formulas for estimating resting energy, but it is still an estimate. Real expenditure varies with muscle mass, genetics, and daily fidgeting, so your true TDEE can differ by a few hundred calories. Use the number as a starting point, then weigh yourself over two to three weeks and nudge the target up or down based on what the scale actually does.',
  },
  {
    id: 'tdee-calculator-faq-5',
    question: 'Why is my weight not changing at the calculated calories?',
    answer: 'The most common cause is an activity level set too high, or food intake higher than logged, since portions are easy to underestimate. Give any target two to three weeks before judging it, because water weight masks fat change day to day. If the trend is genuinely flat while eating below the estimate, lower the target by about 150 to 200 kcal and reassess.',
  },
  {
    id: 'tdee-calculator-faq-6',
    question: 'Is my information private?',
    answer: 'Yes. The calculation runs entirely in your browser. Your age, weight, height, and activity level are never sent anywhere, and the values are only stored on your own device so the tool remembers them on your next visit. Clearing your browser storage removes them completely.',
  },
];
