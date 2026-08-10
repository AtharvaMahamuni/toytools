import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'html-entity-encoder-decoder',
  title: 'HTML Entity Encoder & Decoder',
  category: 'developer-utilities',
  summary: 'Escape characters the HTML parser treats as markup, and decode entities back to text.',
  primaryConcepts: ['HTML entities'],
  secondaryConcepts: ['character reference', 'escaping', 'xss', 'named entity'],
  intentGroups: {
    informational: ['What is an HTML entity?', 'Which characters must be escaped?'],
    howTo: ['How to escape < and > for display', 'How to decode HTML entities'],
    comparison: ['HTML encoding vs URL encoding', '&amp; vs &#38;'],
    misconception: ['Entities are still needed for reserved characters in UTF-8'],
    troubleshooting: ['Double encoding shows &amp;lt;', '&apos; not rendering in old HTML'],
  },
  realWorldUseCases: [
    'Displaying code samples on a web page',
    'Escaping user-generated content to prevent XSS',
    'Inserting typographic symbols like — and ©',
    'Keeping a value and its unit on one line with &nbsp;',
  ],
  commonMistakes: [
    'Skipping escaping on user content (XSS risk)',
    'Using &nbsp; for layout instead of CSS',
  ],
  commonQuestions: [
    'Which characters must always be escaped?',
    'What is the difference between &amp; and &#38;?',
    'Does HTML entity encoding prevent XSS?',
  ],
  usedWith: [],
  alternatives: [
    { slug: 'url-encoder-decoder', reason: 'Encode for URL transport instead' },
    { slug: 'base64-encoder-decoder', reason: 'Encode binary data for transport instead' },
  ],
  nextSteps: [],
  workflowStage: ['transform'],
  keywords: ['html entity', 'html encode', 'html decode', 'escape html', 'unescape html'],
  entityAliases: ['html escaping', 'character reference'],
};
