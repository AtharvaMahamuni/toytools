import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'compound-interest-calculator',
  name: 'Compound Interest Calculator',
  seoTitle: 'Compound Interest Calculator Online',
  description: 'See compound interest growth on a principal with optional monthly additions. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Watch savings grow, with optional monthly contributions.',
  categorySlug: 'money-finance',
  tags: ['compound interest', 'compound interest calculator', 'investment calculator', 'savings growth', 'interest calculator', 'future value calculator', 'how to calculate compound interest', 'compounding', 'monthly contribution calculator'],
  updatedAt: '2026-09-25',
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
    description: 'Understand compound interest growth, frequency, and contributions. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 6,
    updatedAt: '2026-09-25',
  },
};
