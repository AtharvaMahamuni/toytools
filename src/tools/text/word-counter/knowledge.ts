import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'word-counter',
  title: 'Word Counter',
  category: 'text-utilities',
  summary: 'Count words in any text, plus characters, sentences, and estimated reading time, live as you type.',
  primaryConcepts: ['word count'],
  secondaryConcepts: ['word limit', 'word boundary', 'token', 'whitespace splitting'],
  intentGroups: {
    informational: ['What counts as a word?', 'How is word count calculated?'],
    howTo: ['How to count words in an essay', 'How to check a word limit before submitting'],
    comparison: ['Word count vs character count', 'Counting words vs counting tokens'],
    misconception: ['Hyphenated words are not always one word', 'Numbers and symbols may or may not count'],
    troubleshooting: ['My count differs from Microsoft Word', 'Double spaces inflate the count'],
  },
  realWorldUseCases: [
    'Staying under an essay or application word limit',
    'Hitting a target article length for SEO',
    'Quoting translation or copywriting work that is priced per word',
    'Trimming a cover letter to one page',
  ],
  commonMistakes: [
    'Assuming every tool counts hyphenated terms the same way',
    'Forgetting that a word limit usually excludes references or footnotes',
  ],
  commonQuestions: [
    'How does the counter decide where one word ends and the next begins?',
    'Does it count numbers as words?',
    'Why is my count slightly different from my word processor?',
  ],
  usedWith: [
    { slug: 'reading-time-calculator', reason: 'Turn the word count into an estimated read time', strength: 0.8 },
    { slug: 'character-counter', reason: 'Check a character limit alongside the word limit', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'character-counter', reason: 'Count by character instead when a field has a character cap' },
    { slug: 'sentence-counter', reason: 'Measure structure by sentence rather than word' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Clean stray double spaces that skew the count', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['word counter', 'count words', 'words in text', 'word count tool', 'essay word count'],
  entityAliases: ['word count', 'wordcount', 'wc'],
  inputs: ['text'],
  outputs: ['word count', 'character count', 'sentence count', 'reading time'],
  difficulty: 'beginner',
  audience: ['writers', 'students', 'editors', 'marketers'],
};
