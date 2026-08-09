import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'unix-timestamp-converter',
  title: 'Unix Timestamp Converter',
  category: 'date-time',
  summary: 'Convert a Unix timestamp to a date or a date back to a timestamp, in seconds or milliseconds, with UTC time, the ISO 8601 string, and local time, in browser.',
  primaryConcepts: ['Unix timestamp conversion', 'epoch converter', 'unix time to date'],
  secondaryConcepts: ['Unix epoch', 'milliseconds vs seconds', 'ISO 8601', 'UTC time'],
  intentGroups: {
    informational: [
      'what a Unix timestamp is and what the epoch counts from',
      'why a Unix timestamp is the same in every timezone',
    ],
    howTo: [
      'convert a Unix timestamp to a date',
      'convert a date to a Unix timestamp',
    ],
    comparison: [
      'timestamp in seconds versus milliseconds',
      'Unix time versus a local calendar date',
    ],
    misconception: [
      'a Unix timestamp does not carry a timezone because it is always counted from UTC',
    ],
    troubleshooting: [
      'why a timestamp that looks wrong is often milliseconds read as seconds',
    ],
  },
  realWorldUseCases: [
    'Reading a Unix timestamp from a log, database row, or API response.',
    'Turning a specific date into a timestamp for a config or query.',
    'Checking whether a value is in seconds or milliseconds before using it.',
  ],
  commonMistakes: [
    'Reading a milliseconds timestamp as seconds, which lands the date thousands of years in the future.',
    'Assuming a Unix timestamp is in local time when it is always counted from UTC.',
    'Forgetting that the epoch starts on 1 January 1970, so earlier dates are negative.',
  ],
  commonQuestions: [
    'How do I convert a Unix timestamp to a date?',
    'How do I convert a date to a Unix timestamp?',
    'Is a Unix timestamp in seconds or milliseconds?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['unix timestamp converter', 'epoch converter', 'unix time to date', 'timestamp to date', 'date to unix timestamp', 'milliseconds to date'],
  entityAliases: ['epoch time converter', 'unix time converter', 'posix timestamp'],
};
