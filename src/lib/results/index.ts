// Result builders — small never-throw helpers every engine uses to assemble an InteractiveResult in
// a consistent shape (so the experience layer can rely on the invariants: metrics is always an array,
// uiState always set, hero echoed into metrics, etc.).

import type {
  InteractiveResult,
  ResultCard,
  UiState,
} from './types';

export * from './types';

/** The neutral empty state — what the experience layer renders before the user has entered enough. */
export function emptyResult(): InteractiveResult {
  return { ok: false, uiState: 'empty', metrics: [] };
}

/** A validation problem (a required input is missing or out of range). Distinct from a calc error so
 *  the UI can phrase it as "check your inputs" rather than "something went wrong". */
export function validationError(message: string): InteractiveResult {
  return { ok: false, uiState: 'validation-error', error: message, metrics: [] };
}

/** A computation failure (an unexpected/never-should-happen path). */
export function calculationError(message: string): InteractiveResult {
  return { ok: false, uiState: 'calculation-error', error: message, metrics: [] };
}

/** Assemble a successful result. `hero` is also surfaced as the first metric so a renderer that only
 *  reads `metrics` still shows the headline. */
export function successResult(
  parts: Omit<InteractiveResult, 'ok' | 'uiState' | 'metrics'> & { metrics?: ResultCard[] },
): InteractiveResult {
  const metrics = parts.metrics ?? [];
  return {
    ...parts,
    ok: true,
    uiState: 'success',
    metrics,
  };
}

/** Convenience card constructor. */
export function card(
  id: string,
  label: string,
  value: string,
  opts: Partial<Pick<ResultCard, 'raw' | 'emphasis' | 'note'>> = {},
): ResultCard {
  return { id, label, value, ...opts };
}

/** True for the terminal failure states. */
export function isError(state: UiState): boolean {
  return state === 'validation-error' || state === 'calculation-error';
}
