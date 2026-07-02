import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'json-escape',
  title: 'JSON Escape / Unescape',
  category: 'developer-utilities',
  summary: 'Escape text into a JSON string body or unescape a JSON string literal back to plain text, with live two-way conversion.',
  primaryConcepts: ['json string escaping'],
  secondaryConcepts: ['escape sequences', 'string literal', 'control characters', 'json syntax'],
  intentGroups: {
    informational: ['What does escaping a JSON string mean?', 'Which characters must be escaped in JSON?'],
    howTo: ['How to escape text for JSON', 'How to unescape a JSON string'],
    comparison: ['JSON escape vs URL encode', 'Escaping vs stringifying a document'],
    misconception: ['Only quotes need escaping', 'The output should include the outer quotes'],
    troubleshooting: ['JSON fails to parse after pasting text', 'A dangling backslash breaks the string'],
  },
  realWorldUseCases: [
    'Pasting multi-line text into a JSON config value',
    'Embedding one JSON document inside another as a string',
    'Preparing log messages or code snippets for a JSON API payload',
    'Reading an escaped string from a log back into plain text',
  ],
  commonMistakes: [
    'Escaping twice and ending up with doubled backslashes',
    'Forgetting that real line breaks are illegal inside a JSON string',
  ],
  commonQuestions: [
    'What does escaping a JSON string mean?',
    'Which characters does JSON require me to escape?',
    'How do I unescape a JSON string back to plain text?',
  ],
  usedWith: [
    { slug: 'json-validator', reason: 'Verify the document parses after pasting the escaped value', strength: 0.8 },
    { slug: 'json-formatter', reason: 'Pretty-print the document the escaped string lands in', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'url-encoder-decoder', reason: 'Escape for URLs instead of JSON string literals' },
  ],
  nextSteps: [
    { slug: 'json-validator', reason: 'Check the full document after embedding the string', priority: 1 },
    { slug: 'json-formatter', reason: 'Format the resulting document for review', priority: 2 },
  ],
  workflowStage: ['transform'],
  keywords: ['json escape', 'json unescape', 'escape json string', 'json escape characters', 'json string literal'],
  entityAliases: ['json escaping', 'json string escape', 'escape for json'],
  inputs: ['plain text', 'escaped json string'],
  outputs: ['escaped string body', 'plain text'],
  difficulty: 'beginner',
  audience: ['developers'],
};
