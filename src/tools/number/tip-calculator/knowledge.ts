import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'tip-calculator',
  title: 'Tip Calculator',
  category: 'number-utilities',
  summary: 'Work out the tip and total bill, then split the cost evenly between any number of people.',
  primaryConcepts: ['tip calculation', 'bill splitting'],
  secondaryConcepts: ['gratuity', 'percentage', 'restaurant bill', 'per person cost'],
  intentGroups: {
    informational: ['How much should I tip?', 'What is a standard tip percentage?'],
    howTo: ['How to calculate a tip', 'How to split a restaurant bill', 'How to tip on a large group bill'],
    comparison: ['Tipping 15% vs 20%', 'Tip on pre-tax vs post-tax total'],
    misconception: ['A tip percentage applies to the bill, not the total with tax already added'],
    troubleshooting: ['The per-person amount looks wrong', 'Splitting an uneven bill'],
  },
  realWorldUseCases: [
    'Calculating a fair tip at a restaurant',
    'Splitting a dinner bill evenly among friends',
    'Working out gratuity on a large group reservation',
    'Checking the total before paying by card',
  ],
  commonMistakes: [
    'Tipping on the post-tax total instead of the bill amount',
    'Forgetting to divide the total, not just the tip, when splitting',
  ],
  commonQuestions: [
    'What percentage should I tip?',
    'Does the tip apply before or after tax?',
    'How do I split the bill between people?',
  ],
  usedWith: [
    { slug: 'percentage-calculator', reason: 'Work out the underlying percentage math', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'percentage-calculator', reason: 'General-purpose percentage calculations' },
  ],
  nextSteps: [
    { slug: 'percentage-calculator', reason: 'Calculate other percentages like discounts', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['tip calculator', 'gratuity calculator', 'bill splitter', 'how much to tip', 'split the bill', 'restaurant tip'],
  entityAliases: ['gratuity calculator', 'bill splitter', 'gratuity tool'],
};
