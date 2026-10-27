import type { ToolConfig } from '@data/types';

export const config: ToolConfig = {
  slug: 'normalize-whitespace',
  name: 'Normalize Whitespace',
  seoTitle: 'Normalize Whitespace — Collapse All Spacing Online',
  description: 'Clean whitespace by collapsing every run of spaces, tabs and newlines into single spaces, then trimming the result.',
  tagline: 'Collapse every run of whitespace into single spaces.',
  categorySlug: 'text-utilities',
  tags: ['normalize whitespace', 'collapse whitespace', 'flatten text', 'remove line breaks', 'single line text', 'clean whitespace', 'remove newlines'],
  updatedAt: '2026-07-09',
  engine: 'text-processor',
  pattern: 'text-cleanup',
  family: 'cleanup',
  craft: {
    id: 'nw-breaks',
    kind: 'orientation',
    solves: 'This is the heaviest cleanup on the engine and it collapses line breaks along with everything else, so somebody who arrived wanting double spaces fixed loses the structure of a list or an address without being told.',
  },
  processorId: 'normalizeWhitespace',
  toolGroup: 'text-cleanup',
  // Its guide was folded into the whitespace hub (GSC pilot, 27 Oct 2026); the old guide URL is a
  // redirect stub in src/data/guide-redirects.ts.
  sharedGuide: 'remove-blank-lines',
};
