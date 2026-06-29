// Domain-concept registry — engine-agnostic mechanism for modelling the IDEAS behind interactive
// tools (compound interest, inflation, time value of money, …). This is the platform mechanism only;
// each engine supplies its own concept data. Concepts feed the knowledge graph (entity aliases),
// guides, FAQs, and research linking, and let a tool say "this relates to" without re-deriving it.

export interface Concept {
  /** Stable id, e.g. 'compound-interest'. */
  id: string;
  /** Canonical display term. */
  term: string;
  /** One or two sentence definition. */
  definition: string;
  /** Ids of related concepts (within any engine's set). */
  relatedConcepts?: string[];
  /** Surface forms an entity matcher maps back to this concept. */
  aliases?: string[];
  /** Optional external references for guides/FAQs. */
  references?: string[];
}

/** Build an id -> Concept map from a list. Pure, so tests can pass fixtures. */
export function buildConceptRegistry(entries: Concept[]): Map<string, Concept> {
  const map = new Map<string, Concept>();
  for (const c of entries) map.set(c.id, c);
  return map;
}
