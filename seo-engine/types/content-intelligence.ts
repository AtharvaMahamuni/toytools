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

// Reflects the current page architecture: FAQs render on the tool page (#faq),
// guides link back to the tool via the .cta-link button, and related tools come
// from config.relatedTools. (The old faqHref/FAQPreview pattern is gone.)
export interface TopicClusterResult {
  guideHasCtaToTool: boolean;
  hasRelatedTools: boolean;
  faqRegistered: boolean;
  score: number;
  missing: string[];
}

export interface KnowledgeSyncCheck {
  kind: 'commonQuestion' | 'commonMistake' | 'useCase';
  item: string;
  ok: boolean;
}

export interface KnowledgeSyncResult {
  checked: boolean; // false when the tool has no knowledge.ts
  checks: KnowledgeSyncCheck[];
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
  /** Which tier the entity/intent profile came from: override | knowledge | config. */
  profileSource: 'override' | 'knowledge' | 'config';
  firstPrinciples: FirstPrinciplesCoverage;
  searchIntent: SearchIntentCoverage;
  entityCoverage: EntityCoverage;
  topicCluster: TopicClusterResult;
  knowledgeSync: KnowledgeSyncResult;
  exampleCount: number;
  mistakeSectionCount: number;
  thinContentFlags: string[];
  actions: ContentAction[];
}

export interface GateCriterion {
  name: string;
  actual: number;
  limit: number;
  pass: boolean;
}

export interface GateResult {
  pass: boolean;
  criteria: GateCriterion[];
}
