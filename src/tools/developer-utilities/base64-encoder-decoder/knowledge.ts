import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'base64-encoder-decoder',
  title: 'Base64 Encoder & Decoder',
  category: 'developer-utilities',
  summary: 'Convert binary data to ASCII text and back. Encoding for transport, not encryption.',
  primaryConcepts: ['Base64'],
  secondaryConcepts: ['encoding', 'binary data', 'data uri', 'ascii'],
  intentGroups: {
    informational: ['What is Base64?', 'Why does Base64 exist?'],
    howTo: ['How to encode text to Base64', 'How to decode a Base64 string'],
    comparison: ['Base64 vs encryption', 'Base64 vs URL encoding'],
    misconception: ['Base64 is not encryption', 'Base64 is not security'],
    troubleshooting: ['Invalid Base64 padding', 'Decoding fails on non-ASCII input'],
  },
  realWorldUseCases: [
    'Embedding small images in HTML/CSS as data URIs',
    'Carrying binary payloads inside JSON API responses',
    'Inspecting the header and payload of a JWT',
    'Encoding email attachments for SMTP',
  ],
  commonMistakes: [
    'Treating Base64 as a way to hide or secure data',
    'Forgetting Base64 inflates size by ~33%',
  ],
  commonQuestions: [
    'Is Base64 encryption?',
    'Why does Base64 end with =?',
    'Can Base64 be reversed?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format JSON payloads after decoding', strength: 0.8 },
    { slug: 'url-encoder-decoder', reason: 'Make Base64 safe for URLs', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'url-encoder-decoder', reason: 'Encode for URL transport instead' },
    { slug: 'html-entity-encoder-decoder', reason: 'Encode for HTML output instead' },
  ],
  nextSteps: [
    { slug: 'json-formatter', reason: 'Inspect the decoded JSON', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['base64 encode', 'base64 decode', 'base64 converter', 'text to base64', 'base64 to text'],
  entityAliases: ['base 64', 'b64'],
};
