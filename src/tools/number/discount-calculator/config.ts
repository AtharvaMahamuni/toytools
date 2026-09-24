import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'discount-calculator',
  name: 'Discount Calculator',
  seoTitle: 'Discount Calculator Online',
  description: 'Sale price after a percent off, or a fixed amount off. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Sale price and how much you save, by percentage or amount.',
  categorySlug: 'number-utilities',
  tags: ['discount calculator', 'sale price calculator', 'percent off calculator', 'how much you save', 'price after discount', 'markdown calculator', 'numbers', 'math'],
  isNew: true,
  updatedAt: '2026-09-25',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  craft: {
    id: 'disc-stack',
    kind: 'continuation',
    solves: 'Shop signage stacks discounts, and thirty percent off plus an extra twenty at the till reads as fifty percent off to almost everyone. It is forty four. The tool computes one discount at a time and offers no way to chain them, so the second one gets applied to the wrong base or not at all.',
  },
  toolGroup: 'everyday-calculators',
  relatedTools: ['percentage-calculator'],
  guide: {
    slug: 'discount-calculator',
    categorySlug: 'number-utilities',
    title: 'Discount Calculator: Complete Guide',
    description: 'Calculate percentage or fixed-amount discounts and sale price. Runs entirely on your device. Nothing is uploaded.',
    readMinutes: 4,
    updatedAt: '2026-09-25',
  },
};
