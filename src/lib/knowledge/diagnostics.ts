// Graph diagnostics — a build-time health snapshot of the knowledge ecosystem, written to
// dist/knowledge-graph.json (not shipped to the browser). Think "Search Console for the
// internal graph": coverage, density, orphans, broken links — trackable over time.

import { CONTENT_TYPES, type KnowledgeGraph } from './types';

export interface GraphDiagnostics {
  generatedAt: string;
  schemaVersion: number;
  nodes: number;
  edges: number;
  categories: number;
  /** Percent of tools that have an authored knowledge file (0–100, rounded). */
  knowledgeCoverage: number;
  /** edges / nodes, rounded to 2dp — average outgoing relationships per node. */
  avgRelationships: number;
  /** edges / (nodes * (nodes-1)), rounded to 4dp — directed-graph density. */
  graphDensity: number;
  orphanCount: number;
  /** Node ids with zero inbound AND zero outbound edges. */
  orphans: string[];
  /** Edges whose target node does not exist (should always be empty). */
  brokenLinks: string[];
}

export interface DiagnosticsInput {
  graph: KnowledgeGraph;
  schemaVersion: number;
  toolCount: number;
  knowledgeCount: number;
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/** Compute diagnostics from a built graph. Pure. */
export function buildDiagnostics(input: DiagnosticsInput): GraphDiagnostics {
  const { graph, schemaVersion, toolCount, knowledgeCount } = input;
  const nodeIds = new Set(graph.nodes.map(n => n.id));

  const touched = new Set<string>();
  const brokenLinks: string[] = [];
  for (const e of graph.edges) {
    touched.add(e.from);
    touched.add(e.to);
    if (!nodeIds.has(e.to)) brokenLinks.push(`${e.from} -[${e.type}]-> ${e.to}`);
    if (!nodeIds.has(e.from)) brokenLinks.push(`${e.from} (missing source)`);
  }

  const orphans = graph.nodes.filter(n => !touched.has(n.id)).map(n => n.id);
  const n = graph.nodes.length;
  const categories = graph.nodes.filter(node => node.type === CONTENT_TYPES.CATEGORY).length;

  return {
    generatedAt: new Date().toISOString(),
    schemaVersion,
    nodes: n,
    edges: graph.edges.length,
    categories,
    knowledgeCoverage: toolCount > 0 ? Math.round((knowledgeCount / toolCount) * 100) : 0,
    avgRelationships: n > 0 ? round(graph.edges.length / n, 2) : 0,
    graphDensity: n > 1 ? round(graph.edges.length / (n * (n - 1)), 4) : 0,
    orphanCount: orphans.length,
    orphans,
    brokenLinks,
  };
}
