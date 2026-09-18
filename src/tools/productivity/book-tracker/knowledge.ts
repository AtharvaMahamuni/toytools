import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'book-tracker',
  title: 'Book Tracker',
  category: 'productivity',
  summary:
    'A private reading list for books you want, are reading, or finished, saved only in your browser.',
  primaryConcepts: ['reading list'],
  secondaryConcepts: [
    'book tracker',
    'bookshelf',
    'reading progress',
    'goodreads alternative',
    'local storage',
  ],
  intentGroups: {
    informational: [
      'What is a book tracker?',
      'Is my reading list private?',
      'How is this different from Goodreads?',
    ],
    howTo: [
      'How to keep a private reading shelf',
      'How to export a bookshelf backup',
      'How to mark a book finished',
    ],
    comparison: [
      'Browser book tracker vs Goodreads',
      'Local shelf vs StoryGraph account',
    ],
    misconception: [
      'Books do not sync across devices',
      'Clearing site data deletes the shelf',
      'Finished books do not stay in Reading',
    ],
    troubleshooting: [
      'My shelf disappeared after clearing site data',
      'Import created duplicate books',
      'A finished book still shows as reading',
    ],
  },
  realWorldUseCases: [
    'Keeping a private reading list without a Goodreads account',
    'Marking a book finished so it leaves the reading view',
    'Backing up the shelf with export JSON before clearing the browser',
    'Merging an import so ratings stay on the same title and author',
  ],
  commonMistakes: [
    'Expecting the shelf to sync across phones and laptops',
    'Clearing browser data without exporting JSON first',
    'Leaving a finished book in the reading list because progress was not updated',
    'Importing the same backup twice and getting duplicate rows',
  ],
  commonQuestions: [
    'Do books sync across devices?',
    'Why did my shelf disappear?',
    'What happens when I mark a book finished?',
    'Will importing the same file create duplicates?',
  ],
  usedWith: [
    { slug: 'habit-streak-tracker', reason: 'Keep a daily reading habit beside the shelf of titles', strength: 0.7 },
    { slug: 'notepad', reason: 'Keep longer reading notes beside the short note on a card', strength: 0.6 },
    { slug: 'todo-list', reason: 'Park library errands that are not books on the shelf', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'notepad', reason: 'Use a blank note when you want prose, not a status and a percent' },
    { slug: 'habit-streak-tracker', reason: 'Use a daily check when the goal is showing up, not a title list' },
  ],
  nextSteps: [
    { slug: 'habit-streak-tracker', reason: 'Turn pages-per-day into a tiny daily check once the shelf exists', priority: 1 },
    { slug: 'notepad', reason: 'Keep a longer reaction to a finished book outside the 240-character note', priority: 2 },
  ],
  workflowStage: ['input'],
  keywords: [
    'reading list',
    'goodreads alternative',
    'no account',
    'bookshelf export',
  ],
  entityAliases: ['reading list', 'offline books'],
  inputs: ['titles', 'reading status'],
  outputs: ['shelf', 'export JSON'],
  difficulty: 'beginner',
  audience: ['everyone', 'students', 'professionals'],
};
