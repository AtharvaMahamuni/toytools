import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'upi-1999-split',
  name: 'UPI 1999 Split',
  seoTitle: 'UPI 1999 Split: a meme calculator, not advice',
  description:
    'Meme calculator for the viral 1999 rupee split. Not tax, legal, or payments advice. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'A meme split into 1999 rupee chunks. Not advice.',
  categorySlug: 'money-finance',
  tags: ['meme calculator'],
  updatedAt: '2026-09-18',
  isNew: true,
  trustVariant: 'local',
  engine: 'finance',
  pattern: 'finance-planning',
  family: 'savings',
  processorId: 'upi-1999-split',
  relatedTools: ['tax-calculator', 'tip-calculator', 'discount-calculator'],
  inputs: ['rupees'],
  outputs: ['chunk list'],
  citation: {
    problem: 'Use this page when someone wants the viral 1999 rupee chunk list for an amount.',
    nonGoal: 'send a payment or call an AI model. It is not tax or payments advice.',
  },
  craft: {
    id: 'upi-split-meme',
    kind: 'orientation',
    solves:
      'A viral claim says a UPI payment above 2000 rupees is taxed, so a chunk list looks like a way to dodge a fee. The page says the claim is false and that the chunks still add up to the same total.',
  },
  guide: {
    slug: 'upi-1999-split-is-a-meme',
    categorySlug: 'finance',
    title: 'UPI 1999 Split Is a Meme, Not Advice',
    description:
      'The 2000 rupee UPI tax claim is false. This meme calculator shows locked 1999 chunks and nothing else.',
    readMinutes: 6,
    updatedAt: '2026-09-18',
  },
};
