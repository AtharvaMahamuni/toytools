import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'prime-factorization-calculator',
  name: 'Prime Factorization Calculator',
  seoTitle: 'Prime Factorization Calculator: GCF & LCM',
  description: 'Factor any number into its prime factors like a factor tree, with primality, divisor count, and the greatest common factor and LCM against a second number.',
  tagline: 'Factor a number into primes, with the divisions narrated.',
  categorySlug: 'applied-math',
  tags: ['prime factorization calculator', 'factor tree', 'gcf calculator', 'lcm calculator', 'greatest common factor', 'least common multiple', 'prime numbers', 'divisors'],
  updatedAt: '2026-07-16',
  isNew: true,
  trustVariant: 'private',
  engine: 'math',
  pattern: 'math-calculate',
  family: 'number-theory',
  processorId: 'prime-factorization',
  relatedTools: ['fraction-calculator', 'combinations-permutations-calculator', 'quadratic-equation-solver'],
  guide: {
    slug: 'prime-factorization-calculator',
    categorySlug: 'applied-math',
    title: 'Prime Factorization, GCF, and LCM Explained',
    description: 'How to factor a number into primes by trial division, read GCF and LCM straight off the exponents, and count divisors without listing them.',
    readMinutes: 5,
    updatedAt: '2026-07-16',
  },
};
