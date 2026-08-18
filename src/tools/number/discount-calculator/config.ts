import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'discount-calculator',
  name: 'Discount Calculator',
  seoTitle: 'Discount Calculator — Free Online Tool',
  description: 'Calculate the sale price and what you save from a percent off or fixed-amount discount.',
  tagline: 'Sale price and how much you save, by percentage or amount.',
  categorySlug: 'number-utilities',
  tags: ['discount calculator', 'sale price calculator', 'percent off calculator', 'how much you save', 'price after discount', 'markdown calculator', 'numbers', 'math'],
  isNew: true,
  updatedAt: '2026-06-14',
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
    description: 'Learn how to calculate percentage discounts, stack coupons, and find the sale price. Includes examples, formulas, and common mistakes.',
    readMinutes: 4,
    updatedAt: '2026-06-15',
  },
};
