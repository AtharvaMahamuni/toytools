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

// Cross-tool decision links. Absolute paths (the site is served from the apex domain and locally from
// root, and these render client-side, so withBase does not apply). Only tools that already ship appear
// here; a decision to a not-yet-built sibling returns null and is filtered out, then lights up
// automatically once that tool's slug is added in its own PR.
export const DATETIME_TOOL_PATH: Record<string, string> = {
  'age-calculator': '/tool/datetime/age-calculator/',
};

/** A decision linking to a sibling datetime tool, or null when that tool has not shipped yet. */
export function toolDecision(label: string, slug: string): Decision | null {
  const href = DATETIME_TOOL_PATH[slug];
  return href ? { id: uid('dec'), label, href } : null;
}

/** Drop the nulls from a decisions list (siblings that have not shipped). */
export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
