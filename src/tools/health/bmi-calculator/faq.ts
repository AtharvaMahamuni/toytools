import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'bmi-calculator-faq-1',
    question: 'What is a healthy BMI range?',
    answer: 'For adults, the World Health Organization puts the healthy range at 18.5 to 24.9. Below 18.5 is underweight, 25 to 29.9 is overweight, and 30 or above is classed as obesity. The calculator shows your figure, which band it falls in, and the actual weight range that would keep you inside the healthy band at your height.',
  },
  {
    id: 'bmi-calculator-faq-2',
    question: 'How is BMI calculated?',
    answer: 'BMI is your weight in kilograms divided by the square of your height in metres. Someone who is 70 kg and 1.75 m tall has a BMI of 70 / (1.75 × 1.75), which is about 22.9. If you enter imperial units, the calculator converts pounds and inches to kilograms and metres first, so the result is identical either way.',
  },
  {
    id: 'bmi-calculator-faq-3',
    question: 'Is BMI accurate for muscular or athletic people?',
    answer: 'Not always. BMI only uses height and weight, so it cannot tell muscle from fat. A muscular athlete can weigh enough to score as overweight while carrying very little fat, and an older person who has lost muscle can score as healthy while carrying too much. Treat BMI as one quick signal and pair it with a body fat measure for a fuller picture.',
  },
  {
    id: 'bmi-calculator-faq-4',
    question: 'How do I calculate BMI in pounds and inches?',
    answer: 'Switch the units toggle to imperial and enter weight in pounds and height in total inches. A 5 foot 9 person is 69 inches. The calculator converts internally and applies the same WHO categories, so 154 lb at 69 inches gives a BMI of about 22.7, the same as 69.9 kg at 175 cm.',
  },
  {
    id: 'bmi-calculator-faq-5',
    question: 'Does this BMI calculator work for children?',
    answer: 'No. The adult categories used here do not apply to anyone under 18. Children and teenagers are assessed with age and sex specific BMI-for-age percentile charts instead of fixed cut-offs, because healthy body composition changes as they grow. For a child, use a paediatric BMI percentile tool or ask a doctor.',
  },
  {
    id: 'bmi-calculator-faq-6',
    question: 'Is my data private?',
    answer: 'Yes. Everything runs in your browser. Your height and weight are never sent to a server, and the values you enter are only saved to your own device so the tool remembers them next time. Clearing the field or your browser storage removes them.',
  },
];
