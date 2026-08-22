import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'coin-flipper',
  name: 'Coin Flipper',
  seoTitle: 'Coin Flip: Flip a Coin Online, Once or 500 Times',
  description: 'A coin toss in your browser, once or five hundred times at once. Heads or tails, yes or no, true or false, with a tally and how ordinary that split is.',
  tagline: 'Flip a coin once, or five hundred times, and see the split.',
  categorySlug: 'generate',
  tags: ['coin flip', 'flip a coin', 'coin flipper', 'heads or tails', 'coin toss', 'random yes or no', 'virtual coin', 'online coin flip'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-chance',
  family: 'chance',
  processorId: 'coin-flip',
  craft: {
    id: 'coin-streak',
    kind: 'orientation',
    solves:
      'Somebody flips ten times, lands eight heads, and concludes the tool is rigged. Every coin flipper collects that complaint and answers it with a reassurance, which convinces nobody. What the person needs is the share of ten-flip runs that come out at least that lopsided, because that number is checkable and a promise is not.',
  },
  relatedTools: ['dice-roller', 'random-choice-picker', 'random-name-picker', 'probability-calculator'],
  keywords: ['heads or tails', 'coin toss', 'random yes or no'],
  inputs: ['count'],
  outputs: ['text'],
  guide: {
    slug: 'coin-flipper',
    categorySlug: 'generate',
    title: 'Heads or Tails, and Why a Lopsided Run Is Normal',
    description: 'What a fair coin actually looks like over ten flips, why eight heads is nothing to worry about, and when a coin toss is the right way to decide something.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
