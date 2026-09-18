import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'split-bill',
  title: 'Split Bill',
  category: 'money-finance',
  summary: 'Splits a dinner bill and optional tip so leftover paise land on the last person.',
  primaryConcepts: ['bill split'],
  secondaryConcepts: ['leftover paise'],
  intentGroups: {
    informational: ['What is Split Bill?'],
    howTo: ['How does the leftover paise work?'],
    comparison: ['Split Bill versus the tip calculator'],
    misconception: ['Is this a payment-fee tool?'],
    troubleshooting: ['What if the total divides evenly?'],
  },
  realWorldUseCases: [
    'Splitting a dinner bill after an optional tip',
  ],
  commonMistakes: [
    'Rounding each share alone so the sum misses the bill',
    'Treating this page as a payment-fee tool',
  ],
  commonQuestions: [
    'How does the leftover paise work?',
    'Does this page keep accounts?',
    'Are my numbers uploaded?',
  ],
  usedWith: [
    { slug: 'tip-calculator', reason: 'A tip percent is a sibling question', strength: 0.5 },
    { slug: 'upi-mdr-estimator', reason: 'A merchant charge is a different page', strength: 0.2 },
  ],
  alternatives: [
    { slug: 'tip-calculator', reason: 'The tip calculator stops at the tip and the total' },
  ],
  nextSteps: [
    { slug: 'tip-calculator', reason: 'Check a tip percent on its own', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['dinner'],
  entityAliases: ['shares'],
  inputs: ['bill', 'people', 'tip percent'],
  outputs: ['each share'],
  difficulty: 'beginner',
  audience: ['friends at dinner'],
};
