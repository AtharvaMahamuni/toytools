import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'timezone-converter',
  title: 'Timezone Converter',
  category: 'date-time',
  summary: 'Convert a date and time from one timezone to another, with the UTC time, each zone offset, and the difference, daylight saving handled, in the browser.',
  primaryConcepts: ['timezone converter', 'convert time between time zones', 'time difference between cities'],
  secondaryConcepts: ['UTC offset', 'daylight saving time', 'GMT', 'IANA timezone'],
  intentGroups: {
    informational: [
      'how a time in one timezone maps to another timezone',
      'what a UTC offset means for a city',
    ],
    howTo: [
      'convert a time between two time zones',
      'find the time difference between two cities',
    ],
    comparison: [
      'UTC offset versus daylight saving time',
      'GMT versus UTC',
    ],
    misconception: [
      'the offset between two zones is not always fixed because daylight saving shifts it',
    ],
    troubleshooting: [
      'why a converted time can land on the next or previous calendar day',
    ],
  },
  realWorldUseCases: [
    'Scheduling a meeting across offices in different time zones.',
    'Working out what time a live event airs in your own city.',
    'Converting a UTC timestamp from a log into your local time.',
  ],
  commonMistakes: [
    'Assuming the gap between two zones is fixed all year, when daylight saving changes it.',
    'Forgetting that a converted time can fall on a different calendar day.',
    'Treating GMT and a summer offset like British Summer Time as the same thing.',
  ],
  commonQuestions: [
    'How do I convert a time between two time zones?',
    'What is the time difference between two cities?',
    'How do I convert a time to UTC?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['timezone converter', 'time zone converter', 'convert time between time zones', 'utc converter', 'time difference between cities', 'gmt to local time'],
  entityAliases: ['world clock converter', 'time zone calculator', 'gmt converter'],
};
