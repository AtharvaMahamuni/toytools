import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-duplicate-lines',
  title: 'Remove Duplicate Lines',
  category: 'text-utilities',
  summary: 'Keep only the first occurrence of each line, deduplicating lists, logs, and exported data.',
  primaryConcepts: ['remove duplicate lines'],
  secondaryConcepts: ['deduplication', 'unique lines', 'case sensitivity', 'order preservation'],
  intentGroups: {
    informational: ['How are duplicate lines detected?', 'Is the original order preserved?'],
    howTo: ['How to deduplicate an email or URL list', 'How to get unique lines from a log'],
    comparison: ['Removing duplicates vs removing blank lines', 'Exact-match vs case-insensitive dedup'],
    misconception: ['Trailing spaces can make identical-looking lines differ', 'Case differences count as different lines'],
    troubleshooting: ['Lines I expected to match were kept', 'Order changed when I did not expect it'],
  },
  realWorldUseCases: [
    'Deduplicating an email or subscriber list',
    'Getting a unique set of URLs or IDs',
    'Cleaning repeated entries from a log or export',
    'Building a distinct keyword list',
  ],
  commonMistakes: [
    'Not trimming whitespace first, so near-identical lines survive',
    'Forgetting that case differences are treated as distinct',
  ],
  commonQuestions: [
    'Is matching case-sensitive?',
    'Are leading or trailing spaces considered?',
    'Does it keep the first or last occurrence?',
  ],
  usedWith: [
    { slug: 'trim-text', reason: 'Trim edges first so true duplicates collapse', strength: 0.7 },
    { slug: 'remove-blank-lines', reason: 'Drop empties before or after deduping', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'text-compare', reason: 'See the differences between two texts instead of deduping one' },
    { slug: 'remove-blank-lines', reason: 'Only remove empty lines, keeping duplicates' },
  ],
  nextSteps: [
    { slug: 'line-counter', reason: 'Count the unique lines that remain', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove duplicate lines', 'deduplicate text', 'unique lines', 'dedup list', 'delete repeated lines'],
  entityAliases: ['duplicate lines', 'dedupe', 'unique lines'],
  inputs: ['text'],
  outputs: ['deduplicated text'],
  difficulty: 'beginner',
  audience: ['data analysts', 'developers', 'marketers'],
};
