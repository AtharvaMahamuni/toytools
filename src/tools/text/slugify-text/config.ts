import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'slugify-text',
  name: 'Slugify Text',
  seoTitle: 'Slugify Text — URL Slug Generator Online',
  description: 'Make any text into a clean, lowercase, hyphenated URL slug.',
  categorySlug: 'text-utilities',
  tags: ['slugify text', 'url slug generator', 'text to slug', 'make a slug', 'slug generator', 'permalink generator', 'slugify online'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-transform',
  family: 'transform',
  craft: {
    id: 'slug-empty',
    kind: 'guardrail',
    solves: 'A line with no ASCII alphanumerics slugifies to an empty string, so a list of titles quietly loses rows. Nothing in the output says a line was there, which is the worst shape of data loss a text tool can have.',
  },
  processorId: 'slugify',
  guide: {
    slug: 'how-to-slugify-text',
    categorySlug: 'text',
    title: 'How To Slugify Text',
    description: 'Learn what a URL slug is, why clean slugs matter for SEO, and how to turn any title into a safe, hyphenated slug.',
    readMinutes: 3,
    updatedAt: '2026-06-01',
  },
};
