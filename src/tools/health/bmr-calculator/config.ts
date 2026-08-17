import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'bmr-calculator',
  name: 'BMR Calculator',
  seoTitle: 'BMR Calculator: Basal Metabolic Rate, Mifflin-St Jeor',
  description: 'Calculate your basal metabolic rate with the Mifflin-St Jeor equation, and see what each activity level adds on top of it.',
  tagline: 'Your basal metabolic rate, and what each activity level adds.',
  categorySlug: 'health-fitness',
  tags: [
    'bmr calculator', 'basal metabolic rate', 'bmr', 'resting metabolic rate',
    'mifflin st jeor calculator', 'calculate bmr', 'bmr formula', 'metabolism calculator',
    'how many calories do i burn at rest', 'rmr calculator', 'free bmr calculator',
    'bmr and tdee', 'daily calorie burn',
  ],
  isNew: true,
  updatedAt: '2026-08-04',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'energy',
  toolGroup: 'body-metrics',
  processorId: 'bmr',
  relatedTools: ['tdee-calculator', 'calorie-deficit-calculator', 'macro-calculator', 'bmi-calculator'],
  methodology: {
    name: 'Mifflin-St Jeor equation',
    detail: 'The equation clinical practice moved to over Harris-Benedict, because it estimates resting energy use more closely across modern body compositions.',
  },
  guide: {
    slug: 'what-your-bmr-actually-measures',
    categorySlug: 'health-fitness',
    title: 'What Your BMR Actually Measures',
    description: 'How the Mifflin-St Jeor equation estimates resting energy, why it is not what you should eat, and how activity turns it into a daily total.',
    readMinutes: 5,
    updatedAt: '2026-08-04',
  },
};
