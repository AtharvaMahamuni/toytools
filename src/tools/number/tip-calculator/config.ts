import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'tip-calculator',
  name: 'Tip Calculator',
  seoTitle: 'Tip Calculator: Split the Bill and Tip',
  description: 'Tip = bill times rate. A $60 bill at 20% is a $12 tip and $72 total, or $24 each split three ways. Nothing is uploaded.',
  tagline: 'The tip, the total, and the split between any number of people.',
  categorySlug: 'number-utilities',
  tags: ['tip calculator', 'gratuity calculator', 'how much to tip', 'split the bill', 'restaurant tip', 'tip percentage', 'bill splitter', 'calculate tip', 'numbers', 'math'],
  updatedAt: '2026-10-05',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  craft: {
    id: 'tip-round-up',
    kind: 'continuation',
    solves: 'The output stops at an exact total like $100.30, and the next thing anyone does at a table is round it to a figure they can write on the slip. Working out what that rounded number actually tipped is arithmetic done in your head, badly, while a server waits.',
  },
  toolGroup: 'everyday-calculators',
  relatedTools: ['percentage-calculator'],
  guide: {
    slug: 'tip-calculator',
    categorySlug: 'number-utilities',
    title: 'How Much to Tip, and How to Split a Bill',
    description: 'How much to tip in the US for restaurants, delivery and bars, tipping norms abroad, and how to work out 15, 18 or 20 percent in your head.',
    readMinutes: 6,
    updatedAt: '2026-10-05',
  },
};
