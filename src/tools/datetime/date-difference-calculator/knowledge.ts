import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'date-difference-calculator',
  title: 'Date Difference Calculator',
  category: 'date-time',
  summary: 'Measure the exact duration between two dates in years, months, and days, with totals in days, weeks, and months and a weekday count, all in the browser.',
  primaryConcepts: ['date difference', 'days between two dates', 'duration between dates'],
  secondaryConcepts: ['business days', 'weeks between dates', 'calendar months', 'weekday count'],
  intentGroups: {
    informational: [
      'how the duration between two dates is measured',
      'what business days mean in a date range',
    ],
    howTo: [
      'count the days between two dates',
      'find the number of weekdays between two dates',
    ],
    comparison: [
      'calendar duration versus total days',
      'total days versus business days',
    ],
    misconception: [
      'the order of the two dates does not change the length of the span',
    ],
    troubleshooting: [
      'why total days and the years-months-days breakdown describe the same gap',
    ],
  },
  realWorldUseCases: [
    'Counting the days remaining until a deadline or event.',
    'Measuring a project length in weeks and business days.',
    'Working out how long ago a past date was in exact calendar terms.',
  ],
  commonMistakes: [
    'Approximating a month as 30 days instead of borrowing the real length of the preceding month.',
    'Counting calendar days when a task actually needs business days, which exclude weekends.',
    'Assuming the difference changes if you swap the start and end dates.',
  ],
  commonQuestions: [
    'How many days are between two dates?',
    'How many weekdays are between two dates?',
    'How many weeks and months is that span?',
  ],
  usedWith: [
    { slug: 'age-calculator', reason: 'Measure the same span from a birthdate instead', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'timezone-converter', reason: 'Check what those dates are in another zone', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: ['date difference calculator', 'days between two dates', 'business days calculator', 'weeks between dates', 'duration between dates'],
  entityAliases: ['days between dates', 'date duration calculator', 'time between dates'],
};
