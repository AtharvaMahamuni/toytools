import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'rule-of-72-calculator',
  title: 'Rule of 72 Calculator',
  category: 'money-finance',
  summary: 'Estimate how long money takes to double at a given growth rate using the Rule of 72 shortcut.',
  primaryConcepts: ['rule of 72'],
  secondaryConcepts: ['doubling time', 'compound growth', 'rate of return', 'CAGR'],
  intentGroups: {
    informational: ['What is the Rule of 72?', 'Why does dividing by 72 work?'],
    howTo: ['How to estimate doubling time', 'How to find the rate needed to double in N years'],
    comparison: ['Rule of 72 vs the exact doubling formula', 'Rule of 72 vs Rule of 70'],
    misconception: ['The Rule of 72 is an approximation, not exact', 'It assumes a constant rate'],
    troubleshooting: ['My estimate seems off at very high rates', 'I entered a rate of zero'],
  },
  realWorldUseCases: [
    'Quickly estimating how long an investment takes to double',
    'Comparing the impact of different rates of return',
    'Sanity checking a long term growth assumption',
    'Teaching the power of compounding',
  ],
  commonMistakes: [
    'Treating the estimate as exact at very high or very low rates',
    'Entering the rate as a decimal instead of a percent',
  ],
  commonQuestions: [
    'What is the Rule of 72?',
    'How accurate is the Rule of 72?',
    'What rate doubles my money in 10 years?',
  ],
  usedWith: [
    { slug: 'compound-interest-calculator', reason: 'Project the actual growth once you know the rate', strength: 0.8 },
  ],
  alternatives: [
    { slug: 'compound-interest-calculator', reason: 'Exact growth with full inputs instead of an estimate' },
  ],
  nextSteps: [
    { slug: 'compound-interest-calculator', reason: 'Run the precise numbers', priority: 1 },
    { slug: 'inflation-calculator', reason: 'Check the doubling against inflation', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['rule of 72 calculator', 'doubling time', 'how long to double money', 'compound growth'],
  entityAliases: ['rule of 72', 'doubling time', 'rule of seventy two'],
  inputs: ['rate'],
  outputs: ['doubling time'],
  difficulty: 'beginner',
  audience: ['investors', 'students', 'finance'],
};
