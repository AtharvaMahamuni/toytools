// Feel runtime facade: the single object attached as ToyTools.feel.
//
// Fidget tools call this namespace; they never touch navigator.vibrate or AudioContext directly.
// Prefs are read fresh on every call so a Settings change applies without a reload.

import { vibrate as vibrateRaw } from './haptics';
import {
  applyFriction,
  clampVelocity,
  createRafLoop,
  flickOmega,
  hubDeltaAngle,
  integratePosition,
  intensityScale,
  motionAllowed,
  motionScale,
  pushFlickSample,
  stepSpring,
  systemPrefersReducedMotion,
  type FlickSample,
  type FrameCallback,
  type MomentumOpts,
  type SpringOpts,
  type SpringState,
} from './motion';
import { readFeelPrefs, writeFeelPrefs, type PrefsBag } from './prefs';
import { playSound as playSoundRaw, resetSoundContext, unlockSound } from './sound';
import {
  DEFAULT_FEEL_PREFS,
  FEEL_HAPTICS,
  FEEL_INTENSITY_SCALE,
  FEEL_PREF_KEYS,
  FEEL_TONES,
  clampSpinSpeed,
  formatSpinSpeed,
  type FeelPrefs,
  type FeelSoundId,
  type FeelTone,
} from './types';
import { breathingApi } from './breathing';
import { gearsApi } from './gears';
import { spinnerApi } from './spinner';
import { createTilt } from './tilt';

export type { FeelPrefs, FeelSoundId, FeelTone, PrefsBag, SpringState, SpringOpts, MomentumOpts, FlickSample };
export {
  DEFAULT_FEEL_PREFS,
  FEEL_HAPTICS,
  FEEL_INTENSITY_SCALE,
  FEEL_PREF_KEYS,
  FEEL_TONES,
  clampSpinSpeed,
  formatSpinSpeed,
  resetSoundContext,
  stepSpring,
  applyFriction,
  integratePosition,
  clampVelocity,
  createRafLoop,
  intensityScale,
  motionScale,
  hubDeltaAngle,
  flickOmega,
  pushFlickSample,
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
    /** Swipe-speed multiplier for gears and the spinner (0.05..2). */
    spinSpeed(): number {
      return clampSpinSpeed(prefsOf().spinSpeed);
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
    /** Signed angle change of a pointer around a hub. Filters centre-crossing jumps. */
    hubDelta(
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      cx: number,
      cy: number,
      minR?: number,
    ): number {
      return hubDeltaAngle(x0, y0, x1, y1, cx, cy, minR);
    },
    /** Weighted recent omega with a boost so one swipe can carry several rotations. */
    flick(samples: FlickSample[], boost?: number): number {
      return flickOmega(samples, boost);
    },
    /** Push a sample, dropping anything older than the flick window. */
    pushFlick(samples: FlickSample[], omega: number, dt: number, maxAge?: number): FlickSample[] {
      return pushFlickSample(samples, omega, dt, maxAge);
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
     * Play a named cue (`pop` | `click` | `tick` | `soft` | `grain` | `squish` | `metal` | `plastic`) or a custom tone.
     * Respects the sound pref; never throws.
     */
    play(idOrTone: FeelSoundId | FeelTone | string, volume?: number): boolean {
      return playSoundRaw(idOrTone, { prefs: prefsOf(), volume });
    },
    /** Resume audio on a user gesture so the next cue is not eaten by autoplay policy. */
    unlock(): void {
      unlockSound();
    },
    /** Convenience: sound + haptic in one call. Haptic length comes from the named cue unless overridden. */
    feedback(kind: FeelSoundId = 'pop', pattern?: number | number[]): {
      sound: boolean;
      haptic: boolean;
    } {
      const hapticPattern = pattern ?? FEEL_HAPTICS[kind] ?? 16;
      return {
        sound: playSoundRaw(kind, { prefs: prefsOf() }),
        haptic: vibrateRaw(hapticPattern, { prefs: prefsOf() }),
      };
    },
    gears: gearsApi,
    spinner: spinnerApi,
    breathing: breathingApi,
    /** Phone tilt. Kinetic Sand pours with it. No-op on desktop. */
    tilt: createTilt(),
  };
}

export type FeelApi = ReturnType<typeof createFeelApi>;

/**
 * Processor registry for fidget tools on the Feel engine. Keys are tool slugs.
 * The shared FeelWidget does not dispatch through this map yet; it exists so contract tests
 * and validate-registry can grow a def (layout, default latch) without a second widget.
 */
export const FEEL_TOOLS: Record<string, { id: string }> = {
  'pop-it': { id: 'pop-it' },
  'switch-board': { id: 'switch-board' },
  gears: { id: 'gears' },
  spinner: { id: 'spinner' },
  'kinetic-sand': { id: 'kinetic-sand' },
  slime: { id: 'slime' },
  'breathing-circle': { id: 'breathing-circle' },
};
