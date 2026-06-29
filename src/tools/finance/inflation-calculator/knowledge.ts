import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'inflation-calculator',
  title: 'Inflation Calculator',
  category: 'money-finance',
  summary: 'See what an amount of money will be worth after inflation and how much purchasing power it loses over time.',
  primaryConcepts: ['inflation'],
  secondaryConcepts: ['purchasing power', 'real value', 'nominal value', 'cost of living'],
  intentGroups: {
    informational: ['What is inflation?', 'What is purchasing power?'],
    howTo: ['How to calculate the future value of money after inflation', 'How to find what a salary is worth in today money'],
    comparison: ['Real value vs nominal value', 'Inflation vs investment return'],
    misconception: ['Inflation does not reduce the number of dollars, it reduces what they buy', 'A small annual rate compounds to a large effect over decades'],
    troubleshooting: ['My future cost looks very high', 'I mixed up real and nominal'],
  },
  realWorldUseCases: [
    'Estimating what savings will be worth at retirement',
    'Seeing how much a salary needs to rise to keep up',
    'Understanding the future cost of a goal',
    'Comparing investment returns against inflation',
  ],
  commonMistakes: [
    'Confusing real (purchasing power) with nominal (face value) amounts',
    'Underestimating how much inflation compounds over long periods',
  ],
  commonQuestions: [
    'What will my money be worth after inflation?',
    'What is the difference between real and nominal value?',
    'How do I beat inflation?',
  ],
  usedWith: [
    { slug: 'compound-interest-calculator', reason: 'Check whether returns outpace inflation', strength: 0.8 },
    { slug: 'savings-goal-calculator', reason: 'Adjust a goal for future prices', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'compound-interest-calculator', reason: 'Model growth that offsets inflation' },
  ],
  nextSteps: [
    { slug: 'compound-interest-calculator', reason: 'Find a return that beats inflation', priority: 1 },
    { slug: 'rule-of-72-calculator', reason: 'Estimate doubling against inflation', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['inflation calculator', 'purchasing power', 'future value of money', 'real value', 'cost of living'],
  entityAliases: ['inflation', 'purchasing power', 'cost of living'],
  inputs: ['amount', 'rate', 'years'],
  outputs: ['real value'],
  difficulty: 'beginner',
  audience: ['savers', 'investors', 'finance'],
};
