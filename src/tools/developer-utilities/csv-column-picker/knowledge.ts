import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'csv-column-picker',
  title: 'CSV Column Picker',
  category: 'developer-utilities',
  summary: 'Keep named columns from a CSV by header or by position, including semicolon files.',
  primaryConcepts: ['csv column picker'],
  secondaryConcepts: ['extract columns from csv', 'csv column position', 'semicolon csv'],
  intentGroups: {
    informational: ['What is a csv column picker?', 'What a header row means for a column cut'],
    howTo: ['How do I extract columns from csv by header name?', 'How to keep columns from a semicolon file'],
    comparison: ['What is the difference between picking by header name and picking by position?'],
    misconception: ['A semicolon file is not one column', 'A position number is not a stable field name'],
    troubleshooting: ['Why did my semicolon file become one column?', 'What happens when a header name is missing?'],
  },
  realWorldUseCases: [
    'Pull name and email out of a wide CRM export',
    'Drop a salary column before sharing a spreadsheet',
    'Keep city and name from a European semicolon export',
  ],
  commonMistakes: [
    'Picking by position after a column is inserted',
    'Treating a semicolon file as comma-separated',
    'Ignoring a missing header and guessing the column',
  ],
  commonQuestions: [
    'What is a csv column picker?',
    'How do I extract columns from csv by header name?',
    'What is the difference between picking by header name and picking by position?',
    'Why did my semicolon file become one column?',
    'What happens when a header name is missing?',
    'Does a quoted comma stay inside the cell?',
    'Will a pick by position break if I insert a column?',
    'Is my CSV uploaded anywhere?',
  ],
  usedWith: [
    { slug: 'csv-cleaner', reason: 'Square ragged rows before you choose columns', strength: 0.8 },
    { slug: 'csv-to-tsv', reason: 'Change the delimiter after the columns you need are left', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'csv-to-json-converter', reason: 'When you need objects for an API rather than a smaller CSV' },
  ],
  nextSteps: [
    { slug: 'csv-to-json-converter', reason: 'Turn the smaller CSV into JSON', priority: 1 },
    { slug: 'json-to-csv-converter', reason: 'Come back to CSV after an edit in JSON', priority: 2 },
  ],
  workflowStage: ['transform', 'export'],
  keywords: ['csv column picker', 'extract columns from csv', 'select csv columns', 'semicolon csv', 'keep csv columns'],
  entityAliases: ['csv column selector', 'csv column filter', 'pick csv columns'],
  inputs: ['csv text', 'column list'],
  outputs: ['smaller csv', 'delimiter or position notice'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'operations'],
};
