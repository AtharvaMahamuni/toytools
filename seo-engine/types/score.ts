export interface SeoScore {
  score: number;
  issues: string[];
}

export interface GeoScore {
  score: number;
  issues: string[];
  /** Original 5-axis Reddit intent score (0–100), surfaced for reporting. */
  redditIntentScore?: number;
  /** Composite Reddit demand score (0–100), surfaced for reporting. */
  redditDemandScore?: number;
}

export interface ValidationResult {
  tool: string;
  seo: SeoScore;
  geo: GeoScore;
  generatedAt: string;
}
