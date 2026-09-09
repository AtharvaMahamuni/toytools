// Sound cues — short Web Audio beeps, gated by the Feel sound pref.
//
// No media files: a pop / click / tick is an oscillator burst. Mute is independent of haptics
// (a Switch Board failure was that muting also killed vibration). Never throws.

import { FEEL_TONES, type FeelPrefs, type FeelSoundId, type FeelTone } from './types';
import { DEFAULT_FEEL_PREFS } from './types';

export type AudioBufferLike = {
  getChannelData: (channel: number) => Float32Array;
};

export type AudioContextLike = {
  state: string;
  resume: () => Promise<void>;
  currentTime: number;
  sampleRate?: number;
  createOscillator: () => {
    type: string;
    frequency: {
      setValueAtTime: (value: number, time: number) => void;
      exponentialRampToValueAtTime?: (value: number, time: number) => void;
    };
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
  createBuffer?: (channels: number, length: number, sampleRate: number) => AudioBufferLike;
  createBufferSource?: () => {
    buffer: unknown;
    connect: (dest: unknown) => void;
    start: (when?: number) => void;
    stop: (when?: number) => void;
  };
  createBiquadFilter?: () => {
    type: string;
    frequency: { setValueAtTime: (value: number, time: number) => void };
    Q?: { setValueAtTime: (value: number, time: number) => void };
    connect: (dest: unknown) => void;
  };
  destination: unknown;
};

export type AudioContextFactory = () => AudioContextLike | null;

let sharedCtx: AudioContextLike | null = null;
let noiseBuffer: AudioBufferLike | null = null;

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
    frequencyEnd:
      Number.isFinite(idOrTone.frequencyEnd) && (idOrTone.frequencyEnd as number) > 0
        ? idOrTone.frequencyEnd
        : undefined,
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

    if (tone.type === 'noise') {
      return playNoise(ctx, tone, peak);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = tone.type ?? 'sine';
    const t0 = ctx.currentTime;
    const startHz = Math.max(20, tone.frequency);
    osc.frequency.setValueAtTime(startHz, t0);
    if (
      tone.frequencyEnd &&
      tone.frequencyEnd > 0 &&
      typeof osc.frequency.exponentialRampToValueAtTime === 'function'
    ) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, tone.frequencyEnd), t0 + tone.duration);
    }
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

/**
 * Resume a suspended AudioContext on a user gesture. Safe to call on every pointerdown;
 * first cues after a backgrounded tab otherwise stay silent.
 */
export function unlockSound(
  opts: {
    context?: AudioContextLike | null;
    createContext?: AudioContextFactory | null;
  } = {},
): void {
  try {
    let ctx = opts.context ?? sharedCtx;
    if (!ctx) {
      const factory = opts.createContext ?? defaultFactory;
      ctx = factory();
      if (!ctx) return;
      if (!opts.context) sharedCtx = ctx;
    }
    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => { /* ignore */ });
    }
  } catch {
    /* ignore */
  }
}

function playNoise(ctx: AudioContextLike, tone: FeelTone, peak: number): boolean {
  if (typeof ctx.createBuffer !== 'function' || typeof ctx.createBufferSource !== 'function') {
    // Older fakes / browsers: a low rumble still reads as sand better than silence.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    const t0 = ctx.currentTime;
    osc.frequency.setValueAtTime(tone.frequency > 0 ? Math.min(180, tone.frequency) : 140, t0);
    gain.gain.setValueAtTime(Math.max(0.0001, peak * 0.7), t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + tone.duration + 0.01);
    return true;
  }

  const sr = ctx.sampleRate && ctx.sampleRate > 0 ? ctx.sampleRate : 44100;
  const length = Math.max(1, Math.floor(sr * 0.12));
  if (!noiseBuffer || (noiseBuffer as { length?: number }).length !== length) {
    noiseBuffer = fillPinkNoise(ctx.createBuffer(1, length, sr), length);
  }

  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;
  gain.gain.setValueAtTime(Math.max(0.0001, peak), t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + tone.duration);

  if (typeof ctx.createBiquadFilter === 'function') {
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(tone.frequency > 0 ? tone.frequency : 650, t0);
    if (filter.Q) filter.Q.setValueAtTime(0.9, t0);
    src.connect(filter);
    filter.connect(gain);
  } else {
    src.connect(gain);
  }
  gain.connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + tone.duration + 0.02);
  return true;
}

function fillPinkNoise(buffer: AudioBufferLike, length: number): AudioBufferLike {
  const data = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    data[i] = (b0 + b1 + b2 + w * 0.04) * 0.35;
  }
  return buffer;
}

/** Drop the cached AudioContext — used by tests so each suite starts clean. */
export function resetSoundContext(): void {
  sharedCtx = null;
  noiseBuffer = null;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
