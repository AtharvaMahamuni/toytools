// Engine Opportunity Analyzer — per engine: existing tools, taxonomy-derived missing family
// members (expected − existing), and structural signals derived with NO taxonomy (declared
// patterns that power zero tools; families far below the engine's mean member count). Pure.

import type { AnalyzerInputs, EngineOpportunities, EngineOpportunity } from './types';

// A family is "underpopulated" when it has fewer than this fraction of the engine's mean members.
const UNDERPOP_RATIO = 0.5;

export function analyzeEngineOpportunities(inputs: AnalyzerInputs): EngineOpportunities {
  const out: EngineOpportunity[] = [];

  for (const eng of inputs.engines) {
    const engineTools = inputs.tools.filter(t => t.engine === eng.id);
    const existing = engineTools.map(t => t.slug);
    const existingSet = new Set(existing);

    // Taxonomy-derived missing members
    const taxEngine = inputs.taxonomy.find(e => e.engine === eng.id);
    const missingFamilyMembers: EngineOpportunity['missingFamilyMembers'] = [];
    if (taxEngine) {
      for (const fam of taxEngine.families) {
        for (const expected of fam.expected) {
          if (!existingSet.has(expected)) {
            missingFamilyMembers.push({ family: fam.family, expected });
          }
        }
      }
    }

    // Structural signals (no taxonomy needed)
    const structuralSignals: string[] = [];

    // Declared patterns with zero tools
    const activePatterns = new Set(engineTools.map(t => t.pattern).filter(Boolean) as string[]);
    for (const pattern of eng.patterns) {
      if (!activePatterns.has(pattern)) {
        structuralSignals.push(`pattern "${pattern}" is declared but has 0 tools`);
      }
    }

    // Families far below the engine's mean member count
    const familyCounts = new Map<string, number>();
    for (const t of engineTools) {
      if (!t.family) continue;
      familyCounts.set(t.family, (familyCounts.get(t.family) ?? 0) + 1);
    }
    if (familyCounts.size > 1) {
      const counts = [...familyCounts.values()];
      const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
      for (const [family, count] of familyCounts) {
        if (count < mean * UNDERPOP_RATIO) {
          structuralSignals.push(
            `family "${family}" has ${count} tool(s), below the engine mean of ${round(mean, 1)}`,
          );
        }
      }
    }

    out.push({ engine: eng.id, existing, missingFamilyMembers, structuralSignals });
  }

  return out;
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
