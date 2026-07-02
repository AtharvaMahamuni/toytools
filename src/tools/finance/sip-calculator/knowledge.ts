import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'sip-calculator',
  title: 'SIP Calculator',
  category: 'money-finance',
  summary: 'Project the future value of a monthly SIP investment, split into your contributions and the wealth added by returns.',
  primaryConcepts: ['systematic investment plan'],
  secondaryConcepts: ['monthly investing', 'cost averaging', 'compounding', 'expected return'],
  intentGroups: {
    informational: ['What is a SIP?', 'How are SIP returns calculated?'],
    howTo: ['How to estimate SIP maturity value', 'How to plan a monthly investment'],
    comparison: ['SIP vs lump sum investing', 'Higher instalment vs longer duration'],
    misconception: ['The expected return is an assumption, not a guarantee', 'Doubling the period more than doubles the growth'],
    troubleshooting: ['My wealth gained looks small', 'Why the result differs from my fund statement'],
  },
  realWorldUseCases: [
    'Planning a monthly mutual fund investment',
    'Estimating what a salary-day transfer grows into',
    'Comparing instalment amounts for a long-term goal',
    'Showing a first-time investor the effect of starting early',
  ],
  commonMistakes: [
    'Assuming an aggressive return and treating the result as certain',
    'Ignoring inflation when reading the maturity value',
  ],
  commonQuestions: [
    'What is a SIP?',
    'How is the SIP maturity value calculated?',
    'Is a SIP better than a lump sum?',
  ],
  usedWith: [
    { slug: 'inflation-calculator', reason: 'Convert the maturity value into current purchasing power', strength: 0.8 },
    { slug: 'savings-goal-calculator', reason: 'Solve for the instalment a target needs', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'compound-interest-calculator', reason: 'Project a lump sum instead of monthly instalments' },
  ],
  nextSteps: [
    { slug: 'inflation-calculator', reason: 'Check the result in real purchasing power', priority: 1 },
    { slug: 'savings-goal-calculator', reason: 'Work backwards from a target amount', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['sip calculator', 'systematic investment plan', 'monthly investment', 'sip returns', 'sip maturity value'],
  entityAliases: ['sip', 'systematic investment plan', 'monthly investment plan'],
  inputs: ['monthly investment', 'expected return', 'years', 'starting lump sum'],
  outputs: ['investment value', 'wealth gained', 'total invested'],
  difficulty: 'beginner',
  audience: ['investors', 'finance'],
};
