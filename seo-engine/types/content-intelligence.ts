export interface FirstPrinciplesCoverage {
  whatItIs: boolean;
  whyItMatters: boolean;
  howItWorks: boolean;
  examples: boolean;
  commonMistakes: boolean;
  comparisons: boolean;
  score: number;
  missing: string[];
}

export interface SearchIntentCoverage {
  intents: Array<{ query: string; covered: boolean }>;
  score: number;
  missing: string[];
}

export interface EntityCoverage {
  expected: string[];
  found: string[];
  missing: string[];
  score: number;
}

export interface TopicClusterResult {
  guideLinksToFaq: boolean;
  faqLinksToGuide: boolean;
  hasRelatedTools: boolean;
  hasEcosystemLinks: boolean;
  score: number;
  missing: string[];
}

export interface ContentAction {
  impact: 'high' | 'medium' | 'low';
  file: 'Guide.astro' | 'faq.ts' | 'config.ts';
  issue: string;
  suggestion: string;
  scoreGain: number;
}

export interface ContentIntelligenceScore {
  overall: number;
  writingQuality: number;
  usefulness: number;
  seoCompleteness: number;
  topicClusterCompleteness: number;
  toyToolsStyleScore: number;
  firstPrinciples: FirstPrinciplesCoverage;
  searchIntent: SearchIntentCoverage;
  entityCoverage: EntityCoverage;
  topicCluster: TopicClusterResult;
  exampleCount: number;
  mistakeSectionCount: number;
  thinContentFlags: string[];
  actions: ContentAction[];
}
