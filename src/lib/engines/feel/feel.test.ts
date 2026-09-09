import { describe, it, expect, beforeEach, vi } from 'vitest';

import { vibrate } from './haptics';
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
} from './motion';
import { readFeelPrefs, writeFeelPrefs, type PrefsBag } from './prefs';
import { createFeelApi, DEFAULT_FEEL_PREFS, FEEL_HAPTICS, FEEL_PREF_KEYS, FEEL_TONES } from './registry';
import { playSound, resetSoundContext, resolveTone, unlockSound, type AudioContextLike } from './sound';

function memoryPrefs(seed: Record<string, unknown> = {}): PrefsBag & { store: Record<string, unknown> } {
  const store = { ...seed };
  return {
    store,
    get: (name, fallback) => (store[name] === undefined ? fallback : store[name]),
    set: (name, value) => {
      store[name] = value;
    },
  };
}

function fakeAudioContext(): AudioContextLike & {
  createOscillator: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
} {
  const osc = {
    type: 'sine',
    frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gain = {
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  };
  return {
    state: 'running',
    resume: vi.fn(async () => {}),
    currentTime: 0,
    createOscillator: vi.fn(() => osc),
    createGain: vi.fn(() => gain),
    destination: {},
  };
}

describe('feel prefs', () => {
  it('returns defaults when prefs are missing', () => {
    expect(readFeelPrefs(null)).toEqual(DEFAULT_FEEL_PREFS);
    expect(readFeelPrefs(undefined)).toEqual(DEFAULT_FEEL_PREFS);
  });

  it('reads feel.* keys from the prefs bag', () => {
    const prefs = memoryPrefs({
      [FEEL_PREF_KEYS.sound]: false,
      [FEEL_PREF_KEYS.haptics]: true,
      [FEEL_PREF_KEYS.motion]: 'reduced',
      [FEEL_PREF_KEYS.intensity]: 'high',
    });
    expect(readFeelPrefs(prefs)).toEqual({
      sound: false,
      haptics: true,
      motion: 'reduced',
      intensity: 'high',
      spinSpeed: 1,
    });
  });

  it('ignores junk values and keeps defaults for those fields', () => {
    const prefs = memoryPrefs({
      [FEEL_PREF_KEYS.sound]: 'maybe',
      [FEEL_PREF_KEYS.motion]: 'zoom',
      [FEEL_PREF_KEYS.intensity]: 'ultra',
    });
    expect(readFeelPrefs(prefs)).toEqual(DEFAULT_FEEL_PREFS);
  });

  it('writes a sanitized patch without throwing', () => {
    const prefs = memoryPrefs();
    const next = writeFeelPrefs(prefs, {
      haptics: true,
      sound: false,
      motion: 'full',
      intensity: 'low',
    });
    expect(next).toEqual({ sound: false, haptics: true, motion: 'full', intensity: 'low', spinSpeed: 1 });
    expect(prefs.store[FEEL_PREF_KEYS.haptics]).toBe(true);
    expect(prefs.store[FEEL_PREF_KEYS.sound]).toBe(false);
    expect(prefs.store[FEEL_PREF_KEYS.motion]).toBe('full');
    expect(prefs.store[FEEL_PREF_KEYS.intensity]).toBe('low');
  });

  it('survives a throwing prefs.set', () => {
    const prefs: PrefsBag = {
      get: () => undefined,
      set: () => {
        throw new Error('quota');
      },
    };
    expect(() => writeFeelPrefs(prefs, { sound: false })).not.toThrow();
  });
});

describe('feel motion', () => {
  it('honours full and reduced overrides', () => {
    expect(motionAllowed('full', true)).toBe(true);
    expect(motionAllowed('reduced', false)).toBe(false);
    expect(motionAllowed({ motion: 'full' }, true)).toBe(true);
  });

  it('follows the OS bit when motion is system', () => {
    expect(motionAllowed('system', false)).toBe(true);
    expect(motionAllowed('system', true)).toBe(false);
    expect(motionAllowed(DEFAULT_FEEL_PREFS, true)).toBe(false);
  });

  it('reads matchMedia safely when unavailable', () => {
    expect(systemPrefersReducedMotion(undefined)).toBe(false);
    expect(
      systemPrefersReducedMotion(() => {
        throw new Error('nope');
      }),
    ).toBe(false);
    expect(systemPrefersReducedMotion(() => ({ matches: true }))).toBe(true);
  });

  it('maps intensity to a scale and zeroes motionScale when reduced', () => {
    expect(intensityScale('low')).toBeLessThan(intensityScale('medium'));
    expect(intensityScale('high')).toBeGreaterThan(intensityScale('medium'));
    expect(motionScale({ motion: 'reduced', intensity: 'high' }, false)).toBe(0);
    expect(motionScale({ motion: 'full', intensity: 'medium' }, true)).toBe(1);
  });

  it('steps a spring toward the target and snaps when scale is 0', () => {
    let state = { value: 0, velocity: 0 };
    for (let i = 0; i < 120; i++) state = stepSpring(state, 1, {}, 1 / 60, 1);
    expect(state.value).toBeCloseTo(1, 2);
    expect(stepSpring({ value: 0.5, velocity: 2 }, 1, {}, 1 / 60, 0)).toEqual({
      value: 1,
      velocity: 0,
    });
  });

  it('decays momentum and integrates position', () => {
    const next = applyFriction(10, { friction: 0.9 }, 1 / 60, 1);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
    expect(applyFriction(10, {}, 1 / 60, 0)).toBe(0);
    expect(integratePosition(1, 2, 1/60)).toBeCloseTo(1 + 2/60, 6);
    expect(clampVelocity(100, 40, 1)).toBe(40);
    expect(clampVelocity(100, 40, 0)).toBe(0);
  });

  it('reads a quarter-turn around a hub and ignores a centre-crossing jump', () => {
    expect(hubDeltaAngle(40, 0, 0, 40, 0, 0)).toBeCloseTo(Math.PI / 2, 5);
    expect(hubDeltaAngle(40, 0, 0, -40, 0, 0)).toBeCloseTo(-Math.PI / 2, 5);
    expect(hubDeltaAngle(-40, 2, 40, 2, 0, 0)).toBe(0);
  });

  it('weights a flick so one swipe carries more than the last frame', () => {
    const samples = [
      { omega: 4, dt: 0.02 },
      { omega: 8, dt: 0.02 },
      { omega: 10, dt: 0.02 },
    ];
    expect(flickOmega(samples, 2)).toBeGreaterThan(10);
    expect(flickOmega([], 2)).toBe(0);
    const buf: { omega: number; dt: number }[] = [];
    pushFlickSample(buf, 5, 0.2, 0.1);
    expect(buf).toHaveLength(1);
  });

  it('runs a rAF loop until the callback returns false', () => {
    const frames: number[] = [];
    let id = 0;
    const queue: FrameRequestCallback[] = [];
    const loop = createRafLoop(
      (dt) => {
        frames.push(dt);
        return frames.length < 3;
      },
      {
        raf: (cb) => {
          queue.push(cb);
          return ++id;
        },
        caf: () => {},
        now: () => frames.length * 16,
      },
    );
    loop.start();
    expect(loop.running()).toBe(true);
    while (queue.length) {
      const cb = queue.shift()!;
      cb(frames.length * 16);
    }
    expect(frames.length).toBe(3);
    expect(loop.running()).toBe(false);
  });

  it('does not schedule frames when disabled', () => {
    const raf = vi.fn(() => 1);
    const loop = createRafLoop(() => true, { enabled: false, raf });
    loop.start();
    expect(raf).not.toHaveBeenCalled();
    expect(loop.running()).toBe(false);
  });
});

describe('feel haptics', () => {
  it('does not vibrate when haptics are off (default)', () => {
    const vibrateFn = vi.fn(() => true);
    expect(vibrate(20, { prefs: { haptics: false }, vibrateFn })).toBe(false);
    expect(vibrateFn).not.toHaveBeenCalled();
  });

  it('vibrates when opted in', () => {
    const vibrateFn = vi.fn(() => true);
    expect(vibrate(20, { prefs: { haptics: true }, vibrateFn })).toBe(true);
    expect(vibrateFn).toHaveBeenCalledWith(20);
  });

  it('swallows vibrate failures so callers keep running', () => {
    const vibrateFn = vi.fn(() => {
      throw new Error('no vibrator');
    });
    expect(vibrate([10, 20], { prefs: { haptics: true }, vibrateFn })).toBe(false);
  });

  it('rejects invalid patterns instead of calling vibrate', () => {
    const vibrateFn = vi.fn(() => true);
    expect(vibrate(-1, { prefs: { haptics: true }, vibrateFn })).toBe(false);
    expect(vibrate([], { prefs: { haptics: true }, vibrateFn })).toBe(false);
    expect(vibrateFn).not.toHaveBeenCalled();
  });
});

describe('feel sound', () => {
  beforeEach(() => {
    resetSoundContext();
  });

  it('resolves named tones and falls back on unknown ids', () => {
    expect(resolveTone('pop')).toEqual(FEEL_TONES.pop);
    expect(resolveTone('nope').frequency).toBe(FEEL_TONES.click.frequency);
  });

  it('stays silent when sound is muted', () => {
    const ctx = fakeAudioContext();
    expect(playSound('pop', { prefs: { sound: false }, context: ctx })).toBe(false);
    expect(ctx.createOscillator).not.toHaveBeenCalled();
  });

  it('schedules a tone when sound is on', () => {
    const ctx = fakeAudioContext();
    expect(playSound('click', { prefs: { sound: true }, context: ctx })).toBe(true);
    expect(ctx.createOscillator).toHaveBeenCalled();
    expect(ctx.createGain).toHaveBeenCalled();
  });

  it('returns false when AudioContext cannot be created', () => {
    expect(playSound('pop', { prefs: { sound: true }, createContext: () => null })).toBe(false);
  });

  it('plays grain as noise when the context can make a buffer', () => {
    const data = new Float32Array(8);
    const ctx = fakeAudioContext() as AudioContextLike & {
      createBuffer: ReturnType<typeof vi.fn>;
      createBufferSource: ReturnType<typeof vi.fn>;
      sampleRate: number;
    };
    ctx.sampleRate = 44100;
    ctx.createBuffer = vi.fn(() => ({
      getChannelData: () => data,
    }));
    const src = { buffer: null as unknown, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    ctx.createBufferSource = vi.fn(() => src);
    expect(FEEL_TONES.grain.type).toBe('noise');
    expect(playSound('grain', { prefs: { sound: true }, context: ctx })).toBe(true);
    expect(ctx.createBufferSource).toHaveBeenCalled();
    expect(src.start).toHaveBeenCalled();
  });

  it('unlocks a suspended context without throwing', () => {
    const ctx = fakeAudioContext();
    ctx.state = 'suspended';
    expect(() => unlockSound({ context: ctx })).not.toThrow();
    expect(ctx.resume).toHaveBeenCalled();
  });

  it('glides squish from a high blorp down to a low one', () => {
    const ctx = fakeAudioContext();
    expect(FEEL_TONES.squish.frequencyEnd).toBeLessThan(FEEL_TONES.squish.frequency);
    expect(playSound('squish', { prefs: { sound: true }, context: ctx })).toBe(true);
    const osc = ctx.createOscillator.mock.results[0].value as {
      frequency: { exponentialRampToValueAtTime: ReturnType<typeof vi.fn> };
    };
    expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
  });
});

describe('ToyTools.feel facade', () => {
  it('exposes prefs, motion helpers, play, vibrate and feedback', () => {
    const prefs = memoryPrefs();
    const feel = createFeelApi({ prefs });
    expect(feel.prefs()).toEqual(DEFAULT_FEEL_PREFS);
    feel.setPrefs({ haptics: true, sound: false, motion: 'reduced', intensity: 'high' });
    expect(feel.prefs()).toEqual({
      sound: false,
      haptics: true,
      motion: 'reduced',
      intensity: 'high',
      spinSpeed: 1,
    });
    feel.setPrefs({ spinSpeed: 1.6 });
    expect(feel.spinSpeed()).toBe(1.6);
    feel.setPrefs({ spinSpeed: 9 });
    expect(feel.spinSpeed()).toBe(2);
    expect(feel.motionAllowed()).toBe(false);
    expect(feel.motionScale()).toBe(0);
    expect(feel.intensityScale()).toBeGreaterThan(1);
    expect(feel.spring({ value: 0, velocity: 0 }, 1).value).toBe(1);
    expect(feel.friction(5)).toBe(0);
    expect(feel.play('pop')).toBe(false);
    expect(feel.vibrate(10)).toBe(false);
    expect(feel.feedback('click')).toEqual({ sound: false, haptic: false });
    expect(typeof feel.unlock).toBe('function');
    expect(Array.isArray(FEEL_HAPTICS.tick)).toBe(true);
    expect(Array.isArray(FEEL_HAPTICS.pop)).toBe(true);
    expect(Array.isArray(FEEL_HAPTICS.grain)).toBe(true);
    expect(Array.isArray(FEEL_HAPTICS.squish)).toBe(true);
  });
});
