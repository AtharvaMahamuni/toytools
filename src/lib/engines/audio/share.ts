// Sharing: the URL, and the plain text someone pastes into a chat.
//
// The settings never leave the browser. A shared preset travels IN the link (and in the image),
// which is why the encoding is a readable list of numbers rather than a compressed blob: it is
// short enough already, and a link whose contents you can read is one you can trust to be nothing
// but seven gains.

import type { EqDefinition } from './types';
import { clampGains } from './curve';
import { headroom } from './headroom';
import { matchPreset } from './presets';

/**
 * "6_3_-1_0_0_0_1" — one signed integer per band, in band order.
 *
 * Underscore rather than the obvious comma because the query is built with URLSearchParams, which
 * form-encodes a comma to %2C and leaves `_` and `-` alone. The point of a readable encoding is
 * that the link stays readable once it is in the address bar, not just before it gets there.
 */
export function encodeGains(gains: number[]): string {
  return gains.join('_');
}

/** The inverse, tolerant of anything: a mangled link falls back to a flat EQ rather than a blank page. */
export function decodeGains(value: unknown, count: number, min: number, max: number): number[] {
  // Commas are accepted too, since a link retyped or reformatted by a chat client may arrive that way.
  const parts = typeof value === 'string' ? value.split(/[_,]/) : [];
  return clampGains(parts.map((p) => parseInt(p, 10)), count, min, max);
}

/** The display name for a set of gains: the preset it still matches, the name someone gave it, or nothing. */
export function displayName(def: EqDefinition, gains: number[], custom?: string): string {
  const trimmed = (custom ?? '').trim();
  if (trimmed) return trimmed.slice(0, 48);
  const preset = matchPreset(def.presets, gains);
  return preset ? preset.name : 'Custom EQ';
}

/** Query values for ToyTools.url.build. Empty name is omitted rather than sent blank. */
export function shareValues(gains: number[], name?: string): Record<string, string> {
  const values: Record<string, string> = { eq: encodeGains(gains) };
  const trimmed = (name ?? '').trim();
  if (trimmed) values.name = trimmed.slice(0, 48);
  return values;
}

/**
 * The settings as text, laid out so it survives being pasted anywhere.
 *
 * It carries the preamp line and the band caveat, because the two ways this text goes wrong for
 * its reader are applying big boosts with no preamp, and assuming their own player has these exact
 * seven bands.
 */
export function settingsText(def: EqDefinition, gains: number[], name: string, link?: string): string {
  const width = def.bands.reduce((m, b) => Math.max(m, b.label.length), 0) + 2;
  const rows = def.bands.map((b, i) => {
    const g = gains[i] ?? 0;
    return `${b.label.padEnd(width)}${g > 0 ? '+' : ''}${g} dB`;
  });
  const hr = headroom(gains);
  const lines = [`${name} - EQ settings`, '', ...rows];
  if (hr.peak > 0) lines.push(`${'Preamp'.padEnd(width)}${hr.preamp} dB`);
  lines.push('', 'Equalizers vary by app and device, so match the nearest band you have.');
  if (link) lines.push(link);
  return lines.join('\n');
}
