import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'roi-calculator',
  name: 'ROI Calculator',
  seoTitle: 'ROI Calculator — Return on Investment, Annualized Return',
  description: 'Calculate return on investment from what you paid and what it is worth now, including the annualized return most ROI tools skip.',
  categorySlug: 'money-finance',
  tags: ['roi calculator', 'return on investment calculator', 'investment return calculator', 'roi formula', 'annualized return calculator', 'investment gain calculator', 'roi percentage', 'stock return calculator'],
  updatedAt: '2026-07-04',
  isNew: true,
  trustVariant: 'private',
  engine: 'finance',
  pattern: 'finance-growth',
  family: 'interest',
  processorId: 'roi',
  relatedTools: ['cagr-calculator', 'compound-interest-calculator', 'inflation-calculator'],
  guide: {
    slug: 'how-to-calculate-return-on-investment',
    categorySlug: 'finance',
    title: 'How to Calculate Return on Investment',
    description: 'Learn the ROI formula, why the annualized return matters more than the headline percentage, and how to read gains and losses honestly.',
    readMinutes: 4,
    updatedAt: 'Jul 2026',
  },
};
