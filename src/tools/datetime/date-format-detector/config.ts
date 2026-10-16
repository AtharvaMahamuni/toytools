import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'date-format-detector',
  name: 'Date Format Detector',
  seoTitle: 'Date Format Detector: DD/MM, MM/DD, ISO 8601',
  description:
    'Is this date day first or month first, DD/MM vs MM/DD? See how it will be parsed when an Excel locale guess is wrong. Nothing is uploaded.',
  tagline: 'Both readings when a date could be day first or month first.',
  categorySlug: 'date-time',
  tags: ['ambiguous date', 'dd/mm', 'mm/dd', 'date format', 'excel dates', 'iso 8601'],
  keywords: [
    'is this date dd/mm or mm/dd',
    'is this date day first or month first',
    'ambiguous date format',
    'how will this date be parsed',
    'excel date locale wrong',
    'iso 8601 vs us date',
  ],
  updatedAt: '2026-10-16',
  addedOn: '2026-10-16',
  trustVariant: 'private',
  engine: 'datetime',
  pattern: 'datetime-convert',
  family: 'parse',
  processorId: 'date-format',
  inputs: ['text'],
  outputs: ['metric'],
  relatedTools: ['timezone-converter', 'unix-timestamp-converter', 'date-difference-calculator'],
  craft: {
    id: 'date-ambiguous-rows',
    kind: 'orientation',
    solves:
      'A column mixes dates that have one reading with dates that swap month and day, and the rows where both numbers are 12 or under are easy to miss.',
  },
  citation: {
    problem: 'See which dates in a pasted list can be read as two different days, on this device.',
    nonGoal: 'pick a locale, rewrite the column, or decide which reading a spreadsheet will store.',
  },
  job: {
    intent: 'analyze',
    userJob: 'See which dates in a pasted list can be read as two different days, on this device.',
    repeatability: 'medium',
    interactionDepth: 'medium',
    privacyValue: 'medium',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'date-format-detector',
    categorySlug: 'datetime',
    title: 'When a Date Can Be Read Two Ways',
    description:
      'How 03/04/2026 is both 3 April and 4 March, which rows have one reading, and what a missing time zone or a two-digit year changes.',
    readMinutes: 6,
    updatedAt: '2026-10-16',
  },
};
