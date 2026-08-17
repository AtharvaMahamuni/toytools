import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'unix-timestamp-converter',
  name: 'Unix Timestamp Converter',
  seoTitle: 'Unix Timestamp Converter — Epoch to Date and Back',
  description: 'Convert a Unix timestamp to a human date, or a date back to a timestamp, in seconds or milliseconds, with the UTC time, ISO 8601 string, and your local time.',
  tagline: 'Unix timestamp to a date and back, in seconds or milliseconds.',
  categorySlug: 'date-time',
  tags: ['unix timestamp converter', 'epoch converter', 'unix time to date', 'timestamp to date', 'date to unix timestamp', 'epoch time', 'unix time', 'milliseconds to date'],
  updatedAt: '2026-07-10',
  isNew: true,
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-convert',
  family: 'timestamp',
  processorId: 'unix-timestamp',
  relatedTools: ['timezone-converter', 'date-difference-calculator'],
  guide: {
    slug: 'unix-timestamp-converter',
    categorySlug: 'datetime',
    title: 'How to Convert a Unix Timestamp to a Date',
    description: 'Learn what a Unix timestamp is, how the epoch works, how to convert seconds or milliseconds to a date, and how to turn a date back into a timestamp.',
    readMinutes: 4,
    updatedAt: '2026-07-10',
  },
};
