// Knowledge layer — the typed source of truth that powers the Relationship Engine,
// related-content sections, EntityMatcher, topic clusters, and (later) search + schema.
//
// Design notes:
// - Relationships are typed objects (RelationshipReference), never bare slugs, so each edge
//   can carry a human `reason` (UI + semantic SEO) and a `strength`/`priority` (future ranking).
// - Content/relation types are OPEN string models (constants below), so adding a node type
//   (reference, calculator, collection…) or relation type needs no code change here.
// - Concepts split into primary/secondary for future search/clustering/authority weighting.
// - Every Knowledge carries a schemaVersion so V1/V2 can coexist without scattered migrations.

/** Open content-type model. New types (reference, calculator, collection…) need no code change. */
export type ContentType = string;
export const CONTENT_TYPES = {
  TOOL: 'tool',
  GUIDE: 'guide',
  CATEGORY: 'category',
} as const;

/** Open relation-type model — same rationale as ContentType. */
export type RelationType = string;
export const RELATION_TYPES = {
  RELATED_TOOL: 'RELATED_TOOL',
  RELATED_GUIDE: 'RELATED_GUIDE',
  USED_WITH: 'USED_WITH',
  ALTERNATIVE: 'ALTERNATIVE',
  NEXT_STEP: 'NEXT_STEP',
  BELONGS_TO_CATEGORY: 'BELONGS_TO_CATEGORY',
  MENTIONS: 'MENTIONS',
} as const;

/** A typed pointer from one piece of content to another. */
export interface RelationshipReference {
  /** Target tool slug. */
  slug: string;
  /** Human-readable why ("Inspect decoded JSON payloads") — drives UI subtitles + semantic SEO. */
  reason?: string;
  /** 0..1 confidence used for ranking. Derived edges get a tier-based default; overlay edges optional. */
  strength?: number;
  /** Explicit manual sort override (lower = first). Wins over strength when present. */
  priority?: number;
}

/** Where a tool typically sits in a data pipeline — powers future "Typical Workflow" blocks. */
export type WorkflowStage = 'input' | 'transform' | 'validate' | 'analyze' | 'export';

export const WORKFLOW_STAGES: WorkflowStage[] = [
  'input',
  'transform',
  'validate',
  'analyze',
  'export',
];

/** Search-intent buckets for a tool's concept space. */
export interface IntentGroups {
  informational: string[];
  howTo: string[];
  comparison: string[];
  misconception: string[];
  troubleshooting: string[];
}

/** Bump when the Knowledge shape changes; enables V1/V2 coexistence + keyed migrations. */
export const KNOWLEDGE_SCHEMA_VERSION = 1;

export interface Knowledge {
  /** Validated to equal KNOWLEDGE_SCHEMA_VERSION at build time. */
  schemaVersion: typeof KNOWLEDGE_SCHEMA_VERSION;
  /** MUST equal the tool slug. */
  slug: string;
  title: string;
  /** MUST equal tool.categorySlug. */
  category: string;
  /** One-line summary, ≤160 chars (same discipline as guide descriptions). */
  summary: string;
  /** 1–2 canonical concepts — weighted highest for search/clustering/authority. */
  primaryConcepts: string[];
  /** Supporting concepts. */
  secondaryConcepts: string[];
  intentGroups: IntentGroups;
  realWorldUseCases: string[];
  commonMistakes: string[];
  commonQuestions: string[];
  /** Curated, non-derivable workflow relationships. */
  usedWith: RelationshipReference[];
  alternatives: RelationshipReference[];
  nextSteps: RelationshipReference[];
  /** Pipeline stages this tool participates in. */
  workflowStage: WorkflowStage[];
  keywords: string[];
  /** Extra surface forms the EntityMatcher maps back to this tool. */
  entityAliases: string[];
  /** Optional manual override; normally relatedTools are DERIVED from metadata, not authored. */
  relatedTools?: RelationshipReference[];

  // ---- Richer semantic identity (additive; populated for newer files) --------------------
  /** What the tool consumes, e.g. ['text'] | ['number','number']. */
  inputs?: string[];
  /** What the tool produces, e.g. ['count'] | ['formatted text']. */
  outputs?: string[];
  /** Rough skill level the tool/concept assumes. */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** Primary audiences, e.g. ['writers','students','developers']. */
  audience?: string[];
}

// ---- Graph model ------------------------------------------------------------

export interface GraphNode {
  id: string;          // unique: `${type}:${slug}`
  type: ContentType;
  slug: string;
  title: string;
  category: string;
  url: string;
}

export interface GraphEdge {
  from: string;        // GraphNode.id
  to: string;          // GraphNode.id
  type: RelationType;
  reason?: string;
  strength?: number;
  priority?: number;
}

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Adjacency: node id → outgoing edges, for near-O(1) queries. */
  adjacency: Map<string, GraphEdge[]>;
}
