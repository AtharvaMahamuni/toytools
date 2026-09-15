import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'statistics-visualizer',
  title: 'Statistics Visualizer',
  category: 'applied-math',
  summary:
    'Paste numbers for mean, median, mode, quartiles, and standard deviation with a live histogram and box plot that never leaves the browser.',
  primaryConcepts: ['descriptive statistics', 'five-number summary'],
  secondaryConcepts: [
    'mean median mode',
    'standard deviation',
    'quartiles',
    'histogram',
    'box plot',
    'sample versus population',
    'outliers',
  ],
  intentGroups: {
    informational: [
      'what mean median and mode each measure',
      'what a box plot shows that a table does not',
      'sample versus population standard deviation',
    ],
    howTo: [
      'calculate standard deviation from a pasted list',
      'read a histogram and box plot together',
      'find quartiles and the interquartile range',
    ],
    comparison: [
      'sample standard deviation versus population standard deviation',
      'mean versus median when the data are skewed',
    ],
    misconception: [
      'a table of summary numbers is not the same as seeing the distribution',
      'dividing by n is not always the right standard deviation',
    ],
    troubleshooting: [
      'why sample standard deviation needs at least two values',
      'why a pasted token that is not a number blocks the chart',
    ],
  },
  realWorldUseCases: [
    'Checking class quiz scores for center, spread, and outliers before grade discussions.',
    'Summarizing a short survey column without uploading responses to a third-party calculator.',
    'Comparing a lab’s sample standard deviation against a known population value from a textbook.',
  ],
  commonMistakes: [
    'Reading only the mean and missing a skewed tail that the histogram would show.',
    'Using population SD (divide by n) on a sample when the course expects n − 1.',
    'Calling every extreme value an outlier without checking the 1.5 × IQR Tukey fences.',
  ],
  commonQuestions: [
    'How do I calculate mean, median, and mode from a list of numbers?',
    'What is the difference between sample and population standard deviation?',
    'How do I read the histogram and box plot together?',
    'Is my data uploaded to a server?',
  ],
  usedWith: [
    { slug: 'probability-calculator', reason: 'Turn outcome counts into probabilities', strength: 0.7 },
    {
      slug: 'combinations-permutations-calculator',
      reason: 'Count arrangements before asking about chance',
      strength: 0.6,
    },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'fraction-calculator', reason: 'Keep a ratio exact instead of decimal', strength: 0.5 },
    {
      slug: 'prime-factorization-calculator',
      reason: 'Factor counts that show up in combinatorics problems',
      strength: 0.4,
    },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'standard deviation calculator',
    'mean median mode',
    'histogram maker',
    'box plot generator',
  ],
  entityAliases: [
    'stats calculator',
    'descriptive statistics calculator',
  ],
};
