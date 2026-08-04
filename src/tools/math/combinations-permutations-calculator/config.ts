import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'combinations-permutations-calculator',
  name: 'Combinations & Permutations Calculator',
  seoTitle: 'Combinations & Permutations Calculator: nCr, nPr',
  description: 'Compute nCr and nPr exactly, with or without repetition, with the formula expanded step by step and a plain-language reading of how many ways you can choose.',
  categorySlug: 'applied-math',
  tags: ['combination calculator', 'permutation calculator', 'ncr calculator', 'npr calculator', 'how many combinations', 'combinations and permutations', 'stars and bars', 'factorial'],
  updatedAt: '2026-07-16',
  isNew: true,
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'combinatorics',
  processorId: 'combinations',
  relatedTools: ['fraction-calculator', 'quadratic-equation-solver', 'unit-circle-calculator'],
  guide: {
    slug: 'combinations-permutations-calculator',
    categorySlug: 'applied-math',
    title: 'Combinations vs Permutations, Explained',
    description: 'When order matters and when it does not: the nCr and nPr formulas, repetition variants like stars and bars, and how to read huge counts sensibly.',
    readMinutes: 5,
    updatedAt: 'Jul 2026',
  },
};
