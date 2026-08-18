import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'markup-calculator',
  name: 'Markup Calculator',
  seoTitle: 'Markup Calculator — Markup % from Cost and Price',
  description: 'Find markup percentage from cost and selling price, or set a price from a target markup. Cost plus pricing, with profit and margin.',
  tagline: 'Markup percentage from cost and price, or price from a markup.',
  categorySlug: 'number-utilities',
  tags: ['markup calculator', 'markup percentage', 'cost plus pricing', 'markup formula', 'price from markup', 'markup vs margin', 'retail markup'],
  updatedAt: '2026-07-09',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  craft: {
    id: 'mk-below-cost',
    kind: 'guardrail',
    solves: 'A selling price under cost prints as a percentage like any other result, and a percentage is the one format that makes a loss easy to skim past. Someone pricing a clearance SKU reads minus twenty five percent as a markup figure rather than as money leaving on every unit sold.',
  },
  toolGroup: 'everyday-calculators',
  relatedTools: ['margin-calculator', 'percentage-calculator'],
  guide: {
    slug: 'markup-vs-margin',
    categorySlug: 'number',
    title: 'Markup vs Margin: How To Calculate Markup',
    description: 'Understand the difference between markup and margin, the markup formula, and how to price from a target markup.',
    readMinutes: 4,
    updatedAt: '2026-06-01',
  },
};
