// Sound cues — short Web Audio beeps, gated by the Feel sound pref.
//
// No media files: a pop / click / tick is an oscillator burst. Mute is independent of haptics
// (a Switch Board failure was that muting also killed vibration). Never throws.

import { FEEL_TONES, type FeelPrefs, type FeelSoundId, type FeelTone } from './types';
import { DEFAULT_FEEL_PREFS } from './types';

export type AudioContextLike = {
  state: string;
  resume: () => Promise<void>;
  currentTime: number;
  createOscillator: () => {
    type: string;
    frequency: { setValueAtTime: (value: number, time: number) => void };
    connect: (dest: unknown) => void;
    start: (when?: number) => void;
    stop: (when?: number) => void;
  };
  createGain: () => {
    gain: {
      setValueAtTime: (value: number, time: number) => void;
      exponentialRampToValueAtTime: (value: number, time: number) => void;
    };
    connect: (dest: unknown) => void;
  };
  destination: unknown;
};

export type AudioContextFactory = () => AudioContextLike | null;

let sharedCtx: AudioContextLike | null = null;

function defaultFactory(): AudioContextLike | null {
  try {
    const g = globalThis as unknown as {
      AudioContext?: new () => AudioContextLike;
      webkitAudioContext?: new () => AudioContextLike;
    };
    const AC = g.AudioContext || g.webkitAudioContext;
    if (!AC) return null;
    return new AC();
  } catch {
    return null;
  }
}

/** Resolve a named cue or a custom tone. Unknown ids fall back to `click`. */
export function resolveTone(idOrTone: FeelSoundId | FeelTone | string): FeelTone {
  if (typeof idOrTone === 'string') {
    return FEEL_TONES[idOrTone as FeelSoundId] ?? FEEL_TONES.click;
  }
  return {
    frequency: Number.isFinite(idOrTone.frequency) ? idOrTone.frequency : 720,
    duration: Number.isFinite(idOrTone.duration) && idOrTone.duration > 0 ? idOrTone.duration : 0.025,
    gain: idOrTone.gain,
    type: idOrTone.type,
  };
}

/**
 * Play a short cue when sound is enabled. Returns whether playback was scheduled.
 * Failures (no AudioContext, autoplay policy, muted prefs) return false and never throw.
 */
export function playSound(
  idOrTone: FeelSoundId | FeelTone | string,
  opts: {
    prefs?: Pick<FeelPrefs, 'sound'> | null;
    context?: AudioContextLike | null;
    createContext?: AudioContextFactory | null;
    volume?: number;
  } = {},
): boolean {
  const enabled = opts.prefs?.sound ?? DEFAULT_FEEL_PREFS.sound;
  if (!enabled) return false;

  try {
    let ctx = opts.context ?? sharedCtx;
    if (!ctx) {
      const factory = opts.createContext ?? defaultFactory;
      ctx = factory();
      if (!ctx) return false;
      if (!opts.context) sharedCtx = ctx;
    }

    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => { /* ignore */ });
    }

    const tone = resolveTone(idOrTone);
    const volume = clamp01(opts.volume ?? 1);
    const peak = clamp01((tone.gain ?? 0.12) * volume);
    if (peak <= 0) return false;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type ?? 'sine';
    const t0 = ctx.currentTime;
    osc.frequency.setValueAtTime(tone.frequency, t0);
    gain.gain.setValueAtTime(Math.max(0.0001, peak), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + tone.duration + 0.01);
    return true;
  } catch {
    return false;
  }
}

/** Drop the cached AudioContext — used by tests so each suite starts clean. */
export function resetSoundContext(): void {
  sharedCtx = null;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
