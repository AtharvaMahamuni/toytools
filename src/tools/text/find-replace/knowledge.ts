import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'find-replace',
  title: 'Find and Replace',
  category: 'text-utilities',
  summary: 'Find every occurrence of a string and replace it across the whole text, with case and match options.',
  primaryConcepts: ['find and replace'],
  secondaryConcepts: ['search and replace', 'bulk edit', 'case sensitivity', 'match all occurrences'],
  intentGroups: {
    informational: ['How does find and replace work?', 'What is case-sensitive matching?'],
    howTo: ['How to replace a word everywhere at once', 'How to swap a term across a long document'],
    comparison: ['Find and replace vs manual editing', 'Plain text match vs pattern match'],
    misconception: ['Replace all changes every match, including inside other words', 'Case-sensitive matches miss differently-cased copies'],
    troubleshooting: ['It changed text inside larger words', 'Some matches were skipped due to case'],
  },
  realWorldUseCases: [
    'Renaming a term consistently across a document',
    'Fixing a repeated typo in one pass',
    'Swapping placeholders for real values',
    'Standardizing inconsistent spelling or formatting',
  ],
  commonMistakes: [
    'Replacing a short string that also appears inside larger words',
    'Forgetting that case sensitivity can skip valid matches',
  ],
  commonQuestions: [
    'What is case-sensitive matching?',
    'Does replace all change matches inside other words?',
    'Is find and replace better than manual editing?',
  ],
  usedWith: [
    { slug: 'text-compare', reason: 'Diff before and after to confirm the edits', strength: 0.6 },
    { slug: 'remove-extra-spaces', reason: 'Clean spacing left by replacements', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'text-compare', reason: 'Compare two texts instead of editing one' },
  ],
  nextSteps: [
    { slug: 'text-compare', reason: 'Verify the changes against the original', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['find and replace', 'search and replace', 'replace text', 'bulk replace', 'replace all'],
  entityAliases: ['find replace', 'search replace'],
  inputs: ['text'],
  outputs: ['edited text'],
  difficulty: 'beginner',
  audience: ['writers', 'developers', 'editors'],
};
