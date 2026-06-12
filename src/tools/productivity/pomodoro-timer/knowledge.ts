import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'pomodoro-timer',
  title: 'Pomodoro Timer',
  category: 'productivity',
  summary: 'Run 25/5 Pomodoro focus cycles in the browser: custom durations, session tracking, and notifications. No account, nothing leaves your device.',
  primaryConcepts: ['pomodoro technique', 'focus timer'],
  secondaryConcepts: ['time management', 'work intervals', 'study sessions', 'deep work'],
  intentGroups: {
    informational: ['What is the Pomodoro Technique?', 'Why is it called Pomodoro?'],
    howTo: ['How to use a Pomodoro timer', 'How to customize focus and break durations'],
    comparison: ['Pomodoro vs time blocking'],
    misconception: ['Does the Pomodoro Technique actually work?', 'More sessions do not automatically mean more output'],
    troubleshooting: ['Timer drifts in a background tab', 'Screen locks and the timer stops on mobile'],
  },
  realWorldUseCases: [
    'Writing a first draft in timed sessions',
    'Studying problem sets with scheduled breaks',
    'Reviewing pull requests in focused sessions',
  ],
  commonMistakes: [
    'Skipping breaks because of flow state',
    'Checking messages during sessions',
    'Starting without a clear objective',
  ],
  commonQuestions: [
    'What is a Pomodoro?',
    'How long is a Pomodoro?',
    'Does the Pomodoro Technique work for ADHD?',
  ],
  usedWith: [
    { slug: 'todo-list', reason: 'Write the session goal as a task before starting the timer', strength: 0.8 },
    { slug: 'keep-screen-awake', reason: 'Keep the countdown visible through a full session without the screen locking', strength: 0.7 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'notepad', reason: 'Capture distractions during a session and review them in the break', priority: 1 },
  ],
  workflowStage: ['input'],
  keywords: ['pomodoro timer', 'pomodoro technique', 'focus timer', 'study timer', '25 5 timer', 'tomato timer'],
  entityAliases: ['tomato timer', 'focus sessions'],
};
