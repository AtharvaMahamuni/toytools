import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'inflation-calculator',
  name: 'Inflation Calculator',
  seoTitle: 'Inflation Calculator — Future Purchasing Power — Free Online Tool',
  description: 'See what your money will be worth after inflation, how much purchasing power is lost, and the future cost of the same goods.',
  categorySlug: 'money-finance',
  tags: ['inflation calculator', 'purchasing power', 'future value of money', 'inflation impact', 'cost of living calculator', 'real value', 'money worth over time', 'how inflation affects savings'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'inflation',
  processorId: 'inflation',
  relatedTools: ['compound-interest-calculator', 'rule-of-72-calculator', 'savings-goal-calculator'],
  guide: {
    slug: 'how-inflation-affects-money',
    categorySlug: 'finance',
    title: 'How Inflation Affects Your Money',
    description: 'Understand how inflation erodes purchasing power over time, how to read real vs nominal value, and the formula behind it.',
    readMinutes: 5,
    updatedAt: 'Jun 2026',
  },
};
