import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'matrix-calculator',
  name: 'Matrix Calculator',
  seoTitle: 'Matrix Calculator: Multiplication, Determinant, Inverse',
  description:
    'Add, subtract, or multiply two matrices. Read the determinant, the inverse, and the first steps.',
  tagline: 'Multiply two matrices and read the first step.',
  categorySlug: 'applied-math',
  tags: ['multiplication', 'determinant', 'inverse', 'steps'],
  updatedAt: '2026-10-02',
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
    problem: 'Use Matrix Calculator when two matrices should be added, multiplied, transposed, or inverted with the shapes shown.',
    nonGoal: 'row-reduce to rref, solve a linear system, or send the entries to an AI model.',
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
    title: 'How to Multiply Matrices and Read the First Steps',
    description:
      'How to enter two matrices, multiply them, and read a determinant or inverse, including the shape check when the sizes do not match.',
    readMinutes: 6,
    updatedAt: '2026-10-02',
  },
};
