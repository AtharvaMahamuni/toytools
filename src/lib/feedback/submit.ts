// Submission — composes the payload and hands it to the Web3Forms relay.
//
// Everything the inbox receives is built here from templates.ts, and only four fields go over
// the wire: the access key, the subject, a from-name, and the composed body. Web3Forms echoes
// every field it receives into the email, so keeping the payload minimal is what makes the
// email look identical every time instead of gaining a machine-generated field dump.
//
// This function never throws. A network failure is a returned result, not an exception,
// because the caller is an inline script with no error boundary.

import { isAnalyticsEnabled, readSignals, type AnalyticsSignals } from '@lib/analytics/guard';
import { HONEYPOT_FIELD, WEB3FORMS_ACCESS_KEY, WEB3FORMS_ENDPOINT } from './config';
import { composeBody, composeSubject, type FeedbackEnv, type FeedbackInput } from './templates';
import { validateFeedback, type ValidationResult } from './validate';

export type SubmitOutcome =
  /** Delivered to the relay. */
  | 'sent'
  /** Composed but deliberately not sent: no access key, or not a real production session. */
  | 'preview'
  /** A bot filled the honeypot. Swallowed silently so it looks like success. */
  | 'trapped'
  /** Required answers are missing. */
  | 'invalid'
  /** The relay was unreachable or refused the submission. */
  | 'error';

export interface SubmitResult {
  outcome: SubmitOutcome;
  /** The composed subject and body, always present so preview mode can show them. */
  subject: string;
  body: string;
  validation: ValidationResult;
  /** Message suitable for showing the person who clicked Send. */
  message: string;
}

export interface SubmitDeps {
  /** Injected for testing. Defaults to the global fetch. */
  fetchFn?: typeof fetch;
  /** Injected for testing. Defaults to the live environment. */
  signals?: AnalyticsSignals;
  /** Injected for testing. Defaults to the build-time key. */
  accessKey?: string;
  /** Contents of the hidden honeypot input. Non-empty means a bot filled it. */
  honeypot?: string;
}

/**
 * Whether a submission may actually leave the browser.
 *
 * This is the same "is this a real person on production" question the analytics guard already
 * answers, so it delegates rather than duplicating the four checks. It matters more here than
 * it does for analytics: the Playwright suite exercises this form on every pull request across
 * desktop and Pixel 5, and without this the inbox would receive a burst of test submissions on
 * every CI run.
 */
export function isSubmissionEnabled(signals: AnalyticsSignals): boolean {
  return isAnalyticsEnabled(signals);
}

/** The exact fields sent to the relay. Nothing else is transmitted. */
export function buildPayload(
  input: FeedbackInput,
  env: FeedbackEnv,
  accessKey: string,
): Record<string, string> {
  return {
    access_key: accessKey,
    subject: composeSubject(input),
    from_name: 'ToyTools Feedback',
    message: composeBody(input, env),
    [HONEYPOT_FIELD]: '',
  };
}

const SENT_MESSAGE = 'Thanks. That is genuinely useful.';
const PREVIEW_MESSAGE = 'Preview mode: composed but not sent.';
const INVALID_MESSAGE = 'Please complete the highlighted fields.';
const ERROR_MESSAGE = 'That did not send. Please try again in a moment.';

/**
 * Validate, compose, and submit. Returns the composed email either way, so preview mode can
 * display exactly what would have been delivered.
 */
export async function submitFeedback(
  input: FeedbackInput,
  env: FeedbackEnv,
  deps: SubmitDeps = {},
): Promise<SubmitResult> {
  const subject = composeSubject(input);
  const body = composeBody(input, env);
  const validation = validateFeedback(input);

  const base = { subject, body, validation };

  if (!validation.ok) {
    return { ...base, outcome: 'invalid', message: INVALID_MESSAGE };
  }

  // A real person never sees the honeypot, so anything in it came from a bot. Report success
  // so the bot has no signal to adapt to, and send nothing.
  if ((deps.honeypot ?? '').trim().length > 0) {
    return { ...base, outcome: 'trapped', message: SENT_MESSAGE };
  }

  const accessKey = deps.accessKey ?? WEB3FORMS_ACCESS_KEY;
  const signals = deps.signals ?? readSignals();

  if (!accessKey || !isSubmissionEnabled(signals)) {
    return { ...base, outcome: 'preview', message: PREVIEW_MESSAGE };
  }

  const doFetch = deps.fetchFn ?? (typeof fetch !== 'undefined' ? fetch : undefined);
  if (!doFetch) {
    return { ...base, outcome: 'error', message: ERROR_MESSAGE };
  }

  try {
    const response = await doFetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(input, env, accessKey)),
    });
    if (!response.ok) {
      return { ...base, outcome: 'error', message: ERROR_MESSAGE };
    }
    return { ...base, outcome: 'sent', message: SENT_MESSAGE };
  } catch {
    return { ...base, outcome: 'error', message: ERROR_MESSAGE };
  }
}
