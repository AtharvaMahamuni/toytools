import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'upi-1999-split',
  title: 'UPI 1999 Split',
  category: 'money-finance',
  summary: 'A meme calculator that groups 1999 rupee chunks. Not tax or payments advice.',
  primaryConcepts: ['UPI split'],
  secondaryConcepts: ['meme calculator', '1999'],
  intentGroups: {
    informational: ['What is the UPI 1999 split?'],
    howTo: ['How does the integer split work?'],
    comparison: ['UPI split versus a tax calculator'],
    misconception: ['Is there a UPI tax above 2000?'],
    troubleshooting: ['What if the total is under 2000?'],
  },
  realWorldUseCases: [
    'Checking the viral 2000 rupee claim',
    'Seeing chunk amounts sum to the typed total',
  ],
  commonMistakes: [
    'Reading the chunk list as a fee dodge',
    'Believing a post about a 2000 rupee tax as fact',
  ],
  commonQuestions: [
    'Does a customer owe a 2000 rupee UPI tax?',
    'Does splitting hide the total from the person you paid?',
    'Are my numbers uploaded?',
  ],
  usedWith: [
    { slug: 'tax-calculator', reason: 'A sales tax rate is a different calculator', strength: 0.4 },
    { slug: 'tip-calculator', reason: 'A tip is a percent you choose to add', strength: 0.3 },
  ],
  alternatives: [
    { slug: 'discount-calculator', reason: 'A discount is a percent off a price, not a UPI meme' },
  ],
  nextSteps: [
    { slug: 'tax-calculator', reason: 'Look up a rate you actually have', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['whole rupees'],
  entityAliases: ['not advice'],
  inputs: ['rupees'],
  outputs: ['chunk list'],
  difficulty: 'beginner',
  audience: ['curious readers'],
};
