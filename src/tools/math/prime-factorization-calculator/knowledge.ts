import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'prime-factorization-calculator',
  title: 'Prime Factorization Calculator',
  category: 'applied-math',
  summary: 'Factor a number into primes with the trial divisions narrated, then read GCF, LCM, primality, and the divisor count straight off the exponents.',
  primaryConcepts: ['prime factorization', 'greatest common factor'],
  secondaryConcepts: ['least common multiple', 'prime numbers', 'divisors', 'trial division', 'coprime numbers'],
  intentGroups: {
    informational: [
      'what the fundamental theorem of arithmetic says',
      'how many divisors a number has',
    ],
    howTo: [
      'factor a number into primes by hand',
      'find the GCF and LCM of two numbers from their prime factors',
    ],
    comparison: [
      'GCF versus LCM',
    ],
    misconception: [
      'one is not a prime number',
    ],
    troubleshooting: [
      'why a large number takes its factors from primes only up to its square root',
    ],
  },
  realWorldUseCases: [
    'Simplifying fractions by finding the greatest common factor.',
    'Finding a common denominator via the least common multiple.',
    'Checking whether a number is prime for homework or puzzles.',
  ],
  commonMistakes: [
    'Treating 1 as a prime, which would break the uniqueness of factorizations.',
    'Mixing up GCF and LCM: the GCF takes shared primes at lower exponents, the LCM takes all primes at higher exponents.',
    'Stopping trial division too early instead of continuing up to the square root.',
  ],
  commonQuestions: [
    'How do I find the prime factorization of a number?',
    'How do GCF and LCM come from prime factors?',
    'How do I know if a number is prime?',
  ],
  usedWith: [
    { slug: 'fraction-calculator', reason: 'Use the GCF and LCM to simplify fractions', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'combinations-permutations-calculator', reason: 'Count arrangements once the factors are known', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: ['prime factorization calculator', 'factor tree', 'gcf calculator', 'lcm calculator', 'greatest common factor'],
  entityAliases: ['prime factor calculator', 'factor tree calculator', 'gcf and lcm calculator'],
};
