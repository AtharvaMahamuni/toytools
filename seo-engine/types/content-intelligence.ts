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

/**
 * How many of a tool's real query phrasings its page actually asks for, in a slot a search engine
 * weights (title, H1, an H2, the meta description) rather than in body prose.
 *
 * Measured by scripts/check-query-coverage.ts in the main repo and handed over in
 * seo-engine/cache/query-coverage.json, so the corpus is defined once. `known` is false when that
 * file is absent or has nothing for this tool, in which case the score is not gated: a missing
 * measurement must never read as a passing one.
 */
export interface QueryTargetingResult {
  known: boolean;
  score: number;
  found: number;
  total: number;
  /** Query phrasings the page never asks for. The content brief, in priority order. */
  missing: string[];
}

export interface ContentIntelligenceScore {
  overall: number;
  writingQuality: number;
  usefulness: number;
  seoCompleteness: number;
  topicClusterCompleteness: number;
  toyToolsStyleScore: number;
  queryTargeting: QueryTargetingResult;
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
