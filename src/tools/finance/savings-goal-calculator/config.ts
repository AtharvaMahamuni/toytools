import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'savings-goal-calculator',
  name: 'Savings Goal Calculator',
  seoTitle: 'Savings Goal Calculator — Monthly Savings',
  description: 'Work out how much to save each month to reach a savings goal by a target date, including expected investment returns.',
  tagline: 'How much to save each month to hit a goal by a target date.',
  categorySlug: 'money-finance',
  tags: ['savings goal calculator', 'how much to save', 'monthly savings calculator', 'savings target', 'save for a goal', 'savings plan', 'how much to save per month', 'goal based saving'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'savings',
  processorId: 'savings-goal',
  relatedTools: ['compound-interest-calculator', 'emergency-fund-calculator', 'inflation-calculator'],
  guide: {
    slug: 'how-to-reach-a-savings-goal',
    categorySlug: 'finance',
    title: 'How to Reach a Savings Goal',
    description: 'Learn how to work out the monthly saving needed to reach a goal, how returns reduce what you contribute, and the formula behind it.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
};
