import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-extra-spaces',
  title: 'Remove Extra Spaces',
  category: 'text-utilities',
  summary: 'Collapse repeated spaces between words down to a single space, fixing double-spaced and messy text.',
  primaryConcepts: ['remove extra spaces'],
  secondaryConcepts: ['double space', 'multiple spaces', 'space normalization', 'clean spacing'],
  intentGroups: {
    informational: ['What does removing extra spaces do?', 'Why does pasted text get double spaces?'],
    howTo: ['How to fix double spaces after periods', 'How to clean spacing in pasted text'],
    comparison: ['Removing extra spaces vs trimming edges', 'Collapsing spaces vs normalizing all whitespace'],
    misconception: ['It collapses internal runs, not leading/trailing edges only', 'It keeps single spaces between words'],
    troubleshooting: ['Tabs were left untouched', 'Line breaks were preserved when I expected them gone'],
  },
  realWorldUseCases: [
    'Fixing the old two-spaces-after-a-period habit',
    'Cleaning text copied from PDFs or emails',
    'Tidying form input before saving it',
    'Preparing prose for consistent typesetting',
  ],
  commonMistakes: [
    'Expecting it to also strip leading and trailing whitespace (use trim)',
    'Expecting it to convert tabs (use remove tabs or normalize whitespace)',
  ],
  commonQuestions: [
    'Does it remove line breaks too?',
    'Should I remove extra spaces or trim the whitespace at the edges?',
    'Why does my text still have wide gaps after removing extra spaces?',
  ],
  usedWith: [
    { slug: 'trim-text', reason: 'Trim the edges after collapsing internal runs', strength: 0.7 },
    { slug: 'space-counter', reason: 'Confirm the double spaces are gone', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'normalize-whitespace', reason: 'Standardize tabs and line breaks too, not just spaces' },
    { slug: 'trim-text', reason: 'Only strip leading and trailing whitespace' },
  ],
  nextSteps: [
    { slug: 'remove-blank-lines', reason: 'Clear empty lines once spacing is fixed', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove extra spaces', 'remove double spaces', 'fix spacing', 'collapse spaces', 'clean whitespace'],
  entityAliases: ['extra spaces', 'double spaces'],
  inputs: ['text'],
  outputs: ['text with single spaces'],
  difficulty: 'beginner',
  audience: ['writers', 'editors', 'students'],
};
