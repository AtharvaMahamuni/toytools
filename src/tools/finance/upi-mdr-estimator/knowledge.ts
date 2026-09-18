import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'upi-mdr-estimator',
  title: 'UPI MDR Estimator',
  category: 'money-finance',
  summary: 'Estimates merchant MDR in rupees from the 15 Sep 2026 PIB note. Not a customer fee or a tax.',
  primaryConcepts: ['UPI MDR'],
  secondaryConcepts: ['PIB note'],
  intentGroups: {
    informational: ['What is UPI MDR on this page?'],
    howTo: ['What does 5000 ordinary become?'],
    comparison: ['How is this different from the UPI 1999 split?'],
    misconception: ['Is MDR a tax?'],
    troubleshooting: ['What happens at 2000 rupees or less?'],
  },
  realWorldUseCases: [
    'Checking a merchant quote against the PIB rates',
  ],
  commonMistakes: [
    'Reading the MDR figure as a tax the customer owes',
    'Treating the small-merchant toggle as a bank decision',
  ],
  commonQuestions: [
    'Is MDR a tax?',
    'Does the customer owe this charge?',
    'Are my numbers uploaded?',
  ],
  usedWith: [
    { slug: 'upi-1999-split', reason: 'The meme split is a different page and not a fee estimate', strength: 0.4 },
    { slug: 'tax-calculator', reason: 'A rate you type is a different calculator', strength: 0.3 },
  ],
  alternatives: [
    { slug: 'shop-upi-tally', reason: 'A shop receipt total is not an MDR estimate' },
  ],
  nextSteps: [
    { slug: 'tax-calculator', reason: 'Open a calculator when you have a rate of your own', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['rupees'],
  entityAliases: ['merchant'],
  inputs: ['rupees', 'payment kind'],
  outputs: ['mdr rupees'],
  difficulty: 'beginner',
  audience: ['shopkeepers', 'curious readers'],
};
