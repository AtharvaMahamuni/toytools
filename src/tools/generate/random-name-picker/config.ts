import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'random-name-picker',
  name: 'Random Name Picker',
  seoTitle: 'Random Name Picker: Draw From a List',
  description: 'Draw names with a classroom picker or raffle draw; a quieter wheel of names, without repeats. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Draw names from a pasted list, with no accidental repeats.',
  categorySlug: 'generate',
  tags: ['random name picker', 'name picker', 'random name generator from list', 'raffle picker', 'wheel of names alternative', 'pick a random name', 'classroom name picker'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'generation',
  pattern: 'generate-chance',
  family: 'chance',
  processorId: 'name-picker',
  craft: {
    id: 'name-duplicates',
    kind: 'guardrail',
    solves:
      'Lists arrive pasted from a register, a chat thread or a signup sheet, and a name sitting in there twice quietly gets two chances in a draw everyone was told was fair. Nothing on screen shows it, the draw looks correct, and the person who benefits has no idea either.',
  },
  relatedTools: ['random-choice-picker', 'remove-duplicate-lines', 'dice-roller'],
  keywords: ['raffle', 'classroom draw', 'standup order'],
  inputs: ['list'],
  outputs: ['name'],
  guide: {
    slug: 'random-name-picker',
    categorySlug: 'generate',
    title: 'Drawing Names Fairly From a List You Pasted',
    description: 'How to draw one name or several without repeats, why a duplicated entry breaks a raffle, and what to do when the same person keeps coming up.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
