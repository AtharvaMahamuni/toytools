import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'bmi-calculator',
  name: 'BMI Calculator',
  seoTitle: 'BMI Calculator — Body Mass Index in Metric or Imperial',
  description: 'Calculate your Body Mass Index from height and weight, see your WHO category, and the healthy weight range for your height.',
  tagline: 'Your BMI from height and weight, with the healthy range for you.',
  categorySlug: 'health-fitness',
  tags: [
    'bmi calculator', 'body mass index', 'bmi', 'healthy weight calculator',
    'bmi metric', 'bmi imperial', 'weight category', 'bmi chart',
    'am i overweight', 'ideal weight range', 'calculate bmi', 'bmi formula',
    'free bmi calculator', 'online bmi calculator', 'bmi for adults',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  craft: {
    id: 'bmi-units',
    kind: 'recovery',
    solves: 'Entering a weight in pounds on a metric form is the one mistake here that produces a wrong answer rather than an over-read one, and the result still looks like a number rather than an error. The tool can read the same figure the other way round and show what it would mean.',
  },
  toolGroup: 'body-metrics',
  processorId: 'bmi',
  relatedTools: ['tdee-calculator', 'body-fat-calculator', 'ideal-weight-calculator', 'body-weight-tracker'],
  methodology: {
    name: 'WHO BMI classification',
    detail: 'Weight in kilograms divided by height in metres squared, banded at the World Health Organization adult cut-offs of 18.5, 25 and 30.',
  },
  guide: {
    slug: 'how-to-calculate-bmi',
    categorySlug: 'health-fitness',
    title: 'How to Calculate BMI (and What It Really Tells You)',
    description: 'Learn the BMI formula, the WHO categories, how to read the healthy weight range, and the honest limits of BMI as a health measure.',
    readMinutes: 5,
    updatedAt: '2026-07-23',
  },
};
