/**
 * Reddit Intelligence types.
 *
 * Reddit is an *intent discovery* source, never a content source. These shapes
 * carry only research signals — classified, clustered, normalized title phrases
 * and engagement counts — never reproducible Reddit prose. See scripts/reddit.ts
 * and the "signals not content" rule in README.md.
 */

/** A single collected Reddit post. Engagement fields are present only on the
 *  JSON path; the `site:reddit.com` SERP fallback leaves them undefined. */
export interface RedditPost {
  title: string;
  subreddit: string;
  url: string;
  score?: number;
  comments?: number;
}

/** Question-intent taxonomy used to structure FAQ/guide/GEO generation. */
export type QuestionCategory =
  | 'definition'
  | 'comparison'
  | 'troubleshooting'
  | 'security'
  | 'example'
  | 'usage'
  | 'implementation';

/**
 * One clustered signal. The same shape is used for every bucket so consumers
 * (audit, scaffold, scoring) read one field set. For the question bucket,
 * `topic` holds the canonical question text.
 */
export interface RedditSignal {
  /** Canonical, title-cased cluster label. */
  topic: string;
  /** Number of posts that fell into this cluster. */
  frequency: number;
  /** Σ(score + comments) across the cluster — 0 when engagement is unavailable. */
  engagement: number;
  /** ≤3 representative raw titles. Research-tier transparency only; never published. */
  examples: string[];
  /** Question-intent category (questions bucket only). */
  category?: QuestionCategory;
}

/**
 * The full Reddit intelligence block merged into ResearchDocument. Every field
 * is always written (empty array / 0) so downstream readers stay branch-free.
 */
export interface RedditResearch {
  redditQuestions: RedditSignal[];
  redditPainPoints: RedditSignal[];
  redditUseCases: RedditSignal[];
  redditComparisons: RedditSignal[];
  redditTerminology: RedditSignal[];
  redditMisconceptions: RedditSignal[];

  /** Post count per subreddit, for audience/positioning insight. */
  subredditBreakdown: Record<string, number>;
  /** Inferred audience labels (developer, student, professional, writer…). */
  audienceTypes: string[];

  /** 0–100 roadmap signal blending frequency, engagement, breadth, pain. */
  redditDemandScore: number;
  /** Ranked authoring targets: frequency + engagement + competitor-gap bonus. */
  contentOpportunities: { topic: string; score: number }[];

  /** Posts analyzed and confidence in conclusions drawn from them (0–1). */
  sampleSize: number;
  dataConfidence: number;

  /** 0–100, original 5-axis spec score (+20 per non-empty intent axis). */
  redditIntentScore: number;
}
