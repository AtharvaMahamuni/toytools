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

export const NETWORK_TOOL_PATH: Record<string, string> = {
  'cidr-calculator': '/tool/developer-utilities/cidr-calculator/',
  'what-is-my-ip': '/tool/developer-utilities/what-is-my-ip/',
  'binary-converter': '/tool/number/binary-converter/',
  'hex-encoder-decoder': '/tool/developer-utilities/hex-encoder-decoder/',
  'unix-timestamp-converter': '/tool/datetime/unix-timestamp-converter/',
};

export function toolDecision(label: string, slug: string): Decision | null {
  const href = NETWORK_TOOL_PATH[slug];
  return href ? { id: uid('dec'), label, href } : null;
}

export function decisions(list: (Decision | null)[]): Decision[] {
  return list.filter((d): d is Decision => d !== null);
}
