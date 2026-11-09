import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'xml-formatter',
  title: 'XML Formatter and Validator',
  category: 'developer-utilities',
  summary: 'Pretty-print or minify XML and report the first well-formedness error in the browser.',
  primaryConcepts: ['XML formatting'],
  secondaryConcepts: ['pretty print xml', 'xml validator', 'minify xml', 'format xml'],
  intentGroups: {
    informational: ['What does the XML Formatter change?', 'Why is XML case sensitive?'],
    howTo: ['How to pretty-print XML', 'How to minify XML in the browser'],
    comparison: ['XML formatter vs uploading to a web service', 'Well-formed vs schema-valid XML'],
    misconception: ['Formatting changes XML meaning', 'Well-formed means schema-valid'],
    troubleshooting: ['Mismatched XML tags', 'XML error line number'],
  },
  realWorldUseCases: [
    'Tidying a one-line SOAP or RSS payload from a log',
    'Checking a config file is well-formed before deploy',
    'Minifying XML for a size-sensitive embed',
  ],
  commonMistakes: [
    'Expecting XSD validation from a well-formedness check',
    'Assuming tag case does not matter the way it often does in HTML',
  ],
  commonQuestions: [
    'What does the XML Formatter change?',
    'Is my XML sent to a server?',
    'Why is XML case sensitive?',
  ],
  usedWith: [
    { slug: 'json-formatter', reason: 'Format JSON when an API offers both XML and JSON', strength: 0.55 },
    { slug: 'html-entity-encoder-decoder', reason: 'Encode characters that must appear as text in XML', strength: 0.45 },
  ],
  alternatives: [
    { slug: 'json-formatter', reason: 'Pretty-print JSON instead of XML' },
  ],
  nextSteps: [
    { slug: 'json-validator', reason: 'Validate JSON when the payload is JSON rather than XML', priority: 1 },
  ],
  workflowStage: ['transform'],
  keywords: ['xml formatter', 'format xml', 'xml validator', 'pretty print xml', 'minify xml'],
  entityAliases: ['xml beautifier', 'xml pretty print'],
  inputs: ['xml document text'],
  outputs: ['formatted xml'],
  difficulty: 'beginner',
};
