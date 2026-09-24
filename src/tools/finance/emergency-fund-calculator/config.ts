import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'emergency-fund-calculator',
  name: 'Emergency Fund Calculator',
  seoTitle: 'Emergency Fund Calculator Online',
  description: 'Size an emergency fund (rainy day fund) from monthly expenses and track how far you are. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'How much emergency savings you need, and how far along you are.',
  categorySlug: 'money-finance',
  tags: ['emergency fund calculator', 'how much emergency fund', 'rainy day fund', 'emergency savings', 'months of expenses', 'financial safety net', 'how much to save for emergencies', 'emergency fund goal'],
  updatedAt: '2026-09-25',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'savings',
  processorId: 'emergency-fund',
  relatedTools: ['savings-goal-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  methodology: {
    name: 'Months of essential expenses',
    detail: 'Sized from essential monthly outgoings rather than income, because what a fund has to cover is what you must keep paying.',
  },
  guide: {
    slug: 'how-much-emergency-fund',
    categorySlug: 'finance',
    title: 'How Much Emergency Fund Do You Need?',
    description: 'Learn how to size an emergency fund from monthly expenses and build it. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 5,
    updatedAt: '2026-09-25',
  },
};
