import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'trim-text',
  title: 'Trim Text',
  category: 'text-utilities',
  summary: 'Remove leading and trailing whitespace from each line, clearing indentation and trailing spaces.',
  primaryConcepts: ['trim text'],
  secondaryConcepts: ['leading whitespace', 'trailing whitespace', 'per-line trim', 'indentation'],
  intentGroups: {
    informational: ['What does trimming remove?', 'What is trailing whitespace?'],
    howTo: ['How to remove trailing spaces from every line', 'How to strip indentation from pasted code'],
    comparison: ['Trimming edges vs collapsing internal spaces', 'Per-line trim vs whole-text trim'],
    misconception: ['Trimming touches only the edges, not spaces between words', 'Invisible trailing spaces still get removed'],
    troubleshooting: ['Spaces between words remained (by design)', 'Blank lines were left in place'],
  },
  realWorldUseCases: [
    'Stripping accidental indentation from pasted snippets',
    'Removing invisible trailing spaces that break diffs',
    'Cleaning each line of a list before processing',
    'Preparing values so comparisons match exactly',
  ],
  commonMistakes: [
    'Expecting it to also collapse double spaces inside a line',
    'Forgetting blank lines remain unless removed separately',
  ],
  commonQuestions: [
    'Does it remove spaces between words?',
    'Does it trim each line or just the whole block?',
    'Will it remove empty lines too?',
  ],
  usedWith: [
    { slug: 'remove-extra-spaces', reason: 'Collapse internal runs after trimming the edges', strength: 0.7 },
    { slug: 'remove-duplicate-lines', reason: 'Trim first so duplicates match exactly', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'remove-extra-spaces', reason: 'Target internal double spaces instead of edges' },
    { slug: 'normalize-whitespace', reason: 'Standardize all whitespace at once' },
  ],
  nextSteps: [
    { slug: 'remove-blank-lines', reason: 'Drop the now empty lines trimming exposed', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['trim text', 'remove trailing spaces', 'strip whitespace', 'remove leading spaces', 'trim lines'],
  entityAliases: ['trim', 'trailing whitespace', 'leading whitespace'],
  inputs: ['text'],
  outputs: ['trimmed text'],
  difficulty: 'beginner',
  audience: ['developers', 'writers', 'data analysts'],
};
