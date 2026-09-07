// Motion helpers: reduced-motion gate, intensity scale, springs, momentum, and rAF loops.
// Pure where possible so vitest does not need a browser. Never throws.

import type { FeelIntensity, FeelMotionPref, FeelPrefs } from './types';
import { DEFAULT_FEEL_PREFS, FEEL_INTENSITY_SCALE } from './types';

export interface SpringState {
  value: number;
  velocity: number;
}

export interface SpringOpts {
  /** Spring stiffness. Higher settles faster. Default 180. */
  stiffness?: number;
  /** Damping coefficient. Default 18. */
  damping?: number;
  /** Mass. Default 1. */
  mass?: number;
  /** Snap when close enough. Default 0.001. */
  restDelta?: number;
  /** Snap when velocity is near zero. Default 0.01. */
  restVelocity?: number;
}

export interface MomentumOpts {
  /** Per-second velocity decay factor in (0, 1]. Default 0.92. */
  friction?: number;
  /** Stop when |velocity| is below this. Default 0.01. */
  restVelocity?: number;
}

export type FrameCallback = (dt: number, now: number) => boolean | void;

export interface RafLoop {
  start: () => void;
  stop: () => void;
  /** Whether a frame is currently scheduled. */
  running: () => boolean;
}

/**
 * Whether continuous / decorative motion should run.
 *
 * - `full` always allows motion (user override).
 * - `reduced` always denies it.
 * - `system` follows the OS `prefers-reduced-motion: reduce` media query.
 */
export function motionAllowed(
  prefs: Pick<FeelPrefs, 'motion'> | FeelMotionPref | null | undefined,
  reducedMotionPreferred = false,
): boolean {
  const motion: FeelMotionPref =
    typeof prefs === 'string'
      ? prefs
      : (prefs && typeof prefs === 'object' && prefs.motion) || DEFAULT_FEEL_PREFS.motion;

  if (motion === 'full') return true;
  if (motion === 'reduced') return false;
  return !reducedMotionPreferred;
}

/** Read the OS preference. Safe under SSR / vitest. Returns false when matchMedia is missing. */
export function systemPrefersReducedMotion(
  matchMedia: ((query: string) => { matches: boolean }) | undefined = globalThis.matchMedia,
): boolean {
  try {
    if (typeof matchMedia !== 'function') return false;
    return !!matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Intensity multiplier used by springs and momentum. Unknown values fall back to medium. */
export function intensityScale(intensity: FeelIntensity | string | null | undefined): number {
  if (intensity === 'low' || intensity === 'medium' || intensity === 'high') {
    return FEEL_INTENSITY_SCALE[intensity];
  }
  return FEEL_INTENSITY_SCALE[DEFAULT_FEEL_PREFS.intensity];
}

/**
 * Combined motion scale for callers that want one number: 0 when reduced motion wins,
 * otherwise the intensity multiplier.
 */
export function motionScale(
  prefs: Pick<FeelPrefs, 'motion' | 'intensity'> | null | undefined,
  reducedMotionPreferred = false,
): number {
  if (!motionAllowed(prefs, reducedMotionPreferred)) return 0;
  return intensityScale(prefs?.intensity ?? DEFAULT_FEEL_PREFS.intensity);
}

/**
 * Semi-implicit Euler spring step. Pure. When `scale` is 0 the value snaps to the target and
 * velocity clears so reduced-motion callers still land on the end state.
 */
export function stepSpring(
  state: SpringState,
  target: number,
  opts: SpringOpts = {},
  dt = 1 / 60,
  scale = 1,
): SpringState {
  const value = Number.isFinite(state.value) ? state.value : 0;
  const velocity = Number.isFinite(state.velocity) ? state.velocity : 0;
  const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.064) : 1 / 60;

  if (!(scale > 0)) {
    return { value: target, velocity: 0 };
  }

  const stiffness = (opts.stiffness ?? 180) * scale;
  const damping = opts.damping ?? 18;
  const mass = opts.mass && opts.mass > 0 ? opts.mass : 1;
  const restDelta = opts.restDelta ?? 0.001;
  const restVelocity = opts.restVelocity ?? 0.01;

  const springForce = -stiffness * (value - target);
  const dampForce = -damping * velocity;
  const acceleration = (springForce + dampForce) / mass;
  const nextVelocity = velocity + acceleration * safeDt;
  const nextValue = value + nextVelocity * safeDt;

  if (Math.abs(nextValue - target) < restDelta && Math.abs(nextVelocity) < restVelocity) {
    return { value: target, velocity: 0 };
  }
  return { value: nextValue, velocity: nextVelocity };
}

/** Apply friction to a velocity. Scale 0 clears it (reduced motion). */
export function applyFriction(
  velocity: number,
  opts: MomentumOpts = {},
  dt = 1 / 60,
  scale = 1,
): number {
  if (!Number.isFinite(velocity)) return 0;
  if (!(scale > 0)) return 0;
  const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.064) : 1 / 60;
  const friction = clamp(opts.friction ?? 0.92, 0.0001, 1);
  // Raise friction toward 1 when intensity is lower so low feels softer without stalling instantly.
  const effective = Math.pow(friction, safeDt * 60 * Math.max(0.25, scale));
  const next = velocity * effective;
  const rest = opts.restVelocity ?? 0.01;
  return Math.abs(next) < rest ? 0 : next;
}

