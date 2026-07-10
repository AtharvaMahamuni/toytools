import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'timezone-converter',
  name: 'Timezone Converter',
  seoTitle: 'Timezone Converter — Convert Time Between Zones, Free Online',
  description: 'Convert a date and time from one timezone to another, with the UTC time, each zone offset, and the exact hours difference. Daylight saving handled automatically.',
  categorySlug: 'date-time',
  tags: ['timezone converter', 'time zone converter', 'convert time between time zones', 'utc converter', 'time difference between cities', 'gmt converter', 'world clock converter', 'time conversion'],
  updatedAt: '2026-07-10',
  isNew: true,
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-convert',
  family: 'timezone',
  processorId: 'timezone',
  relatedTools: ['age-calculator', 'date-difference-calculator'],
  guide: {
    slug: 'timezone-converter',
    categorySlug: 'datetime',
    title: 'How to Convert Time Between Timezones',
    description: 'Learn how a wall-clock time in one timezone maps to another, how UTC offsets and daylight saving work, and how to read the difference between two cities.',
    readMinutes: 4,
    updatedAt: 'Jul 2026',
  },
};
