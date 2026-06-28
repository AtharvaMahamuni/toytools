import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'normalize-whitespace',
  title: 'Normalize Whitespace',
  category: 'text-utilities',
  summary: 'Standardize all whitespace, collapsing tabs, repeated spaces, and stray breaks into a consistent form.',
  primaryConcepts: ['normalize whitespace'],
  secondaryConcepts: ['tabs and spaces', 'whitespace consistency', 'collapse spacing', 'data cleanup'],
  intentGroups: {
    informational: ['What is whitespace normalization?', 'Which whitespace gets standardized?'],
    howTo: ['How to clean messy spacing from a spreadsheet paste', 'How to make spacing consistent before parsing'],
    comparison: ['Normalizing whitespace vs removing extra spaces', 'Normalizing vs trimming'],
    misconception: ['It handles tabs and breaks, not just spaces', 'It is broader than a simple double-space fix'],
    troubleshooting: ['Line breaks I wanted to keep were collapsed', 'Tabs became single spaces unexpectedly'],
  },
  realWorldUseCases: [
    'Cleaning text pasted from spreadsheets with mixed tabs and spaces',
    'Preparing inconsistent input before parsing or import',
    'Standardizing whitespace across content from many sources',
    'Fixing copy that mixes spacing styles',
  ],
  commonMistakes: [
    'Using it when you only meant to fix double spaces (use remove extra spaces)',
    'Not expecting tabs and line breaks to be affected',
  ],
  commonQuestions: [
    'Does it convert tabs to spaces?',
    'Will it preserve paragraph breaks?',
    'How is this broader than removing extra spaces?',
  ],
  usedWith: [
    { slug: 'remove-tabs', reason: 'Handle tab characters as part of cleanup', strength: 0.7 },
    { slug: 'trim-text', reason: 'Trim edges after normalizing internal whitespace', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'remove-extra-spaces', reason: 'Only collapse repeated spaces, leaving tabs and breaks' },
    { slug: 'remove-tabs', reason: 'Target tab characters specifically' },
  ],
  nextSteps: [
    { slug: 'space-counter', reason: 'Verify the whitespace is now consistent', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['normalize whitespace', 'standardize spacing', 'clean whitespace', 'collapse tabs and spaces', 'fix messy spacing'],
  entityAliases: ['normalize whitespace', 'whitespace normalization'],
  inputs: ['text'],
  outputs: ['text with normalized whitespace'],
  difficulty: 'intermediate',
  audience: ['developers', 'data analysts', 'editors'],
};
