// Engine-detection model. The RIE never recommends one-off tools blindly: it groups opportunities by
// the reusable transformation/engine they share, then decides whether an EXISTING engine already
// covers them or a NEW engine is implied ("these N opportunities → one CSV engine, confidence X%,
// unlocks tools A,B,C…"). This aligns with ToyTools' engine-first architecture.

export interface EngineRecommendation {
  /** Proposed engine slug (matches a registered engine id when `exists` is true). */
  engine: string;
  /** Does this engine already exist in src/data/engines.ts? */
  exists: boolean;
  /** 0–1 confidence that this cluster justifies the (existing or new) engine. */
  confidence: number;
  /** The transformations this engine would serve. */
  transformations: string[];
  /** Opportunity ids this engine would unlock. */
  unlocksTools: string[];
  /** Best opportunity finalScore in the cluster (drives ordering). */
  topScore: number;
  /** Human-readable rationale lines. */
  rationale: string[];
}

export type EngineRecommendations = EngineRecommendation[];
