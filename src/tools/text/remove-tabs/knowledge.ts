import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'remove-tabs',
  title: 'Remove Tabs',
  category: 'text-utilities',
  summary: 'Replace tab characters with spaces (or remove them) to fix mixed tab/space indentation.',
  primaryConcepts: ['remove tabs'],
  secondaryConcepts: ['tab character', 'tabs vs spaces', 'indentation', 'spreadsheet paste'],
  intentGroups: {
    informational: ['What is a tab character?', 'Why do tabs cause alignment problems?'],
    howTo: ['How to convert tabs to spaces', 'How to clean tab-separated paste from a spreadsheet'],
    comparison: ['Removing tabs vs normalizing all whitespace', 'Tabs vs spaces for indentation'],
    misconception: ['Tabs are single characters that render as variable width', 'A tab is not the same as several spaces'],
    troubleshooting: ['Alignment shifted after conversion', 'Spaces between words were untouched (by design)'],
  },
  realWorldUseCases: [
    'Fixing code that mixes tabs and spaces for indentation',
    'Cleaning tab-separated data pasted from a spreadsheet',
    'Making indentation render consistently across editors',
    'Preparing text for a system that mishandles tabs',
  ],
  commonMistakes: [
    'Assuming a tab equals a fixed number of spaces everywhere',
    'Expecting it to also collapse spaces between words',
  ],
  commonQuestions: [
    'Why do tabs cause alignment problems in text?',
    'How do I clean up tabs after pasting from a spreadsheet?',
    'Is a tab the same as four spaces?',
  ],
  usedWith: [
    { slug: 'normalize-whitespace', reason: 'Follow up by standardizing the remaining spacing', strength: 0.7 },
    { slug: 'remove-extra-spaces', reason: 'Collapse any double spaces the conversion created', strength: 0.6 },
  ],
  alternatives: [
    { slug: 'normalize-whitespace', reason: 'Handle tabs, spaces, and breaks together' },
    { slug: 'trim-text', reason: 'Only strip edge whitespace, leaving inner tabs' },
  ],
  nextSteps: [
    { slug: 'remove-extra-spaces', reason: 'Tidy spacing after tabs become spaces', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['remove tabs', 'convert tabs to spaces', 'tabs to spaces', 'strip tab characters', 'fix indentation'],
  entityAliases: ['tabs', 'tab characters'],
  inputs: ['text'],
  outputs: ['text with tabs replaced'],
  difficulty: 'intermediate',
  audience: ['developers', 'data analysts'],
};
