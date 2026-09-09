// Named breathing presets. The tool must not label a pattern "calm" when it is something else.

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

export interface BreathPreset {
  id: string;
  name: string;
  pattern: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
}

export const BREATH_PRESETS: BreathPreset[] = [
  { id: 'box', name: 'Box', pattern: '4-4-4-4', inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  { id: '4-7-8', name: '4-7-8', pattern: '4-7-8', inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
  { id: 'coherent', name: 'Coherent', pattern: '5-5', inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
];

export const DEFAULT_BREATH_PRESET = BREATH_PRESETS[0];

export function presetById(id: string | null | undefined): BreathPreset {
  return BREATH_PRESETS.find((p) => p.id === id) ?? DEFAULT_BREATH_PRESET;
}

export function cycleLength(preset: BreathPreset): number {
  return preset.inhale + preset.holdIn + preset.exhale + preset.holdOut;
}

export interface BreathState {
  phase: BreathPhase;
  remaining: number;
  elapsedInPhase: number;
  cycle: number;
  /** 1 at rest, up to 1.28 at full inhale. */
  scale: number;
  done: boolean;
}

const PHASES: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

export function phaseAt(elapsed: number, preset: BreathPreset, cycles = Infinity): BreathState {
  const total = cycleLength(preset);
  if (!(total > 0) || !Number.isFinite(elapsed) || elapsed < 0) {
    return { phase: 'inhale', remaining: preset.inhale, elapsedInPhase: 0, cycle: 0, scale: 1, done: false };
  }
  const cycle = Math.floor(elapsed / total);
  if (cycle >= cycles) {
    return { phase: 'exhale', remaining: 0, elapsedInPhase: preset.exhale, cycle: cycles, scale: 1, done: true };
  }
  let t = elapsed - cycle * total;
  for (const phase of PHASES) {
    const dur = preset[phase];
    if (dur <= 0) continue;
    if (t < dur) {
      const remaining = dur - t;
      const scale = scaleFor(phase, t / dur);
      return { phase, remaining, elapsedInPhase: t, cycle, scale, done: false };
    }
    t -= dur;
  }
  return { phase: 'inhale', remaining: preset.inhale, elapsedInPhase: 0, cycle, scale: 1, done: false };
}

function scaleFor(phase: BreathPhase, u: number): number {
  const t = Math.min(1, Math.max(0, u));
  if (phase === 'inhale') return 1 + 0.28 * t;
  if (phase === 'holdIn') return 1.28;
  if (phase === 'exhale') return 1.28 - 0.28 * t;
  return 1;
}

export const FADE_SECONDS = 1.5;

export const breathingApi = {
  BREATH_PRESETS,
  DEFAULT_BREATH_PRESET,
  presetById,
  cycleLength,
  phaseAt,
  FADE_SECONDS,
};
