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

// Cross-tool decision links. Absolute paths (the site is served from the apex domain with no base
// path, and these render client-side so the build-time withBase helper does not apply). Only tools
// that already ship appear here; a decision to a not-yet-built sibling returns null and is filtered
// out, then lights up once that tool's slug lands.
export const WELLNESS_TOOL_PATH: Record<string, string> = {
  'bmi-calculator': '/tool/health/bmi-calculator/',
  'tdee-calculator': '/tool/health/tdee-calculator/',
  'body-fat-calculator': '/tool/health/body-fat-calculator/',
  'macro-calculator': '/tool/health/macro-calculator/',
  'ideal-weight-calculator': '/tool/health/ideal-weight-calculator/',
  'heart-rate-zone-calculator': '/tool/health/heart-rate-zone-calculator/',
  'water-intake-tracker': '/tool/health/water-intake-tracker/',
  'body-weight-tracker': '/tool/health/body-weight-tracker/',
  'move-today-tracker': '/tool/health/move-today-tracker/',
};

/** A decision linking to a sibling wellness tool, or null when that tool has not shipped yet. */
export function toolDecision(label: string, slug: string): Decision | null {
  const href = WELLNESS_TOOL_PATH[slug];
  return href ? { id: uid('dec'), label, href } : null;
}

/** Drop the nulls from a decisions list (siblings that have not shipped). */
export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
