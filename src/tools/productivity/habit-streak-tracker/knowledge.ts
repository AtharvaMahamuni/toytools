import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'habit-streak-tracker',
  title: 'Habit Streak Tracker',
  category: 'productivity',
  summary:
    'A private daily habit streak tracker with honest streaks, a 12-week heat grid, and encouraging recovery, saved only in your browser.',
  primaryConcepts: ['habit streak'],
  secondaryConcepts: [
    'habit tracker',
    'habit loop',
    'daily habit',
    'never miss twice',
    'habit stacking',
    'local storage',
  ],
  intentGroups: {
    informational: [
      'What is a habit streak tracker?',
      'How does the streak rule work?',
      'Is my habit data private?',
    ],
    howTo: [
      'How to build a habit loop that sticks',
      'How to track daily habits without an account',
      'How to recover after missing a habit day',
    ],
    comparison: [
      'Browser habit tracker vs cloud habit app',
      'Honest streaks vs grace days and freeze tokens',
    ],
    misconception: [
      'Habits do not sync across devices',
      'Clearing site data permanently deletes habit history',
      'This is not an official Atomic Habits product',
    ],
    troubleshooting: [
      'My habits disappeared after clearing site data',
      'The list did not appear on another device',
      'I need to undo today\'s check',
    ],
  },
  realWorldUseCases: [
    'Keeping a short daily habit checklist without signing up',
    'Seeing a 12-week heat grid for one tiny habit',
    'Recovering after a miss without guilt dashboards',
    'Backing up habit history with export JSON before clearing the browser',
  ],
  commonMistakes: [
    'Expecting habits to sync across phones and laptops',
    'Clearing browser data without exporting JSON first',
    'Tracking too many habits until the list becomes guilt',
    'Treating one missed day as a reason to quit entirely',
  ],
  commonQuestions: [
    'How does the streak rule work?',
    'Do my habits sync across devices?',
    'How do I export or import my habits?',
    'What does never miss twice mean?',
  ],
  usedWith: [
    { slug: 'todo-list', reason: 'Capture one-off tasks while habits stay as daily checks', strength: 0.7 },
    { slug: 'pomodoro-timer', reason: 'Time-box the response step of a focus habit', strength: 0.6 },
    { slug: 'notepad', reason: 'Keep longer reflections beside the streak checklist', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'todo-list', reason: 'Use a task checklist when the work is not a repeating daily habit' },
    { slug: 'water-intake-tracker', reason: 'Log hydration amounts instead of a yes/no habit check' },
  ],
  nextSteps: [
    { slug: 'pomodoro-timer', reason: 'Run a short focus block after you check a deep-work habit', priority: 1 },
    { slug: 'todo-list', reason: 'Park non-daily tasks so they do not crowd the habit list', priority: 2 },
  ],
  workflowStage: ['input'],
  keywords: [
    'habit tracker',
    'streak tracker',
    'daily habit tracker',
    'habit loop',
    'habit streak',
  ],
  entityAliases: ['habit streak', 'streak tracker', 'daily habits'],
  inputs: ['habits', 'daily checks'],
  outputs: ['streaks', 'heat calendar', 'export JSON'],
  difficulty: 'beginner',
  audience: ['everyone', 'students', 'professionals'],
};
