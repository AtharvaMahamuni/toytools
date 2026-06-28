import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'kebab-case-converter',
  title: 'kebab-case Converter',
  category: 'text-utilities',
  summary: 'Convert text to kebab-case, the hyphen-separated style used for URL slugs, CSS classes, and file names.',
  primaryConcepts: ['kebab-case'],
  secondaryConcepts: ['url slug', 'css class name', 'hyphen separator', 'file naming'],
  intentGroups: {
    informational: ['What is kebab-case?', 'Why do URLs and CSS use hyphens?'],
    howTo: ['How to turn a title into a URL slug', 'How to make a CSS-class-safe name'],
    comparison: ['kebab-case vs snake_case', 'kebab-case vs camelCase'],
    misconception: ['Hyphens are invalid in most code identifiers', 'kebab-case is lowercase with hyphens, not underscores'],
    troubleshooting: ['Special characters were left in the slug', 'Consecutive hyphens appeared'],
  },
  realWorldUseCases: [
    'Generating SEO-friendly URL slugs from page titles',
    'Naming CSS classes and custom HTML attributes',
    'Creating consistent, hyphenated file names',
    'Building branch or ticket identifiers from a description',
  ],
  commonMistakes: [
    'Using kebab-case for variable names (hyphens break identifiers)',
    'Leaving punctuation that should be stripped from a slug',
  ],
  commonQuestions: [
    'How is kebab-case different from snake_case?',
    'Are special characters removed from the slug?',
    'Can I use kebab-case for JavaScript variables?',
  ],
  usedWith: [
    { slug: 'lowercase-converter', reason: 'Lowercase the text before slugifying', strength: 0.5 },
    { slug: 'snake-case-converter', reason: 'Switch hyphens for underscores when code needs it', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'snake-case-converter', reason: 'Use underscores for code identifiers' },
    { slug: 'camel-case-converter', reason: 'Use camelCase for JavaScript or JSON' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Clean stray spacing before generating the slug', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['kebab case converter', 'kebab-case', 'url slug generator', 'css class name', 'hyphen case'],
  entityAliases: ['kebab case', 'kebab-case', 'slug case', 'dash case'],
  inputs: ['text'],
  outputs: ['kebab-case text'],
  difficulty: 'intermediate',
  audience: ['developers', 'web designers', 'content marketers'],
};
