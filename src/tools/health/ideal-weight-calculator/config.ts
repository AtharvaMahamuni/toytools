import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'ideal-weight-calculator',
  name: 'Ideal Weight Calculator',
  seoTitle: 'Ideal Weight Calculator — Devine, Robinson & Healthy Range',
  description: 'Estimate your ideal body weight from height and sex with the Devine, Robinson, Miller, and Hamwi formulas, plus the modern BMI healthy range.',
  categorySlug: 'health-fitness',
  tags: [
    'ideal weight calculator', 'ideal body weight', 'healthy weight for height', 'ibw calculator',
    'devine formula', 'robinson formula', 'what should i weigh', 'ideal weight for height',
    'target weight calculator', 'healthy weight calculator', 'body weight calculator',
    'free ideal weight calculator', 'online ideal weight calculator',
  ],
  isNew: true,
  updatedAt: '2026-07-23',
  trustVariant: 'private',
  engine: 'wellness',
  pattern: 'health-calculate',
  family: 'body-composition',
  processorId: 'ideal-weight',
  relatedTools: ['bmi-calculator', 'body-fat-calculator', 'body-weight-tracker'],
  guide: {
    slug: 'how-to-find-your-ideal-weight',
    categorySlug: 'health-fitness',
    title: 'How to Find Your Ideal Weight for Your Height',
    description: 'Learn what the classic ideal-weight formulas do, why they disagree, and why a healthy weight is a range rather than a single number.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
