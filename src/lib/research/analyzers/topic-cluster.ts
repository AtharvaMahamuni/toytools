// Problem-graph builder. Turns scored opportunities into a graph: opportunity nodes plus the
// existing catalog tools they link to, with edges for shared engine, shared transformation, related
// problems, and links into real tools. Mirrors the knowledge graph's node/edge/adjacency shape so it
// can later power on-site internal linking. Pure, deterministic.

import type { Opportunity } from '../models/opportunity';
import type { ProblemGraph, ProblemNode, ProblemEdge } from '../models/problem';
import type { ResearchInputs } from '../types';
import { transformationId } from './transformation';

export function buildProblemGraph(opportunities: Opportunity[], inputs: ResearchInputs): ProblemGraph {
  const nodes = new Map<string, ProblemNode>();
  const edges: ProblemEdge[] = [];
  const catalogBySlug = new Map(inputs.catalog.map(c => [c.slug, c]));

  for (const o of opportunities) {
    nodes.set(o.id, {
      id: o.id,
      title: o.title,
      transformation: o.transformation,
      engine: o.proposedEngine,
      existing: false,
      relatedTools: o.relatedTools,
      relatedGuides: o.relatedGuides,
      relatedFaqs: o.relatedFaqs,
    });
  }

  // Catalog nodes for any linked existing tool.
  for (const o of opportunities) {
    for (const slug of o.relatedTools) {
      if (nodes.has(slug)) continue;
      const c = catalogBySlug.get(slug);
      if (!c) continue;
      nodes.set(slug, {
        id: slug,
        title: c.name,
        transformation: c.family,
        engine: c.engine,
        existing: true,
        relatedTools: [],
        relatedGuides: [],
        relatedFaqs: [],
      });
    }
  }

  // Shared-engine + same-transformation edges between opportunities (stable upper-triangular pass).
  for (let i = 0; i < opportunities.length; i++) {
    for (let j = i + 1; j < opportunities.length; j++) {
      const a = opportunities[i];
      const b = opportunities[j];
      if (transformationId(a.transformation) === transformationId(b.transformation)) {
        edges.push({ from: a.id, to: b.id, kind: 'same-transformation' });
      } else if (a.proposedEngine === b.proposedEngine) {
        edges.push({ from: a.id, to: b.id, kind: 'shares-engine' });
      }
    }
  }

  // Related-problem edges (resolve a related problem to an opportunity by transformation match).
  for (const o of opportunities) {
    for (const rp of o.relatedProblems) {
      const target = opportunities.find(
        x => x.id !== o.id && x.transformation.toLowerCase().includes(rp.toLowerCase()),
      );
      if (target) edges.push({ from: o.id, to: target.id, kind: 'related-problem' });
    }
  }

  // Links into existing tools.
  for (const o of opportunities) {
    for (const slug of o.relatedTools) {
      if (nodes.get(slug)?.existing) edges.push({ from: o.id, to: slug, kind: 'links-to-tool' });
    }
  }

  // Deterministic edge order + adjacency.
  edges.sort((x, y) => x.from.localeCompare(y.from) || x.to.localeCompare(y.to) || x.kind.localeCompare(y.kind));
  const adjacency = new Map<string, ProblemEdge[]>();
  for (const e of edges) {
    const list = adjacency.get(e.from) ?? [];
    list.push(e);
    adjacency.set(e.from, list);
  }

  return { nodes: [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id)), edges, adjacency };
}
