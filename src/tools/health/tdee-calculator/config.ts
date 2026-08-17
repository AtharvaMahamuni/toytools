import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'tdee-calculator',
  name: 'TDEE Calculator',
  seoTitle: 'TDEE Calculator — Daily Calorie & Maintenance Needs',
  description: 'Estimate your Total Daily Energy Expenditure and the calories to eat to lose, maintain, or gain weight, using the Mifflin-St Jeor formula.',
  tagline: 'Your daily energy expenditure, and calories to lose or gain.',
  categorySlug: 'health-fitness',
  tags: [
    'tdee calculator', 'daily calorie calculator', 'maintenance calories', 'calorie calculator',
    'total daily energy expenditure', 'bmr calculator', 'how many calories to maintain weight',
    'calories to lose weight', 'mifflin st jeor', 'macro calorie calculator', 'energy expenditure',
    'free tdee calculator', 'online calorie calculator', 'calorie needs calculator',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'energy',
  toolGroup: 'body-metrics',
  processorId: 'tdee',
  relatedTools: ['bmi-calculator', 'body-fat-calculator', 'macro-calculator'],
  methodology: {
    name: 'Mifflin-St Jeor equation',
    detail: 'Resting energy from Mifflin-St Jeor, scaled by the standard activity multipliers from sedentary to very active.',
  },
  guide: {
    slug: 'how-to-calculate-tdee',
    categorySlug: 'health-fitness',
    title: 'How to Calculate TDEE and Your Daily Calories',
    description: 'Learn what TDEE and BMR mean, how the Mifflin-St Jeor formula works, and how to turn the number into a calorie target for losing, holding, or gaining weight.',
    readMinutes: 6,
    updatedAt: '2026-07-23',
  },
};
