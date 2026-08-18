import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'one-rep-max-calculator',
  name: 'One Rep Max Calculator',
  seoTitle: 'One Rep Max Calculator: 1RM Plus the Percentage Table',
  description: 'Estimate your one rep max from a set you actually lifted, for the bench press or any lift, across the Epley, Brzycki and Lombardi formulas.',
  tagline: 'Your one rep max from a set you lifted, across four formulas.',
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
  craft: {
    id: 'orm-spread',
    kind: 'verification',
    solves: 'Past about five reps the four formulas stop agreeing, because endurance rather than strength starts deciding how long a set lasts, so a max estimated from a set of twelve can be ten kilos out. The estimate is presented with the same confidence at any rep count.',
  },
  toolGroup: 'body-metrics',
  processorId: 'one-rep-max',
  relatedTools: ['running-pace-calculator', 'heart-rate-zone-calculator', 'protein-intake-calculator', 'body-weight-tracker'],
  methodology: {
    name: 'Epley, Brzycki and Lombardi formulas',
    detail: 'Three published one-rep-max estimates shown together, because they diverge as the rep count climbs and no single one is authoritative above about five reps.',
  },
  guide: {
    slug: 'how-to-estimate-your-one-rep-max',
    categorySlug: 'health-fitness',
    title: 'How to Estimate Your One Rep Max',
    description: 'What the Epley and Brzycki formulas do, why they disagree above ten reps, and how to turn the estimate into training percentages.',
    readMinutes: 5,
    updatedAt: '2026-08-04',
  },
};
