// Audio engine types — the EQ data model.
//
// Everything the equalizer does is derived from ONE array of gains plus ONE EqDefinition. The
// curve, the ledger, the explanations, the headroom warning, the share link and the share image
// are all functions of that pair, so there is no second copy of the state to fall out of sync.
//
// Every function in this engine is pure and never throws: a bad share link or an out-of-range
// gain comes back clamped or defaulted, because the alternative is a blank tool page.

/** The five regions of the spectrum a listener can actually name. */
export type EqRegionId = 'bass' | 'body' | 'mid' | 'presence' | 'air';

export interface EqRegion {
  id: EqRegionId;
  /** What a listener calls it: "Bass", "Body", "Presence". */
  name: string;
  /** Display range, e.g. "20-100 Hz". */
  range: string;
  /** One sentence, hedged: EQ perception depends on the recording and the headphones. */
  summary: string;
}

export interface EqBand {
  /** Stable id, used in the DOM and in saved state. */
  id: string;
  /** Centre frequency in Hz. */
  frequency: number;
  /** Display label, e.g. "2.4 kHz". */
  label: string;
  region: EqRegionId;
  /** What raising this band tends to do, in a listener's words. */
  boost: string;
  /** What lowering it tends to do. */
  cut: string;
}

/** Presets are starting points, never claims about what is optimal. */
export interface EqPreset {
  id: string;
  /** The goal, in the words someone searches with: "More Bass". */
  name: string;
  /** The personality: "The Basshead". */
  persona: string;
  /** What was changed and why, one or two sentences. */
  description: string;
  /**
   * `goal` presets answer "I want more of X" and lead the row; `vibe` presets answer
   * "I am doing X right now" and follow. Same shape, so the widget renders one list.
   */
  kind: 'goal' | 'vibe';
  /** dB per band, in the same order and length as the definition's `bands`. */
  gains: number[];
}

/**
 * One equalizer: its bands, its presets and its limits.
 *
 * A definition rather than constants so a second tool (a bass-preset browser, a 10-band variant)
 * is a new entry in the registry rather than a second widget. `processorId` in a tool's config
 * resolves to one of these.
 */
export interface EqDefinition {
  id: string;
  bands: EqBand[];
  presets: EqPreset[];
  /** Gain limits in dB, and the increment a control moves by. */
  minGain: number;
  maxGain: number;
  step: number;
}

/**
 * The headroom verdict for a set of gains.
 *
 * A heuristic about the SETTINGS, not an analysis of audio: no signal has been measured, so this
 * says what a boost risks rather than what it will do.
 */
export interface EqHeadroom {
  /** The largest positive gain, 0 when nothing is boosted. */
  peak: number;
  /** The preamp cut that gives those boosts room: the negative of the peak. */
  preamp: number;
  level: 'flat' | 'moderate' | 'high';
  /** Short label for the indicator, e.g. "Moderate boost". */
  label: string;
  /** The sentence a listener acts on, or '' when there is nothing worth saying. */
  advice: string;
}

/** A point on the response curve. `x` is 0..1 across the band axis, `y` is dB. */
export interface CurvePoint {
  x: number;
  y: number;
}

/** What changed at one band, for the live explanation line. */
export interface BandNote {
  bandId: string;
  /** "60 Hz, +5 dB" — also the text a screen reader announces. */
  heading: string;
  /** The hedged explanation of what that tends to do. */
  text: string;
}
