import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'shop-upi-tally',
  title: 'Shop UPI Tally',
  category: 'money-finance',
  summary: 'A local monthly tally of shop UPI receipts, measured against 1,00,000 rupees. Not a bank status.',
  primaryConcepts: ['shop UPI tally'],
  secondaryConcepts: ['local month'],
  intentGroups: {
    informational: ['What is Shop UPI Tally?'],
    howTo: ['How do export and import work?'],
    comparison: ['Shop UPI Tally versus the MDR estimator'],
    misconception: ['Does crossing 1,00,000 change my merchant status?'],
    troubleshooting: ['What happens when the calendar month changes?'],
  },
  realWorldUseCases: [
    'Adding shop UPI receipts to a private monthly count',
  ],
  commonMistakes: [
    'Reading the 1,00,000 line as a merchant-status switch',
    'Expecting the tally to survive cleared site data',
  ],
  commonQuestions: [
    'Does crossing 1,00,000 change my merchant status?',
    'Is this my bank or NPCI category?',
    'Are my numbers uploaded?',
  ],
  usedWith: [
    { slug: 'upi-mdr-estimator', reason: 'An MDR estimate is a different question from a receipt tally', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'upi-mdr-estimator', reason: 'The estimator prices one payment and does not store a month' },
  ],
  nextSteps: [
    { slug: 'upi-mdr-estimator', reason: 'Estimate MDR on one amount when you have the PIB rates in mind', priority: 1 },
  ],
  workflowStage: ['analyze', 'export'],
  keywords: ['receipts'],
  entityAliases: ['tally'],
  inputs: ['receipt amount'],
  outputs: ['month total'],
  difficulty: 'beginner',
  audience: ['small shops'],
};
