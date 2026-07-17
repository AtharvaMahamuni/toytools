import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'notepad',
  title: 'Notepad',
  category: 'productivity',
  summary: 'A distraction-free online notepad that autosaves to your browser, with no account required.',
  primaryConcepts: ['online notepad'],
  secondaryConcepts: ['scratchpad', 'autosave', 'local storage', 'plain text notes'],
  intentGroups: {
    informational: ['Where are my notes saved?', 'Does the notepad autosave?'],
    howTo: ['How to jot a quick note that persists', 'How to use a scratchpad without installing anything'],
    comparison: ['An online notepad vs a notes app', 'Plain text vs rich formatting'],
    misconception: ['Notes live in this browser, not in the cloud', 'It saves plain text, not formatted documents'],
    troubleshooting: ['My note vanished after clearing site data', 'It did not show up on another device'],
  },
  realWorldUseCases: [
    'Capturing a quick thought or snippet during work',
    'Holding text temporarily while moving it between apps',
    'Drafting a message before pasting it elsewhere',
    'Keeping a private scratchpad open in a tab',
  ],
  commonMistakes: [
    'Relying on it as permanent or backed-up storage',
    'Expecting rich formatting rather than plain text',
  ],
  commonQuestions: [
    'Does the online notepad autosave?',
    'Where are my notes stored?',
    'Why is my note not showing up on another device?',
  ],
  usedWith: [
    { slug: 'todo-list', reason: 'Pair free-form notes with discrete tasks', strength: 0.6 },
    { slug: 'word-counter', reason: 'Check the length of what you have written', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'todo-list', reason: 'Use a structured task list instead of free notes' },
  ],
  nextSteps: [
    { slug: 'word-counter', reason: 'Measure the note before reusing it', priority: 1 },
  ],
  workflowStage: ['input'],
  keywords: ['online notepad', 'notepad', 'scratchpad', 'quick notes', 'text notes'],
  entityAliases: ['notepad', 'scratchpad', 'notes'],
  inputs: ['text'],
  outputs: ['saved note'],
  difficulty: 'beginner',
  audience: ['everyone', 'writers', 'students'],
};
