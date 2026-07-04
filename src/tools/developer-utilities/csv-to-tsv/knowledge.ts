import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'csv-to-tsv',
  title: 'CSV to TSV Converter',
  category: 'developer-utilities',
  summary: 'Convert comma-separated values to tab-separated values with quoting parsed and rebuilt correctly, so embedded commas survive.',
  primaryConcepts: ['delimiter conversion'],
  secondaryConcepts: ['tab-separated values', 'rfc 4180 quoting', 'spreadsheet paste', 'data import'],
  intentGroups: {
    informational: ['What is TSV?', 'When is TSV better than CSV?'],
    howTo: ['How to convert CSV to tab-separated values', 'How to paste CSV data into a spreadsheet as columns'],
    comparison: ['CSV vs TSV', 'Parsing conversion vs find-and-replace'],
    misconception: ['Replacing commas with tabs corrupts quoted cells', 'TSV does not need any quoting at all'],
    troubleshooting: ['My converted file split a quoted cell in two', 'Tabs inside cells broke my import'],
  },
  realWorldUseCases: [
    'Feeding a bulk loader or CLI tool that only accepts tab-delimited input',
    'Pasting CSV data into Excel or Google Sheets as proper columns',
    'Preparing data for cut, awk, and other tab-oriented Unix tools',
    'Converting exports for legacy systems that predate CSV quoting',
  ],
  commonMistakes: [
    'Converting with find-and-replace and corrupting quoted commas',
    'Forgetting that cells containing tabs still need quoting in TSV',
  ],
  commonQuestions: [
    'How do I convert CSV to TSV without Excel?',
    'What happens to quoted fields during conversion?',
    'Is the conversion lossless?',
  ],
  usedWith: [
    { slug: 'csv-cleaner', reason: 'Clean the file before changing its delimiter', strength: 0.8 },
    { slug: 'csv-to-json-converter', reason: 'Convert the same data to JSON instead', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'csv-to-json-converter', reason: 'When the target tool wants structured JSON rather than another delimiter' },
  ],
  nextSteps: [
    { slug: 'csv-diff', reason: 'Verify the converted data against the original export', priority: 1 },
    { slug: 'csv-cleaner', reason: 'Normalize whitespace and blank rows first', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: ['csv to tsv', 'tab separated values', 'delimiter conversion', 'convert csv', 'tsv converter'],
  entityAliases: ['tsv converter', 'tab delimited converter', 'csv tsv'],
  inputs: ['csv text'],
  outputs: ['tab-separated text'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts'],
};
