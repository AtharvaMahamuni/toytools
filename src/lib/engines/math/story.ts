// Engine-owned storytelling for the math engine — small constructors so every calculator builds
// insights, assumptions, and next-step decisions in the same shape. Pure and synchronous.

import type { Insight, Assumption, Decision } from '@lib/results/types';

let seq = 0;
const uid = (prefix: string) => `${prefix}-${++seq}`;

export function insight(text: string, tone: Insight['tone'] = 'info'): Insight {
  return { id: uid('ins'), text, tone };
}

/** A worked step rendered in the insights list ("Step 1: ..."). */
export function step(index: number, text: string): Insight {
  return { id: uid('step'), text: `Step ${index}: ${text}`, tone: 'info' };
}

export function assumption(label: string, value: string): Assumption {
  return { id: uid('as'), label, value };
}

// Cross-tool decision links. Absolute paths (served from the apex domain; rendered client-side, so
// withBase does not apply). Only tools that already ship appear here; a decision to a not-yet-built
// sibling returns null and is filtered out, then lights up once that tool's slug lands in its PR.
export const MATH_TOOL_PATH: Record<string, string> = {
  'fraction-calculator': '/tool/math/fraction-calculator/',
  'combinations-permutations-calculator': '/tool/math/combinations-permutations-calculator/',
  'prime-factorization-calculator': '/tool/math/prime-factorization-calculator/',
  'probability-calculator': '/tool/math/probability-calculator/',
  'unit-circle-calculator': '/tool/math/unit-circle-calculator/',
  'quadratic-equation-solver': '/tool/math/quadratic-equation-solver/',
};

/** A decision linking to a sibling math tool, or null when that tool has not shipped yet. */
export function toolDecision(label: string, slug: string): Decision | null {
  const href = MATH_TOOL_PATH[slug];
  return href ? { id: uid('dec'), label, href } : null;
}

/** Drop the nulls from a decisions list (siblings that have not shipped). */
export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
