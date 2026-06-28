import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'slugify-text',
  title: 'Slugify Text',
  category: 'text-utilities',
  summary: 'Turn any title into a clean URL slug: strip accents, lowercase, and join words with hyphens, one slug per line.',
  primaryConcepts: ['slugify text'],
  secondaryConcepts: ['url slug', 'permalink', 'kebab case', 'web-safe text'],
  intentGroups: {
    informational: ['What is a URL slug?', 'What makes a slug SEO-friendly?'],
    howTo: ['How to turn a blog title into a slug', 'How to slugify a list of titles at once'],
    comparison: ['Slugify vs kebab-case conversion', 'Slug vs full URL path'],
    misconception: ['Slugify strips accents to ASCII, it does not keep them', 'Slugify lowercases everything by design'],
    troubleshooting: ['Leading or trailing hyphens were removed', 'Symbols collapsed into a single hyphen'],
  },
  realWorldUseCases: [
    'Generating a permalink from a blog post title',
    'Creating clean anchor ids from headings',
    'Producing safe file or folder names from labels',
    'Batch-slugifying a list of page titles for a CMS',
  ],
  commonMistakes: [
    'Expecting accented or uppercase characters to be preserved',
    'Confusing it with kebab-case, which does not strip accents to ASCII',
  ],
  commonQuestions: [
    'Does it remove accents?',
    'Can it slugify many lines at once?',
    'Why were my symbols replaced with hyphens?',
  ],
  usedWith: [
    { slug: 'remove-accents', reason: 'Preview the accent-stripping step on its own', strength: 0.7 },
    { slug: 'lowercase-converter', reason: 'Lowercase text before or after slugifying', strength: 0.5 },
  ],
  alternatives: [
    { slug: 'kebab-case-converter', reason: 'Hyphenate words without ASCII-folding accents' },
    { slug: 'lowercase-converter', reason: 'Only lowercase, without hyphenating' },
  ],
  nextSteps: [
    { slug: 'kebab-case-converter', reason: 'Compare the kebab-case styling of the same text', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['slugify text', 'url slug generator', 'text to slug', 'permalink generator', 'slug generator'],
  entityAliases: ['slug', 'url slug', 'permalink'],
  inputs: ['text'],
  outputs: ['url slug'],
  difficulty: 'beginner',
  audience: ['developers', 'bloggers', 'SEO specialists'],
};
