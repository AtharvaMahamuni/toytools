import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'compound-interest-calculator',
  name: 'Compound Interest Calculator',
  seoTitle: 'Compound Interest Calculator — Free Online Tool',
  description: 'Calculate compound interest and see the growth of savings or investments over time, with optional monthly contributions.',
  tagline: 'Watch savings grow, with optional monthly contributions.',
  categorySlug: 'money-finance',
  tags: ['compound interest', 'compound interest calculator', 'investment calculator', 'savings growth', 'interest calculator', 'future value calculator', 'how to calculate compound interest', 'compounding', 'monthly contribution calculator'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'interest',
  toolGroup: 'growth-calculators',
  processorId: 'compound-interest',
  relatedTools: ['savings-goal-calculator', 'rule-of-72-calculator', 'inflation-calculator'],
  methodology: {
    name: 'Periodic compounding formula',
    detail: 'Future value is FV = P(1 + r/n)^(n x t), so the compounding frequency you pick changes the answer, not just the rate.',
  },
  guide: {
    slug: 'how-compound-interest-works',
    categorySlug: 'finance',
    title: 'How Compound Interest Works',
    description: 'Understand how compound interest grows money over time, how compounding frequency and contributions matter, and the formula behind it.',
    readMinutes: 6,
    updatedAt: '2026-06-29',
  },
};
