// Engine-owned storytelling — small constructors so every calculator builds insights, milestones,
// assumptions, and next-step decisions in the same shape. The engine explains results, it does not
// just compute them. Pure and synchronous; the experience layer renders whatever is returned.

import type { Insight, Milestone, Assumption, Decision } from '@lib/results/types';

let seq = 0;
const uid = (prefix: string) => `${prefix}-${++seq}`;

export function insight(text: string, tone: Insight['tone'] = 'info'): Insight {
  return { id: uid('ins'), text, tone };
}

export function milestone(label: string, reached: boolean, atYear?: number): Milestone {
  return { id: uid('ms'), label, reached, atYear };
}

export function assumption(label: string, value: string): Assumption {
  return { id: uid('asm'), label, value };
}

export function decision(label: string, href?: string): Decision {
  return { id: uid('dec'), label, href };
}

// Tool URLs for cross-tool decisions. Plain absolute paths: the site is served from the apex domain
// (no base path) and locally from root, so these resolve in both. Rendered client-side, so withBase
// (a build-time helper) does not apply here.
export const FINANCE_TOOL_PATH: Record<string, string> = {
  'compound-interest-calculator': '/tool/finance/compound-interest-calculator/',
  'savings-goal-calculator': '/tool/finance/savings-goal-calculator/',
  'emergency-fund-calculator': '/tool/finance/emergency-fund-calculator/',
  'inflation-calculator': '/tool/finance/inflation-calculator/',
  'rule-of-72-calculator': '/tool/finance/rule-of-72-calculator/',
};

/** A decision that links to a sibling finance tool. */
export function toolDecision(label: string, slug: string): Decision {
  return decision(label, FINANCE_TOOL_PATH[slug]);
}
