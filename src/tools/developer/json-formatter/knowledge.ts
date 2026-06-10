import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-formatter',
  title: 'JSON Formatter',
  category: 'developer-tools',
  summary: 'Pretty-print compact JSON with indentation. Same data, readable layout — for debugging.',
  primaryConcepts: ['json formatting'],
  secondaryConcepts: ['json', 'pretty print', 'beautify', 'indentation'],
  intentGroups: {
    informational: ['What is JSON formatting?', 'What is pretty-printing?'],
    howTo: ['How to format an API response', 'How to read minified JSON'],
    comparison: ['Formatting vs minifying'],
    misconception: ['Formatting does not change the data'],
    troubleshooting: ['Formatter rejects invalid JSON', 'Still getting parse errors after formatting'],
  },
  realWorldUseCases: [
    'Debugging a minified API response',
    'Reading a bundled config file',
    'Inspecting a webhook payload from logs',
    'Producing clean diffs for config in source control',
  ],
  commonMistakes: [
    'Trying to format invalid JSON',
    'Storing formatted JSON on performance-sensitive paths',
  ],
  commonQuestions: [
    'Does formatting change what the JSON means?',
    'What indentation level should I use?',
    'Why does my API response look like a mess?',
  ],
  usedWith: [
    { slug: 'json-validator', reason: 'Catch syntax errors before formatting', strength: 0.8 },
  ],
  alternatives: [
    { slug: 'json-minifier', reason: 'Shrink instead of expand' },
  ],
  nextSteps: [
    { slug: 'json-minifier', reason: 'Minify before shipping to production', priority: 1 },
  ],
  workflowStage: ['analyze'],
  keywords: ['json formatter', 'json beautifier', 'format json', 'pretty print json', 'beautify json'],
  entityAliases: ['json beautifier', 'json pretty printer'],
};
