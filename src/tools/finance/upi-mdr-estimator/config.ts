import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'upi-mdr-estimator',
  name: 'UPI MDR Estimator',
  seoTitle: 'UPI MDR Estimator: a merchant charge, not a tax',
  description:
    'Estimate merchant MDR from the 15 Sep 2026 PIB note. Not a tax you owe. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Estimate merchant MDR in rupees. Not a tax you owe.',
  categorySlug: 'money-finance',
  tags: ['mdr'],
  updatedAt: '2026-09-18',
  isNew: true,
  trustVariant: 'local',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'estimator',
  processorId: 'upi-mdr-estimator',
  relatedTools: ['upi-1999-split', 'tax-calculator'],
  inputs: ['rupees', 'payment kind'],
  outputs: ['mdr rupees'],
  craft: {
    id: 'upi-mdr-estimate',
    kind: 'orientation',
    solves:
      'A merchant quote can look like a tax the customer must pay. The line names the charge as an ecosystem charge on some merchant payments, not a fee the customer owes, and not a government tax.',
  },
  guide: {
    slug: 'what-upi-mdr-means',
    categorySlug: 'finance',
    title: 'What UPI MDR Means, and What It Does Not',
    description:
      'The 15 Sep 2026 PIB note on P2P UPI, MDR, and the four merchant kinds this page will estimate. Not a tax.',
    readMinutes: 6,
    updatedAt: '2026-09-18',
  },
};
