import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'systemd-timer-converter',
  title: 'Cron to systemd Timer Converter',
  category: 'date-time',
  summary:
    'Convert a crontab line into a systemd OnCalendar expression with its .timer unit, and check whether the timer fires on the same days cron did.',
  primaryConcepts: ['Converting crontab lines to systemd OnCalendar'],
  secondaryConcepts: [
    'OnCalendar syntax',
    'systemd timer units',
    'day-of-week and day-of-month rules',
    'crontab shorthands',
    'OnBootSec',
  ],
  intentGroups: {
    informational: [
      'What is the OnCalendar equivalent of a cron expression?',
      'How does a systemd timer differ from a cron job?',
    ],
    howTo: [
      'How to convert a crontab line to a systemd timer',
      'How to write an OnCalendar expression for every 15 minutes',
      'How to replace @reboot with a systemd directive',
    ],
    comparison: ['cron vs systemd timers', 'OnCalendar vs crontab syntax'],
    misconception: [
      'The two grammars mean the same thing when both day fields are set',
      'A timer that loads cleanly runs at the right times',
    ],
    troubleshooting: [
      'The timer runs on different days than the cron job did',
      'The timer fires at the wrong hour after a timezone or DST change',
      '@reboot has no OnCalendar equivalent',
    ],
  },
  realWorldUseCases: [
    'Migrating a machine from crontab to systemd timers without changing when jobs run',
    'Rewriting a legacy cron line as a unit file for a configuration management repo',
    'Checking whether a hand-written OnCalendar matches the crontab it replaced',
    'Explaining to a reviewer why a translated schedule fires on fewer days',
  ],
  commonMistakes: [
    'Translating a line that restricts both day-of-month and day-of-week, where cron means either and systemd means both',
    'Reading systemd weekly as the same day cron means, when weekly starts on Monday and cron day 0 is Sunday',
    'Assuming the timer inherits the TZ variable set in the crontab rather than the host system timezone',
    'Confirming the unit loads and treating that as proof the schedule is right',
  ],
  commonQuestions: [
    'What is the OnCalendar equivalent of this cron expression?',
    'Will the systemd timer fire on the same days as my cron job?',
    'How do I convert @daily or @reboot to a systemd timer?',
    'Which timezone does OnCalendar use?',
  ],
  usedWith: [
    { slug: 'cron-expression-parser', reason: 'Read the original crontab line in plain English first', strength: 0.9 },
    { slug: 'timezone-converter', reason: 'Check what a run time becomes in the host timezone', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'cron-expression-parser', reason: 'Stay on cron and just understand the existing schedule' },
  ],
  nextSteps: [
    { slug: 'cron-expression-parser', reason: 'Confirm what the original line meant', priority: 1 },
    { slug: 'timezone-converter', reason: 'Translate a run time into the server timezone', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'cron to systemd timer',
    'crontab to oncalendar',
    'systemd oncalendar syntax',
    'systemd timer unit',
    'cron vs systemd timer',
  ],
  entityAliases: ['systemd timer converter', 'oncalendar converter', 'crontab to systemd'],
  inputs: ['a crontab line'],
  outputs: ['an OnCalendar expression', 'a .timer unit file'],
  difficulty: 'intermediate',
  audience: ['system administrators', 'developers'],
};
