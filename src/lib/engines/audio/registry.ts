// Audio engine runtime namespace, attached to ToyTools.eq. Every function is pure and safe under
// Node (no browser globals at module top level), so the colocated tests and SSR both import it
// cleanly; `card.draw` takes a context the caller owns rather than reaching for one.
//
// An equalizer is a DEFINITION here, not a widget: bands, presets and limits as data, resolved by
// a tool's processorId. A ten-band variant or a headphone-specific preset browser is a new entry
// in this map plus a config, not a second copy of the curve maths.

import type { EqDefinition } from './types';
import { DEFAULT_BANDS, EQ_REGIONS, regionOf } from './bands';
import { DEFAULT_PRESETS, presetById, matchPreset } from './presets';
import { clampGains, curvePath, curvePoints, gainAt, gainForFrequency, EQ_VIEW } from './curve';
import { headroom, trimBoosts } from './headroom';
import { bandNote, customNote, presetNote } from './notes';
import { decodeGains, displayName, encodeGains, settingsText, shareValues } from './share';
import { CARD_SIZE, drawShareCard } from './card';

/**
 * -12 to +12 dB in whole steps: the range consumer players offer, and a step size that matches the
 * controls people are copying these numbers into. Half-decibel precision would be false precision
 * against a phone EQ with five bands.
 */
export const EQ_DEFINITIONS: Record<string, EqDefinition> = {
  'music-eq-7': {
    id: 'music-eq-7',
    bands: DEFAULT_BANDS,
    presets: DEFAULT_PRESETS,
    minGain: -12,
    maxGain: 12,
    step: 1,
  },
};

/** Never throws. An unknown id warns and falls back, because a blank tool page helps nobody. */
export function eqDefinition(id: string): EqDefinition {
  const def = EQ_DEFINITIONS[id];
  if (!def) {
    console.warn(`[audio] Unknown equalizer id "${id}"`);
    return EQ_DEFINITIONS['music-eq-7']!;
  }
  return def;
}

export const eq = {
  definition: eqDefinition,
  regions: EQ_REGIONS,
  regionOf,
  preset: presetById,
  match: matchPreset,
  clamp: clampGains,
  curve: curvePoints,
  path: curvePath,
  view: EQ_VIEW,
  gainAt,
  gainForFrequency,
  headroom,
  trim: trimBoosts,
  bandNote,
  presetNote,
  customNote,
  encode: encodeGains,
  decode: decodeGains,
  name: displayName,
  shareValues,
  text: settingsText,
  card: { size: CARD_SIZE, draw: drawShareCard },
};

export type AudioRuntime = typeof eq;
