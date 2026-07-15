import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'combinations-permutations-calculator',
  title: 'Combinations & Permutations Calculator',
  category: 'applied-math',
  summary: 'Count nCr and nPr exactly, with or without repetition, with the formula expanded and the count read back in plain language.',
  primaryConcepts: ['combinations', 'permutations'],
  secondaryConcepts: ['factorial', 'binomial coefficient', 'stars and bars', 'counting principle', 'repetition'],
  intentGroups: {
    informational: [
      'when order matters in counting problems',
      'what the stars and bars formula counts',
    ],
    howTo: [
      'calculate nCr by hand',
      'count arrangements when items may repeat',
    ],
    comparison: [
      'combinations vs permutations',
    ],
    misconception: [
      'a combination lock is really a permutation lock',
    ],
    troubleshooting: [
      'why r cannot exceed n without repetition',
    ],
  },
  realWorldUseCases: [
    'Working out lottery odds such as 6 numbers from 49.',
    'Counting podium finishes where gold, silver, and bronze are distinct.',
    'Counting possible PIN codes where digits may repeat.',
  ],
  commonMistakes: [
    'Using permutations when the order of the selection is irrelevant, overcounting by r!.',
    'Forgetting that a combination lock accepts one exact order, which makes it a permutation.',
    'Expecting r to be allowed to exceed n when each item can be used only once.',
  ],
  commonQuestions: [
    'What is the difference between combinations and permutations?',
    'How do I calculate nCr by hand?',
    'What if items are allowed to repeat?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['combination calculator', 'permutation calculator', 'ncr calculator', 'npr calculator', 'how many combinations'],
  entityAliases: ['nCr calculator', 'nPr calculator', 'combinations and permutations'],
};
