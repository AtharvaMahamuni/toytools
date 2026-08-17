import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sip-calculator',
  name: 'SIP Calculator',
  seoTitle: 'SIP Calculator — Monthly Investment Returns',
  description: 'Calculate the future value of a monthly SIP investment, the total you contribute, and the wealth your returns add over time.',
  tagline: 'Future value of a monthly SIP, and what returns add on top.',
  categorySlug: 'money-finance',
  tags: ['sip calculator', 'systematic investment plan', 'monthly investment calculator', 'sip return calculator', 'mutual fund sip', 'sip maturity value', 'monthly sip returns', 'investment growth'],
  updatedAt: '2026-07-02',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'savings',
  toolGroup: 'growth-calculators',
  processorId: 'sip',
  relatedTools: ['compound-interest-calculator', 'savings-goal-calculator', 'inflation-calculator'],
  guide: {
    slug: 'how-a-sip-grows-your-money',
    categorySlug: 'finance',
    title: 'How a SIP Grows Your Money',
    description: 'Learn how a systematic investment plan compounds monthly instalments, the formula behind SIP returns, and how to read the results.',
    readMinutes: 5,
    updatedAt: '2026-07-02',
  },
};
