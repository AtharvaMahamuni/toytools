import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'reading-time-calculator',
  title: 'Reading Time Calculator',
  category: 'text-utilities',
  summary: 'Estimate how long text takes to read by dividing the word count by an average reading speed.',
  primaryConcepts: ['reading time'],
  secondaryConcepts: ['words per minute', 'reading speed', 'content length', 'time to read'],
  intentGroups: {
    informational: ['How is reading time estimated?', 'What reading speed is assumed?'],
    howTo: ['How to add a "5 min read" estimate to an article', 'How to plan content length for a time slot'],
    comparison: ['Reading time vs word count', 'Silent reading speed vs speaking speed'],
    misconception: ['Reading speed is not the same for every reader', 'Images and code change the real time'],
    troubleshooting: ['My estimate feels too fast', 'Technical text takes longer than the estimate'],
  },
  realWorldUseCases: [
    'Showing a "X min read" badge on a blog post',
    'Planning how much script fits a fixed presentation slot',
    'Estimating course or newsletter completion time',
    'Deciding whether to split a long article',
  ],
  commonMistakes: [
    'Applying one reading speed to highly technical material',
    'Ignoring that images, tables, and code blocks add real time',
  ],
  commonQuestions: [
    'What words-per-minute rate is used?',
    'How does it handle skimming versus careful reading?',
    'Why does my article feel longer than the estimate?',
  ],
  usedWith: [
    { slug: 'word-counter', reason: 'Reading time is derived from the word count', strength: 0.9 },
    { slug: 'sentence-counter', reason: 'Pair length with sentence-level readability', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'word-counter', reason: 'Measure raw length when you only need words' },
    { slug: 'character-counter', reason: 'Measure by character for fixed-width limits' },
  ],
  nextSteps: [
    { slug: 'word-counter', reason: 'Adjust length to hit a target read time', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['reading time calculator', 'time to read', 'words per minute', 'min read', 'estimated reading time'],
  entityAliases: ['reading time', 'read time', 'wpm'],
  inputs: ['text'],
  outputs: ['estimated reading time'],
  difficulty: 'beginner',
  audience: ['bloggers', 'content marketers', 'speakers', 'editors'],
};
