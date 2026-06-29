import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'compound-interest-calculator',
  title: 'Compound Interest Calculator',
  category: 'money-finance',
  summary: 'See how a lump sum and regular contributions grow with compound interest over time, including interest earned.',
  primaryConcepts: ['compound interest'],
  secondaryConcepts: ['future value', 'compounding frequency', 'monthly contributions', 'time value of money'],
  intentGroups: {
    informational: ['What is compound interest?', 'How does compounding frequency change the result?'],
    howTo: ['How to calculate compound interest', 'How to include monthly contributions'],
    comparison: ['Compound vs simple interest', 'Compound interest vs CAGR'],
    misconception: ['Compound interest is not guaranteed and can lose money in volatile investments', 'More frequent compounding helps less than people expect'],
    troubleshooting: ['My final amount looks too high', 'I am not sure which compounding frequency to pick'],
  },
  realWorldUseCases: [
    'Projecting how a savings account or investment grows over years',
    'Seeing the long term effect of adding a fixed amount every month',
    'Comparing monthly versus annual compounding',
    'Estimating retirement or education savings growth',
  ],
  commonMistakes: [
    'Confusing the annual rate with the periodic rate',
    'Assuming compound growth is guaranteed regardless of the investment',
  ],
  commonQuestions: [
    'What is compound interest?',
    'How is monthly compounding different from yearly?',
    'Is compound interest the same as CAGR?',
  ],
  usedWith: [
    { slug: 'savings-goal-calculator', reason: 'Work backwards from a target to a monthly amount', strength: 0.8 },
    { slug: 'inflation-calculator', reason: 'Check whether growth beats inflation', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'rule-of-72-calculator', reason: 'A quick estimate of doubling time without full inputs' },
  ],
  nextSteps: [
    { slug: 'inflation-calculator', reason: 'See the future amount in today money', priority: 1 },
    { slug: 'rule-of-72-calculator', reason: 'Estimate how long until it doubles', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['compound interest calculator', 'future value', 'investment growth', 'compounding', 'monthly contribution'],
  entityAliases: ['compound interest', 'compounding', 'interest on interest'],
  inputs: ['amount', 'rate', 'years'],
  outputs: ['future value'],
  difficulty: 'beginner',
  audience: ['savers', 'investors', 'students', 'finance'],
};
