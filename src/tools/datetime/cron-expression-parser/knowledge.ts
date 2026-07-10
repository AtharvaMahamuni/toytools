import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'cron-expression-parser',
  title: 'Cron Expression Parser',
  category: 'date-time',
  summary: 'Parse a cron expression into plain English, count how often it runs, and list the next run times, with lists, ranges, steps, and names supported, in browser.',
  primaryConcepts: ['cron expression parser', 'cron expression explained', 'cron next run time'],
  secondaryConcepts: ['crontab', 'cron fields', 'cron step values', 'cron ranges'],
  intentGroups: {
    informational: [
      'what each of the five cron fields means',
      'how a star, range, list, and step change a cron field',
    ],
    howTo: [
      'read what a cron expression means',
      'find the next run time of a cron job',
    ],
    comparison: [
      'a star versus a specific value in a cron field',
      'a step value versus a plain range',
    ],
    misconception: [
      'when both day-of-month and day-of-week are set, a day matches if either matches, not both',
    ],
    troubleshooting: [
      'why a cron job runs more or less often than expected',
    ],
  },
  realWorldUseCases: [
    'Checking what a crontab line inherited from another developer actually does.',
    'Confirming the next few run times before deploying a scheduled job.',
    'Debugging a cron job that fires too often or never at all.',
  ],
  commonMistakes: [
    'Assuming day-of-month and day-of-week are combined with AND when cron uses OR if both are set.',
    'Reading */15 as "at 15 minutes" instead of "every 15 minutes".',
    'Forgetting that standard cron has five fields, not six with seconds.',
  ],
  commonQuestions: [
    'What does this cron expression mean?',
    'When does this cron job run next?',
    'How many times a day does this cron run?',
  ],
  usedWith: [],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['cron expression parser', 'cron expression explained', 'crontab generator', 'cron next run time', 'cron to english', 'cron schedule'],
  entityAliases: ['crontab parser', 'cron reader', 'cron translator'],
};
