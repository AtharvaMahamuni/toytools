export interface SeoScore {
  score: number;
  issues: string[];
}

export interface GeoScore {
  score: number;
  issues: string[];
}

export interface ValidationResult {
  tool: string;
  seo: SeoScore;
  geo: GeoScore;
  generatedAt: string;
}
