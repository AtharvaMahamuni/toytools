import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'random-choice-picker',
  title: 'Random Choice Picker',
  category: 'generate',
  summary: 'Paste options one per line and draw a winner, or shuffle the lot into a running order, with a check for the single line that is really several options.',
  primaryConcepts: ['Random choice'],
  secondaryConcepts: ['decision maker', 'shuffle', 'running order', 'option list', 'tiebreak'],
  intentGroups: {
    informational: ['What is a random choice picker?', 'Deciding by chance'],
    howTo: ['How to pick a random option from a list', 'How to shuffle a list into an order'],
    comparison: ['A choice picker vs a spinning wheel', 'Picking one vs ranking them all'],
    misconception: ['Re-rolling until you like the answer is not a random pick', 'Chance cannot tell you which option is better'],
    troubleshooting: ['My whole list counted as one option', 'The same option keeps winning'],
  },
  realWorldUseCases: [
    'Settling where to eat when nobody in the group will commit',
    'Choosing which task to start when three feel equally urgent',
    'Setting the running order for demos so nobody argues about going first',
    'Picking a film from a shortlist without another twenty minutes of scrolling',
  ],
  commonMistakes: [
    'Typing every option on one line separated by commas, which reads as a single choice',
    'Re-rolling until the answer matches what you wanted, which is a slow way to decide alone',
    'Leaving an option in twice, which gives it a double share of the odds',
  ],
  commonQuestions: [
    'Why did my whole list count as one option?',
    'How do I put a list in a random order?',
    'Is it reasonable to decide something by chance?',
  ],
  usedWith: [
    { slug: 'random-name-picker', reason: 'Draw people rather than options', strength: 0.8 },
    { slug: 'coin-flipper', reason: 'When the list is down to two', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'coin-flipper', reason: 'Faster when there are exactly two options' },
  ],
  nextSteps: [
    { slug: 'remove-duplicate-lines', reason: 'Strip repeated options before drawing again', strength: 0.6 },
    { slug: 'dice-roller', reason: 'Roll a number instead of picking a name', strength: 0.4 },
  ],
  workflowStage: ['transform'],
  keywords: [
    'random choice picker',
    'random picker',
    'decision maker',
    'pick for me',
    'random option picker',
    'shuffle a list',
  ],
  entityAliases: ['decision maker', 'random picker'],
  inputs: ['list'],
  outputs: ['choice', 'order'],
  difficulty: 'beginner',
  audience: ['everyone', 'team leads'],
};
