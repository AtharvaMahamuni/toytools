// Feel runtime facade: the single object attached as ToyTools.feel.
//
// Fidget tools call this namespace; they never touch navigator.vibrate or AudioContext directly.
// Prefs are read fresh on every call so a Settings change applies without a reload.

import { vibrate as vibrateRaw } from './haptics';
import {
  applyFriction,
  clampVelocity,
  createRafLoop,
  integratePosition,
  intensityScale,
  motionAllowed,
  motionScale,
  stepSpring,
  systemPrefersReducedMotion,
  type FrameCallback,
  type MomentumOpts,
  type SpringOpts,
  type SpringState,
} from './motion';
import { readFeelPrefs, writeFeelPrefs, type PrefsBag } from './prefs';
import { playSound as playSoundRaw, resetSoundContext } from './sound';
import {
  DEFAULT_FEEL_PREFS,
  FEEL_INTENSITY_SCALE,
  FEEL_PREF_KEYS,
  FEEL_TONES,
  type FeelPrefs,
  type FeelSoundId,
  type FeelTone,
} from './types';

export type { FeelPrefs, FeelSoundId, FeelTone, PrefsBag, SpringState, SpringOpts, MomentumOpts };
export {
  DEFAULT_FEEL_PREFS,
  FEEL_INTENSITY_SCALE,
  FEEL_PREF_KEYS,
  FEEL_TONES,
  resetSoundContext,
  stepSpring,
  applyFriction,
  integratePosition,
  clampVelocity,
  createRafLoop,
  intensityScale,
  motionScale,
};

type RuntimePrefs = PrefsBag | null | undefined;

function bagFrom(TT: { prefs?: PrefsBag } | null | undefined): RuntimePrefs {
  return TT?.prefs ?? null;
}

/**
 * Build the Feel API bound to a ToyTools-like host (needs `.prefs`). Exported for tests; the
 * attach module installs the result as `ToyTools.feel`.
 */
export function createFeelApi(host: { prefs?: PrefsBag }) {
  const prefsOf = () => readFeelPrefs(bagFrom(host));
  const reduced = () => systemPrefersReducedMotion();
  const scaleOf = () => motionScale(prefsOf(), reduced());

  return {
    /** Current Feel prefs (fresh from storage each call). */
    prefs(): FeelPrefs {
      return prefsOf();
    },
    /** Merge and persist Feel prefs. Returns the resolved next value. */
    setPrefs(patch: Partial<FeelPrefs>): FeelPrefs {
      return writeFeelPrefs(bagFrom(host), patch);
    },
    /**
     * Whether decorative / continuous motion should run right now.
     * Honours the user override and prefers-reduced-motion.
     */
    motionAllowed(): boolean {
      return motionAllowed(prefsOf(), reduced());
    },
    /** 0 when reduced motion wins; otherwise the intensity multiplier (low/medium/high). */
    motionScale(): number {
      return scaleOf();
    },
    /** Intensity multiplier only (ignores reduced-motion). */
    intensityScale(): number {
      return intensityScale(prefsOf().intensity);
    },
    /** One spring step toward `target`. Uses the live motion scale. */
    spring(state: SpringState, target: number, opts?: SpringOpts, dt?: number): SpringState {
      return stepSpring(state, target, opts, dt, scaleOf());
    },
    /** Decay a velocity with friction, scaled by intensity / reduced-motion. */
    friction(velocity: number, opts?: MomentumOpts, dt?: number): number {
      return applyFriction(velocity, opts, dt, scaleOf());
    },
    /** Integrate position with velocity (pure; not gated). */
    integrate(position: number, velocity: number, dt?: number): number {
      return integratePosition(position, velocity, dt);
    },
    /** Clamp a flick velocity using the live motion scale. */
    clampVelocity(velocity: number, max?: number): number {
      return clampVelocity(velocity, max, scaleOf());
    },
    /**
     * rAF loop that no-ops when motion is disallowed. Callback returns false to stop.
     * Re-checks prefs on start only; stop and start again after a Settings change.
     */
    raf(onFrame: FrameCallback) {
      return createRafLoop(onFrame, { enabled: motionAllowed(prefsOf(), reduced()) });
    },
    /**
     * Opt-in vibration. No-op (returns false) when haptics are off, unsupported, or throw.
     * Never rejects: safe to call inside an animation frame.
     */
    vibrate(pattern?: number | number[]): boolean {
      return vibrateRaw(pattern, { prefs: prefsOf() });
    },
    /**
     * Play a named cue (`pop` | `click` | `tick` | `soft`) or a custom tone.
     * Respects the sound pref; never throws.
     */
    play(idOrTone: FeelSoundId | FeelTone | string, volume?: number): boolean {
      return playSoundRaw(idOrTone, { prefs: prefsOf(), volume });
    },
    /** Convenience: sound + optional haptic in one call for a pop/click gesture. */
    feedback(kind: FeelSoundId = 'pop', pattern: number | number[] = 12): {
      sound: boolean;
      haptic: boolean;
    } {
      return {
        sound: playSoundRaw(kind, { prefs: prefsOf() }),
        haptic: vibrateRaw(pattern, { prefs: prefsOf() }),
      };
    },
  };
}

export type FeelApi = ReturnType<typeof createFeelApi>;

/**
 * Processor registry placeholder. Fidget tools will register defs here the way trackers and EQ
 * definitions do; empty until Pop It lands. Declared so validate-registry can grow an entry later.
 */
export const FEEL_TOOLS: Record<string, { id: string }> = {};
