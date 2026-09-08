import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'percentage-calculator',
  name: 'Percentage Calculator',
  seoTitle: 'Percentage Calculator — Free Online Tool',
  description: 'What is 15% of 80? That is 12. Also percentage change, and what percent X is of Y. Nothing is uploaded.',
  tagline: 'Percent of a number, or the change between two. On your device.',
  categorySlug: 'number-utilities',
  tags: ['numbers', 'percentage', 'math', 'calculate', 'calculate percentage online', 'percent calculator', 'percentage of a number', 'percentage increase calculator', 'how to calculate percentage', 'online percent calculator', 'percentage change', 'discount calculator'],
  updatedAt: '2026-09-08',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  craft: {
    id: 'pct-points',
    kind: 'orientation',
    solves: 'When both values are themselves rates, "from 20% to 25%" has two correct answers that people use interchangeably: a 25% change and a gap of 5 percentage points. The tool prints one of them as a bare number and a reader carrying the other never finds out they disagree.',
  },
  toolGroup: 'everyday-calculators',
  guide: {
    slug: 'how-to-calculate-percentages',
    categorySlug: 'number',
    title: 'How To Calculate Percentages',
    description: 'Understand what percentages mean, how the three core percentage formulas work, and where percentages come up in everyday life.',
    readMinutes: 5,
    updatedAt: '2026-06-02',
  },};
