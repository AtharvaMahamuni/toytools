// RIE configuration — scoring weights, thresholds, and report output paths. Tuning lives here as
// data (mirrors PRIORITY_WEIGHTS in content-intelligence). Weights are sum-normalized so they need
// not add to exactly 1. Everything here is deterministic.

/** Weights for the composite finalScore. Each factor is a 0–1 signal from a scorer. */
export const SCORE_WEIGHTS = {
  searchDemand: 0.22,
  competition: 0.16,
  evergreen: 0.12,
  implementationCost: 0.14,
  engineReuse: 0.14,
  seoPotential: 0.1,
  topicClusterPotential: 0.06,
  commercialPotential: 0.02,
  localizationPotential: 0.04,
  // "Should this be an algorithm at all?" — deterministic problems are ToyTools' home turf;
  // AI-shaped needs are an architecture mismatch AND a query class chatbots are absorbing.
  algorithmicFit: 0.08,
  // "Could we rank here even if we built it well?" — distinct from `competition`, which measures how
  // crowded and how weak the SERP is. A YMYL SERP can be both open and unreachable, and without this
  // axis the engine ranked three medical calculators above everything else on demand alone.
  authorityWinnability: 0.12,
} as const;

export const WEIGHT_SUM = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);

/**
 * Weights for the LATENT score, which answers a different question than SCORE_WEIGHTS and therefore
 * shares none of its axes.
 *
 * `finalScore` ranks demand: what are people already asking for that we do not have. Its largest
 * single weight is `searchDemand`, and `scoreConfidence` only fires its first signal at demand >= 60.
 * That is correct for its question and fatal for this one - a need nobody has a word for produces no
 * query, so measuring queries can never find it. Every axis below is therefore structural or
 * consequential, and `namelessness` is the same evidence as `searchDemand` read with the opposite
 * sign.
 *
 * The axis that keeps this honest is `reachability`. A tool nobody searches for is a tool nobody
 * finds, so a latent tool's distribution is the catalog's own internal links rather than the SERP.
 * A candidate that bridges tools we already rank for is reachable; one that bridges nothing is a
 * page nobody will ever arrive at, however real its need.
 */
export const LATENT_WEIGHTS = {
  /** How much derived structure backs it (anchor count + how much of the catalog they touch). */
  anchorStrength: 0.3,
  /** What the unmet need costs when it fails silently - latent tools earn their build here. */
  consequence: 0.25,
  /** Reachable through existing catalog adjacency, since search will not deliver anyone. */
  reachability: 0.2,
  /** Inverted demand: no established query is EVIDENCE here, not absence of it. */
  namelessness: 0.15,
  /** Same question as the main engine: is a deterministic algorithm the right shape at all. */
  algorithmicFit: 0.1,
} as const;

export const LATENT_WEIGHT_SUM = Object.values(LATENT_WEIGHTS).reduce((a, b) => a + b, 0);

export const LATENT_THRESHOLDS = {
  /**
   * Minimum anchors a candidate needs to be scored at all. This is the whole guardrail: without it
   * `namelessness` degenerates into rewarding obscurity, and the engine confidently recommends
   * tools nobody wants on the grounds that nobody has asked for them.
   */
  minAnchors: 1,
  /** Min latentScore to be reported as a candidate worth a build decision. */
  promote: 55,
  /** Catalog tools a bridge must touch before `reachability` saturates. */
  reachabilitySaturation: 6,
  /** Anchor evidence items at which `anchorStrength` saturates. */
  anchorSaturation: 5,
  /** Max signals of each kind to report (keeps the derived half of the report readable). */
  signalsPerKind: 8,
} as const;

/** Thresholds used by analyzers/roadmap. */
export const THRESHOLDS = {
  /** Min finalScore (0–100) to be "recommended". */
  recommend: 60,
  /** Min finalScore to land in the immediate-build tier. */
  immediate: 75,
  /** implementationCost ≥ this AND recommended → quick win. */
  quickWinEase: 0.66,
  /** Min opportunities sharing an engine to justify a NEW engine recommendation. */
  newEngineCluster: 3,
  /** Jaccard similarity over problem shingles above which two opportunities are duplicates. */
  duplicateSimilarity: 0.6,
  /** Roadmap caps. */
  immediateCount: 10,
  quickWinCount: 25,
  roadmapCount: 100,
} as const;

/**
 * Proposed-slug → shipped-slug aliases. Shipped-detection is exact-slug matching against the
 * registry, so when a tool ships under a different slug than a dataset proposed, alias it here —
 * otherwise the RIE keeps recommending an already-built tool. Datasets should also be corrected
 * to the shipped slug; this map is the safety net.
 */
export const SLUG_ALIASES: Record<string, string> = {
  'text-to-binary': 'binary-text-converter',
};

/** Resolve a proposed slug through SLUG_ALIASES (identity for unaliased slugs). */
export function resolveSlugAlias(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

/** Where the CLI writes generated reports (repo-root, committed except cache). */
export const REPORT_PATHS = {
  root: 'research/reports',
  snapshots: 'research/reports/snapshots',
  datasets: 'research/datasets',
  cache: 'research/cache',
} as const;
