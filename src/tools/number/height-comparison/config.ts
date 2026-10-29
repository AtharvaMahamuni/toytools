import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'height-comparison',
  name: 'Height Comparison',
  seoTitle: 'Height Comparison Chart in Feet and Inches',
  description: 'A height comparison chart in feet and inches or centimetres. Line up a person and a door and read the gap.',
  tagline: 'See heights on one chart, in feet or centimetres.',
  categorySlug: 'number-utilities',
  tags: ['chart', 'feet', 'inches'],
  updatedAt: '2026-10-28',
  addedOn: '2026-10-28',
  engine: 'calculator',
  pattern: 'calculate',
  family: 'arithmetic',
  trustVariant: 'private',
  methodology: {
    name: 'International inch (2.54 cm)',
    detail: 'Feet and inches use the international inch of 2.54 cm. The door, the rim, the counter, and the two adult averages are cited reference heights, not a medical formula.',
  },
  craft: {
    id: 'feet-inches-dot',
    kind: 'recovery',
    solves: 'Typing 5.11 to mean 5 feet 11 inches is read as decimal feet, about 5 feet 1 inch, and the chart looks plausible enough that the mistake is not obvious.',
  },
  job: {
    intent: 'compare',
    userJob: 'See several heights drawn to one scale, including a height you type, so the gap between them is visible.',
    repeatability: 'medium',
    interactionDepth: 'high',
    privacyValue: 'medium',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  citation: {
    problem: 'See several heights drawn to one scale, including a height you type, so the gap between them is visible.',
    nonGoal: 'look up celebrity or athlete heights, keep an account, or call a server.',
  },
  guide: {
    slug: 'height-comparison',
    categorySlug: 'number-utilities',
    title: 'How to Read a Height Comparison Chart',
    description: 'How feet and inches share one chart with a door, a rim, and the US adult averages, and why 5.11 is not 5 feet 11 inches.',
    readMinutes: 6,
    updatedAt: '2026-10-28',
  },
};
