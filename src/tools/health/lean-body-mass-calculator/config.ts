import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'lean-body-mass-calculator',
  name: 'Lean Body Mass Calculator',
  seoTitle: 'Lean Body Mass Calculator: Boer, James, and Hume',
  description:
    'A lean body mass calculator using the Boer formula for an LBM, fat free mass, and muscle mass estimate.',
  tagline: 'Boer, James, and Hume side by side, with the kilogram spread.',
  categorySlug: 'health-fitness',
  tags: [
    'lean body mass calculator',
    'boer formula',
    'james formula',
    'hume formula',
    'lean body mass',
    'fat free mass',
    'fat free mass calculator',
    'lbm calculator',
    'muscle mass estimate',
    'body composition',
    'lean mass calculator',
  ],
  addedOn: '2026-10-09',
  updatedAt: '2026-10-09',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  craft: {
    id: 'lbm-formula-spread',
    kind: 'verification',
    solves:
      'On a heavier body Boer and Hume disagree by several kilograms, and a single unlabeled number hides which formula was copied.',
  },
  toolGroup: 'body-metrics',
  processorId: 'lean-body-mass',
  relatedTools: ['body-fat-calculator', 'ideal-weight-calculator', 'bmi-calculator'],
  methodology: {
    name: 'Boer 1984, James 1976, and Hume 1966',
    detail:
      'Three published equations estimate lean body mass from height, weight, and sex, and the page shows all three because they disagree.',
  },
  citation: {
    problem:
      'Use this when height, weight, and sex should produce Boer, James, and Hume lean mass estimates side by side.',
    nonGoal: 'convert a lean mass estimate into a medication dose, measure body fat, or call an AI model.',
  },
  job: {
    intent: 'calculate',
    userJob:
      'Estimate lean body mass from height, weight, and sex with the Boer, James, and Hume formulas side by side.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'medium',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  guide: {
    slug: 'how-to-estimate-lean-body-mass',
    categorySlug: 'health-fitness',
    title: 'How to Estimate Lean Body Mass',
    description:
      'What lean body mass is, how Boer, James and Hume differ at 80 kg and 180 cm, and why the estimate is not a dose.',
    readMinutes: 6,
    updatedAt: '2026-10-09',
  },
};
