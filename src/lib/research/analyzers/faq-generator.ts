// FAQ-generator analyzer — proposes FAQ questions for an opportunity from its problem + weaknesses
// (data only, no answers). Pure, deterministic.

import type { ContentInput } from './guide-generator';

export function suggestFaqs(o: ContentInput): string[] {
  const out = [
    `How do I ${o.transformation.toLowerCase()}?`,
    `Is ${o.name} free and private?`,
  ];
  if (o.intent === 'troubleshooting') out.push(`Why does my input need ${o.transformation.toLowerCase()}?`);
  for (const w of o.solutionWeaknesses.slice(0, 1)) out.push(`Does ${o.name} avoid "${w}"?`);
  return [...new Set(out.map(x => x.trim()))].filter(Boolean).slice(0, 4);
}
