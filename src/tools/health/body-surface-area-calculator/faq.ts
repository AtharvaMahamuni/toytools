import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'body-surface-area-calculator-faq-1',
    question: 'What is body surface area?',
    answer: `Body surface area is an estimate of the skin area, in square metres, from height and weight.

It is not a tape around the body.
At 175 cm and 70 kg, Mosteller reads 1.84 square metres.`,
  },
  {
    id: 'body-surface-area-calculator-faq-2',
    question: 'What is the Mosteller formula?',
    answer: `Mosteller, from the New England Journal of Medicine in 1987, is the square root of height in centimetres times weight in kilograms, divided by 3600.

That result is the hero.
Du Bois stays on the screen beside it.`,
  },
  {
    id: 'body-surface-area-calculator-faq-3',
    question: 'What is the difference between Mosteller and Du Bois?',
    answer: `The difference between Mosteller and Du Bois is the equation, not a second measurement.

Du Bois and Du Bois, Archives of Internal Medicine, 1916, is 0.007184 times height to the power 0.725 times weight to the power 0.425.
At 175 cm and 70 kg the two sit about 0.003 square metres apart.`,
  },
  {
    id: 'body-surface-area-calculator-faq-4',
    question: 'Does this calculate a chemotherapy dose?',
    answer: `No. Copying one formula into a chemotherapy dose is outside this page.

The page does not compute a chemotherapy dose, a cardiac index, or a paediatric dose.
BSA for chemotherapy dosing needs a protocol this calculator does not apply.`,
  },
  {
    id: 'body-surface-area-calculator-faq-5',
    question: 'Why do the two formulas disagree?',
    answer: `They were fitted at different times, to different people, with different arithmetic.

At 160 cm and 90 kg the spread is about 0.07 square metres, and the note names it.
At 175 cm and 70 kg they nearly agree, so the note stays quiet.`,
  },
  {
    id: 'body-surface-area-calculator-faq-6',
    question: 'What if I enter height in metres?',
    answer: `Entering height in metres instead of centimetres is refused.

A height of 1.75 is not 175 cm, and the message says to enter centimetres.
The same floor applies in inches: under 20 inches is refused.`,
  },
];
