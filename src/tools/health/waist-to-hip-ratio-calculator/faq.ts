import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'waist-to-hip-ratio-calculator-faq-1',
    question: 'What is waist to hip ratio?',
    answer: `Waist to hip ratio is the waist circumference divided by the hip circumference.

An 80 cm waist and a 100 cm hip give 0.80.
The number has no unit when both tapes use the same unit.`,
  },
  {
    id: 'waist-to-hip-ratio-calculator-faq-2',
    question: 'What waist to hip ratio is high for men and women?',
    answer: `The WHO consultation of 8 to 11 December 2008 calls 0.90 or higher substantially increased for men.

For women the same phrase starts at 0.85.
A result of 0.80 sits below both cuts.`,
  },
  {
    id: 'waist-to-hip-ratio-calculator-faq-3',
    question: 'Does this calculate waist to height ratio?',
    answer: `No. Expecting a waist to height ratio from this page will not work, because height is not an input.

Waist divided by hip is the only ratio on the screen.
Waist to height is a different metric.`,
  },
  {
    id: 'waist-to-hip-ratio-calculator-faq-4',
    question: 'What if one side is inches and the other is centimetres?',
    answer: `Typing one circumference in inches and the other in centimetres still divides.

A 32 cm waist over a 102 cm hip reads 0.31.
If that waist was 32 inches, the ratio is about 0.80, and the note says so.`,
  },
  {
    id: 'waist-to-hip-ratio-calculator-faq-5',
    question: 'Is a high ratio a diagnosis of central obesity?',
    answer: `No. Treating the ratio as a diagnosis of central obesity overreads a screening cut.

The page names the WHO band. It does not diagnose, and it does not estimate body fat.`,
  },
  {
    id: 'waist-to-hip-ratio-calculator-faq-6',
    question: 'Where does the tape go?',
    answer: `The field help says the narrowest part of the waist, not the navel, and the widest part of the hips.

Use the same unit on both sides.
A clinic protocol may name a different landmark, and that protocol is not applied here.`,
  },
];
