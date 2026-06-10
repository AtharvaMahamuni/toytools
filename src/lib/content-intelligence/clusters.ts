// Topic Cluster Analyzer — for every topic: cluster size (tool + guide + faq + derived related
// content), related topics, and missing connections (same-family tools that aren't linked, and
// curated overlay edges that aren't reciprocated). Pure; reuses the knowledge graph + queries.

import { getTopicCluster } from '@lib/knowledge/queries';
import { RELATION_TYPES } from '@lib/knowledge/types';
import type { AnalyzerInputs, TopicClusters, ClusterEntry } from './types';

const OVERLAY_TYPES = new Set<string>([
  RELATION_TYPES.USED_WITH,
  RELATION_TYPES.ALTERNATIVE,
  RELATION_TYPES.NEXT_STEP,
]);

export function analyzeTopicClusters(inputs: AnalyzerInputs): TopicClusters {
  const out: ClusterEntry[] = [];
  const familyOf = new Map(inputs.tools.map(t => [t.slug, t.family]));

  for (const t of inputs.tools) {
    const cluster = getTopicCluster(t.slug, 10, inputs.graph);
    const relatedSlugs = new Set(cluster.relatedTools.map(r => r.node.slug));
    const relatedTopics = [...relatedSlugs];

    const clusterSize =
      (cluster.tool ? 1 : 0) +
      (cluster.guide ? 1 : 0) +
      (cluster.faq ? 1 : 0) +
      cluster.relatedTools.length +
      cluster.relatedGuides.length +
      cluster.relatedFaqs.length;

    const missingConnections: string[] = [];

    // Same-family tools that are not in the related set
    if (t.family) {
      for (const other of inputs.tools) {
        if (other.slug === t.slug) continue;
        if (familyOf.get(other.slug) === t.family && !relatedSlugs.has(other.slug)) {
          missingConnections.push(`same-family tool "${other.slug}" is not linked`);
        }
      }
    }

    // Curated overlay edges that aren't reciprocated
    const outEdges = inputs.graph.adjacency.get(`tool:${t.slug}`) ?? [];
    for (const e of outEdges) {
      if (!OVERLAY_TYPES.has(e.type)) continue;
      const targetSlug = e.to.replace(/^tool:/, '');
      const back = inputs.graph.adjacency.get(e.to) ?? [];
      const reciprocated = back.some(b => b.to === `tool:${t.slug}`);
      if (!reciprocated) {
        missingConnections.push(`"${targetSlug}" does not link back (non-reciprocal ${e.type})`);
      }
    }

    out.push({ slug: t.slug, clusterSize, relatedTopics, missingConnections });
  }

  return out;
}
