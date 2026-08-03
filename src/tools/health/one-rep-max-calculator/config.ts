import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'one-rep-max-calculator',
  name: 'One Rep Max Calculator',
  seoTitle: 'One Rep Max Calculator: 1RM Plus the Percentage Table',
  description: 'Estimate your one rep max from a set you actually lifted, across four formulas, with the training percentages a program is written in.',
  categorySlug: 'health-fitness',
  tags: [
    'one rep max calculator', '1rm calculator', 'one rep max', 'max lift calculator',
    'epley formula', 'brzycki formula', 'bench press max calculator', 'squat max calculator',
    'training percentage chart', 'how to calculate 1rm', 'free 1rm calculator',
    'estimate max lift', 'strength calculator',
  ],
  isNew: true,
  updatedAt: '2026-08-04',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'fitness-performance',
  toolGroup: 'body-metrics',
  processorId: 'one-rep-max',
  relatedTools: ['running-pace-calculator', 'heart-rate-zone-calculator', 'protein-intake-calculator', 'body-weight-tracker'],
  guide: {
    slug: 'how-to-estimate-your-one-rep-max',
    categorySlug: 'health-fitness',
    title: 'How to Estimate Your One Rep Max',
    description: 'What the Epley and Brzycki formulas do, why they disagree above ten reps, and how to turn the estimate into training percentages.',
    readMinutes: 5,
    updatedAt: 'Aug 2026',
  },
};
