import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'todo-list',
  title: 'Todo List',
  category: 'productivity',
  summary: 'A simple, private to-do list that saves in your browser, no account or sign-in needed.',
  primaryConcepts: ['to-do list'],
  secondaryConcepts: ['task management', 'checklist', 'local storage', 'browser persistence'],
  intentGroups: {
    informational: ['Where are my tasks stored?', 'Is a to-do list saved without an account?'],
    howTo: ['How to keep a quick daily task list', 'How to make a checklist that persists on reload'],
    comparison: ['A browser to-do list vs a full task app', 'Local storage vs cloud sync'],
    misconception: ['Tasks are stored on this device, not synced across devices', 'Clearing browser data removes the list'],
    troubleshooting: ['My tasks disappeared after clearing site data', 'The list did not appear on another device'],
  },
  realWorldUseCases: [
    'Jotting a quick daily task list',
    'Tracking steps in a one-off process',
    'Keeping a private checklist without signing up anywhere',
    'Holding a short shopping or packing list',
  ],
  commonMistakes: [
    'Expecting tasks to sync across devices',
    'Clearing browser data and losing the saved list',
  ],
  commonQuestions: [
    'Do my tasks sync to other devices?',
    'Are tasks saved if I close the tab?',
    'Is any of this sent to a server?',
  ],
  usedWith: [
    { slug: 'pomodoro-timer', reason: 'Work through the list in focused intervals', strength: 0.7 },
    { slug: 'notepad', reason: 'Keep longer notes alongside quick tasks', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'notepad', reason: 'Use free-form notes instead of discrete tasks' },
  ],
  nextSteps: [
    { slug: 'pomodoro-timer', reason: 'Time-box the tasks you just listed', priority: 1 },
  ],
  workflowStage: ['input'],
  keywords: ['todo list', 'task list', 'checklist', 'to-do app', 'simple todo'],
  entityAliases: ['todo', 'to-do list', 'task list'],
  inputs: ['tasks'],
  outputs: ['saved task list'],
  difficulty: 'beginner',
  audience: ['everyone', 'students', 'professionals'],
};
