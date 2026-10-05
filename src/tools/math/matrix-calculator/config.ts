import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'matrix-calculator',
  name: 'Matrix Calculator',
  seoTitle: 'Matrix Calculator: Multiply, Determinant, Inverse',
  description:
    'Add, subtract, multiply, transpose or invert matrices up to 8 by 8, with the first of the steps worked out. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Add, multiply, transpose or invert matrices, with the first step shown.',
  categorySlug: 'applied-math',
  tags: ['matrix multiplication', 'determinant', 'inverse matrix', 'transpose', 'matrix calculator with steps'],
  updatedAt: '2026-10-05',
  addedOn: '2026-10-02',
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'matrices',
  processorId: 'matrix',
  inputs: ['text'],
  outputs: ['metric'],
  craft: {
    id: 'matrix-shapes',
    kind: 'orientation',
    solves:
      'A dimension mismatch that only says error hides which matrix is the wrong shape, so multiply names both shapes when the inner sizes do not match.',
  },
  citation: {
    problem: 'Use Matrix Calculator when two matrices should be added or multiplied, or one matrix transposed or inverted, with the shapes shown.',
    nonGoal: 'row-reduce to RREF, solve a linear system, or send the entries to an AI model.',
  },
  job: {
    intent: 'calculate',
    userJob: 'Add, multiply, transpose, or invert a matrix and see the shape that made the product legal.',
    repeatability: 'high',
    interactionDepth: 'high',
    privacyValue: 'low',
    aiSubstitutability: 'medium',
    browserOnly: true,
  },
  relatedTools: ['triangle-solver', 'statistics-visualizer', 'fraction-calculator'],
  guide: {
    slug: 'matrix-calculator',
    categorySlug: 'applied-math',
    title: 'How to Multiply Matrices Step by Step',
    description:
      'How to enter two matrices, multiply them, and read a determinant or inverse, including the shape check when the sizes do not match.',
    readMinutes: 6,
    updatedAt: '2026-10-05',
  },
};
