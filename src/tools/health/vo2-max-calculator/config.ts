import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'vo2-max-calculator',
  name: 'VO2 Max Calculator',
  seoTitle: 'VO2 Max Calculator: Cooper Test and Resting Heart Rate',
  description:
    'Estimate aerobic capacity from a Cooper test or a resting heart rate. This is not a fitness age calculator, and vo2max stays labeled.',
  tagline: 'Cooper distance or a resting pulse, kept as two numbers.',
  categorySlug: 'health-fitness',
  tags: [
    'vo2 max calculator',
    'cooper test calculator',
    'aerobic capacity calculator',
    'vo2max from resting heart rate',
    'fitness age calculator',
  ],
  updatedAt: '2026-10-17',
  addedOn: '2026-10-17',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'fitness-performance',
  craft: {
    id: 'vo2-method-gap',
    kind: 'verification',
    solves:
      'A Cooper distance and a resting pulse can disagree by 5 ml/kg/min or more, and one unlabeled number hides which method was copied.',
  },
  toolGroup: 'body-metrics',
  processorId: 'vo2-max',
  relatedTools: ['heart-rate-zone-calculator', 'running-pace-calculator'],
  methodology: {
    name: 'Cooper 1968, Uth 2004, and Tanaka 2001',
    detail:
      'Cooper uses the twelve-minute distance, and the resting-pulse estimate uses Uth with a Tanaka maximum heart rate.',
  },
  citation: {
    problem: 'Use this when a twelve-minute distance or a resting pulse should become a VO2 max estimate.',
    nonGoal: 'diagnose fitness, replace a laboratory cart, or compute fitness age.',
  },
  job: {
    intent: 'calculate',
    userJob:
      'Estimate VO2 max from a twelve-minute distance or a resting pulse, and keep the two estimates distinct.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  guide: {
    slug: 'vo2-max-calculator',
    categorySlug: 'health-fitness',
    title: 'How to Estimate VO2 Max',
    description:
      'The Cooper test at 2.4 km and the Uth resting-pulse estimate, kept as two different numbers.',
    readMinutes: 6,
    updatedAt: '2026-10-17',
  },
};
