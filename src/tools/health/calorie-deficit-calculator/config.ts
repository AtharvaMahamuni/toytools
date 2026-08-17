import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'calorie-deficit-calculator',
  name: 'Calorie Deficit Calculator',
  seoTitle: 'Calorie Deficit Calculator: Daily Target and Timeline',
  description: 'Work out what to eat a day for a chosen rate of weight loss, how long it takes to lose it, and the date you reach your goal weight.',
  tagline: 'What to eat daily for a chosen rate of loss, and how long it takes.',
  categorySlug: 'health-fitness',
  tags: [
    'calorie deficit calculator', 'calorie deficit', 'weight loss calculator',
    'how many calories to lose weight', 'daily calorie target', 'deficit calculator',
    'calories to lose a pound a week', 'weight loss timeline', 'cutting calories',
    'calorie calculator to lose weight', 'free calorie deficit calculator',
  ],
  isNew: true,
  updatedAt: '2026-08-04',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'energy',
  toolGroup: 'body-metrics',
  processorId: 'calorie-deficit',
  relatedTools: ['tdee-calculator', 'bmr-calculator', 'macro-calculator', 'body-weight-tracker'],
  methodology: {
    name: '7,700 kcal per kilogram energy density',
    detail: 'The standard figure for the energy in a kilogram of body mass, so a 0.5 kg weekly change works out near a 550 kcal daily difference.',
  },
  guide: {
    slug: 'how-to-set-a-calorie-deficit',
    categorySlug: 'health-fitness',
    title: 'How to Set a Calorie Deficit That Holds',
    description: 'Where the 7,700 kcal per kilogram figure comes from, why a deficit below BMR backfires, and how to adjust the target as you get lighter.',
    readMinutes: 6,
    updatedAt: '2026-08-04',
  },
};
