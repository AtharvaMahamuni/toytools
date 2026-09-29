// Engine-owned storytelling — small constructors so every calculator builds insights, milestones,
// assumptions, and next-step decisions in the same shape. The engine explains results, it does not
// just compute them. Pure and synchronous; the experience layer renders whatever is returned.

import type { Insight, Milestone, Assumption, Decision } from '@lib/results/types';
import { toolPath } from '@lib/paths';

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

// Cross-tool decision links. Engines name the tool by slug; the URL builder (src/lib/paths.ts)
// makes the href, so the shape of a tool URL and the base path live in one place. The map holds
// only what a link needs besides the slug, the tool's URL segment, and the engine href contract
// test (src/lib/engines/href-contract.test.ts) checks every entry against the registry.
export const FINANCE_LINKED_TOOLS: Record<string, string> = {
  'compound-interest-calculator': 'finance',
  'savings-goal-calculator': 'finance',
  'emergency-fund-calculator': 'finance',
  'inflation-calculator': 'finance',
  'rule-of-72-calculator': 'finance',
  'sip-calculator': 'finance',
  'roi-calculator': 'finance',
  'cagr-calculator': 'finance',
  'upi-mdr-estimator': 'finance',
  'tax-calculator': 'number',
  'tip-calculator': 'number',
};

/** A decision that links to another tool by slug (a finance sibling, or tax / tip). */
export function toolDecision(label: string, slug: string): Decision {
  const segment = FINANCE_LINKED_TOOLS[slug];
  return decision(label, segment ? toolPath({ slug, segment }) : undefined);
}
