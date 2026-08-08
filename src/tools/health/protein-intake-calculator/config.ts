import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'protein-intake-calculator',
  name: 'Protein Intake Calculator',
  seoTitle: 'Protein Intake Calculator: Grams a Day by Body Weight',
  description: 'Find the protein range your body weight and training goal actually support, with the per-meal split and the grams-per-kilogram it came from.',
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
  toolGroup: 'body-metrics',
  processorId: 'protein-intake',
  relatedTools: ['macro-calculator', 'tdee-calculator', 'body-fat-calculator', 'calorie-deficit-calculator'],
  guide: {
    slug: 'how-much-protein-you-actually-need',
    categorySlug: 'health-fitness',
    title: 'How Much Protein You Actually Need',
    description: 'Why the guidelines give a range rather than a number, what changes it, and why spreading protein across meals matters as much as the daily total.',
    readMinutes: 5,
    updatedAt: 'Aug 2026',
  },
};
