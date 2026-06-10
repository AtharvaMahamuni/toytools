// Coverage Analyzer — for every topic (tool slug) record whether the tool, guide, FAQ, and
// derived related tools/guides exist. Pure: reads only AnalyzerInputs (queries use the injected
// graph, never the module-global default).

import { getRelatedTools, getRelatedGuides } from '@lib/knowledge/queries';
import type { AnalyzerInputs, CoverageReport } from './types';

export function analyzeCoverage(inputs: AnalyzerInputs): CoverageReport {
  const report: CoverageReport = {};
  for (const t of inputs.tools) {
    report[t.slug] = {
      tool: true,
      guide: t.guide !== undefined,
      faq: t.faq !== undefined,
      relatedTools: getRelatedTools(t.slug, 1, inputs.graph).length > 0,
      relatedGuides: getRelatedGuides(t.slug, 1, inputs.graph).length > 0,
    };
  }
  return report;
}
