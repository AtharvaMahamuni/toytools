import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'emergency-fund-calculator',
  title: 'Emergency Fund Calculator',
  category: 'money-finance',
  summary: 'Work out how large an emergency fund you need from your monthly expenses and track progress toward it.',
  primaryConcepts: ['emergency fund'],
  secondaryConcepts: ['months of expenses', 'financial safety net', 'savings progress', 'liquidity'],
  intentGroups: {
    informational: ['What is an emergency fund?', 'How many months of expenses should I keep?'],
    howTo: ['How to size an emergency fund', 'How to track progress toward the target'],
    comparison: ['Three months vs six months of cover', 'Emergency fund vs general savings'],
    misconception: ['An emergency fund is based on expenses, not income', 'Variable income usually needs more months of cover'],
    troubleshooting: ['My target seems high', 'I am not sure how many months to choose'],
  },
  realWorldUseCases: [
    'Deciding how much cash to keep for emergencies',
    'Tracking progress toward a fully funded buffer',
    'Sizing cover for a freelancer or single earner',
    'Planning the gap left to save',
  ],
  commonMistakes: [
    'Basing the fund on income instead of expenses',
    'Keeping too little cover for a variable income',
  ],
  commonQuestions: [
    'How much emergency fund do I need?',
    'How many months of expenses should an emergency fund cover?',
    'Where should I keep my emergency fund?',
  ],
  usedWith: [
    { slug: 'savings-goal-calculator', reason: 'Plan a monthly amount to close the gap', strength: 0.8 },
  ],
  alternatives: [
    { slug: 'savings-goal-calculator', reason: 'Treat the fund as a dated savings goal' },
  ],
  nextSteps: [
    { slug: 'savings-goal-calculator', reason: 'Turn the remaining amount into a monthly plan', priority: 1 },
    { slug: 'compound-interest-calculator', reason: 'Grow surplus cash once the fund is full', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['emergency fund calculator', 'how much emergency fund', 'months of expenses', 'rainy day fund', 'safety net'],
  entityAliases: ['emergency fund', 'rainy day fund', 'safety net'],
  inputs: ['monthly expenses', 'months', 'current savings'],
  outputs: ['recommended fund'],
  difficulty: 'beginner',
  audience: ['savers', 'finance'],
};
