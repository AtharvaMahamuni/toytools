import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'ovulation-calculator',
  title: 'Ovulation Calculator',
  category: 'health-fitness',
  summary:
    'Find a fertile window, an ovulation date, and the next period from the last period, the cycle length, and the luteal phase.',
  primaryConcepts: ['fertile window'],
  secondaryConcepts: ['ovulation date', 'conception date', 'next period', 'luteal phase'],
  intentGroups: {
    informational: [
      'what a luteal phase counts',
      'how a fertile window is dated',
      'when the next period starts',
    ],
    howTo: [
      'when am i ovulating',
      'estimate a conception date from the last period',
      'adjust ovulation for a luteal phase that is not 14 days',
    ],
    comparison: [
      'a 14 day luteal phase versus a 12 day luteal phase',
      'fertile window versus ovulation date',
    ],
    misconception: [
      'a shorter luteal phase moves ovulation earlier',
      'the fertile window is the whole cycle',
    ],
    troubleshooting: [
      'why the ovulation date moved when the luteal phase changed',
      'why the next period did not move with the luteal phase',
    ],
  },
  realWorldUseCases: [
    'Checking a fertile window before using an ovulation test.',
    'Seeing how a 12 day luteal phase moves 15 January 2026 to 17 January 2026.',
    'The next period on 29 January 2026 stays put when the luteal phase changes.',
  ],
  commonMistakes: [
    'Leaving the luteal phase at 14 days when the real phase is shorter, so ovulation lands early.',
    'Expecting the next period to move when only ovulation was adjusted.',
    'Typing the ovulation date into the last-period field and reading the window as if it were today.',
  ],
  commonQuestions: [
    'When am I ovulating?',
    'What is a fertile window?',
    'What if my luteal phase is not 14 days?',
    'Are these dates uploaded?',
  ],
  usedWith: [
    { slug: 'pregnancy-due-date-calculator', reason: 'Project a due date from the same last period when the luteal phase is 14 days', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'date-difference-calculator', reason: 'A plain day count between two dates, which is a different job', strength: 0.2 },
  ],
  nextSteps: [
    { slug: 'pregnancy-due-date-calculator', reason: 'Turn the same last period into a due date', strength: 0.4 },
  ],
  workflowStage: ['analyze'],
  keywords: [
    'ovulation calculator',
    'fertile window calculator',
    'when am i ovulating',
    'conception date calculator',
    'luteal phase',
  ],
  entityAliases: ['luteal phase', 'fertile window'],
  inputs: ['date', 'number'],
  outputs: ['metric'],
  difficulty: 'beginner',
  audience: ['anyone dating a fertile window from a last period'],
};
