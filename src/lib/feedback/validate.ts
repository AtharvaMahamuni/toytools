// Submission validation — deliberately minimal.
//
// The four-question form is itself the quality filter: anyone willing to describe their goal,
// their current workflow, and what frustrates them is giving a useful answer by construction.
// So the rules here only catch genuine accidents (an empty required field, a one-word answer)
// and never punish someone for being concise. There is no rate limiting, no quota, no
// duplicate detection, and no stored submission history anywhere in this system.

import { MIN_ANSWER_LENGTH } from './config';
import { fieldsForType, type FeedbackInput } from './templates';

export interface ValidationResult {
  ok: boolean;
  /** Field id → message. Empty when the submission is fine. */
  errors: Record<string, string>;
}

const BLANK_MESSAGE = 'Please fill this in.';
const SHORT_MESSAGE = 'A little more detail would help.';

/**
 * Check a submission. Only fields the selected type actually asks for are considered, so
 * switching type never leaves a stale error on a field that is no longer on screen.
 */
export function validateFeedback(input: FeedbackInput): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field of fieldsForType(input.type)) {
    if (!field.required) continue;

    const answer = (input.values[field.id] ?? '').trim();
    if (answer.length === 0) {
      errors[field.id] = BLANK_MESSAGE;
      continue;
    }

    // A tool name is legitimately short ("JWT"), so the length floor applies only to the
    // free-text answers where a single word tells us nothing.
    if (field.control === 'textarea' && answer.length < MIN_ANSWER_LENGTH) {
      errors[field.id] = SHORT_MESSAGE;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
