import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'lean-body-mass-calculator-faq-1',
    question: 'What is lean body mass?',
    answer: `Lean body mass is body weight with the fat removed.

Muscle, bone, organs and water make up that remainder.
An 80 kg man at 180 cm gets a Boer estimate of 61.4 kg rather than a scan.`,
  },
  {
    id: 'lean-body-mass-calculator-faq-2',
    question: 'What is the difference between the Boer, James, and Hume formulas?',
    answer: `The difference between the Boer, James, and Hume formulas is the arithmetic, not a second measurement.

Boer from 1984 is linear in weight and height, and it is the hero.
James from 1976 squares weight over height in centimetres, while Hume returns 57.8 kg for that same man.`,
  },
  {
    id: 'lean-body-mass-calculator-faq-3',
    question: 'Why do the three formulas disagree?',
    answer: `The three formulas disagree because each was fitted to a different group of people.

An 80 kg man at 180 cm spans about 4.9 kg, from 57.8 kg up to 62.7 kg.
At 120 kg and 170 cm that spread grows to about 7.5 kg, so keep every formula.`,
  },
  {
    id: 'lean-body-mass-calculator-faq-4',
    question: 'How do I calculate lean body mass from a body fat percentage?',
    answer: `LBM = weight * (1 - fat fraction).

At 80 kg and 20 percent fat, 80 times 0.80 is 64 kg of lean mass.
Fat is not measured here, so the estimate comes from height and weight through Boer, James and Hume.`,
  },
  {
    id: 'lean-body-mass-calculator-faq-5',
    question: 'Which formula should I use?',
    answer: `Use the Boer formula when you want the clinical default, and leave James and Hume visible beside it.

For an 80 kg man at 180 cm the three read 61.4 kg, 62.7 kg and 57.8 kg, and none of them is a measurement.`,
  },
  {
    id: 'lean-body-mass-calculator-faq-6',
    question: 'Is this a drug dose?',
    answer: `No, this is an estimate of lean body mass, not a drug dose.

Using one formula as a drug dose ignores the other two estimates, which can sit about 7.5 kg apart on a heavier body.
Checking the kilogram gap before a formula is copied into a chart is the check the calculator actually does.`,
  },
];
