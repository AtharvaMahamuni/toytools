import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'rule-of-72-calculator',
  name: 'Rule of 72 Calculator',
  seoTitle: 'Rule of 72 Calculator — Doubling Time — Free Online Tool',
  description: 'Estimate how long it takes for money to double at a given rate of return using the Rule of 72.',
  tagline: 'How long money takes to double at a given rate of return.',
  categorySlug: 'money-finance',
  tags: ['rule of 72', 'rule of 72 calculator', 'doubling time', 'how long to double money', 'investment doubling', 'compound growth', 'rate of return', 'time to double'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'interest',
  toolGroup: 'growth-calculators',
  processorId: 'rule-of-72',
  relatedTools: ['compound-interest-calculator', 'inflation-calculator', 'savings-goal-calculator'],
  guide: {
    slug: 'what-is-the-rule-of-72',
    categorySlug: 'finance',
    title: 'What Is the Rule of 72?',
    description: 'Learn the Rule of 72 shortcut for estimating how long an investment takes to double, when it is accurate, and how it compares to the exact formula.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
};
