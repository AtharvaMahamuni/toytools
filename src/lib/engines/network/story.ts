import type { Insight, Assumption, Decision } from '@lib/results/types';

let seq = 0;
const uid = (prefix: string) => `${prefix}-${++seq}`;

export function insight(text: string, tone: Insight['tone'] = 'info'): Insight {
  return { id: uid('ins'), text, tone };
}

export function step(index: number, text: string): Insight {
  return { id: uid('step'), text: `Step ${index}: ${text}`, tone: 'info' };
}

export function assumption(label: string, value: string): Assumption {
  return { id: uid('as'), label, value };
}

// Cross-tool decision links. Engines name the tool by slug and never write its URL: a decision
// carries { slug, segment } and the experience renderer makes the href with the URL builder
// (toolPath in src/lib/paths.ts), so the base path and the URL shape live in one place. The map
// holds the one thing a link needs besides the slug, the tool's URL segment; the engine href
// contract test (src/lib/engines/href-contract.test.ts) checks every entry against the registry.
// Only tools that already ship appear here; a decision to a not-yet-built sibling returns null
// and is filtered out, then lights up once that tool's slug is added in its own PR.
export const NETWORK_LINKED_TOOLS: Record<string, string> = {
  'cidr-calculator': 'developer-utilities',
  'what-is-my-ip': 'developer-utilities',
  'binary-converter': 'number',
  'hex-encoder-decoder': 'developer-utilities',
  'unix-timestamp-converter': 'datetime',
};

export function toolDecision(label: string, slug: string): Decision | null {
  const segment = NETWORK_LINKED_TOOLS[slug];
  return segment ? { id: uid('dec'), label, tool: { slug, segment } } : null;
}

export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
