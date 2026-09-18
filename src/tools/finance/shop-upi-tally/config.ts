import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'shop-upi-tally',
  name: 'Shop UPI Tally',
  seoTitle: 'Shop UPI Tally: a local monthly receipt total',
  description:
    'A local monthly tally of shop UPI receipts, not a bank status. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'A local monthly tally of your shop UPI receipts.',
  categorySlug: 'money-finance',
  tags: ['tally'],
  updatedAt: '2026-09-18',
  isNew: true,
  trustVariant: 'local',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'tally',
  processorId: 'shop-upi-tally',
  relatedTools: ['upi-mdr-estimator'],
  inputs: ['receipt amount'],
  outputs: ['month total'],
  craft: {
    id: 'shop-upi-tally',
    kind: 'orientation',
    solves:
      'A shop total near 1,00,000 looks like a merchant-status switch. This tally is the shop own count, and crossing or staying under that line here does not change bank or NPCI status.',
  },
  guide: {
    slug: 'what-a-shop-upi-tally-counts',
    categorySlug: 'finance',
    title: 'What a Shop UPI Tally Counts, and What It Does Not',
    description:
      'Add receipts on this device, watch the local month total, and keep the 1,00,000 line as a reference, not a status change.',
    readMinutes: 6,
    updatedAt: '2026-09-18',
  },
};
