import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'chat-export-cleaner',
  title: 'Chat Export Cleaner',
  category: 'prep',
  summary: 'Turn a copied chat transcript into plain text with explicit, reversible cleanup rules.',
  primaryConcepts: ['chat transcript'],
  secondaryConcepts: ['speaker label', 'timestamp', 'code fence', 'citation chip'],
  intentGroups: {
    informational: ['What is a chat export?', 'Which speaker labels are recognized?'],
    howTo: ['How to clean a copied conversation', 'How to keep only code blocks from a chat'],
    comparison: ['Keeping every turn vs keeping user turns', 'Cleaning a transcript vs rewriting it'],
    misconception: ['The cleaner is not a model', 'It does not understand every export format'],
    troubleshooting: ['User filter left the text unchanged', 'A date in a sentence was left alone'],
  },
  realWorldUseCases: [
    'Stripping timestamps and names before you quote a conversation',
    'Pulling fenced code out of a long chat',
    'Keeping only what you typed, or only what the model replied',
  ],
  commonMistakes: [
    'Expecting a vendor-specific export to be parsed perfectly',
    'Using Keep user messages and then wondering where the answers went',
    'Treating a cleaned transcript as a summary',
  ],
  commonQuestions: [
    'What does Chat Export Cleaner remove?',
    'Does it upload the transcript?',
    'Can it keep only code blocks?',
  ],
  usedWith: [
    { slug: 'prompt-packer', reason: 'Assemble a prompt from text you kept', strength: 0.5 },
    { slug: 'find-replace', reason: 'Make a further exact substitution after the cleanup', strength: 0.4 },
  ],
  alternatives: [],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['chat export', 'conversation cleaner', 'transcript'],
  entityAliases: ['chat log cleaner', 'transcript cleaner'],
  inputs: ['text'],
  outputs: ['text'],
  difficulty: 'beginner',
  audience: ['anyone copying a chat'],
};
