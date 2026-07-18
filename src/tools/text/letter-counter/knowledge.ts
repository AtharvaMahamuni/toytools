import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'letter-counter',
  title: 'Letter Counter',
  category: 'text-utilities',
  summary: 'Count only the alphabetic letters in text, ignoring spaces, digits, and punctuation.',
  primaryConcepts: ['letter count'],
  secondaryConcepts: ['alphabetic characters', 'letters vs characters', 'diacritics', 'non-letter exclusion'],
  intentGroups: {
    informational: ['What counts as a letter?', 'How do letters differ from characters?'],
    howTo: ['How to count letters only, excluding spaces and numbers', 'How to check an alphabetic-only field'],
    comparison: ['Letter count vs character count', 'Letters vs alphanumeric characters'],
    misconception: ['Letters exclude digits, spaces, and punctuation', 'Accented letters still count as letters'],
    troubleshooting: ['My count dropped after removing numbers', 'Accented characters behaved unexpectedly'],
  },
  realWorldUseCases: [
    'Checking a field that allows letters only',
    'Linguistic or puzzle work where punctuation should not count',
    'Comparing alphabetic length across translations',
    'Verifying a name or code is purely alphabetic',
  ],
  commonMistakes: [
    'Treating letter count and character count as the same number',
    'Forgetting that digits and symbols are deliberately excluded',
  ],
  commonQuestions: [
    'How do I check that a text field contains only letters?',
    'Why did my letter count drop after I deleted the numbers?',
    'Why do accented letters count the same as regular letters?',
  ],
  usedWith: [
    { slug: 'character-counter', reason: 'Compare letters against the full character total', strength: 0.7 },
    { slug: 'space-counter', reason: 'Account for the spaces letters exclude', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'character-counter', reason: 'Count every character, including spaces and symbols' },
    { slug: 'word-counter', reason: 'Measure by word rather than by letter' },
  ],
  nextSteps: [
    { slug: 'character-counter', reason: 'Switch to full character count for a platform limit', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['letter counter', 'count letters', 'alphabetic characters', 'letters only', 'letters in text'],
  entityAliases: ['letter count', 'letters'],
  inputs: ['text'],
  outputs: ['letter count'],
  difficulty: 'beginner',
  audience: ['students', 'linguists', 'puzzle solvers', 'writers'],
};
