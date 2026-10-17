import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'body-surface-area-calculator',
  name: 'Body Surface Area Calculator',
  seoTitle: 'Body Surface Area Calculator: Mosteller and Du Bois',
  description:
    'Mosteller and Du Bois BSA formulas side by side. The page does not compute chemotherapy dosing.',
  tagline: 'Mosteller and Du Bois, with the square-metre spread.',
  categorySlug: 'health-fitness',
  tags: [
    'body surface area calculator',
    'bsa calculator',
    'mosteller formula',
    'du bois bsa',
    'bsa for chemotherapy dosing',
  ],
  updatedAt: '2026-10-17',
  addedOn: '2026-10-17',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  craft: {
    id: 'bsa-formula-spread',
    kind: 'verification',
    solves:
      'Mosteller and Du Bois can disagree by more than 0.05 square metres, and one unlabeled number hides which formula was copied.',
  },
  toolGroup: 'body-metrics',
  processorId: 'body-surface-area',
  relatedTools: ['bmi-calculator', 'lean-body-mass-calculator', 'ideal-weight-calculator'],
  methodology: {
    name: 'Mosteller 1987 and Du Bois 1916',
    detail:
      'Mosteller is the square root of centimetres times kilograms over 3600, and Du Bois stays beside it with the signed spread.',
  },
  citation: {
    problem: 'Use this when height and weight should become Mosteller and Du Bois body surface area side by side.',
    nonGoal: 'compute a chemotherapy dose, a cardiac index, or a paediatric dose.',
  },
  job: {
    intent: 'calculate',
    userJob:
      'Estimate body surface area from height and weight with the Mosteller and Du Bois formulas side by side.',
    repeatability: 'low',
    interactionDepth: 'medium',
    privacyValue: 'medium',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  guide: {
    slug: 'body-surface-area-calculator',
    categorySlug: 'health-fitness',
    title: 'How to Estimate Body Surface Area',
    description:
      'Mosteller and Du Bois at 175 cm and 70 kg, and why the page does not compute a chemotherapy dose.',
    readMinutes: 6,
    updatedAt: '2026-10-17',
  },
};
