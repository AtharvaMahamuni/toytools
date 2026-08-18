import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'margin-calculator',
  name: 'Margin Calculator',
  seoTitle: 'Margin Calculator — Free Online Tool',
  description: 'Calculate gross margin percentage, gross profit, and markup from cost and selling price.',
  tagline: 'Gross margin, gross profit and markup from cost and price.',
  categorySlug: 'number-utilities',
  tags: ['margin calculator', 'gross margin', 'profit margin calculator', 'markup calculator', 'gross profit', 'margin vs markup', 'profit percentage', 'numbers', 'math'],
  isNew: true,
  updatedAt: '2026-06-14',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  craft: {
    id: 'mgn-below-cost',
    kind: 'guardrail',
    solves: 'A selling price under cost prints as a percentage like any other result, and a percentage is the one format that makes a loss easy to skim past. Someone pricing a clearance SKU reads minus twenty five percent as a margin figure rather than as money leaving on every unit sold.',
  },
  toolGroup: 'everyday-calculators',
  relatedTools: ['percentage-calculator'],
  guide: {
    slug: 'margin-calculator',
    categorySlug: 'number-utilities',
    title: 'Margin Calculator: Complete Guide',
    description: 'Learn the difference between gross margin and markup, how to price for a target margin, and what good margins look like by industry.',
    readMinutes: 5,
    updatedAt: '2026-06-15',
  },
};
