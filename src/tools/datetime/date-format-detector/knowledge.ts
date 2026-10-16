import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'date-format-detector',
  title: 'Date Format Detector',
  category: 'date-time',
  summary:
    'Paste a column of dates and see which rows can be read as two different days, including a missing time zone and a two-digit year, entirely in the browser.',
  primaryConcepts: ['ambiguous date format', 'day first or month first', 'ISO 8601 date'],
  secondaryConcepts: ['Excel locale', 'two-digit year', 'time zone offset', 'DD/MM and MM/DD'],
  intentGroups: {
    informational: [
      'why 03/04/2026 is either 3 April or 4 March',
      'how a two-digit year is pivoted',
    ],
    howTo: [
      'check a pasted column for dates that can be read two ways',
      'see how a date will be parsed before a spreadsheet stores it',
    ],
    comparison: [
      'ISO 8601 vs a US date',
      'day first vs month first',
    ],
    misconception: [
      'A 13 settles only that line. Rows where both numbers are 12 or under can still be two different days.',
    ],
    troubleshooting: [
      'excel date locale wrong after an export',
      'a timestamp with no zone lands on the wrong civil day',
    ],
  },
  realWorldUseCases: [
    'Checking a European CSV date column before opening it in a US locale.',
    'Finding the rows in a mixed list where both numbers are 12 or under.',
    'Spotting a timestamp that has no offset before it is stored.',
  ],
  commonMistakes: [
    'Eyeballing a column for a day above 12 and missing every row where both numbers are 12 or under.',
    'Treating a timestamp with no zone as a finished civil date.',
    'Assuming a two-digit year always means 20xx.',
  ],
  commonQuestions: [
    'Is this date DD/MM or MM/DD?',
    'How will this date be parsed?',
    'Which rows in this column are an ambiguous date format?',
  ],
  usedWith: [
    { slug: 'timezone-converter', reason: 'Apply a real zone once a timestamp has been flagged as having none', strength: 0.7 },
    { slug: 'date-difference-calculator', reason: 'Count the days between two dates after each reading is pinned down', strength: 0.6 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'unix-timestamp-converter', reason: 'Turn a date you have now pinned down into a Unix timestamp', strength: 0.5 },
  ],
  workflowStage: ['analyze', 'validate'],
  keywords: [
    'is this date dd/mm or mm/dd',
    'ambiguous date format',
    'how will this date be parsed',
    'excel date locale wrong',
    'iso 8601 vs us date',
  ],
  entityAliases: ['date format checker', 'DD/MM or MM/DD', 'ambiguous date parser'],
  inputs: ['text'],
  outputs: ['metric'],
};
