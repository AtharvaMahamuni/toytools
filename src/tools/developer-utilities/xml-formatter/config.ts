import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'xml-formatter',
  name: 'XML Formatter and Validator',
  seoTitle: 'XML Formatter and Validator Online',
  description:
    'XML formatter and xml beautifier online: pretty print xml, minify XML, xml validator with line errors. What you enter stays on your device.',
  tagline: 'Pretty-print or minify XML and catch well-formedness errors.',
  categorySlug: 'developer-utilities',
  tags: ['xml formatter', 'format xml', 'xml validator', 'pretty print xml', 'minify xml'],
  updatedAt: '2026-11-09',
  addedOn: '2026-11-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'xml',
  processorId: 'xml-formatter',
  trustVariant: 'private',
  relatedTools: ['json-formatter', 'json-validator', 'html-entity-encoder-decoder'],
  craft: {
    id: 'xml-line-col',
    kind: 'guardrail',
    solves:
      'A broken tag often fails far from where you are looking. The validator names the first well-formedness error and, when the browser provides it, the line so you can jump there instead of counting brackets by hand.',
  },
  citation: {
    problem: 'Use this XML Formatter and Validator when a document needs tidy indentation or a well-formedness check without uploading it.',
    nonGoal: 'validate against an XSD, DTD or Schematron schema.',
  },
  job: {
    intent: 'format',
    userJob: 'Turn messy or minified XML into readable indented XML, or shrink it, and see the first well-formedness error.',
    repeatability: 'high',
    interactionDepth: 'low',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'xml-formatter',
    categorySlug: 'developer-utilities',
    title: 'XML Formatter: Pretty Print Without Upload',
    description:
      'How XML formatting and well-formedness checks work in the browser, why XML is case sensitive, and what namespaces mean for validation.',
    readMinutes: 4,
    updatedAt: '2026-11-09',
  },
};
