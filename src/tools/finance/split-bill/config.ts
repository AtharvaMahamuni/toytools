import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'split-bill',
  name: 'Split Bill',
  seoTitle: 'Split Bill: equal shares that add up',
  description:
    'Split a dinner bill so leftover paise land on the last person. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Split a dinner bill so every share adds up.',
  categorySlug: 'money-finance',
  tags: ['bill'],
  updatedAt: '2026-09-18',
  isNew: true,
  trustVariant: 'local',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'bill',
  processorId: 'split-bill',
  relatedTools: ['tip-calculator', 'upi-mdr-estimator'],
  inputs: ['bill', 'people', 'tip percent'],
  outputs: ['each share'],
  craft: {
    id: 'bill-split-fair',
    kind: 'verification',
    solves:
      'Equal shares that round on their own stop adding up to the bill, so the last rupee or paise gets argued over. The last person takes the leftover so the shares still sum to the total.',
  },
  guide: {
    slug: 'how-a-fair-bill-split-works',
    categorySlug: 'finance',
    title: 'How a Fair Bill Split Keeps the Shares Honest',
    description:
      'Add an optional tip, then split the total so leftover paise land on the last person and the shares still add up.',
    readMinutes: 6,
    updatedAt: '2026-09-18',
  },
};
