import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'protein-intake-calculator',
  name: 'Protein Intake Calculator',
  seoTitle: 'Protein Intake Calculator: Grams a Day by Body Weight',
  description: 'Work out how much protein per day your bodyweight and training goal support, in grams per kg, with a daily per-meal split for muscle gain.',
  tagline: 'The protein range your weight and training goal support.',
  categorySlug: 'health-fitness',
  tags: [
    'protein intake calculator', 'how much protein do i need', 'protein calculator',
    'grams of protein per day', 'protein per kg body weight', 'daily protein intake',
    'protein for muscle gain', 'protein while cutting', 'protein requirements',
    'protein per meal', 'free protein calculator',
  ],
  isNew: true,
  updatedAt: '2026-08-04',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'nutrition',
  craft: {
    id: 'pi-per-meal',
    kind: 'orientation',
    solves: 'The daily total is met by eating most of it at dinner, and the response to a single serving plateaus around forty grams, so the target is hit on paper and missed in the body. The meal count is already an input, which makes the per-sitting figure computable.',
  },
  toolGroup: 'body-metrics',
  processorId: 'protein-intake',
  relatedTools: ['macro-calculator', 'tdee-calculator', 'body-fat-calculator', 'calorie-deficit-calculator'],
  methodology: {
    name: 'Grams per kilogram of body weight',
    detail: 'Targets are set per kilogram of body weight against published activity bands rather than as one number for everybody.',
  },
  guide: {
    slug: 'how-much-protein-you-actually-need',
    categorySlug: 'health-fitness',
    title: 'How Much Protein You Actually Need',
    description: 'Why the guidelines give a range rather than a number, what changes it, and why spreading protein across meals matters as much as the daily total.',
    readMinutes: 5,
    updatedAt: '2026-08-04',
  },
};
