import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'text-compare',
  title: 'Text Compare',
  category: 'text-utilities',
  summary: 'Compare two pieces of text side by side and highlight the differences between them.',
  primaryConcepts: ['text comparison'],
  secondaryConcepts: ['diff', 'added and removed lines', 'side-by-side', 'change detection'],
  intentGroups: {
    informational: ['What is a text diff?', 'How are differences detected?'],
    howTo: ['How to compare two versions of a document', 'How to spot what changed between two drafts'],
    comparison: ['Text compare vs find and replace', 'Line-level diff vs character-level diff'],
    misconception: ['Whitespace and case differences can show as changes', 'A diff shows what changed, it does not merge'],
    troubleshooting: ['Trailing spaces showed as differences', 'Reordered lines looked like full rewrites'],
  },
  realWorldUseCases: [
    'Checking what changed between two drafts of a document',
    'Reviewing edits a collaborator made',
    'Comparing two configuration or code snippets',
    'Proofreading a revised version against the original',
  ],
  commonMistakes: [
    'Comparing without normalizing whitespace first, inflating the diff',
    'Expecting it to merge the two texts rather than just show differences',
  ],
  commonQuestions: [
    'What is the difference between a line-level diff and a character-level diff?',
    'Why do trailing spaces show as differences in a text compare?',
    'Why do reordered lines look like a full rewrite in a diff?',
  ],
  usedWith: [
    { slug: 'find-replace', reason: 'Apply fixes after spotting the differences', strength: 0.6 },
    { slug: 'normalize-whitespace', reason: 'Normalize both sides to reduce noise in the diff', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'find-replace', reason: 'Edit a single text instead of comparing two' },
    { slug: 'remove-duplicate-lines', reason: 'Deduplicate one list rather than diff two' },
  ],
  nextSteps: [
    { slug: 'find-replace', reason: 'Make the corrections the diff revealed', priority: 1 },
  ],
  workflowStage: ['validate'],
  keywords: ['text compare', 'diff checker', 'compare text', 'text difference', 'compare two texts'],
  entityAliases: ['text diff', 'compare text', 'diff'],
  inputs: ['text', 'text'],
  outputs: ['difference report'],
  difficulty: 'beginner',
  audience: ['writers', 'developers', 'editors', 'reviewers'],
};
