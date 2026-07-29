// Feedback system configuration — every tunable value in one place.
//
// The feedback system is email-first and fully static: the browser composes a structured
// message and hands it to Web3Forms, which relays it to the inbox. There is no backend,
// no database, and no stored state of any kind.
//
// Nothing here reads the DOM or the network; this module is safe to import from SSR,
// from vitest, and from an Astro frontmatter block.

/** Web3Forms relay endpoint. The browser POSTs a plain form payload here. */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Public access key. It is *meant* to be visible in the page HTML — the key only permits
 * submitting, never reading, and the real protection is the domain allow-list configured
 * in the Web3Forms dashboard. When it is absent the form runs in preview mode (composes
 * the email and shows it) so local development can never reach the inbox.
 */
export const WEB3FORMS_ACCESS_KEY: string = import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '';

/**
 * Web3Forms' built-in honeypot field name. A real person never sees it; bots fill every
 * input they find, and Web3Forms drops any submission where it is non-empty. This is the
 * only anti-abuse measure in the system, and it costs a human nothing.
 */
export const HONEYPOT_FIELD = 'botcheck';

/** Subject-line prefix. Every email starts with this, so one Gmail filter catches them all. */
export const SUBJECT_PREFIX = '[ToyTools]';

/** Separator between subject segments. */
export const SUBJECT_SEPARATOR = ' · ';

/** Longest derived subject label, so subject lines stay scannable in a mail list. */
export const MAX_SUBJECT_LABEL = 40;

/** Opt-in reproduction data is truncated to this many characters before sending. */
export const MAX_CAPTURED_INPUT = 500;

/**
 * Minimum length for a required free-text answer. Low on purpose: the four-question form
 * is already a far stronger quality filter than any character count, and a hard floor
 * only ever punishes someone being concise.
 */
export const MIN_ANSWER_LENGTH = 10;

/** The four kinds of submission. `id` is internal, `token` appears in the email subject. */
export type FeedbackType = 'new-tool' | 'improve' | 'bug' | 'general';

export interface FeedbackTypeDef {
  id: FeedbackType;
  /** Segmented-control label. */
  label: string;
  /** Uppercase token in the email subject — what Gmail filters match on. */
  token: string;
  /** Human-readable name printed as the email's "Feedback Type". */
  emailLabel: string;
}

export const FEEDBACK_TYPES: readonly FeedbackTypeDef[] = [
  { id: 'new-tool', label: 'Suggest a New Tool',       token: 'IDEA',        emailLabel: 'New Tool Suggestion' },
  { id: 'improve',  label: 'Improve an Existing Tool', token: 'IMPROVEMENT', emailLabel: 'Improvement' },
  { id: 'bug',      label: 'Report a Bug',             token: 'BUG',         emailLabel: 'Bug Report' },
  { id: 'general',  label: 'General Feedback',         token: 'FEEDBACK',    emailLabel: 'General Feedback' },
] as const;

export const DEFAULT_FEEDBACK_TYPE: FeedbackType = 'new-tool';

/** Look up a type definition, falling back to the default for an unknown id. */
export function feedbackType(id: string): FeedbackTypeDef {
  return FEEDBACK_TYPES.find(t => t.id === id)
    ?? FEEDBACK_TYPES.find(t => t.id === DEFAULT_FEEDBACK_TYPE)!;
}

/**
 * Engines whose input may be a secret. On these tools the "include my input so the issue
 * can be reproduced" checkbox is not rendered at all — not disabled, not hidden, absent.
 * Someone debugging a JWT decoder is holding a bearer token; the reproduction value is
 * never worth the risk of relaying it.
 */
export const SENSITIVE_ENGINES: readonly string[] = ['jwt', 'hashing', 'encoding'];

/** Patterns whose output is a credential, regardless of which engine produced it. */
export const SENSITIVE_PATTERNS: readonly string[] = ['generate-credential'];

/**
 * Whether the reproduction opt-in may be offered for a tool. Derived from the registry's
 * engine/pattern metadata rather than a hand-maintained slug list, so a new hashing or
 * credential tool is covered the day it ships without anyone remembering to add it.
 */
export function allowsInputCapture(engine?: string, pattern?: string): boolean {
  if (engine && SENSITIVE_ENGINES.includes(engine)) return false;
  if (pattern && SENSITIVE_PATTERNS.includes(pattern)) return false;
  return true;
}
