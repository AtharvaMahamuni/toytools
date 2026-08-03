import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'calorie-deficit-calculator',
  name: 'Calorie Deficit Calculator',
  seoTitle: 'Calorie Deficit Calculator: Daily Target and Timeline',
  description: 'Work out what to eat a day for a chosen rate of weight loss, and how many weeks that rate takes to reach your goal weight.',
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
  guide: {
    slug: 'how-to-set-a-calorie-deficit',
    categorySlug: 'health-fitness',
    title: 'How to Set a Calorie Deficit That Holds',
    description: 'Where the 7,700 kcal per kilogram figure comes from, why a deficit below BMR backfires, and how to adjust the target as you get lighter.',
    readMinutes: 6,
    updatedAt: 'Aug 2026',
  },
};
