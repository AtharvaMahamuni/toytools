import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'body-fat-calculator',
  name: 'Body Fat Calculator',
  seoTitle: 'Body Fat Percentage Calculator (Bodyfat, Navy Method)',
  description: 'Estimate your body fat percentage with the U.S. Navy tape-measure method, plus your fat mass and lean mass, in metric or imperial.',
  tagline: 'Body fat percentage by the Navy tape method, plus fat and lean mass.',
  categorySlug: 'health-fitness',
  tags: [
    'body fat calculator', 'body fat percentage', 'navy body fat', 'us navy body fat calculator',
    'body fat percentage calculator', 'lean body mass', 'fat mass calculator', 'tape measure body fat',
    'body composition', 'how to measure body fat', 'body fat formula',
    'free body fat calculator', 'online body fat calculator', 'estimate body fat',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  toolGroup: 'body-metrics',
  processorId: 'body-fat',
  relatedTools: ['bmi-calculator', 'tdee-calculator'],
  guide: {
    slug: 'how-to-measure-body-fat',
    categorySlug: 'health-fitness',
    title: 'How to Measure Body Fat With a Tape Measure',
    description: 'Learn the U.S. Navy body fat method, exactly where to measure, how accurate it is, and how body fat differs from BMI as a health signal.',
    readMinutes: 6,
    updatedAt: 'Jul 2026',
  },
};
