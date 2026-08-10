import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'url-encoder-decoder',
  title: 'URL Encoder & Decoder',
  category: 'developer-utilities',
  summary: 'Percent-encode characters that would break a URL, and decode them back to plain text.',
  primaryConcepts: ['URL encoding'],
  secondaryConcepts: ['percent encoding', 'query string', 'uri', 'encodeURIComponent'],
  intentGroups: {
    informational: ['What is URL encoding?', 'Which characters must be encoded?'],
    howTo: ['How to encode a query parameter', 'How to decode a percent-encoded URL'],
    comparison: ['encodeURI vs encodeURIComponent', '%20 vs + for spaces'],
    misconception: ['URL encoding is not encryption'],
    troubleshooting: ['Double encoding produces %2520', 'Spaces show as + instead of %20'],
  },
  realWorldUseCases: [
    'Encoding search terms into a query string',
    'Passing an email address as a URL parameter',
    'Embedding an OAuth redirect URI as a parameter',
    'Encoding file paths that contain spaces',
  ],
  commonMistakes: [
    'Encoding the whole URL instead of individual components',
    'Double-encoding an already-encoded value',
  ],
  commonQuestions: [
    'What is the difference between %20 and +?',
    'When should I use encodeURIComponent vs encodeURI?',
    'What is double encoding?',
  ],
  usedWith: [
    { slug: 'base64-encoder-decoder', reason: 'URL-safe a Base64 string', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'base64-encoder-decoder', reason: 'Encode binary data for transport instead' },
    { slug: 'html-entity-encoder-decoder', reason: 'Encode for HTML output instead' },
  ],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['url encode', 'url decode', 'percent encoding', 'uri encode', 'encode url online'],
  entityAliases: ['percent encoding', 'uri encoding'],
};
