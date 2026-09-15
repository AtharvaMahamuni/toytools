import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'habit-streak-tracker',
  name: 'Habit Streak Tracker',
  seoTitle: 'Habit Streak Tracker: Daily Checks On Your Device',
  description:
    'Track up to eight daily habits with honest streaks, a 12-week heat grid, and encouraging recovery copy. Runs entirely on your device. Nothing is uploaded.',
  tagline: 'Check habits, keep honest streaks, start again without guilt.',
  categorySlug: 'productivity',
  tags: [
    'habit tracker',
    'streak tracker',
    'daily habit tracker',
    'habit streak',
  ],
  isNew: true,
  updatedAt: '2026-09-16',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'habit',
  trustVariant: 'local',
  craft: {
    id: 'habit-loop-encourage',
    kind: 'orientation',
    solves:
      'Incumbent habit apps push signup, cloud sync, and guilt dashboards after a miss. This tool keeps the cue-response-reward loop, honest streaks, and warm never-miss-twice recovery entirely on your device.',
  },
  relatedTools: ['todo-list', 'pomodoro-timer', 'notepad'],
  guide: {
    slug: 'how-to-build-a-habit-loop-that-sticks',
    categorySlug: 'productivity',
    title: 'How to Build a Habit Loop That Sticks',
    description:
      'Cue, craving, response, and reward in plain language, plus tiny habits, identity, and honest streaks without all-or-nothing guilt. Educational framing only.',
    readMinutes: 6,
    updatedAt: '2026-09-16',
  },
};
