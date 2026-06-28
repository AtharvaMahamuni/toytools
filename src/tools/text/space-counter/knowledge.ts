import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'space-counter',
  title: 'Space Counter',
  category: 'text-utilities',
  summary: 'Count the spaces and whitespace in text, useful for spotting double spaces and formatting issues.',
  primaryConcepts: ['space count'],
  secondaryConcepts: ['whitespace', 'double space', 'tab', 'trailing space'],
  intentGroups: {
    informational: ['What is counted as a space?', 'Are tabs and line breaks included?'],
    howTo: ['How to find double spaces in a document', 'How to audit whitespace before formatting'],
    comparison: ['Spaces vs all whitespace', 'Spaces vs tabs'],
    misconception: ['Tabs are not the same as spaces', 'Trailing spaces are easy to miss but still count'],
    troubleshooting: ['Invisible trailing spaces inflate my total', 'Tabs were counted differently than expected'],
  },
  realWorldUseCases: [
    'Detecting accidental double spaces after sentences',
    'Auditing whitespace before reformatting code or prose',
    'Checking fixed-width alignment that depends on exact spacing',
    'Cleaning data pasted with inconsistent spacing',
  ],
  commonMistakes: [
    'Assuming spaces and tabs are interchangeable in the count',
    'Overlooking trailing spaces because they are invisible',
  ],
  commonQuestions: [
    'Does it count tabs and line breaks, or only spaces?',
    'How can I tell if I have double spaces?',
    'Are leading and trailing spaces included?',
  ],
  usedWith: [
    { slug: 'character-counter', reason: 'See spaces as a share of total characters', strength: 0.6 },
    { slug: 'letter-counter', reason: 'Contrast whitespace against letters', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'character-counter', reason: 'Count all characters rather than only spaces' },
    { slug: 'word-counter', reason: 'Measure content by word instead of whitespace' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Collapse the double spaces this tool reveals', priority: 1 },
    { slug: 'normalize-whitespace', reason: 'Standardise mixed spaces, tabs, and breaks', priority: 2 },
  ],
  workflowStage: ['analyze'],
  keywords: ['space counter', 'count spaces', 'whitespace counter', 'double spaces', 'spaces in text'],
  entityAliases: ['space count', 'spaces', 'whitespace'],
  inputs: ['text'],
  outputs: ['space count'],
  difficulty: 'beginner',
  audience: ['writers', 'editors', 'developers', 'data analysts'],
};
