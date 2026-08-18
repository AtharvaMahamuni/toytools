import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'running-pace-calculator',
  name: 'Running Pace Calculator',
  seoTitle: 'Running Pace Calculator: Pace, Speed and Race Times',
  description: 'Turn a distance and finish time into pace as min per km and per mile, with race splits and predicted 5K, 10K, half and marathon times.',
  tagline: 'Pace per km and per mile, plus predicted race times.',
  categorySlug: 'health-fitness',
  tags: [
    'running pace calculator', 'pace calculator', 'race pace calculator',
    'min per km calculator', 'min per mile calculator', 'marathon time predictor',
    '5k pace calculator', 'half marathon pace', 'running speed calculator',
    'riegel formula', 'race time predictor', 'free pace calculator',
  ],
  isNew: true,
  updatedAt: '2026-08-04',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'fitness-performance',
  craft: {
    id: 'rp-extrapolation',
    kind: 'guardrail',
    solves: 'A marathon predicted from a 5K is an extrapolation eight times past the distance actually run, well outside the range Riegel holds for, and it is printed with exactly the same confidence as a 10K prediction from the same run. People plan a race around it.',
  },
  toolGroup: 'body-metrics',
  processorId: 'running-pace',
  relatedTools: ['heart-rate-zone-calculator', 'one-rep-max-calculator', 'tdee-calculator', 'move-today-tracker'],
  methodology: {
    name: 'Riegel endurance model',
    detail: 'Race predictions use t2 = t1 x (d2/d1)^1.06, where the exponent above 1 is what encodes slowing down over longer distances.',
  },
  guide: {
    slug: 'how-running-pace-and-race-predictions-work',
    categorySlug: 'health-fitness',
    title: 'How Running Pace and Race Predictions Work',
    description: 'Pace versus speed, how Riegel predicts a longer race from a shorter one, and how far you can trust the extrapolation.',
    readMinutes: 5,
    updatedAt: '2026-08-04',
  },
};
