import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-minifier',
  title: 'JSON Minifier',
  category: 'developer-utilities',
  summary: 'Strip whitespace from JSON to shrink payload size. Lossless and reversible.',
  primaryConcepts: ['JSON minification'],
  secondaryConcepts: ['json', 'compression', 'whitespace', 'payload size'],
  intentGroups: {
    informational: ['What is JSON minification?', 'How much does minifying save?'],
    howTo: ['How to minify a JSON file', 'How to reverse minification'],
    comparison: ['Minification vs gzip compression', 'Minifying vs formatting'],
    misconception: ['Minified JSON is still valid JSON'],
    troubleshooting: ['Minifier rejects JSON with comments (JSONC/JSON5)'],
  },
  realWorldUseCases: [
    'Reducing the size of production API responses',
    'Shrinking static JSON served over HTTP',
    'Compacting config bundles in build output',
  ],
  commonMistakes: [
    'Minifying JSON stored in source control (unreadable diffs)',
    'Minifying files that contain comments',
  ],
  commonQuestions: [
    'Is minified JSON still valid?',
    'Can I format minified JSON back?',
    'What is the difference between minification and gzip?',
  ],
  usedWith: [
    { slug: 'json-validator', reason: 'Confirm the JSON is valid before minifying', strength: 0.7 },
  ],
  alternatives: [
    { slug: 'json-formatter', reason: 'Expand instead of shrink' },
  ],
  nextSteps: [],
  workflowStage: ['export'],
  keywords: ['json minifier', 'minify json', 'compress json', 'shrink json', 'json compressor'],
  entityAliases: ['json compressor'],
};
