import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'emergency-fund-calculator',
  name: 'Emergency Fund Calculator',
  seoTitle: 'Emergency Fund Calculator — How Much to Save',
  description: 'Work out how much emergency savings you need based on monthly expenses, and track your progress toward the target.',
  tagline: 'How much emergency savings you need, and how far along you are.',
  categorySlug: 'money-finance',
  tags: ['emergency fund calculator', 'how much emergency fund', 'rainy day fund', 'emergency savings', 'months of expenses', 'financial safety net', 'how much to save for emergencies', 'emergency fund goal'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'savings',
  processorId: 'emergency-fund',
  relatedTools: ['savings-goal-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  guide: {
    slug: 'how-much-emergency-fund',
    categorySlug: 'finance',
    title: 'How Much Emergency Fund Do You Need?',
    description: 'Learn how to size an emergency fund from your monthly expenses, how many months to aim for, and how to build it.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
};
