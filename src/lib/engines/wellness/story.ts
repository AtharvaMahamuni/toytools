// Engine-owned storytelling for the wellness engine — small constructors so every calculator builds
// insights, assumptions, and next-step decisions in the same shape. The engine explains results, it
// does not just compute them. Pure and synchronous; the experience layer renders whatever is returned.

import type { Insight, Assumption, Decision } from '@lib/results/types';

let seq = 0;
const uid = (prefix: string) => `${prefix}-${++seq}`;

export function insight(text: string, tone: Insight['tone'] = 'info'): Insight {
  return { id: uid('ins'), text, tone };
}

export function assumption(label: string, value: string): Assumption {
  return { id: uid('asm'), label, value };
}

// Cross-tool decision links. Engines name the tool by slug and never write its URL: a decision
// carries { slug, segment } and the experience renderer makes the href with the URL builder
// (toolPath in src/lib/paths.ts), so the base path and the URL shape live in one place. The map
// holds the one thing a link needs besides the slug, the tool's URL segment; the engine href
// contract test (src/lib/engines/href-contract.test.ts) checks every entry against the registry.
// Only tools that already ship appear here; a decision to a not-yet-built sibling returns null
// and is filtered out, then lights up once that tool's slug is added in its own PR.
export const WELLNESS_LINKED_TOOLS: Record<string, string> = {
  'bmi-calculator': 'health',
  'tdee-calculator': 'health',
  'body-fat-calculator': 'health',
  'macro-calculator': 'health',
  'ideal-weight-calculator': 'health',
  'heart-rate-zone-calculator': 'health',
  'water-intake-tracker': 'health',
  'body-weight-tracker': 'health',
  'move-today-tracker': 'health',
  'bmr-calculator': 'health',
  'calorie-deficit-calculator': 'health',
  'protein-intake-calculator': 'health',
  'one-rep-max-calculator': 'health',
  'running-pace-calculator': 'health',
};

/** A decision linking to a sibling wellness tool, or null when that tool has not shipped yet. */
export function toolDecision(label: string, slug: string): Decision | null {
  const segment = WELLNESS_LINKED_TOOLS[slug];
  return segment ? { id: uid('dec'), label, tool: { slug, segment } } : null;
}

/** Drop the nulls from a decisions list (siblings that have not shipped). */
export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
