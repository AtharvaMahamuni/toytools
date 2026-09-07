// Feel engine types. One cohesive surface for motion, sound and haptics.
//
// Research proposed separate "motion" and "haptics" engines for fidget tools. Shipping three
// half-engines (or even two) before any fidget exists would freeze the wrong seams: sound and
// haptics must be independently muteable (a Switch Board failure), motion must honour
// prefers-reduced-motion plus a user override (a Spinner failure), and every fidget shares the
// same prefs. One `feel` namespace owns all three so Pop It and friends call one API.

/** How motion should behave relative to the OS preference. */
export type FeelMotionPref = 'system' | 'full' | 'reduced';

/** How strong continuous motion and springs feel when motion is allowed. */
export type FeelIntensity = 'low' | 'medium' | 'high';

/** Cross-tool Feel preferences, stored under `toytools:prefs` as `feel.*` keys. */
export interface FeelPrefs {
  /** Play short UI cues. Default true; mute is one tap away on Settings. */
  sound: boolean;
  /**
   * Fire `navigator.vibrate`. Default false. Haptics are always opt-in. Desktop has no vibrator
   * and a rejected promise must never break a pop animation loop.
   */
  haptics: boolean;
  /** `system` follows prefers-reduced-motion; `full`/`reduced` override it. */
  motion: FeelMotionPref;
  /** Scales spring stiffness / momentum when motion is allowed. Default medium. */
  intensity: FeelIntensity;
}

/** Named cue ids fidgets can play without shipping audio assets. */
export type FeelSoundId = 'pop' | 'click' | 'tick' | 'soft';

export interface FeelTone {
  /** Oscillator frequency in Hz. */
  frequency: number;
  /** Duration in seconds. */
  duration: number;
  /** Peak gain 0..1 before the prefs volume scale. */
  gain?: number;
  type?: OscillatorType;
}

export const FEEL_PREF_KEYS = {
  sound: 'feel.sound',
  haptics: 'feel.haptics',
  motion: 'feel.motion',
  intensity: 'feel.intensity',
} as const;

export const DEFAULT_FEEL_PREFS: FeelPrefs = {
  sound: true,
  haptics: false,
  motion: 'system',
  intensity: 'medium',
};

/** Multipliers for spring / momentum helpers. */
export const FEEL_INTENSITY_SCALE: Record<FeelIntensity, number> = {
  low: 0.55,
  medium: 1,
  high: 1.35,
};

/** Built-in cues. Short, soft, and synthesised. No media files on the critical path. */
export const FEEL_TONES: Record<FeelSoundId, FeelTone> = {
  pop: { frequency: 380, duration: 0.045, gain: 0.18, type: 'sine' },
  click: { frequency: 720, duration: 0.025, gain: 0.12, type: 'triangle' },
  tick: { frequency: 1100, duration: 0.018, gain: 0.08, type: 'square' },
  soft: { frequency: 240, duration: 0.08, gain: 0.1, type: 'sine' },
};
