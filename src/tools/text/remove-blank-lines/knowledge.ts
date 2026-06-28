import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-blank-lines',
  title: 'Remove Blank Lines',
  category: 'text-utilities',
  summary: 'Strip empty and whitespace-only lines so lists, code, and data become compact and gap-free.',
  primaryConcepts: ['remove blank lines'],
  secondaryConcepts: ['empty line', 'whitespace-only line', 'compact text', 'line cleanup'],
  intentGroups: {
    informational: ['What counts as a blank line?', 'Why do pasted lists have empty gaps?'],
    howTo: ['How to remove empty lines from a list', 'How to compact code or data without gaps'],
    comparison: ['Removing blank lines vs removing duplicate lines', 'Blank lines vs trailing spaces'],
    misconception: ['Whitespace-only lines look blank but contain spaces', 'It removes gaps, not paragraph structure on purpose'],
    troubleshooting: ['A line with only spaces was not removed elsewhere', 'Intentional spacing disappeared'],
  },
  realWorldUseCases: [
    'Compacting a list pasted with empty lines between items',
    'Cleaning code or config that has stray empty lines',
    'Tightening data before importing it',
    'Removing the gaps left after deleting content',
  ],
  commonMistakes: [
    'Removing blank lines that were intentional paragraph separators',
    'Assuming whitespace-only lines are always treated as blank',
  ],
  commonQuestions: [
    'Does it remove lines that contain only spaces or tabs?',
    'Will it keep a single separator between sections?',
    'How is this different from removing duplicate lines?',
  ],
  usedWith: [
    { slug: 'remove-duplicate-lines', reason: 'Compact then deduplicate the remaining lines', strength: 0.7 },
    { slug: 'line-counter', reason: 'Confirm the reduced line total', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'normalize-whitespace', reason: 'Standardize all whitespace rather than only blank lines' },
    { slug: 'paragraph-counter', reason: 'Measure structure instead of stripping gaps' },
  ],
  nextSteps: [
    { slug: 'trim-text', reason: 'Trim leftover edge whitespace on each line', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove blank lines', 'delete empty lines', 'remove empty lines', 'compact text', 'strip blank lines'],
  entityAliases: ['blank lines', 'empty lines'],
  inputs: ['text'],
  outputs: ['text without blank lines'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'writers'],
};
