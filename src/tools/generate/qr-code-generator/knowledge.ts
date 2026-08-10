import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'qr-code-generator',
  title: 'QR Code Generator',
  category: 'generate',
  summary:
    'Create QR codes in the browser from text, a URL, email, phone, Wi-Fi credentials, or a contact card, and download PNG or SVG.',
  primaryConcepts: ['QR code generation', 'qr codes'],
  secondaryConcepts: ['error correction', 'wifi qr code', 'vcard', 'png export', 'svg export'],
  intentGroups: {
    informational: [
      'what a qr code is',
      'how qr error correction works',
      'what a wifi qr code contains',
    ],
    howTo: [
      'create a qr code',
      'make a wifi qr code',
      'download a qr code as png or svg',
    ],
    comparison: ['png vs svg qr code', 'static vs dynamic qr code'],
    misconception: ['qr codes can be edited after printing', 'more data keeps the code simple'],
    troubleshooting: ['qr code will not scan', 'qr code too dense to read'],
  },
  realWorldUseCases: [
    'Linking a poster or flyer to a web page',
    'Sharing Wi-Fi access without typing a password',
    'Putting contact details on a business card',
    'Adding a menu or form link to a table tent',
  ],
  commonMistakes: [
    'Encoding a very long URL so the code becomes unreadable',
    'Printing the code too small for the scan distance',
    'Using low error correction on a surface that may get damaged',
    'Removing the quiet zone (white border) around the code',
  ],
  commonQuestions: [
    'What is a QR code?',
    'How do I make a Wi-Fi QR code?',
    'Can I download it as PNG or SVG?',
    'Does it expire or can it be edited?',
    'Does it work offline?',
  ],
  usedWith: [
    { slug: 'password-generator', reason: 'Generate a strong Wi-Fi password before encoding it' },
  ],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['qr code generator', 'wifi qr code', 'vcard qr code', 'url qr code'],
  entityAliases: ['qr generator', 'qr maker', 'wifi qr code generator'],
  inputs: ['options'],
  outputs: ['qr code image'],
  difficulty: 'beginner',
  audience: ['everyone', 'designers', 'small business'],
};
