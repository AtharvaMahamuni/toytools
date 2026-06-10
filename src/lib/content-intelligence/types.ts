// Content Intelligence Layer — data contracts. Build-time, registry-driven ecosystem analysis:
// coverage gaps, category health, engine expansion opportunities, topic clusters, and a ranked
// roadmap. No Search Console / Analytics / external APIs (the `signals` seam is reserved for a
// future phase). Every analyzer is a pure function over AnalyzerInputs — never reads globals.

import type { ToolConfig, Category } from '@data/types';
import type { EngineManifest } from '@data/engines';
import type { Knowledge, KnowledgeGraph } from '@lib/knowledge/types';

/** Bump when any report shape changes; stamped on index.json so schemas evolve cleanly. */
export const INTELLIGENCE_SCHEMA_VERSION = 1;

// ---- Expansion taxonomy (hierarchical, NOT a flat list) ---------------------
// engine → family → expected tool slugs. A small structured registry, edited as data.
export interface FamilyExpansion {
  family: string;
  expected: string[];
}
export interface EngineExpansion {
  engine: string;
  families: FamilyExpansion[];
}
export type ExpansionTaxonomy = EngineExpansion[];

// ---- Inputs -----------------------------------------------------------------
/** Reserved Phase-E2 seam: Search Console / Analytics signals keyed by slug. Unused in E1. */
export interface ExternalSignals {
  [slug: string]: { impressions?: number; clicks?: number; ctr?: number; position?: number };
}

export interface AnalyzerInputs {
  tools: ToolConfig[];
  categories: Category[];
  engines: EngineManifest[];
  graph: KnowledgeGraph;
  knowledge: Map<string, Knowledge>;
  taxonomy: ExpansionTaxonomy;
  signals?: ExternalSignals;
}

// ---- Report contracts -------------------------------------------------------
export interface TopicCoverage {
  tool: boolean;
  guide: boolean;
  faq: boolean;
  relatedTools: boolean;
  relatedGuides: boolean;
}
/** Keyed by tool slug — the "topic". */
export type CoverageReport = Record<string, TopicCoverage>;

export type GapKind = 'guide' | 'faq' | 'relatedTools' | 'relatedGuides' | 'knowledge';
export interface TopicGaps {
  slug: string;
  missing: GapKind[];
}
export interface ContentGaps {
  topics: TopicGaps[];
  missingTools: Array<{ engine: string; family: string; expected: string }>;
  categoriesMissingEngines: Array<{ category: string; engine: string }>;
}

export interface CategoryHealthEntry {
  slug: string;
  tools: number;
  guides: number;
  faqs: number;
  avgRelationships: number;
  coverageScore: number; // 0–100 composite
}
export type CategoryHealth = CategoryHealthEntry[];

export interface EngineOpportunity {
  engine: string;
  existing: string[];
  missingFamilyMembers: Array<{ family: string; expected: string }>;
  structuralSignals: string[];
}
export type EngineOpportunities = EngineOpportunity[];

export interface ClusterEntry {
  slug: string;
  clusterSize: number;
  relatedTopics: string[];
  missingConnections: string[];
}
export type TopicClusters = ClusterEntry[];

export type RecommendationReason =
  | 'missing-family-member'
  | 'weak-category'
  | 'orphan-cluster'
  | 'missing-guide'
  | 'missing-faq'
  | 'relationship-deficit';

export interface PriorityFactors {
  coverageGap: number;
  categoryImportance: number;
  engineExpansion: number;
  relationshipDeficiency: number;
}
export interface PriorityEntry {
  slug: string; // a tool slug, or "engine:family:expected" for a missing-tool opportunity
  score: number; // 0–1 weighted composite
  confidence: number; // 0–1, from how many independent signals back it
  reasons: RecommendationReason[];
  explanation: string[];
  factors: PriorityFactors;
}
export type RoadmapPriorities = PriorityEntry[]; // sorted desc by score

/** Platform-wide summary — "knowledge-diagnostics for the whole ecosystem". */
export interface EcosystemHealth {
  toolCount: number;
  guideCoverage: number; // %
  faqCoverage: number; // %
  relationshipDensity: number; // %
  orphanTopics: number;
  categoryHealth: number; // mean coverageScore, 0–100
  ecosystemScore: number; // blended 0–100
}

export interface IntelligenceReports {
  version: number;
  generatedAt: string;
  coverage: CoverageReport;
  gaps: ContentGaps;
  categoryHealth: CategoryHealth;
  engineOpportunities: EngineOpportunities;
  topicClusters: TopicClusters;
  roadmap: RoadmapPriorities;
  ecosystem: EcosystemHealth;
}
