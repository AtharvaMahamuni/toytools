// Seed-dataset provider — the one real provider. It reads curated evidence records (handed in via
// ProviderContext.datasets, loaded from research/datasets/*.json by the CLI) and normalizes each into
// a RawOpportunity. Pure and deterministic: same datasets → same output, in stable order.

import type { Provider, ProviderContext, RawOpportunity, SeedRecord } from '../../models/provider';

const DEFAULT_EVERGREEN = 80;
const DEFAULT_LOCALIZATION = 50;
// Candidate utility tools are algorithmic by selection, so the omitted-field default is high;
// records should set it explicitly when the AI-vs-algorithm question is even debatable.
const DEFAULT_ALGORITHMIC_FIT = 85;

function toRaw(rec: SeedRecord): RawOpportunity {
  return {
    source: 'seed-dataset',
    query: rec.query,
    problem: rec.problem,
    intent: rec.intent,
    transformation: rec.transformation,
    proposedTool: rec.proposedTool,
    proposedEngine: rec.proposedEngine,
    proposedName: rec.proposedName,
    searchQueries: dedupeStrings([rec.query, ...rec.searchQueries]),
    existingSolutions: rec.existingSolutions ?? [],
    solutionWeaknesses: rec.solutionWeaknesses ?? [],
    userFailures: rec.userFailures ?? [],
    relatedProblems: rec.relatedProblems ?? [],
    relatedTools: rec.relatedTools ?? [],
    demand: clamp(rec.demand, 0, 100),
    competition: clamp(rec.competition, 0, 100),
    evergreen: clamp(rec.evergreen ?? DEFAULT_EVERGREEN, 0, 100),
    difficulty: rec.difficulty,
    localization: clamp(rec.localization ?? DEFAULT_LOCALIZATION, 0, 100),
    algorithmicFit: clamp(rec.algorithmicFit ?? DEFAULT_ALGORITHMIC_FIT, 0, 100),
    // Carried through unchanged. There is no default: a record either makes a latent-demand claim
    // or it does not, and manufacturing one would put every ordinary tool into the latent report.
    ...(rec.latent ? { latent: { ...rec.latent, consequence: clamp(rec.latent.consequence, 0, 100) } } : {}),
  };
}

export const seedDatasetProvider: Provider = {
  id: 'seed-dataset',
  discover(ctx: ProviderContext): RawOpportunity[] {
    const out: RawOpportunity[] = [];
    for (const ds of ctx.datasets) {
      for (const rec of ds.records) out.push(toRaw(rec));
    }
    // Stable order regardless of dataset iteration order.
    return out.sort((a, b) => a.proposedTool.localeCompare(b.proposedTool));
  },
};

function dedupeStrings(xs: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of xs) {
    const k = x.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(x.trim());
  }
  return out;
}

function clamp(n: number, lo: number, hi: number): number {
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}
