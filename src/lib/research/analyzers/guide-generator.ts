// Guide-generator analyzer — proposes guide titles for an opportunity (data only, no prose). The
// titles follow ToyTools' informational/how-to guide conventions. Pure, deterministic.

/** Minimal shape both RawOpportunity and Opportunity satisfy. */
export interface ContentInput {
  transformation: string;
  name: string;
  intent: string;
  existingSolutions: string[];
  solutionWeaknesses: string[];
}

export function suggestGuides(o: ContentInput): string[] {
  const out = [
    `What is ${o.transformation}?`,
    `How to ${o.transformation.toLowerCase()} online`,
  ];
  if (o.existingSolutions.length > 0) out.push(`${o.name} vs the alternatives`);
  return [...new Set(out.map(x => x.trim()))].filter(Boolean);
}
