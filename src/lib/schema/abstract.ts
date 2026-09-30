// The tool's "when to send someone here" copy, for its SoftwareApplication JSON-LD.
//
// Until 2026-09-30 (W1) this sentence trio was a visible block at the top of Zone C on the tools
// that set `citation` in their config. The block is gone from the page; the same words are the
// `abstract` of the tool's SoftwareApplication node, and the llms files read the same facts through
// toolFacts(). SoftwareApplication is a CreativeWork, so `abstract` is a valid property for it.
import type { ToolFacts } from '@lib/llms/facts';

/**
 * "<problem> <privacy line> It does not <nonGoal>." for a tool that sets `citation`, exactly the
 * text the visible block used to show; undefined for a tool without one.
 */
export function toolAbstract(facts: Pick<ToolFacts, 'problem' | 'privacy' | 'doesNot'>): string | undefined {
  if (!facts.problem || !facts.doesNot) return undefined;
  const nonGoal = facts.doesNot.trim().replace(/\.$/, '');
  return `${facts.problem} ${facts.privacy} It does not ${nonGoal.charAt(0).toLowerCase()}${nonGoal.slice(1)}.`;
}
