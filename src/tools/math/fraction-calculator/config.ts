import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'fraction-calculator',
  name: 'Fraction Calculator',
  seoTitle: 'Fraction Calculator with Steps: Add & Simplify',
  description: 'Adding, subtracting, multiplying or dividing fractions and mixed numbers, every step shown, with the LCD, simplifying and fraction to decimal forms.',
  tagline: 'Add, subtract, multiply or divide fractions with every step shown.',
  categorySlug: 'applied-math',
  tags: ['fraction calculator', 'adding fractions', 'simplify fractions', 'mixed number calculator', 'fraction to decimal', 'least common denominator', 'multiplying fractions', 'dividing fractions'],
  updatedAt: '2026-07-16',
  isNew: true,
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'fractions',
  processorId: 'fraction',
  relatedTools: ['percentage-calculator', 'quadratic-equation-solver', 'unit-circle-calculator'],
  guide: {
    slug: 'fraction-calculator',
    categorySlug: 'applied-math',
    title: 'How Fraction Arithmetic Works, Step by Step',
    description: 'How to add, subtract, multiply, and divide fractions and mixed numbers: the LCD, the flip-and-multiply rule, and simplifying by the greatest common factor.',
    readMinutes: 5,
    updatedAt: '2026-07-16',
  },
};
