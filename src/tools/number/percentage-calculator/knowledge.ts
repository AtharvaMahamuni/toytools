import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'percentage-calculator',
  title: 'Percentage Calculator',
  category: 'number-utilities',
  summary: 'Work out percentages: a percent of a number, what percent one number is of another, and percent change.',
  primaryConcepts: ['percentage'],
  secondaryConcepts: ['percent of a number', 'percentage change', 'percent difference', 'ratio to percent'],
  intentGroups: {
    informational: ['What is a percentage?', 'How is percentage change calculated?'],
    howTo: ['How to find X percent of a number', 'How to calculate percent increase or decrease'],
    comparison: ['Percentage change vs percentage difference', 'Percent of vs percent off'],
    misconception: ['A percent increase then the same percent decrease does not return the original', 'Percentage points are not the same as percent'],
    troubleshooting: ['My percent change sign looks wrong', 'I confused the part and the whole'],
  },
  realWorldUseCases: [
    'Calculating a discount or markup amount',
    'Finding how much a value grew or shrank in percent',
    'Working out a tip or tax share',
    'Converting a score or ratio into a percentage',
  ],
  commonMistakes: [
    'Confusing percentage change with percentage points',
    'Swapping the part and the whole when finding "what percent of"',
  ],
  commonQuestions: [
    'How do I find what percent one number is of another?',
    'How is percent increase different from percent difference?',
    'Why does a 50% rise then 50% fall not break even?',
  ],
  usedWith: [
    { slug: 'discount-calculator', reason: 'Apply a percentage as a price discount', strength: 0.7 },
    { slug: 'tip-calculator', reason: 'Compute a tip as a percentage of a bill', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'discount-calculator', reason: 'Purpose-built for sale prices and savings' },
    { slug: 'margin-calculator', reason: 'For profit margin and markup specifically' },
  ],
  nextSteps: [
    { slug: 'margin-calculator', reason: 'Turn a percentage into a pricing margin', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['percentage calculator', 'percent of a number', 'percentage change', 'percent increase', 'percent difference'],
  entityAliases: ['percentage', 'percent', '%'],
  inputs: ['number', 'number'],
  outputs: ['percentage result'],
  difficulty: 'beginner',
  audience: ['students', 'shoppers', 'professionals', 'finance'],
};
