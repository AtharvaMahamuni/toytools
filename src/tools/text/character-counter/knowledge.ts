import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'character-counter',
  title: 'Character Counter',
  category: 'text-utilities',
  summary: 'Count characters with and without spaces, the way platform limits like Twitter/X, SMS, and meta tags measure them.',
  primaryConcepts: ['character count'],
  secondaryConcepts: ['character limit', 'with spaces vs without spaces', 'unicode code point', 'grapheme'],
  intentGroups: {
    informational: ['What is a character count?', 'How are spaces and line breaks counted?'],
    howTo: ['How to fit text within a 280-character limit', 'How to write a meta description under 160 characters'],
    comparison: ['Characters with spaces vs without spaces', 'Character count vs byte length'],
    misconception: ['An emoji is often more than one character', 'Spaces usually do count toward a limit'],
    troubleshooting: ['My emoji count looks wrong', 'A pasted line break changed my total'],
  },
  realWorldUseCases: [
    'Fitting a post inside the 280-character limit on X',
    'Keeping a meta title and description within Google display limits',
    'Staying inside the 160-character SMS segment',
    'Respecting a database or form field maximum length',
  ],
  commonMistakes: [
    'Measuring without spaces when the platform counts them',
    'Assuming one emoji equals one character (many are multi-code-point)',
  ],
  commonQuestions: [
    'Does the count include spaces and punctuation?',
    'How are emoji and accented letters counted?',
    'What is the difference between characters and bytes?',
  ],
  usedWith: [
    { slug: 'word-counter', reason: 'Track a word limit and a character limit together', strength: 0.6 },
    { slug: 'letter-counter', reason: 'Compare total characters against letters only', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'letter-counter', reason: 'Count only alphabetic letters, ignoring spaces and symbols' },
    { slug: 'space-counter', reason: 'Isolate just the whitespace portion of the text' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Drop redundant spaces to fit a tight character limit', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['character counter', 'count characters', 'letters and spaces', 'character limit', 'twitter character count'],
  entityAliases: ['char count', 'character count', 'characters'],
  inputs: ['text'],
  outputs: ['characters with spaces', 'characters without spaces'],
  difficulty: 'beginner',
  audience: ['social media managers', 'writers', 'developers', 'marketers'],
};
