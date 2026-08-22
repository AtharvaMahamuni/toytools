import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'text-repeater',
  name: 'Text Repeater',
  seoTitle: 'Text Repeater: Repeat Any Text X Times Online',
  description: 'Repeat a word or duplicate a line as many times as you need, with a separator you choose and optional numbering. Warns before the output gets huge.',
  tagline: 'Repeat text as many times as you need, separated how you like.',
  categorySlug: 'text-utilities',
  tags: ['text repeater', 'repeat text', 'repeat text online', 'repeat a word', 'duplicate text', 'repeat line', 'text multiplier'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'repeat',
  craft: {
    id: 'rep-size',
    kind: 'guardrail',
    solves:
      'The copy count is a number field, so an extra zero costs one keystroke and produces a multi-megabyte string. The tab locks while it renders, the paste that follows is refused by whatever field it was headed for, and nothing warned anybody until it had already happened.',
  },
  relatedTools: ['remove-duplicate-lines', 'find-replace', 'character-counter', 'lorem-ipsum-generator'],
  keywords: ['repeat a word', 'padding text', 'test data'],
  inputs: ['text'],
  outputs: ['text'],
  guide: {
    slug: 'text-repeater',
    categorySlug: 'text',
    title: 'Repeating Text Without Breaking the Paste',
    description: 'Choosing a separator, numbering each copy, generating test data of a known length, and why a repeat count is the easiest field on the page to get wrong.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
