import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'uppercase-converter',
  name: 'Uppercase Converter',
  seoTitle: 'Convert Text to Uppercase Online',
  description: 'Convert any pasted text to UPPERCASE (all caps) in one click, then copy it. What you enter stays on your device.',
  tagline: 'Convert any text to UPPERCASE, then copy it.',
  categorySlug: 'text-utilities',
  tags: ['uppercase', 'uppercase converter', 'convert to uppercase', 'all caps', 'capital letters', 'text to uppercase', 'uppercase text generator', 'make text uppercase'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  processorId: 'uppercase',
  craft: {
    id: 'uppercase-turkish-i',
    kind: 'orientation',
    solves:
      'Locale-sensitive uppercase conversion changes the dotted lowercase "i" to "İ" in Turkic languages rather than standard ASCII "I".',
  },
  toolGroup: 'case-converters',
  relatedTools: ['lowercase-converter', 'title-case-converter', 'character-counter'],
  guide: {
    slug: 'how-to-convert-text-to-uppercase',
    categorySlug: 'text',
    title: 'How To Convert Text To Uppercase',
    description: 'Learn what uppercase means, when all-caps text is appropriate, and how to convert text to uppercase without retyping it.',
    readMinutes: 3,
    updatedAt: '2026-06-07',
  },};
