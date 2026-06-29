// Topic-cluster model. Opportunities sharing a transformation/engine form a cluster — the unit the
// roadmap reasons about for internal linking and topic authority. Derived from the problem graph.

export interface TopicCluster {
  /** Stable cluster id (the shared transformation, slugified). */
  id: string;
  transformation: string;
  engine: string;
  /** Opportunity ids in this cluster, strongest first. */
  members: string[];
  /** Existing catalog tool slugs that already sit in this cluster. */
  existingMembers: string[];
  size: number;
  /** Mean finalScore of the members (0–100). */
  meanScore: number;
  /** Internal links the cluster would create across the catalog. */
  internalLinks: string[];
}

export type TopicClusters = TopicCluster[];
