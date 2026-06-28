// Problem-graph model. Instead of isolated opportunities, the RIE builds a graph whose nodes are
// problems/tools and whose edges capture "related problem", "shares engine", "same transformation",
// and links into the real catalog (tools/guides/FAQs). This graph later powers internal linking.

export type ProblemEdgeKind =
  | 'related-problem'
  | 'shares-engine'
  | 'same-transformation'
  | 'links-to-tool';

export interface ProblemNode {
  /** Opportunity id (or existing tool slug for catalog nodes). */
  id: string;
  title: string;
  transformation: string;
  engine: string;
  /** True when this node is an existing ToyTools tool rather than a discovered opportunity. */
  existing: boolean;
  relatedTools: string[];
  relatedGuides: string[];
  relatedFaqs: string[];
}

export interface ProblemEdge {
  from: string;
  to: string;
  kind: ProblemEdgeKind;
}

export interface ProblemGraph {
  nodes: ProblemNode[];
  edges: ProblemEdge[];
  /** Outgoing-edge adjacency for O(1) traversal. */
  adjacency: Map<string, ProblemEdge[]>;
}
