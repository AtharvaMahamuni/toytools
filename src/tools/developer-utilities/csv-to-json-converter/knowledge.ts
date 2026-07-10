import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'csv-to-json-converter',
  title: 'CSV to JSON Converter',
  category: 'developer-utilities',
  summary: 'Convert CSV to a JSON array of objects for APIs, JavaScript, and databases. Smart type detection, custom delimiters, and RFC 4180 quoting.',
  primaryConcepts: ['csv to json', 'data conversion'],
  secondaryConcepts: ['csv', 'json', 'tabular data', 'data import', 'type detection', 'delimiter', 'spreadsheet'],
  intentGroups: {
    informational: ['What is CSV to JSON conversion?', 'How do CSV rows map to JSON objects?'],
    howTo: ['How to convert a CSV export to JSON', 'How to turn a spreadsheet into a JSON array', 'How to import CSV data into a JavaScript app'],
    comparison: ['CSV vs JSON for data storage', 'When to use JSON instead of CSV'],
    misconception: ['Every CSV value becomes a string in JSON', 'CSV always uses commas as the delimiter'],
    troubleshooting: ['Leading zeros lost after converting to numbers', 'Commas inside a field splitting columns', 'Semicolon-separated file not parsing'],
  },
  realWorldUseCases: [
    'Converting a spreadsheet export into a JSON array for a web app',
    'Turning a database CSV dump into JSON for an API request',
    'Seeding JavaScript fixtures or mock data from a CSV file',
    'Reshaping a CSV report into JSON for a charting or visualization library',
    'Loading tab-separated values from a tool export into a JSON pipeline',
  ],
  commonMistakes: [
    'Omitting the header row that names the columns',
    'Expecting numeric strings with leading zeros to become numbers',
    'Choosing the wrong delimiter for semicolon or tab separated files',
    'Forgetting to quote fields that contain the delimiter',
  ],
  commonQuestions: [
    'How does type detection decide what becomes a number or boolean?',
    'Why is a leading-zero value kept as a string?',
    'Can I use a semicolon or tab delimiter?',
    'Can I convert the JSON back to CSV?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format and inspect the JSON output', strength: 0.8 },
    { slug: 'json-validator', reason: 'Validate the resulting JSON syntax', strength: 0.8 },
  ],
  alternatives: [
    { slug: 'json-to-csv-converter', reason: 'Convert the other direction, JSON to CSV' },
    { slug: 'json-minifier', reason: 'Compact the JSON output for transmission' },
  ],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Format the JSON output for readability', priority: 1 },
    { slug: 'json-validator', reason: 'Validate the resulting JSON', priority: 2 },
    { slug: 'json-to-csv-converter', reason: 'Round-trip back to CSV when needed', priority: 3 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: [
    'csv to json', 'convert csv to json', 'csv json converter',
    'csv to json online', 'csv to array', 'import csv to json',
    'tsv to json', 'csv to json array',
  ],
  entityAliases: ['csv json converter', 'csv to json array', 'csv to javascript object', 'csv parser'],
};
