// Haptics — opt-in vibration that never breaks the caller.
//
// A recorded Pop It failure: "Haptics fire on desktop where there is no vibrator and the API
// rejection breaks the animation loop." So every path here returns false on skip/failure and
// swallows throws. Haptics stay off until the user opts in via Settings.

import type { FeelPrefs } from './types';
import { DEFAULT_FEEL_PREFS } from './types';

export type VibrateFn = (pattern: number | number[]) => boolean;

const DEFAULT_PATTERN = 12;

/**
 * Fire a short vibration when haptics are opted in. Returns whether a vibrate call was attempted
 * and reported success. Never throws — unsupported browsers, missing permission, or a rejected
 * call all become `false`.
 */
export function vibrate(
  pattern: number | number[] = DEFAULT_PATTERN,
  opts: {
    prefs?: Pick<FeelPrefs, 'haptics'> | null;
    vibrateFn?: VibrateFn | null;
  } = {},
): boolean {
  const enabled = opts.prefs?.haptics ?? DEFAULT_FEEL_PREFS.haptics;
  if (!enabled) return false;

  const vibrateFn =
    opts.vibrateFn ??
    (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
      ? (p: number | number[]) => navigator.vibrate(p)
      : null);

  if (!vibrateFn) return false;

  try {
    const normalized = normalizePattern(pattern);
    if (normalized === null) return false;
    return !!vibrateFn(normalized);
  } catch {
    return false;
  }
}

function normalizePattern(pattern: number | number[]): number | number[] | null {
  if (typeof pattern === 'number') {
    return Number.isFinite(pattern) && pattern >= 0 ? pattern : null;
  }
  if (!Array.isArray(pattern) || pattern.length === 0) return null;
  const out: number[] = [];
  for (const n of pattern) {
    if (!Number.isFinite(n) || n < 0) return null;
    out.push(n);
  }
  return out;
}
