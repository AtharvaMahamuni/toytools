import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'matrix-calculator',
  title: 'Matrix Calculator',
  category: 'applied-math',
  summary:
    'Add, multiply, transpose, or invert a matrix and read the first steps, including a determinant.',
  primaryConcepts: ['matrix multiplication'],
  secondaryConcepts: ['determinant', 'inverse matrix', 'matrix shapes'],
  intentGroups: {
    informational: [
      'what the inner sizes of a product must be',
      'when a determinant is zero',
      'how a transpose swaps rows and columns',
    ],
    howTo: [
      'multiply two matrices and read the first dot product',
      'enter a matrix with one row per line',
      'compute a 2 by 2 inverse',
    ],
    comparison: [
      'add versus multiply',
      'determinant versus inverse',
    ],
    misconception: [
      'any two matrices can be multiplied',
      'a zero determinant still has an inverse',
    ],
    troubleshooting: [
      'why multiply names both shapes',
      'why 0.1 plus 0.2 does not print a long decimal',
    ],
  },
  realWorldUseCases: [
    'Checking a 2 by 2 product before writing it into a homework line.',
    'Seeing that a 2 by 3 matrix cannot multiply another 2 by 3 matrix.',
    'Reading the inverse of a matrix whose determinant is not zero.',
  ],
  commonMistakes: [
    'Multiplying when the columns of A do not equal the rows of B.',
    'Asking for an inverse of a matrix whose determinant is 0.',
    'Pasting a whole grid into one line so every number becomes one row.',
  ],
  commonQuestions: [
    'How do I multiply two matrices?',
    'What does the shape error mean?',
    'How is the determinant of a 2 by 2 matrix found?',
    'Why is there no RREF button?',
  ],
  usedWith: [
    { slug: 'fraction-calculator', reason: 'Reduce a fractional entry before you paste the matrix', strength: 0.4 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'triangle-solver', reason: 'Solve a triangle once the side lengths are known', strength: 0.3 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'matrix multiplication calculator',
    'determinant calculator',
    'inverse matrix calculator',
    'matrix calculator with steps',
  ],
  entityAliases: ['matrix multiplication', 'determinant'],
  inputs: ['text'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['students', 'developers'],
};
