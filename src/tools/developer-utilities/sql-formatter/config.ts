import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'sql-formatter',
  name: 'SQL Formatter',
  seoTitle: 'SQL Formatter Online: Pretty Print SQL',
  description:
    'Format SQL query text online: pretty print SQL, beautify SQL, and indent clauses. SQL beautifier online that keeps string literals intact. What you enter stays on your device.',
  tagline: 'Pretty-print messy SQL with tidy clauses and keywords.',
  categorySlug: 'developer-utilities',
  tags: ['sql formatter', 'format sql', 'pretty print sql', 'sql beautifier', 'indent sql'],
  updatedAt: '2026-11-09',
  addedOn: '2026-11-09',
  engine: 'structured-data',
  pattern: 'structured-transform',
  family: 'sql',
  processorId: 'sql-formatter',
  trustVariant: 'private',
  relatedTools: ['json-formatter', 'json-minifier', 'regex-tester'],
  craft: {
    id: 'sql-secret-guard',
    kind: 'guardrail',
    solves:
      'A query pasted from a ticket sometimes still carries a password or API key in a quoted value. The formatter still runs, and a warning says the secret is visible so it is not copied into a shareable gist next.',
  },
  citation: {
    problem: 'Use this SQL Formatter when a one-line or messy query needs to be readable without uploading it.',
    nonGoal: 'run the query against a database or rewrite its meaning.',
  },
  job: {
    intent: 'format',
    userJob: 'Turn a one-line or messy SQL query into readable, indented SQL I can edit and share.',
    repeatability: 'high',
    interactionDepth: 'low',
    privacyValue: 'high',
    aiSubstitutability: 'low',
    browserOnly: true,
  },
  guide: {
    slug: 'sql-formatter',
    categorySlug: 'developer-utilities',
    title: 'SQL Formatter: Make Queries Readable Without Uploading Them',
    description:
      'How SQL formatting works, which keywords it recognises, and why a query with credentials should never be pasted into an upload site.',
    readMinutes: 4,
    updatedAt: '2026-11-09',
  },
};
