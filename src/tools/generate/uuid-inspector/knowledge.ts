import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'uuid-inspector',
  title: 'UUID Inspector',
  category: 'generate',
  summary:
    'Paste a UUID and read its version, variant, and timestamp on your device. Hyphenated and 32-hex forms both count.',
  primaryConcepts: ['UUID version', 'UUID variant'],
  secondaryConcepts: [
    'uuid validator',
    'version 4 versus version 7',
    'nil uuid',
    'max uuid',
    'rfc 4122',
    'uuid timestamp',
  ],
  intentGroups: {
    informational: [
      'what version is this uuid',
      'what a uuid variant is',
      'what the nil uuid means',
    ],
    howTo: [
      'check if a uuid is valid',
      'decode a uuid timestamp',
      'tell version 4 from version 7',
    ],
    comparison: ['uuid v4 vs v7', 'uuid inspector vs uuid generator', 'nil uuid vs max uuid'],
    misconception: [
      'a version 4 uuid is acceptable whenever it looks well formed',
      'version 4 has a timestamp',
      'missing hyphens make a uuid invalid',
    ],
    troubleshooting: [
      'uuid rejected by a database column',
      'truncated uuid',
      'uuid variant is not rfc 4122',
    ],
  },
  realWorldUseCases: [
    'Checking a UUID copied from a log before inserting it',
    'Confirming an API returned version 7 rather than version 4',
    'Spotting a nil or max UUID used as a placeholder',
    'Reading the timestamp out of a version 7 identifier',
  ],
  commonMistakes: [
    'Treating a version 4 UUID as acceptable when the system wants version 7',
    'Letting a truncated UUID reach the database before checking length',
    'Reading the nil UUID as an ordinary random identifier',
    'Ignoring variant bits that say NCS, Microsoft, or future',
  ],
  commonQuestions: [
    'Does the paste stay on my device?',
    'Why can a version 4 UUID look fine when a system wants version 7?',
    'What happens if I paste a truncated UUID?',
    'What is the nil UUID?',
  ],
  usedWith: [
    { slug: 'uuid-generator', reason: 'Mint a version 4 UUID when the task is to create one, not to read one' },
  ],
  alternatives: [
    { slug: 'uuid-generator', reason: 'Choose this when you need a new identifier rather than a reading of an existing one' },
  ],
  nextSteps: [
    { slug: 'uuid-generator', reason: 'Generate a fresh version 4 UUID after the inspection shows the old one is the wrong version' },
  ],
  workflowStage: ['validate'],
  keywords: ['uuid validator', 'uuid version', 'decode uuid timestamp', 'valid uuid', 'nil uuid', 'what version is this uuid'],
  entityAliases: ['uuid version checker'],
  inputs: ['text'],
  outputs: ['uuid reading'],
  difficulty: 'beginner',
  audience: ['developers'],
};
