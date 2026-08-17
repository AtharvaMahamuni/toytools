import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'inflation-calculator',
  name: 'Inflation Calculator',
  seoTitle: 'Inflation Calculator — Future Purchasing Power',
  description: 'See what your money will be worth after inflation, how much purchasing power is lost, and the future cost of the same goods.',
  tagline: 'What your money will be worth later, and what it will cost.',
  categorySlug: 'money-finance',
  tags: ['inflation calculator', 'purchasing power', 'future value of money', 'inflation impact', 'cost of living calculator', 'real value', 'money worth over time', 'how inflation affects savings'],
  updatedAt: '2026-06-29',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'inflation',
  toolGroup: 'growth-calculators',
  processorId: 'inflation',
  relatedTools: ['compound-interest-calculator', 'rule-of-72-calculator', 'savings-goal-calculator'],
  methodology: {
    name: 'Periodic compounding formula',
    detail: 'Inflation compounds the same way interest does, so purchasing power falls geometrically rather than in a straight line.',
  },
  guide: {
    slug: 'how-inflation-affects-money',
    categorySlug: 'finance',
    title: 'How Inflation Affects Your Money',
    description: 'Understand how inflation erodes purchasing power over time, how to read real vs nominal value, and the formula behind it.',
    readMinutes: 5,
    updatedAt: '2026-06-29',
  },
};
