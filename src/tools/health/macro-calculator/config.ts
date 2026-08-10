import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'macro-calculator',
  name: 'Macro Calculator',
  seoTitle: 'Macro Calculator — Protein, Carbs & Fat From Calories',
  description: 'Split a daily calorie target into grams of protein, carbs, and fat with balanced, high-protein, low-carb, or keto presets.',
  tagline: 'Split a calorie target into protein, carbs and fat.',
  categorySlug: 'health-fitness',
  tags: [
    'macro calculator', 'macronutrient calculator', 'protein carbs fat calculator', 'iifym calculator',
    'macros calculator', 'calorie macro split', 'keto macro calculator', 'high protein macros',
    'daily macros', 'macro split', 'grams of protein carbs fat',
    'free macro calculator', 'online macro calculator', 'diet macro calculator',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'nutrition',
  toolGroup: 'body-metrics',
  processorId: 'macro',
  relatedTools: ['tdee-calculator', 'bmi-calculator'],
  guide: {
    slug: 'how-to-calculate-macros',
    categorySlug: 'health-fitness',
    title: 'How to Calculate Your Macros From Calories',
    description: 'Learn what macros are, how calories convert to grams of protein, carbs, and fat, and how to pick a split you can actually stick to.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
