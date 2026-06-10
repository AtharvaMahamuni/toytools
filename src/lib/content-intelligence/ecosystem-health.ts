// Ecosystem Health — rolls the per-analyzer reports into one platform-wide summary. The
// "knowledge-diagnostics for the whole ecosystem": coverage %s, relationship density, orphan
// count, mean category health, and a single blended ecosystemScore. Pure over the sub-reports.

import type {
  CategoryHealth,
  CoverageReport,
  EcosystemHealth,
  TopicClusters,
} from './types';

const REL_TARGET = 5; // related topics per tool for full relationship density
const WEIGHT = { guide: 0.3, faq: 0.2, relationships: 0.25, category: 0.25 };

export interface EcosystemParts {
  coverage: CoverageReport;
  categoryHealth: CategoryHealth;
  clusters: TopicClusters;
}

export function summarizeEcosystem(parts: EcosystemParts): EcosystemHealth {
  const slugs = Object.keys(parts.coverage);
  const toolCount = slugs.length;

  const pct = (n: number) => (toolCount > 0 ? Math.round((n / toolCount) * 100) : 0);
  const guideCoverage = pct(slugs.filter(s => parts.coverage[s].guide).length);
  const faqCoverage = pct(slugs.filter(s => parts.coverage[s].faq).length);

  const avgRelated =
    parts.clusters.length > 0
      ? parts.clusters.reduce((a, c) => a + c.relatedTopics.length, 0) / parts.clusters.length
      : 0;
  const relationshipDensity = Math.round(Math.min(avgRelated / REL_TARGET, 1) * 100);

  const orphanTopics = parts.clusters.filter(c => c.clusterSize <= 1).length;

  const categoryHealth =
    parts.categoryHealth.length > 0
      ? Math.round(
          parts.categoryHealth.reduce((a, h) => a + h.coverageScore, 0) / parts.categoryHealth.length,
        )
      : 0;

  const ecosystemScore = Math.round(
    WEIGHT.guide * guideCoverage +
      WEIGHT.faq * faqCoverage +
      WEIGHT.relationships * relationshipDensity +
      WEIGHT.category * categoryHealth,
  );

  return {
    toolCount,
    guideCoverage,
    faqCoverage,
    relationshipDensity,
    orphanTopics,
    categoryHealth,
    ecosystemScore,
  };
}
