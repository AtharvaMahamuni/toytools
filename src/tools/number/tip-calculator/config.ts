import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'tip-calculator',
  name: 'Tip Calculator',
  seoTitle: 'Tip Calculator — Free Online Tool',
  description: 'Calculate the tip and total bill, and split the cost between any number of people.',
  categorySlug: 'number-utilities',
  tags: ['tip calculator', 'gratuity calculator', 'how much to tip', 'split the bill', 'restaurant tip', 'tip percentage', 'bill splitter', 'calculate tip', 'numbers', 'math'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  relatedTools: ['percentage-calculator'],
  guide: {
    slug: 'tip-calculator',
    categorySlug: 'number-utilities',
    title: 'Tip Calculator: Complete Guide',
    description: 'Learn how much to tip, how to calculate a tip by hand, how to split a bill, and common tipping mistakes. Covers US norms and international customs.',
    readMinutes: 4,
    updatedAt: '2026-06-15',
  },
};
