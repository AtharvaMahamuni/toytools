import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'random-choice-picker',
  name: 'Random Choice Picker',
  seoTitle: 'Random Choice Picker: Let It Decide For You',
  description: 'Paste your options one per line and let it choose, or shuffle the list into a random order. Settles what should I eat, and who goes first.',
  tagline: 'Paste the options, let it choose, or shuffle them into an order.',
  categorySlug: 'generate',
  tags: ['random choice picker', 'random picker', 'decision maker', 'what should i eat', 'random option picker', 'pick for me', 'random list shuffler'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-chance',
  family: 'chance',
  processorId: 'choice-picker',
  craft: {
    id: 'choice-split',
    kind: 'recovery',
    solves:
      'People type their options the way they say them, on one line with commas or the word or between them. A picker that reads lines then holds exactly one option and picks it with total confidence, which is a wrong answer wearing the costume of a right one.',
  },
  relatedTools: ['random-name-picker', 'coin-flipper', 'dice-roller', 'remove-duplicate-lines'],
  keywords: ['decision maker', 'shuffle a list', 'pick for me'],
  inputs: ['list'],
  outputs: ['choice'],
  guide: {
    slug: 'random-choice-picker',
    categorySlug: 'generate',
    title: 'Letting a Random Picker Settle a Stuck Decision',
    description: 'How to pick one option or rank them all, why a comma-separated line breaks a picker, and when handing a decision to chance is the right move.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
