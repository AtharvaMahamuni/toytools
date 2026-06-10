// Query APIs over the prebuilt relationship graph. All lookups are O(1) over the adjacency
// map / node index. Consumed by related-content components and (later) search + schema.
//
// Sorting convention for relationship lists: explicit `priority` asc first, then `strength`
// desc, then original order — so curated overlay edges and derived edges sort on one axis.

import { graph as defaultGraph } from './graph';
import { getKnowledge } from './registry';
import {
  CONTENT_TYPES,
  RELATION_TYPES,
  type GraphEdge,
  type GraphNode,
  type KnowledgeGraph,
  type Knowledge,
  type WorkflowStage,
  WORKFLOW_STAGES,
} from './types';

const nodeId = (type: string, slug: string) => `${type}:${slug}`;

function nodeIndex(graph: KnowledgeGraph): Map<string, GraphNode> {
  return new Map(graph.nodes.map(n => [n.id, n]));
}

/** Edges out of a node, optionally filtered by relation type. */
function edgesFrom(graph: KnowledgeGraph, fromId: string, type?: string): GraphEdge[] {
  const all = graph.adjacency.get(fromId) ?? [];
  return type ? all.filter(e => e.type === type) : all;
}

/** Sort edges: priority asc (when present) → strength desc → stable original order. */
function sortEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges
    .map((e, i) => ({ e, i }))
    .sort((a, b) => {
      const pa = a.e.priority ?? Infinity;
      const pb = b.e.priority ?? Infinity;
      if (pa !== pb) return pa - pb;
      const sa = a.e.strength ?? 0;
      const sb = b.e.strength ?? 0;
      if (sa !== sb) return sb - sa;
      return a.i - b.i;
    })
    .map(x => x.e);
}

/** A resolved relationship: the target node plus the edge's reason/strength. */
export interface ResolvedRelation {
  node: GraphNode;
  reason?: string;
  strength?: number;
  type: string;
}

function resolve(
  graph: KnowledgeGraph,
  fromId: string,
  type: string,
  max: number,
): ResolvedRelation[] {
  const index = nodeIndex(graph);
  return sortEdges(edgesFrom(graph, fromId, type))
    .map(e => {
      const node = index.get(e.to);
      return node ? { node, reason: e.reason, strength: e.strength, type: e.type } : null;
    })
    .filter((x): x is ResolvedRelation => x !== null)
    .slice(0, max);
}

// ---- Public API -------------------------------------------------------------

/** A tool's authored knowledge, or undefined. */
export function getKnowledgeFor(slug: string): Knowledge | undefined {
  return getKnowledge(slug);
}

export function getRelatedTools(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.RELATED_TOOL, max);
}

export function getRelatedGuides(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.RELATED_GUIDE, max);
}

export function getRelatedFaqs(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.RELATED_FAQ, max);
}

export function getUsedWith(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.USED_WITH, max);
}

export function getAlternatives(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.ALTERNATIVE, max);
}

export function getNextSteps(slug: string, max = 5, graph = defaultGraph): ResolvedRelation[] {
  return resolve(graph, nodeId(CONTENT_TYPES.TOOL, slug), RELATION_TYPES.NEXT_STEP, max);
}

/** Tool + its guide/faq + derived related tools/guides/faqs — the topic cluster around a slug. */
export interface TopicCluster {
  tool?: GraphNode;
  guide?: GraphNode;
  faq?: GraphNode;
  relatedTools: ResolvedRelation[];
  relatedGuides: ResolvedRelation[];
  relatedFaqs: ResolvedRelation[];
}

export function getTopicCluster(slug: string, max = 5, graph = defaultGraph): TopicCluster {
  const index = nodeIndex(graph);
  return {
    tool: index.get(nodeId(CONTENT_TYPES.TOOL, slug)),
    guide: index.get(nodeId(CONTENT_TYPES.GUIDE, slug)),
    faq: index.get(nodeId(CONTENT_TYPES.FAQ, slug)),
    relatedTools: getRelatedTools(slug, max, graph),
    relatedGuides: getRelatedGuides(slug, max, graph),
    relatedFaqs: getRelatedFaqs(slug, max, graph),
  };
}

/**
 * Order a tool's usedWith + nextSteps neighbours by workflow stage (input→…→export),
 * so a future "Typical Workflow" block can render with no schema change. Falls back to
 * relationship sort order for tools without authored knowledge.
 */
export function getWorkflow(slug: string, graph = defaultGraph): ResolvedRelation[] {
  const neighbours = [...getUsedWith(slug, 10, graph), ...getNextSteps(slug, 10, graph)];
  const seen = new Set<string>();
  const unique = neighbours.filter(r => {
    if (seen.has(r.node.slug)) return false;
    seen.add(r.node.slug);
    return true;
  });
  const stageOf = (s: string): number => {
    const kn = getKnowledge(s);
    const stage = kn?.workflowStage?.[0] as WorkflowStage | undefined;
    const idx = stage ? WORKFLOW_STAGES.indexOf(stage) : -1;
    return idx === -1 ? WORKFLOW_STAGES.length : idx;
  };
  return unique
    .map((r, i) => ({ r, i }))
    .sort((a, b) => stageOf(a.r.node.slug) - stageOf(b.r.node.slug) || a.i - b.i)
    .map(x => x.r);
}
