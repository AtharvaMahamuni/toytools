import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'waist-to-hip-ratio-calculator',
  name: 'Waist to Hip Ratio Calculator',
  seoTitle: 'Waist to Hip Ratio Calculator: WHR and Central Obesity',
  description:
    'Read WHR and the central obesity risk band from waist and hip. This page does not compute waist to height ratio.',
  tagline: 'Waist and hip in, with the sex-specific WHO band.',
  categorySlug: 'health-fitness',
  tags: [
    'waist to hip ratio calculator',
    'whr calculator',
    'waist hip ratio risk',
    'central obesity calculator',
  ],
  updatedAt: '2026-10-17',
  addedOn: '2026-10-17',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  craft: {
    id: 'whr-mixed-unit',
    kind: 'orientation',
    solves:
      'A waist typed in inches beside a hip in centimetres still divides, and the ratio looks like a real result.',
  },
  toolGroup: 'body-metrics',
  processorId: 'waist-to-hip-ratio',
  relatedTools: ['bmi-calculator', 'body-fat-calculator', 'lean-body-mass-calculator', 'body-weight-tracker', 'move-today-tracker'],
  methodology: {
    name: 'WHO expert consultation, 8 to 11 December 2008',
    detail:
      'Men at or above 0.90 and women at or above 0.85 are the substantially increased cuts, shown beside the ratio.',
  },
  citation: {
    problem:
      'Use this when waist and hip circumferences should become a waist-to-hip ratio and the sex-specific WHO band.',
    nonGoal: 'diagnose central obesity or estimate body fat.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Compute the waist-to-hip ratio from waist and hip circumferences and read the sex-specific band.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'medium',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  guide: {
    slug: 'waist-to-hip-ratio-calculator',
    categorySlug: 'health-fitness',
    title: 'How to Read a Waist to Hip Ratio',
    description:
      'The WHO 2008 cuts of 0.90 and 0.85, and why a mixed-unit ratio is not a waist to height ratio.',
    readMinutes: 6,
    updatedAt: '2026-10-17',
  },
};
