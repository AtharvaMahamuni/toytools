// Delivery — turning a submission into something the visitor's mail client will open.
//
// There is no network call anywhere in this file, and no endpoint behind it. The only thing that
// leaves the browser is whatever the visitor's own mail app sends after they press Send, which
// means nothing here can deliver anything on its own. That removes an entire category of concern:
// no relay, no access key, no honeypot, no spam surface, and no way for a test run or a script to
// reach the inbox.
//
// Pure and synchronous. Given a submission it returns a mailto URL and the full text, and the
// caller decides what to do with them.

import { MAX_MAILTO_LENGTH, TRUNCATION_NOTICE, feedbackAddress } from './config';
import { composeBody, composeSubject, type FeedbackEnv, type FeedbackInput } from './templates';
import { validateFeedback, type ValidationResult } from './validate';

export interface ComposedFeedback {
  subject: string;
  /** The complete message. Always intact, whatever the mail client can cope with. */
  body: string;
  /** mailto: URL, with the body trimmed if it had to be. */
  mailto: string;
  address: string;
  /** True when the mailto body is shorter than `body`. */
  truncated: boolean;
}

/**
 * Build a mailto: URL that fits.
 *
 * Percent-encoding roughly triples the length of a body full of newlines, so the fitting has to
 * be measured on the encoded URL rather than the plain text. Trimming walks back to a line break
 * so the message never ends mid-sentence.
 */
export function buildMailtoUrl(
  subject: string,
  body: string,
  address: string,
  maxLength: number = MAX_MAILTO_LENGTH,
): { url: string; truncated: boolean } {
  const prefix = `mailto:${encodeURIComponent(address).replace('%40', '@')}?subject=${encodeURIComponent(subject)}&body=`;
  const full = prefix + encodeURIComponent(body);
  if (full.length <= maxLength) return { url: full, truncated: false };

  // Shrink the plain text until the encoded URL fits. Two things make this fiddlier than a slice:
  //
  //   - Encoded length is not proportional to character count. A newline costs three characters
  //     and an emoji up to twelve, so the fitting has to measure the encoded string each time
  //     rather than estimate from the plain one.
  //   - Trimming has to happen on whole code points. Cutting a string mid-emoji leaves a lone
  //     surrogate, and encodeURIComponent throws URIError on that. Given this form exists partly
  //     to collect bug reports about emoji handling, that is a certainty, not an edge case.
  const budget = maxLength - prefix.length - encodeURIComponent(TRUNCATION_NOTICE).length;
  const points = Array.from(body);
  let count = points.length;
  while (count > 0 && encodeURIComponent(points.slice(0, count).join('')).length > budget) {
    count -= Math.max(1, Math.ceil(count * 0.1));
  }
  let text = points.slice(0, Math.max(0, count)).join('');

  // Prefer ending on a line break, so the message stops at a section rather than mid-word.
  const lastBreak = text.lastIndexOf('\n');
  if (lastBreak > text.length * 0.5) text = text.slice(0, lastBreak);

  return {
    url: prefix + encodeURIComponent(text.trimEnd() + TRUNCATION_NOTICE),
    truncated: true,
  };
}

/** Compose the subject, the body, and the mailto URL for a submission. */
export function composeFeedback(
  input: FeedbackInput,
  env: FeedbackEnv,
  address: string = feedbackAddress(),
): ComposedFeedback {
  const subject = composeSubject(input);
  const body = composeBody(input, env);
  const { url, truncated } = buildMailtoUrl(subject, body, address);
  return { subject, body, mailto: url, address, truncated };
}

export type PrepareOutcome = 'ready' | 'invalid';

export interface PrepareResult {
  outcome: PrepareOutcome;
  validation: ValidationResult;
  composed: ComposedFeedback;
  /** Message suitable for showing the person who clicked the button. */
  message: string;
}

const READY_MESSAGE = 'Your message is ready. Send it from your email app, or copy it below.';
const INVALID_MESSAGE = 'Please complete the highlighted fields.';
const TRUNCATED_MESSAGE =
  'Your message is ready, but it was too long for some mail apps. If anything looks cut off, use Copy message instead.';

/**
 * Validate and compose. The composed message is returned either way, so a failed validation can
 * still show what was captured rather than throwing the answers away.
 */
export function prepareFeedback(input: FeedbackInput, env: FeedbackEnv): PrepareResult {
  const validation = validateFeedback(input);
  const composed = composeFeedback(input, env);

  if (!validation.ok) {
    return { outcome: 'invalid', validation, composed, message: INVALID_MESSAGE };
  }
  return {
    outcome: 'ready',
    validation,
    composed,
    message: composed.truncated ? TRUNCATED_MESSAGE : READY_MESSAGE,
  };
}
