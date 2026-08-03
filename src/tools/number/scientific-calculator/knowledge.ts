import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'scientific-calculator',
  title: 'Scientific Calculator',
  category: 'number-utilities',
  summary: 'Evaluate full expressions with correct order of operations: trig, logs, powers, roots, factorials, and constants, in degrees or radians.',
  primaryConcepts: ['scientific calculator'],
  secondaryConcepts: ['order of operations', 'trigonometry', 'logarithms', 'exponents', 'degrees and radians', 'factorial'],
  intentGroups: {
    informational: ['What is a scientific calculator?', 'What order of operations does it use?'],
    howTo: ['How to calculate sine in degrees', 'How to raise a number to a power', 'How to use memory keys'],
    comparison: ['Degrees vs radians', 'A scientific calculator vs a basic calculator'],
    misconception: ['Multiplication and division happen before addition and subtraction', 'sin of 30 depends on whether you are in degrees or radians'],
    troubleshooting: ['Why my trig answer looks wrong (check degrees vs radians)', 'Why the calculator says the result is undefined'],
  },
  realWorldUseCases: [
    'Working through algebra, trigonometry, and physics homework',
    'Checking exam answers that mix powers, roots, and parentheses',
    'Converting between degree and radian trig results',
    'Evaluating a long expression without rewriting it step by step',
  ],
  commonMistakes: [
    'Forgetting that multiplication binds tighter than addition',
    'Leaving the calculator in radians when the question is in degrees',
    'Missing a closing parenthesis in a nested expression',
  ],
  commonQuestions: [
    'What is a scientific calculator?',
    'Why is my trig answer wrong?',
    'Why does the calculator say the result is undefined?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Reach for a dedicated tool when the whole task is a percentage', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'percentage-calculator', reason: 'Use a focused calculator for a single percentage question' },
  ],
  nextSteps: [
    { slug: 'tip-calculator', reason: 'Jump to a task-specific calculator for everyday sums', priority: 1 },
    { slug: 'wave-speed-calculator', reason: 'Put the numbers to work in an interactive physics simulation', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: ['scientific calculator', 'online calculator', 'trig calculator', 'log calculator', 'order of operations', 'degrees radians'],
  entityAliases: ['scientific calculator', 'sci calc', 'student calculator', 'online scientific calculator'],
  inputs: ['math expression'],
  outputs: ['calculated result'],
  difficulty: 'beginner',
  audience: ['students', 'teachers', 'engineers'],
};
