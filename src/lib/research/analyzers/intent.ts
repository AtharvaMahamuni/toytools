// Intent analyzer — classifies the search intent behind a problem from keyword cues, falling back to
// the provider-supplied hint. Deterministic. Pure.

import type { IntentKind } from '../constants';
import type { RawOpportunity } from '../models/provider';

const CUES: Array<{ kind: IntentKind; rx: RegExp }> = [
  { kind: 'comparison', rx: /\b(vs|versus|compare|difference between)\b/ },
  { kind: 'troubleshooting', rx: /\b(won'?t|error|invalid|fix|broken|not working|remove|strip|clean)\b/ },
  { kind: 'howTo', rx: /\b(how to|how do|tutorial|guide|steps)\b/ },
  { kind: 'transactional', rx: /\b(converter|generator|online|tool|calculator|encode|decode|convert)\b/ },
];

export function classifyIntent(raw: RawOpportunity): IntentKind {
  const hay = `${raw.query} ${raw.problem}`.toLowerCase();
  for (const c of CUES) if (c.rx.test(hay)) return c.kind;
  return raw.intent; // provider hint as the default
}
