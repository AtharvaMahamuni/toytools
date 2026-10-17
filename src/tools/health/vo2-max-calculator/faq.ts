import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'vo2-max-calculator-faq-1',
    question: 'What is VO2 max?',
    answer: `VO2 max is the rate of oxygen use during hard work, in millilitres per kilogram per minute.

A lab cart measures it. This page estimates it.
The hero names which field method produced the number.`,
  },
  {
    id: 'vo2-max-calculator-faq-2',
    question: 'How does the Cooper test estimate VO2 max?',
    answer: `Cooper, JAMA 1968, uses the metres covered in twelve minutes.

The estimate is that distance, minus 504.9, divided by 44.73.
A 2.4 km run is 42.4 ml/kg/min.`,
  },
  {
    id: 'vo2-max-calculator-faq-3',
    question: 'How does a resting heart rate estimate vo2max?',
    answer: `Uth and colleagues, European Journal of Applied Physiology 2004, use 15.3 times max heart rate divided by resting heart rate.

Max heart rate here is the Tanaka estimate, 208 minus 0.7 times age.
Age 30 and a resting pulse of 60 give about 47.7.`,
  },
  {
    id: 'vo2-max-calculator-faq-4',
    question: 'What is the difference between the Cooper test and the resting-pulse estimate?',
    answer: `The difference between the Cooper test and the resting-pulse estimate is the measurement, not a rounding error.

One uses a twelve-minute distance. The other uses age and a resting pulse.
When they disagree by 5 ml/kg/min or more, the note names both.`,
  },
  {
    id: 'vo2-max-calculator-faq-5',
    question: 'Does this calculate fitness age?',
    answer: `No. Expecting a fitness age from this page will not work.

The page does not compute fitness age, and it does not replace a lab cart.
Heart-rate zones are a different calculator.`,
  },
  {
    id: 'vo2-max-calculator-faq-6',
    question: 'What distance counts as a twelve-minute run?',
    answer: `The field is kilometres or miles, and a Cooper test is often near 2.4 km or 1.5 miles.

Typing the distance in metres while the field is in kilometres, such as 2400, is rejected.
Leave the distance blank to use only the resting pulse.`,
  },
];
