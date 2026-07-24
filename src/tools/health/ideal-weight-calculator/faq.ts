import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'ideal-weight-calculator-faq-1',
    question: 'What should I weigh for my height?',
    answer: 'There is no single right number. This calculator shows four classic formulas, Devine, Robinson, Miller, and Hamwi, which each estimate a target from your height and sex, plus the modern BMI healthy range for your height. For most people the honest answer is the range: any weight inside the BMI healthy band is reasonable, and where you sit within it depends on your build and muscle.',
  },
  {
    id: 'ideal-weight-calculator-faq-2',
    question: 'Why do the formulas give different answers?',
    answer: 'They were created at different times for different purposes and simply chose different numbers. Each starts from a base weight at five feet tall and adds a fixed amount for every inch above that, but the base and the per-inch amount vary between them. Hamwi tends to run highest and Miller lowest, so seeing all four at once shows you a believable spread rather than one falsely precise figure.',
  },
  {
    id: 'ideal-weight-calculator-faq-3',
    question: 'Is ideal weight the same as a healthy weight?',
    answer: 'Not quite. The ideal-weight formulas aim at a single target and were originally used to help dose medication. A healthy weight is a range, captured better by BMI between 18.5 and 24.9, which allows for different body types at the same height. This tool shows both so you can treat the formula figures as a central anchor and the BMI range as the realistic band around it.',
  },
  {
    id: 'ideal-weight-calculator-faq-4',
    question: 'Do these formulas account for muscle or frame size?',
    answer: 'No. They use only height and sex, so a broad-framed or muscular person and a slight one of the same height get the same estimate. That is their main limitation. A very muscular person can be well above their formula ideal while carrying little fat. Pair the number with a body fat estimate and common sense rather than treating it as a verdict.',
  },
  {
    id: 'ideal-weight-calculator-faq-5',
    question: 'How do I use this to set a goal?',
    answer: 'Use the healthy BMI range as your target zone rather than chasing one exact number. Pick a point within it that feels realistic for your build, then track your progress toward it over time. Weight moves slowly and fluctuates daily, so watch the trend, not any single reading. Everything here runs privately in your browser.',
  },
];
