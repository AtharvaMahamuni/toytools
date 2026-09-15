import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'statistics-visualizer',
  name: 'Statistics Visualizer',
  seoTitle: 'Statistics Visualizer: Mean, Median, SD, Histogram',
  description:
    'Paste a list of numbers for mean, median, mode, quartiles, and standard deviation with a live histogram and box plot. Runs in your browser; nothing is uploaded.',
  tagline: 'Paste numbers. See mean, spread, histogram, and box plot.',
  categorySlug: 'applied-math',
  tags: [
    'standard deviation calculator',
    'mean median mode',
    'histogram maker',
    'box plot generator',
  ],
  updatedAt: '2026-09-15',
  isNew: true,
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'statistics',
  processorId: 'statistics',
  craft: {
    id: 'stats-shape',
    kind: 'orientation',
    solves:
      'Incumbents dump mean, median, and SD as a table of numbers with no chart, and often upload the paste to a server. The shape of the data (skew, spread, outliers) stays invisible until a histogram and box plot are drawn together on-device.',
  },
  relatedTools: [
    'probability-calculator',
    'combinations-permutations-calculator',
    'fraction-calculator',
    'prime-factorization-calculator',
  ],
  guide: {
    slug: 'statistics-visualizer',
    categorySlug: 'applied-math',
    title: 'How to Read Mean, Median, SD, Histogram, Box Plot',
    description:
      'What mean, median, mode, quartiles, and standard deviation each tell you, how to read a histogram with a box plot, and when to use sample versus population SD.',
    readMinutes: 6,
    updatedAt: '2026-09-15',
  },
};
