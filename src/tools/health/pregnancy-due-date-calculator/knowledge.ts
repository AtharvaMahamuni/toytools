import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'pregnancy-due-date-calculator',
  title: 'Pregnancy Due Date Calculator',
  category: 'health-fitness',
  summary:
    'Project a due date, weeks pregnant, and trimester dates from the first day of the last period and the cycle length.',
  primaryConcepts: ['pregnancy due date'],
  secondaryConcepts: ['Naegele rule', 'weeks pregnant', 'estimated delivery date', 'trimester dates'],
  intentGroups: {
    informational: [
      'what the Naegele rule counts',
      'how many weeks pregnant a last period means',
      'when the second and third trimesters start',
    ],
    howTo: [
      'how many weeks pregnant am I',
      'estimate a delivery date from the last period',
      'adjust a due date for a cycle that is not 28 days',
    ],
    comparison: [
      'a 28 day cycle versus a 32 day cycle',
      'weeks pregnant versus days until the due date',
    ],
    misconception: [
      'a longer cycle changes how many weeks pregnant you are',
      'the month shortcut and the 280 day count always match',
    ],
    troubleshooting: [
      'why the due date moved when the cycle length changed',
      'why the week count did not move with the due date',
    ],
  },
  realWorldUseCases: [
    'Checking an estimated delivery date before a first prenatal visit.',
    'Seeing how a 32 day cycle moves 8 October 2026 to 12 October 2026.',
    'Weeks pregnant on 1 March 2026 stay on the device. Nothing is uploaded.',
  ],
  commonMistakes: [
    'Leaving the cycle at 28 days when the real cycle is longer, so the due date lands early.',
    'Expecting the week count to jump when only the due date was adjusted.',
    'Typing the due date into the last-period field and reading the week count as if it were today.',
  ],
  commonQuestions: [
    'How many weeks pregnant am I?',
    'What is the Naegele rule?',
    'What if my cycle is not 28 days?',
    'Are these dates uploaded?',
  ],
  usedWith: [
    { slug: 'date-difference-calculator', reason: 'Count the days between the last period and any later date', strength: 0.4 },
  ],
  alternatives: [
    { slug: 'age-calculator', reason: 'An exact age from a birth date, which is a different count', strength: 0.2 },
  ],
  nextSteps: [
    { slug: 'date-difference-calculator', reason: 'Measure a span that is not a pregnancy', strength: 0.3 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'pregnancy due date calculator',
    'naegele rule',
    'estimated delivery date',
    'how many weeks pregnant am i',
    'weeks pregnant',
  ],
  entityAliases: ['naegele rule'],
  inputs: ['date', 'number'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['anyone dating a pregnancy from a last period'],
};
