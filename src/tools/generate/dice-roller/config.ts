import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'dice-roller',
  name: 'Dice Roller',
  seoTitle: 'Dice Roller: Roll d20, 2d6 and Any Dice Online',
  description: 'Virtual dice for DND, board games and classrooms. Roll d20, 2d6 or 4d8+3 by notation, and see every die, the total, and how likely that roll was.',
  tagline: 'Roll any dice by notation, and see how likely the result was.',
  categorySlug: 'generate',
  tags: ['dice roller', 'roll a dice', 'd20 roller', 'roll 2d6', 'virtual dice', 'online dice', 'dnd dice roller', 'random dice'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-chance',
  family: 'chance',
  processorId: 'dice',
  craft: {
    id: 'dice-odds',
    kind: 'orientation',
    solves:
      'A total on its own says nothing about whether it was a good roll. 2d6 and 1d12 share a range and share almost nothing in the middle, so a player choosing between a bigger die and a flat bonus, or deciding whether a 14 was lucky, is working from a feel for dice that is famously wrong.',
  },
  relatedTools: ['coin-flipper', 'random-choice-picker', 'random-name-picker', 'probability-calculator'],
  keywords: ['d20', '2d6', 'dice notation', 'tabletop dice'],
  inputs: ['notation'],
  outputs: ['number'],
  guide: {
    slug: 'dice-roller',
    categorySlug: 'generate',
    title: 'Dice Notation, and What Your Roll Was Actually Worth',
    description: 'How to read 4d6+2, why 2d6 and 1d12 behave nothing alike, and how to work out the odds of clearing a target number before you commit to a build.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
