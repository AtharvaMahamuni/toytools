// Feel prefs: pure read/merge over a bag of values. The runtime wires this to ToyTools.prefs;
// settings.astro writes the same keys directly so the control panel works before the feel chunk
// loads. Never throws.

import {
  DEFAULT_FEEL_PREFS,
  FEEL_PREF_KEYS,
  type FeelIntensity,
  type FeelMotionPref,
  type FeelPrefs,
} from './types';

export type PrefsBag = {
  get: (name: string, fallback?: unknown) => unknown;
  set: (name: string, value: unknown) => void;
};

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function asMotion(value: unknown, fallback: FeelMotionPref): FeelMotionPref {
  if (value === 'system' || value === 'full' || value === 'reduced') return value;
  return fallback;
}

function asIntensity(value: unknown, fallback: FeelIntensity): FeelIntensity {
  if (value === 'low' || value === 'medium' || value === 'high') return value;
  return fallback;
}

/** Resolve the current Feel prefs from a prefs bag (ToyTools.prefs or a test double). */
export function readFeelPrefs(prefs?: PrefsBag | null): FeelPrefs {
  if (!prefs || typeof prefs.get !== 'function') {
    return { ...DEFAULT_FEEL_PREFS };
  }
  try {
    return {
      sound: asBoolean(prefs.get(FEEL_PREF_KEYS.sound, DEFAULT_FEEL_PREFS.sound), DEFAULT_FEEL_PREFS.sound),
      haptics: asBoolean(
        prefs.get(FEEL_PREF_KEYS.haptics, DEFAULT_FEEL_PREFS.haptics),
        DEFAULT_FEEL_PREFS.haptics,
      ),
      motion: asMotion(
        prefs.get(FEEL_PREF_KEYS.motion, DEFAULT_FEEL_PREFS.motion),
        DEFAULT_FEEL_PREFS.motion,
      ),
      intensity: asIntensity(
        prefs.get(FEEL_PREF_KEYS.intensity, DEFAULT_FEEL_PREFS.intensity),
        DEFAULT_FEEL_PREFS.intensity,
      ),
    };
  } catch {
    return { ...DEFAULT_FEEL_PREFS };
  }
}

/** Merge a partial update into Feel prefs. Unknown fields are ignored; never throws. */
export function writeFeelPrefs(prefs: PrefsBag | null | undefined, patch: Partial<FeelPrefs>): FeelPrefs {
  const next: FeelPrefs = { ...readFeelPrefs(prefs), ...sanitizePatch(patch) };
  if (!prefs || typeof prefs.set !== 'function') return next;
  try {
    prefs.set(FEEL_PREF_KEYS.sound, next.sound);
    prefs.set(FEEL_PREF_KEYS.haptics, next.haptics);
    prefs.set(FEEL_PREF_KEYS.motion, next.motion);
    prefs.set(FEEL_PREF_KEYS.intensity, next.intensity);
  } catch {
    // private browsing / quota: callers still get the resolved next value
  }
  return next;
}

function sanitizePatch(patch: Partial<FeelPrefs>): Partial<FeelPrefs> {
  const out: Partial<FeelPrefs> = {};
  if (typeof patch.sound === 'boolean') out.sound = patch.sound;
  if (typeof patch.haptics === 'boolean') out.haptics = patch.haptics;
  if (patch.motion === 'system' || patch.motion === 'full' || patch.motion === 'reduced') {
    out.motion = patch.motion;
  }
  if (patch.intensity === 'low' || patch.intensity === 'medium' || patch.intensity === 'high') {
    out.intensity = patch.intensity;
  }
  return out;
}
