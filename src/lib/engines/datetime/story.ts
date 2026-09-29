// Engine-owned storytelling for the Date & Time engine — small constructors so every tool builds
// insights, milestones, and next-step decisions in the same shape. Pure and synchronous.

import type { Insight, Milestone, Decision } from '@lib/results/types';

let seq = 0;
const uid = (prefix: string) => `${prefix}-${++seq}`;

export function insight(text: string, tone: Insight['tone'] = 'info'): Insight {
  return { id: uid('ins'), text, tone };
}

export function milestone(label: string, reached: boolean): Milestone {
  return { id: uid('ms'), label, reached };
}

// Cross-tool decision links. Engines name the tool by slug and never write its URL: a decision
// carries { slug, segment } and the experience renderer makes the href with the URL builder
// (toolPath in src/lib/paths.ts), so the base path and the URL shape live in one place. The map
// holds the one thing a link needs besides the slug, the tool's URL segment; the engine href
// contract test (src/lib/engines/href-contract.test.ts) checks every entry against the registry.
// Only tools that already ship appear here; a decision to a not-yet-built sibling returns null
// and is filtered out, then lights up once that tool's slug is added in its own PR.
export const DATETIME_LINKED_TOOLS: Record<string, string> = {
  'age-calculator': 'datetime',
  'date-difference-calculator': 'datetime',
  'timezone-converter': 'datetime',
  'unix-timestamp-converter': 'datetime',
  'cron-expression-parser': 'datetime',
};

/** A decision linking to a sibling datetime tool, or null when that tool has not shipped yet. */
export function toolDecision(label: string, slug: string): Decision | null {
  const segment = DATETIME_LINKED_TOOLS[slug];
  return segment ? { id: uid('dec'), label, tool: { slug, segment } } : null;
}

/** Drop the nulls from a decisions list (siblings that have not shipped). */
export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
