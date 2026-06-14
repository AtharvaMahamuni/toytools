import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'hex-encoder-decoder',
  title: 'Hex Encoder & Decoder',
  category: 'developer-utilities',
  summary: 'Encode text to hexadecimal bytes and decode hex strings back to human-readable text, with UTF-8 support.',
  primaryConcepts: ['hex encoding', 'hexadecimal'],
  secondaryConcepts: ['binary-to-text encoding', 'byte representation', 'UTF-8', 'hex dump'],
  intentGroups: {
    informational: ['What is hex encoding?', 'What does hexadecimal mean?', 'How are bytes represented in hex?'],
    howTo: ['How to encode text to hex', 'How to decode a hex string', 'How to convert text to hexadecimal bytes'],
    comparison: ['Hex vs Base64 encoding', 'Hex vs binary representation'],
    misconception: ['Hex encoded output is twice as long as the input in bytes', 'Spaces between hex pairs are optional separators, not part of the encoding'],
    troubleshooting: ['Odd number of hex digits — missing a nibble', 'Non-hex characters in input — strip whitespace first'],
  },
  realWorldUseCases: [
    'Inspecting raw byte values of strings for debugging',
    'Reading and writing hex dumps from binary files',
    'Working with color codes and CSS hex values',
    'Network protocol debugging and packet inspection',
    'Cryptographic key and hash display formats',
  ],
  commonMistakes: [
    'Forgetting that hex encoding doubles the character count',
    'Including non-hex characters (0x prefix, colons) without stripping them first',
    'Confusing hex encoding (display) with encryption (security)',
  ],
  commonQuestions: [
    'How do I convert text to hex?',
    'What is the difference between hex and Base64?',
    'Why does each character produce two hex digits?',
  ],
  usedWith: [
    { slug: 'base64-encoder-decoder', reason: 'Alternative binary-to-text encoding', strength: 0.7 },
    { slug: 'md5-hash-generator', reason: 'Hash output is commonly displayed in hex', strength: 0.6 },
    { slug: 'sha256-hash-generator', reason: 'Hash output is commonly displayed in hex', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'base64-encoder-decoder', reason: 'More compact binary-to-text encoding for data transfer' },
    { slug: 'url-encoder-decoder', reason: 'Percent-encoding for URLs uses hex pairs' },
  ],
  nextSteps: [
    { slug: 'base64-encoder-decoder', reason: 'Encode data more compactly for embedding in JSON or HTML', priority: 1 },
    { slug: 'md5-hash-generator', reason: 'Generate a hash and inspect the hex output', priority: 2 },
  ],
  workflowStage: ['transform', 'analyze'],
  keywords: ['hex encoder', 'hex decoder', 'text to hex', 'hex to text', 'hexadecimal converter', 'hex string decoder'],
  entityAliases: ['hexadecimal encoder', 'hex string converter', 'text to hexadecimal'],
};
