import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'age-calculator',
  title: 'Age Calculator',
  category: 'date-time',
  summary: 'Work out an exact age in years, months, and days from a birth date, with totals and a next-birthday countdown, entirely in the browser.',
  primaryConcepts: ['age calculation', 'date of birth', 'chronological age'],
  secondaryConcepts: ['leap year', 'calendar months', 'next birthday', 'elapsed days'],
  intentGroups: {
    informational: [
      'how age is measured in years, months, and days',
      'why leap years affect an exact age',
    ],
    howTo: [
      'calculate age from a date of birth',
      'find your age on a specific past or future date',
    ],
    comparison: [
      'exact calendar age versus a simple year subtraction',
    ],
    misconception: [
      'age is not just the current year minus the birth year',
    ],
    troubleshooting: [
      'why a February 29 birthday needs special handling',
    ],
  },
  realWorldUseCases: [
    'Confirming an exact age for a form, eligibility, or milestone.',
    'Finding how many days old someone is for a birthday surprise.',
    'Measuring the time elapsed between a start date and a chosen date.',
  ],
  commonMistakes: [
    'Subtracting the birth year from the current year, which is off by one until the birthday has passed this year.',
    'Assuming every month has 30 days instead of borrowing the real length of the preceding month.',
    'Averaging 365.25 days per year rather than counting the exact calendar days, including leap days.',
  ],
  commonQuestions: [
    'How old am I exactly in years, months, and days?',
    'How many days until my next birthday?',
    'What day of the week was I born on?',
  ],
  usedWith: [
    { slug: 'date-difference-calculator', reason: 'Count the days between two dates that are not a birthday', strength: 0.8 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'unix-timestamp-converter', reason: 'Convert that date to or from an epoch timestamp', strength: 0.5 },
  ],
  workflowStage: ['transform'],
  keywords: ['age calculator', 'how old am i', 'date of birth', 'age in days', 'days until birthday'],
  entityAliases: ['birthday calculator', 'date of birth calculator', 'chronological age calculator'],
};
