// Cluster analyzer — groups scored opportunities into topic clusters by shared transformation. Each
// cluster is the unit the roadmap reasons about for internal linking + topic authority. Pure.

import type { Opportunity } from '../models/opportunity';
import type { TopicCluster, TopicClusters } from '../models/cluster';
import type { ResearchInputs } from '../types';
import { transformationId } from './transformation';

export function buildClusters(opportunities: Opportunity[], inputs: ResearchInputs): TopicClusters {
  const groups = new Map<string, Opportunity[]>();
  for (const o of opportunities) {
    const key = `${o.proposedEngine}::${transformationId(o.transformation)}`;
    const list = groups.get(key) ?? [];
    list.push(o);
    groups.set(key, list);
  }

  const clusters: TopicCluster[] = [];
  for (const [key, members] of groups) {
    const [engine] = key.split('::');
    const sorted = [...members].sort((a, b) => b.finalScore - a.finalScore || a.id.localeCompare(b.id));
    const existingMembers = inputs.catalog
      .filter(c => c.engine === engine)
      .map(c => c.slug)
      .sort();
    const internalLinks = [...new Set(sorted.flatMap(m => m.relatedTools))].sort();
    clusters.push({
      id: transformationId(sorted[0].transformation),
      transformation: sorted[0].transformation,
      engine,
      members: sorted.map(m => m.id),
      existingMembers,
      size: sorted.length,
      meanScore: round1(sorted.reduce((s, m) => s + m.finalScore, 0) / sorted.length),
      internalLinks,
    });
  }
  return clusters.sort((a, b) => b.meanScore - a.meanScore || a.id.localeCompare(b.id));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
