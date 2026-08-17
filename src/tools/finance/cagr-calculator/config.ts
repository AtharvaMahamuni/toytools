import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'cagr-calculator',
  name: 'CAGR Calculator',
  seoTitle: 'CAGR Calculator — Compound Annual Growth Rate',
  description: 'Calculate compound annual growth rate live from a start value, end value and period: your annualized return, total growth and doubling time.',
  tagline: 'Compound annual growth rate, total growth and doubling time.',
  categorySlug: 'money-finance',
  tags: ['cagr calculator', 'compound annual growth rate', 'annualized return calculator', 'cagr formula', 'growth rate calculator', 'annual growth rate', 'investment growth calculator', 'revenue cagr'],
  updatedAt: '2026-07-04',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'interest',
  toolGroup: 'growth-calculators',
  processorId: 'cagr',
  relatedTools: ['roi-calculator', 'rule-of-72-calculator', 'compound-interest-calculator'],
  methodology: {
    name: 'Compound annual growth rate',
    detail: 'The single annual rate that turns the start value into the end value over the period, which is why it is lower than total growth divided by years.',
  },
  guide: {
    slug: 'what-is-cagr-and-how-to-calculate-it',
    categorySlug: 'finance',
    title: 'What Is CAGR and How to Calculate It',
    description: 'Learn what compound annual growth rate means, the formula behind it, why it beats simple averages, and where it misleads.',
    readMinutes: 4,
    updatedAt: '2026-07-04',
  },
};
