// Roadmap + next-build models. The roadmap analyzer ranks scored opportunities into tiers and emits
// a single, fully-reasoned "next build" recommendation — the artifact the next-tool skill/agent surfaces.

import type { RoadmapTier } from '../constants';

export interface RoadmapItem {
  id: string;
  proposedTool: string;
  title: string;
  finalScore: number;
  tier: RoadmapTier;
  engine: string;
  engineExists: boolean;
  reasons: string[];
}

/** Suggested supporting content for a recommended tool (data only — no prose generation). */
export interface ContentSuggestions {
  guides: string[];
  faqs: string[];
  internalLinks: string[];
  /** JSON-LD schema types the tool page should emit. */
  schema: string[];
}

/** The headline recommendation. Mirrors the spec's next-build.md shape. */
export interface NextBuild {
  id: string;
  proposedTool: string;
  title: string;
  finalScore: number;
  reason: string[];
  /** Why incumbent search results are weak. */
  incumbentWeakness: string[];
  /** Why ToyTools can compete. */
  whyWeCanWin: string[];
  engine: string;
  engineExists: boolean;
  /** Other tools the same engine unlocks next. */
  unlocksTools: string[];
  estimatedEffort: 'low' | 'medium' | 'high';
  estimatedSeoValue: 'low' | 'medium' | 'high';
  estimatedMaintenance: 'low' | 'medium' | 'high';
  content: ContentSuggestions;
  relatedTools: string[];
  relatedGuides: string[];
  relatedFaqs: string[];
}

export interface Roadmap {
  immediate: RoadmapItem[]; // top 10
  quickWins: RoadmapItem[]; // top 25 low-effort
  longTerm: RoadmapItem[];
  all: RoadmapItem[]; // up to 100, ranked
  nextBuild: NextBuild | null;
}
