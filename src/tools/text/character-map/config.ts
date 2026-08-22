import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'character-map',
  name: 'Character Map',
  seoTitle: 'Character Map: Find and Copy Any Special Character',
  description: 'A unicode symbols picker you search by name. Tap to copy symbols: arrows, currency, maths, Greek, accents and fractions, with the escape for each.',
  tagline: 'Search special characters by name and tap to copy any of them.',
  categorySlug: 'text-utilities',
  tags: ['character map', 'special characters', 'copy paste symbols', 'unicode characters', 'symbol picker', 'html entity list', 'text symbols'],
  updatedAt: '2026-08-22',
  isNew: true,
  trustVariant: 'private',
  engine: 'text-interactive',
  pattern: 'text-interactive',
  family: 'character-map',
  craft: {
    id: 'cm-escapes',
    kind: 'continuation',
    solves:
      'A character map stops at copying the glyph, and the task does not. The character is headed for an HTML file, a stylesheet or a string literal, where a raw glyph mangles under the wrong encoding and has to become an escape whose syntax nobody remembers off the top of their head.',
  },
  relatedTools: ['invisible-character-detector', 'html-entity-encoder-decoder', 'remove-emoji', 'remove-accents'],
  keywords: ['unicode', 'symbol', 'html entity', 'code point'],
  inputs: ['search'],
  outputs: ['character'],
  guide: {
    slug: 'character-map',
    categorySlug: 'text',
    title: 'Finding a Character and Making It Survive',
    description: 'Searching by name instead of by shape, what a code point is, and when to paste the glyph rather than an escape that survives anything.',
    readMinutes: 5,
    updatedAt: '2026-08-22',
  },
};
