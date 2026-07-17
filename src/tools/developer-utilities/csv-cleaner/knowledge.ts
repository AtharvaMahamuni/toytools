import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'csv-cleaner',
  title: 'CSV Cleaner',
  category: 'developer-utilities',
  summary: 'Fix a messy CSV in one pass: remove empty rows, trim cell whitespace, drop trailing-comma phantom columns, and square ragged rows.',
  primaryConcepts: ['csv cleanup'],
  secondaryConcepts: ['data normalization', 'import errors', 'ragged rows', 'whitespace trimming'],
  intentGroups: {
    informational: ['What makes a CSV file invalid?', 'What are ragged rows?'],
    howTo: ['How to remove empty rows from a CSV', 'How to fix a CSV that fails to import'],
    comparison: ['Automated cleaning vs manual spreadsheet cleanup', 'Cleaning vs converting'],
    misconception: ['A CSV that opens in Excel is not necessarily valid for importers', 'Trailing commas are not harmless'],
    troubleshooting: ['Import rejects the file over column counts', 'Values stopped matching after an export added padding'],
  },
  realWorldUseCases: [
    'Fixing an export a database importer rejects over column counts',
    'Stripping whitespace padding so joins and lookups match again',
    'Removing blank separator rows a reporting tool inserted',
    'Normalizing a hand-edited CSV before automated processing',
  ],
  commonMistakes: [
    'Cleaning by hand in a spreadsheet and introducing new format changes on save',
    'Assuming the file is clean because it renders fine in a spreadsheet',
  ],
  commonQuestions: [
    'What makes a CSV file invalid?',
    'Why does my CSV open fine in Excel but fail to import?',
    'Why did my lookups stop matching after a CSV export?',
  ],
  usedWith: [
    { slug: 'csv-diff', reason: 'Clean both files first so the diff shows real changes, not noise', strength: 0.8 },
    { slug: 'csv-to-json-converter', reason: 'Convert the cleaned file for an API', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'remove-blank-lines', reason: 'Plain-text blank-line removal when the file is not really CSV' },
  ],
  nextSteps: [
    { slug: 'csv-to-json-converter', reason: 'Convert the cleaned data to JSON', priority: 1 },
    { slug: 'csv-diff', reason: 'Verify what the cleanup changed against the original', priority: 2 },
  ],
  workflowStage: ['transform', 'validate'],
  keywords: ['csv cleaner', 'clean csv', 'remove empty rows', 'fix csv', 'csv import error'],
  entityAliases: ['csv fixer', 'csv normalizer', 'clean csv file'],
  inputs: ['messy csv text'],
  outputs: ['normalized csv text', 'cleanup summary'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'operations'],
};
