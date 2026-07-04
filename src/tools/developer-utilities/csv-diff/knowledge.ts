import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'csv-diff',
  title: 'CSV Diff',
  category: 'developer-utilities',
  summary: 'Compare two CSV files by row key and see added, removed, and changed rows with per-column detail, without uploading either file.',
  primaryConcepts: ['csv comparison'],
  secondaryConcepts: ['row key', 'data reconciliation', 'spreadsheet exports', 'change detection'],
  intentGroups: {
    informational: ['How does a CSV diff work?', 'What is a row-aware comparison?'],
    howTo: ['How to compare two CSV files', 'How to find changed rows between two exports'],
    comparison: ['CSV diff vs text diff', 'Key-based vs whole-row comparison'],
    misconception: ['A text diff on CSVs flags reordered rows as changes', 'Identical row counts do not mean identical data'],
    troubleshooting: ['Everything shows as added and removed', 'Duplicate keys force whole-row mode'],
  },
  realWorldUseCases: [
    'Reconciling two database exports taken before and after a change',
    'Checking what a colleague edited in a shared spreadsheet export',
    'Verifying that a data migration preserved every row',
    "Auditing a price list or inventory file against last week's version",
  ],
  commonMistakes: [
    'Comparing files whose first column is not a stable unique key',
    'Uploading sensitive exports to server-side comparison sites',
  ],
  commonQuestions: [
    'How does this CSV diff compare rows?',
    'Why not just use a regular text diff on the two files?',
    'Are my CSV files uploaded to a server?',
  ],
  usedWith: [
    { slug: 'csv-cleaner', reason: 'Normalize whitespace and blank rows before comparing', strength: 0.8 },
    { slug: 'csv-to-json-converter', reason: 'Inspect one side as structured data', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'text-compare', reason: 'Line-by-line comparison for plain text rather than tabular data' },
  ],
  nextSteps: [
    { slug: 'csv-cleaner', reason: 'Clean the file the diff revealed problems in', priority: 1 },
    { slug: 'csv-to-json-converter', reason: 'Convert the reconciled file for an API', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['csv diff', 'compare csv files', 'csv comparison', 'find changed rows', 'data reconciliation'],
  entityAliases: ['csv compare', 'csv comparison', 'diff csv'],
  inputs: ['original csv', 'changed csv'],
  outputs: ['added rows', 'removed rows', 'changed rows with column detail'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'operations'],
};
