// Feedback system configuration — every tunable value in one place.
//
// The system is email-only and involves no third party at all. A static page cannot send an
// email: there is no browser API for it, SMTP needs credentials that would be public, and every
// hosted form endpoint is somebody else's server. So the page composes a structured message and
// hands it to the visitor's own mail client via a mailto: URL. They press Send.
//
// That constraint buys more than it costs. There is no endpoint to abuse, so no honeypot and no
// spam surface. Nothing can be delivered without a human deliberately sending it, so there is no
// risk of a test run or a script reaching the inbox. And the visitor reads the whole message,
// including anything attached from a tool, before it leaves their machine.
//
// Nothing here reads the DOM or the network; this module is safe to import from SSR, from vitest,
// and from an Astro frontmatter block.

// Destination address, kept in two halves and joined at runtime. A mailto: URL has to contain a
// real address, so it is inherently visible to anyone who looks; splitting it defeats the naive
// scrapers that harvest `text@text` patterns out of raw HTML and nothing more sophisticated.
// This is friction for bulk harvesters, not privacy, and it should not be mistaken for it.
const ADDRESS_LOCAL = 'atharvamahamunitemp';
const ADDRESS_DOMAIN = 'gmail.com';

/** The address feedback is addressed to. */
export function feedbackAddress(): string {
  return `${ADDRESS_LOCAL}@${ADDRESS_DOMAIN}`;
}

/**
 * Ceiling for a whole mailto: URL.
 *
 * Mail clients disagree about how much they will accept, and the historical floor is the Windows
 * shell's roughly 2,048-character command limit. Anything longer is silently truncated or simply
 * ignored, which would look like the button doing nothing. So the mailto body is trimmed to fit
 * while the full text stays available to copy: nothing the visitor wrote is ever lost, it just
 * may not all fit through the mail client.
 */
export const MAX_MAILTO_LENGTH = 1800;

/** Appended to a body that had to be shortened, so the truncation is never silent. */
export const TRUNCATION_NOTICE =
  '\n\n[This message was shortened to fit your mail app. Use "Copy message" on the page to send the full version.]';

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
