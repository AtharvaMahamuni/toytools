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
  /**
   * How far a gears / spinner swipe coasts. 0.5 is a short nudge, 2 is a long spin.
   * Also scales their tick sound and haptics. Default 1.
   */
  spinSpeed: number;
}

/** Named cue ids fidgets can play without shipping audio assets. */
export type FeelSoundId = 'pop' | 'click' | 'tick' | 'soft' | 'grain' | 'squish' | 'metal' | 'plastic';

export type FeelWave = OscillatorType | 'noise';

export interface FeelTone {
  /** Oscillator frequency in Hz. For `noise`, used as a bandpass centre when available. */
  frequency: number;
  /** Optional glide target in Hz. When set, the oscillator ramps from `frequency`. */
  frequencyEnd?: number;
  /** Duration in seconds. */
  duration: number;
  /** Peak gain 0..1 before the prefs volume scale. */
  gain?: number;
  type?: FeelWave;
}

export const FEEL_PREF_KEYS = {
  sound: 'feel.sound',
  haptics: 'feel.haptics',
  motion: 'feel.motion',
  intensity: 'feel.intensity',
  spinSpeed: 'feel.spinSpeed',
} as const;

export const DEFAULT_FEEL_PREFS: FeelPrefs = {
  sound: true,
  haptics: false,
  motion: 'system',
  intensity: 'medium',
  spinSpeed: 1,
};

export const SPIN_SPEED_MIN = 0.5;
export const SPIN_SPEED_MAX = 2;
export const SPIN_SPEED_STEP = 0.1;

/** Clamp the swipe-speed pref into the slider range. Junk becomes 1. */
export function clampSpinSpeed(value: unknown): number {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(n)) return DEFAULT_FEEL_PREFS.spinSpeed;
  return Math.min(SPIN_SPEED_MAX, Math.max(SPIN_SPEED_MIN, n));
}

/** Multipliers for spring / momentum helpers. */
export const FEEL_INTENSITY_SCALE: Record<FeelIntensity, number> = {
  low: 0.55,
  medium: 1,
  high: 1.35,
};

/** Built-in cues. Short, soft, and synthesised. No media files on the critical path. */
export const FEEL_TONES: Record<FeelSoundId, FeelTone> = {
  pop: { frequency: 380, duration: 0.055, gain: 0.22, type: 'sine' },
  click: { frequency: 720, duration: 0.032, gain: 0.16, type: 'triangle' },
  tick: { frequency: 980, duration: 0.028, gain: 0.14, type: 'square' },
  soft: { frequency: 240, duration: 0.1, gain: 0.14, type: 'sine' },
  grain: { frequency: 650, duration: 0.09, gain: 0.24, type: 'noise' },
  squish: { frequency: 320, frequencyEnd: 120, duration: 0.18, gain: 0.3, type: 'triangle' },
  metal: { frequency: 820, frequencyEnd: 240, duration: 0.05, gain: 0.24, type: 'square' },
  plastic: { frequency: 210, duration: 0.055, gain: 0.2, type: 'triangle' },
};

/**
 * Vibration patterns that register on a phone. Sub-15ms pulses are commonly swallowed, which
 * is why the old 8-12ms defaults felt like silence even with haptics on.
 */
export const FEEL_HAPTICS: Record<FeelSoundId, number | number[]> = {
  pop: [12, 16, 40],
  click: [10, 18, 32],
  tick: [20, 12, 26],
  soft: [20, 24, 44, 28],
  grain: [12, 8, 20, 10, 28, 12, 18],
  squish: [18, 14, 36, 16, 48, 20, 28],
  metal: [8, 12, 30],
  plastic: [14, 12, 24],
};
