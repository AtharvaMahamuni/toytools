import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-to-csv-converter',
  title: 'JSON to CSV Converter',
  category: 'developer-utilities',
  summary: 'Convert JSON arrays to CSV for spreadsheets and databases. Flattens nested objects, handles sparse rows, and escapes special characters.',
  primaryConcepts: ['json to csv', 'data conversion'],
  secondaryConcepts: ['csv export', 'json', 'tabular data', 'spreadsheet', 'data transformation', 'nested objects'],
  intentGroups: {
    informational: ['What is JSON to CSV conversion?', 'How does JSON map to CSV columns?'],
    howTo: ['How to export JSON to Excel', 'How to convert an API response to CSV', 'How to flatten nested JSON for a spreadsheet'],
    comparison: ['JSON vs CSV for data storage', 'Flat CSV vs nested JSON'],
    misconception: ['CSV cannot represent nested data — flattening is needed', 'Not all JSON arrays can become CSV directly'],
    troubleshooting: ['Nested objects appear as [object Object] in CSV', 'Missing columns for sparse JSON rows', 'Commas inside values break the CSV'],
  },
  realWorldUseCases: [
    'Exporting an API response to Excel for a client report',
    'Loading JSON fixture data into a relational database via CSV import',
    'Converting a config file or log array into a spreadsheet for analysis',
    'Sharing structured data with teammates who use Google Sheets',
  ],
  commonMistakes: [
    'Passing a JSON object instead of a JSON array',
    'Expecting nested objects to appear as full columns without flattening',
    'Forgetting that values with commas must be quoted in CSV',
  ],
  commonQuestions: [
    'What happens to nested objects when converting to CSV?',
    'How are missing fields handled in sparse JSON arrays?',
    'Can I choose which columns to include?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format and inspect JSON before converting', strength: 0.7 },
    { slug: 'json-validator', reason: 'Validate JSON syntax before converting', strength: 0.9 },
  ],
  alternatives: [
    { slug: 'csv-to-json-converter', reason: 'Convert the other direction — CSV back to JSON' },
    { slug: 'json-minifier', reason: 'Keep JSON compact instead of converting' },
  ],
  nextSteps: [
    { slug: 'csv-to-json-converter', reason: 'Convert the CSV back to JSON when needed', priority: 1 },
    { slug: 'json-validator', reason: 'Validate JSON before converting', priority: 2 },
    { slug: 'json-formatter', reason: 'Inspect and format the source JSON', priority: 3 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: ['json to csv', 'convert json to csv', 'json csv converter', 'export json to csv', 'json to spreadsheet', 'json array to csv'],
  entityAliases: ['json csv converter', 'json to excel converter', 'json export tool'],
};
