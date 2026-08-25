// The shape of a generated X draft, shared by the generator and the card renderer.
//
// A draft is NOT a finished post. Every `fact` in it is derived from a registry field and is
// safe to publish as written; every `[[...]]` slot marks the connective prose the generator
// cannot write, because it is a judgement about what a reader already knows. The skill
// (.claude/skills/x-content/) is where those get filled in.

/** The four content types, in the order the strategy ranks them. */
export type DraftKind =
  /** A cluster thread: the topic explained, landing on the guide. The evergreen asset's front door. */
  | 'thread'
  /** One tool's craft touch: a specific failure mode, its cause, and what handles it. */
  | 'gotcha'
  /** A list of real problems in one area, published to measure which one people react to. */
  | 'probe'
  /** A ship note. Rate-limited on purpose: it is the least valuable thing the account can say. */
  | 'ship';

export interface DraftPost {
  /** 1-based position in a thread; 1 for a single post. */
  index: number;
  /** The post body as it would be published, slots included. */
  text: string;
  /** Where each factual claim came from, so a reviewer can check it without leaving the file. */
  sources: string[];
}

export interface Draft {
  id: string;
  kind: DraftKind;
  /** The tool or category the draft is about. */
  subject: string;
  /** The canonical URL this draft sends people to. Empty for a probe, which deliberately sends nobody anywhere. */
  landing: string;
  /** A one-line note on why this draft exists, shown in the queue. */
  rationale: string;
  posts: DraftPost[];
  /** Card template to render alongside, if any. */
  card?: { template: 'gotcha' | 'thread' | 'ship'; headline: string; body: string; eyebrow: string };
}

export interface ValidationIssue {
  draftId: string;
  postIndex: number;
  rule: string;
  detail: string;
}
