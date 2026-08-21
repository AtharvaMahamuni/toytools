import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'encoding-detector',
  title: 'Encoding Detector',
  category: 'developer-utilities',
  summary: 'Identify which encoding produced a string, see what each reading decodes to, and find out when a value is wrapped more than once.',
  primaryConcepts: ['Encoding detection'],
  secondaryConcepts: ['base64url', 'double encoding', 'hex', 'percent-encoding', 'punycode'],
  intentGroups: {
    informational: ['What encoding is this string?', 'How can you tell Base64 from hex?'],
    howTo: ['How to identify an unknown encoded string', 'How to decode a double-encoded value'],
    comparison: ['Base64 vs Base64URL', 'Hex vs Base64', 'A hash vs an encoding'],
    misconception: ['Encoded is not encrypted', 'A string matching the Base64 alphabet is not always Base64'],
    troubleshooting: ['Base64 decodes to gibberish', 'Decoder rejects a valid string', 'Decoded output still looks encoded'],
  },
  realWorldUseCases: [
    'Working out why a token copied from a URL will not decode in a standard Base64 tool',
    'Telling a truncated payload apart from one that lost its padding in transit',
    'Reading a value pulled from a log line without knowing how it was wrapped',
    'Checking whether an opaque field is encoded data or a hash digest',
  ],
  commonMistakes: [
    'Assuming a decoder failure means the data is corrupt, when the alphabet is simply URL-safe',
    'Stopping after one decode when the value was encoded twice',
    'Reading a digest-length hex string as encoded text, when a hash does not decode at all',
  ],
  commonQuestions: [
    'How do I know if a string is Base64 or hex?',
    'Why does my Base64 string decode to gibberish?',
    'Can you detect ROT13?',
  ],
  usedWith: [
    { slug: 'base64-encoder-decoder', reason: 'Decode once the alphabet is known', strength: 0.9 },
    { slug: 'url-encoder-decoder', reason: 'Peel a percent-encoded wrapper', strength: 0.7 },
    { slug: 'hex-encoder-decoder', reason: 'Decode a hex payload', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'base64-encoder-decoder', reason: 'Go straight there when the encoding is already known' },
  ],
  nextSteps: [
    { slug: 'base64-encoder-decoder', reason: 'Decode in bulk once the encoding is identified', strength: 0.8 },
    { slug: 'json-formatter', reason: 'Read a decoded payload that turns out to be JSON', strength: 0.6 },
  ],
  workflowStage: ['validate', 'analyze'],
  keywords: [
    'encoding detector',
    'what encoding is this',
    'identify base64 or hex',
    'detect string encoding',
    'is this base64url',
    'decode unknown string',
    'why does my base64 decode to gibberish',
    'double encoded string',
  ],
  entityAliases: ['encoding identifier', 'string encoding detector'],
  inputs: ['text'],
  outputs: ['encoding name', 'decoded text'],
  difficulty: 'intermediate',
  audience: ['developers'],
};
