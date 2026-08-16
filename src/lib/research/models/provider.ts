// Provider contracts. Every research source exposes the SAME interface: discover(ctx) → RawOpportunity[].
// Providers are pure and deterministic — they never call another provider, never write reports, and
// never read module globals. The seed-dataset provider reads curated evidence handed to it via the
// context (the CLI loads the JSON files; tests pass datasets inline) so the analyzer layer stays
// free of filesystem access and remains trivially testable.

import type { ProviderId, IntentKind, Difficulty } from '../constants';

/**
 * Evidence that a need is LATENT: real, but with no query behind it because nobody has a word for
 * it yet. Optional, and its absence is meaningful - a record without this block is an ordinary
 * demand-driven opportunity and the latent analyzer will not consider it at all.
 *
 * Authoring one of these is a claim that has to survive the anchor gate in latent-demand.ts: if no
 * structural silence in the catalog matches the proposal, it is reported as unanchored rather than
 * scored, however well written the prose here is.
 */
export interface LatentEvidence {
  /**
   * Why no established search term exists. "It is niche" is not an answer - niche needs still have
   * queries. The answer is usually that the thing has no name, or that the person does not yet know
   * the failure is possible.
   */
  whyUnnamed: string;
  /**
   * 0-100: what it costs when this need goes unmet AND the person does not notice. Latent tools earn
   * their build here rather than on traffic, so a silent, expensive, delayed failure scores high and
   * a mild inconvenience scores low.
   */
  consequence: number;
  /** What people are observed doing instead today. The behaviour that stands in for the query. */
  observedBehaviour: string[];
}

/** One curated evidence record inside research/datasets/<domain>.json. */
export interface SeedRecord {
  /** The originating user query / phrasing (used for searchQueries + the human-readable problem). */
  query: string;
  /** Plain-language statement of the user's problem. */
  problem: string;
  intent: IntentKind;
  /** The reusable transformation this problem implies (e.g. "CSV Diff"), engine-agnostic. */
  transformation: string;
  /** Proposed tool slug (kebab-case) — the deterministic opportunity id derives from this. */
  proposedTool: string;
  /** Engine slug this would reuse. If it is not a registered engine, it becomes a missing-engine. */
  proposedEngine: string;
  proposedName?: string;
  searchQueries: string[];
  existingSolutions?: string[];
  solutionWeaknesses?: string[];
  /**
   * Where a person using this tool fails MID-TASK, which is a different fact from
   * `solutionWeaknesses` and easy to conflate.
   *
   * `solutionWeaknesses` is about the market: "ad-supported", "dated UI", "single incumbent
   * dominates". It answers whether the SERP is beatable. This answers whether the tool has
   * anything of its own to offer once someone is using it: "pastes a data URI and gets a correct
   * rejection instead of the decode they wanted".
   *
   * It is the evidence a craft declaration is built from (see docs/analysis/2026-08-11-tool-craft.md).
   * Without it a recommendation can be fully justified on demand and still leave the builder with
   * nothing honest to declare, which is discovered only after the tool is scaffolded.
   *
   * Optional, and an empty list is a legitimate answer: it means no task-level failure is recorded
   * yet, and the roadmap says so rather than inventing one.
   */
  userFailures?: string[];
  relatedProblems?: string[];
  relatedTools?: string[];
  /** 0–100 raw demand signal (search volume proxy). */
  demand: number;
  /** 0–100 raw competition signal (higher = more/stronger incumbents). */
  competition: number;
  /** 0–100 how evergreen the need is (stable utility vs fad). Defaults high when omitted. */
  evergreen?: number;
  difficulty: Difficulty;
  /** Optional localization hint, 0–100 (language-independent tools score higher). */
  localization?: number;
  /**
   * 0–100: how well a DETERMINISTIC ALGORITHM (vs AI) solves this need. 100 = exact computation,
   * conversion, or simulation (ToyTools' home turf); low = the need really wants generation or
   * judgment, which a client-side static site cannot serve and AI chat is absorbing anyway.
   * Defaults high when omitted, since candidate utility tools are algorithmic by selection.
   */
  algorithmicFit?: number;
  /** Present when this record is a claim about latent demand. See LatentEvidence. */
  latent?: LatentEvidence;
}

/** A whole domain seed file. */
export interface SeedDataset {
  domain: string;
  records: SeedRecord[];
}

/** A provider's normalized-but-unscored output. Carries only evidence; the analyzers/scorers derive
 *  the rest. No provider-specific fields are allowed past this point. */
export interface RawOpportunity {
  source: ProviderId;
  query: string;
  problem: string;
  intent: IntentKind;
  transformation: string;
  proposedTool: string;
  proposedEngine: string;
  proposedName?: string;
  searchQueries: string[];
  existingSolutions: string[];
  solutionWeaknesses: string[];
  /** Task-level failures this tool's users hit. See RawRecord.userFailures. */
  userFailures: string[];
  relatedProblems: string[];
  relatedTools: string[];
  demand: number;
  competition: number;
  evergreen: number;
  difficulty: Difficulty;
  localization: number;
  algorithmicFit: number;
  /** Carried verbatim from the seed record; undefined for ordinary demand-driven opportunities. */
  latent?: LatentEvidence;
}

/** Read-only context handed to every provider. */
export interface ProviderContext {
  /** Seed evidence keyed by domain — populated by the CLI from research/datasets/*.json. */
  datasets: SeedDataset[];
  /** Current catalog tool slugs, so a provider could skip obvious duplicates (it does not have to). */
  existingSlugs: Set<string>;
}

/** The uniform provider interface. */
export interface Provider {
  id: ProviderId;
  discover(ctx: ProviderContext): RawOpportunity[];
}
