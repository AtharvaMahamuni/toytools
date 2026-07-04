import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'cagr-calculator',
  title: 'CAGR Calculator',
  category: 'money-finance',
  summary: 'Find the compound annual growth rate between a starting and ending value, with total growth, growth multiple, and exact doubling time.',
  primaryConcepts: ['compound annual growth rate'],
  secondaryConcepts: ['annualized return', 'growth rate', 'doubling time', 'compounding'],
  intentGroups: {
    informational: ['What is CAGR?', 'What does compound annual growth rate mean?'],
    howTo: ['How to calculate CAGR from start and end values', 'How to annualize multi-year growth'],
    comparison: ['CAGR vs average annual return', 'CAGR vs ROI'],
    misconception: ['Total growth divided by years is not the annual rate', 'Two investments with the same CAGR can have very different risk'],
    troubleshooting: ['My CAGR looks too low compared to total growth', 'Why deposits during the period break the CAGR'],
  },
  realWorldUseCases: [
    'Annualizing a fund or stock return quoted over several years',
    'Reporting revenue growth across a multi-year span',
    'Comparing investments held for different lengths of time',
    'Sanity-checking a projected growth rate against history',
  ],
  commonMistakes: [
    'Dividing total growth by the number of years instead of compounding',
    'Applying CAGR to a period with deposits or withdrawals in between',
  ],
  commonQuestions: [
    'How is CAGR calculated?',
    'Why is CAGR lower than total growth divided by years?',
    'Can CAGR be negative?',
  ],
  usedWith: [
    { slug: 'roi-calculator', reason: 'See the same growth as a simple total return', strength: 0.9 },
    { slug: 'rule-of-72-calculator', reason: 'Estimate doubling time from the resulting rate', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'roi-calculator', reason: 'Start from cost and proceeds when you care about the total gain' },
  ],
  nextSteps: [
    { slug: 'compound-interest-calculator', reason: 'Project forward at the rate you just found', priority: 1 },
    { slug: 'inflation-calculator', reason: 'Compare the rate against inflation for the real return', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['cagr calculator', 'compound annual growth rate', 'annualized growth', 'growth rate', 'doubling time'],
  entityAliases: ['cagr', 'compound annual growth rate', 'annual growth rate'],
  inputs: ['starting value', 'ending value', 'period in years'],
  outputs: ['cagr percentage', 'total growth', 'growth multiple', 'doubling time'],
  difficulty: 'beginner',
  audience: ['investors', 'finance', 'business'],
};