/** Integrate position with velocity. Pure. */
export function integratePosition(position: number, velocity: number, dt = 1 / 60): number {
  const p = Number.isFinite(position) ? position : 0;
  const v = Number.isFinite(velocity) ? velocity : 0;
  const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(dt, 0.064) : 1 / 60;
  return p + v * safeDt;
}

/**
 * Clamp a flick / drag velocity so a trackpad spike cannot launch a spinner forever.
 * `max` is scaled by intensity so "high" can go a bit further.
 */
export function clampVelocity(velocity: number, max = 40, scale = 1): number {
  if (!Number.isFinite(velocity)) return 0;
  const limit = Math.max(0, max) * Math.max(0, scale);
  if (limit === 0) return 0;
  return Math.min(limit, Math.max(-limit, velocity));
}

type Raf = (cb: FrameRequestCallback) => number;
type Caf = (id: number) => void;

/**
 * requestAnimationFrame loop with dt in seconds. The callback returns `false` to stop.
 * When `enabled` is false, the loop never schedules frames (caller should snap state itself).
 */
export function createRafLoop(
  onFrame: FrameCallback,
  opts: {
    enabled?: boolean;
    raf?: Raf;
    caf?: Caf;
    now?: () => number;
  } = {},
): RafLoop {
  const enabled = opts.enabled !== false;
  const raf: Raf =
    opts.raf ??
    (typeof requestAnimationFrame === 'function'
      ? (cb) => requestAnimationFrame(cb)
      : () => 0);
  const caf: Caf =
    opts.caf ??
    (typeof cancelAnimationFrame === 'function'
      ? (id) => cancelAnimationFrame(id)
      : () => {});
  const nowFn = opts.now ?? (() => (typeof performance !== 'undefined' ? performance.now() : Date.now()));

  let handle = 0;
  let last = 0;
  let active = false;

  const tick = (stamp: number) => {
    if (!active) return;
    const t = Number.isFinite(stamp) ? stamp : nowFn();
    const dt = last ? Math.min(0.064, Math.max(0, (t - last) / 1000)) : 1 / 60;
    last = t;
    let keepGoing = true;
    try {
      keepGoing = onFrame(dt, t) !== false;
    } catch {
      keepGoing = false;
    }
    if (keepGoing && active) {
      handle = raf(tick);
    } else {
      active = false;
      handle = 0;
      last = 0;
    }
  };

  return {
    start() {
      if (!enabled || active) return;
      active = true;
      last = 0;
      handle = raf(tick);
    },
    stop() {
      active = false;
      if (handle) caf(handle);
      handle = 0;
      last = 0;
    },
    running() {
      return active;
    },
  };
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}
