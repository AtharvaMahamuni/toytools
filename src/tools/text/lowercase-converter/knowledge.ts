import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'lowercase-converter',
  title: 'Lowercase Converter',
  category: 'text-utilities',
  summary: 'Convert text to all lowercase, ideal for normalizing emails, tags, and values before comparison.',
  primaryConcepts: ['lowercase'],
  secondaryConcepts: ['case normalization', 'case-insensitive comparison', 'letter case', 'slug preparation'],
  intentGroups: {
    informational: ['What is lowercase text?', 'Why normalize text to lowercase?'],
    howTo: ['How to make text all lowercase', 'How to normalize emails before storing them'],
    comparison: ['Lowercase vs uppercase', 'Lowercasing for display vs for comparison'],
    misconception: ['Lowercasing proper nouns can lose meaning', 'Case-insensitive matching still needs consistent casing'],
    troubleshooting: ['Some special characters did not change', 'My comparison still failed after lowercasing one side'],
  },
  realWorldUseCases: [
    'Normalizing email addresses or usernames before saving',
    'Preparing tags and keywords so duplicates collapse',
    'Making text ready for case-insensitive search or matching',
    'Cleaning up text that was typed with the caps lock on',
  ],
  commonMistakes: [
    'Lowercasing proper nouns or acronyms that should keep their case',
    'Normalizing only one side of a comparison',
  ],
  commonQuestions: [
    'How do I normalize email addresses before storing them?',
    'Why does my comparison still fail after converting to lowercase?',
    'Why did some characters not change when I converted to lowercase?',
  ],
  usedWith: [
    { slug: 'uppercase-converter', reason: 'Switch to uppercase when needed', strength: 0.6 },
    { slug: 'kebab-case-converter', reason: 'Lowercase first, then build a URL slug', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'uppercase-converter', reason: 'Convert to uppercase instead' },
    { slug: 'sentence-case-converter', reason: 'Keep sentence capitalization rather than flattening all case' },
  ],
  nextSteps: [
    { slug: 'remove-duplicate-lines', reason: 'After lowercasing, collapse now-identical lines', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['lowercase converter', 'all lowercase', 'text to lowercase', 'normalize case', 'small letters'],
  entityAliases: ['lowercase', 'small letters'],
  inputs: ['text'],
  outputs: ['lowercase text'],
  difficulty: 'beginner',
  audience: ['developers', 'data analysts', 'writers'],
};
