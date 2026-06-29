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
} as const;

export const WEIGHT_SUM = Object.values(SCORE_WEIGHTS).reduce((a, b) => a + b, 0);

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

/** Where the CLI writes generated reports (repo-root, committed except cache). */
export const REPORT_PATHS = {
  root: 'research/reports',
  snapshots: 'research/reports/snapshots',
  datasets: 'research/datasets',
  cache: 'research/cache',
} as const;
