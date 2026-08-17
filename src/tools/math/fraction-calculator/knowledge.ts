import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'fraction-calculator',
  title: 'Fraction Calculator',
  category: 'applied-math',
  summary: 'Add, subtract, multiply, or divide fractions and mixed numbers with the LCD, conversion, and simplification steps worked in front of you.',
  primaryConcepts: ['fraction arithmetic', 'least common denominator'],
  secondaryConcepts: ['simplifying fractions', 'mixed numbers', 'improper fractions', 'greatest common factor', 'reciprocal'],
  intentGroups: {
    informational: [
      'what a least common denominator is',
      'why dividing by a fraction means multiplying by its reciprocal',
    ],
    howTo: [
      'add fractions with unlike denominators',
      'simplify a fraction to lowest terms',
      'convert between improper fractions and mixed numbers',
    ],
    comparison: [
      'improper fraction versus mixed number form',
    ],
    misconception: [
      'adding fractions is not adding the numerators and the denominators separately',
    ],
    troubleshooting: [
      'why a fraction result looks different from the textbook answer before simplifying',
    ],
  },
  realWorldUseCases: [
    'Checking fraction homework with the intermediate steps visible.',
    'Scaling a recipe by multiplying quantities like 3/4 cup by 1 1/2.',
    'Combining measurements in woodworking or sewing that come in eighths and sixteenths.',
  ],
  commonMistakes: [
    'Adding numerators and denominators straight across instead of converting to a common denominator first.',
    'Forgetting to flip the second fraction when dividing.',
    'Leaving an answer unsimplified or as an improper fraction when a mixed number was asked for.',
  ],
  commonQuestions: [
    'How do I add fractions with different denominators?',
    'How does dividing by a fraction work?',
    'Can I enter mixed numbers or whole numbers?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Take the same value as a percentage instead', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'prime-factorization-calculator', reason: 'See where the LCD and GCF come from', strength: 0.6 },
  ],
  workflowStage: ['transform'],
  keywords: ['fraction calculator', 'adding fractions', 'simplify fractions', 'mixed number calculator', 'fraction to decimal'],
  entityAliases: ['fractions calculator', 'adding fractions calculator', 'fraction simplifier'],
};
