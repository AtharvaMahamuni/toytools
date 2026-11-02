import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'pomodoro-timer',
  name: 'Pomodoro Timer',
  seoTitle: 'Pomodoro Timer Online: 25 Minute Focus Timer',
  description: 'A free Pomodoro Technique timer: 25 minutes of focus, then a 5 minute break, with 50/10 and custom lengths. What you enter stays on your device.',
  tagline: 'Stay focused with timed work sessions and breaks.',
  categorySlug: 'productivity',
  tags: [
    'pomodoro', 'timer', 'focus', 'pomodoro technique', '25/5', 'study timer',
    'free pomodoro timer', 'online focus timer', 'work sessions', 'time management',
    'break timer', 'concentration', 'deep work', 'productivity timer',
    'pomodoro clock', 'focus session', 'work timer', 'tomato timer',
  ],
  updatedAt: '2026-10-05',
  engine: 'productivity',
  pattern: 'stateful',
  family: 'timer',
  craft: {
    id: 'pomodoro-distraction-free',
    kind: 'orientation',
    solves:
      'Account-walled pomodoro apps bombard users with analytics dashboards and sign-up prompts, destroying the focus the user opened the timer to achieve.',
  },
  relatedTools: ['todo-list', 'keep-screen-awake', 'notepad'],
  guide: {
    slug: 'pomodoro-technique',
    categorySlug: 'productivity',
    title: 'The Pomodoro Technique: A Practical Guide',
    description: 'Learn how the Pomodoro Technique works, when to use it, and how timed focus sessions improve concentration and output.',
    readMinutes: 6,
    updatedAt: '2026-06-05',
  },
  trustVariant: 'local',
};
