// JSON report renderers — pure functions that slice the ResearchReports bundle into the individual
// machine-readable artifacts the CLI writes. Deterministic; the Map in the problem graph is dropped
// (adjacency is re-derivable) so the JSON is stable and diffable.

import type { ResearchReports } from '../models/report';

export function opportunitiesJson(r: ResearchReports): unknown {
  return { version: r.version, generatedAt: r.generatedAt, opportunities: r.opportunities };
}

export function topOpportunitiesJson(r: ResearchReports, n = 10): unknown {
  return {
    version: r.version,
    generatedAt: r.generatedAt,
    top: r.opportunities.filter(o => o.status !== 'already-exists').slice(0, n),
  };
}

export function missingEnginesJson(r: ResearchReports): unknown {
  return {
    version: r.version,
    generatedAt: r.generatedAt,
    engines: r.engines.filter(e => !e.exists),
  };
}

export function clustersJson(r: ResearchReports): unknown {
  return { version: r.version, generatedAt: r.generatedAt, clusters: r.clusters };
}

export function trendsJson(r: ResearchReports): unknown {
  return { version: r.version, generatedAt: r.generatedAt, trends: r.trends };
}

export function graphJson(r: ResearchReports): unknown {
  return {
    version: r.version,
    generatedAt: r.generatedAt,
    nodes: r.graph.nodes,
    edges: r.graph.edges,
  };
}

/** Summary index, mirroring content-intelligence's index.json. */
export function indexJson(r: ResearchReports): unknown {
  return {
    version: r.version,
    generatedAt: r.generatedAt,
    ...r.summary,
    nextBuild: r.roadmap.nextBuild?.proposedTool ?? null,
  };
}
