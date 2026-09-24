import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'savings-goal-calculator',
  name: 'Savings Goal Calculator',
  seoTitle: 'Savings Goal Calculator Online',
  description: 'Work out how much to save monthly to hit a goal by a date, with optional returns. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'How much to save each month to hit a goal by a target date.',
  categorySlug: 'money-finance',
  tags: ['savings goal calculator', 'how much to save', 'monthly savings calculator', 'savings target', 'save for a goal', 'savings plan', 'how much to save per month', 'goal based saving'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'savings',
  processorId: 'savings-goal',
  relatedTools: ['compound-interest-calculator', 'emergency-fund-calculator', 'inflation-calculator'],
  methodology: {
    name: 'Future value of an annuity',
    detail: 'Solves the annuity formula for the contribution, so the monthly figure already accounts for the growth on what you have paid in.',
  },
  guide: {
    slug: 'how-to-reach-a-savings-goal',
    categorySlug: 'finance',
    title: 'How to Reach a Savings Goal',
    description: 'Work out the monthly saving needed to reach a goal by a date. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 5,
    updatedAt: '2026-09-25',
  },
};
