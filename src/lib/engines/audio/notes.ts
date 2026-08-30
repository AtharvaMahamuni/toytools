// The live explanation line: what the thing you just moved tends to do.
//
// This is the teaching half of the tool, and it is deliberately one sentence attached to an action
// rather than a paragraph you read first. Move 60 Hz, find out what 60 Hz is for.
//
// Every claim is hedged, because it has to be: whether a boost at 6 kHz reads as detail or as
// harshness depends on the recording, the headphones and the listener. A tool that states those as
// facts is wrong for most of the people reading it.

import type { BandNote, EqBand, EqPreset } from './types';

/** At or above this, a single band is worth calling a large move. */
const LARGE = 8;

function signed(gain: number): string {
  return gain > 0 ? `+${gain} dB` : `${gain} dB`;
}

export function bandNote(band: EqBand, gain: number): BandNote {
  const heading = `${band.label}, ${gain === 0 ? '0 dB' : signed(gain)}`;

  if (gain === 0) {
    return {
      bandId: band.id,
      heading,
      text: `${band.label} is back at 0 dB, which leaves this part of the spectrum exactly as the recording has it.`,
    };
  }

  const direction = gain > 0 ? band.boost : band.cut;
  const size = Math.abs(gain) <= 2 ? 'A small move here tends to bring' : 'This tends to bring';
  const warning = gain >= LARGE
    ? ' A boost this large also eats headroom, so watch the preamp note under your settings.'
    : '';

  return {
    bandId: band.id,
    heading,
    text: `${signed(gain)} at ${band.label}. ${size} ${direction}.${warning}`,
  };
}

/** The explanation shown when a preset is loaded, before anything has been dragged. */
export function presetNote(preset: EqPreset): BandNote {
  return { bandId: '', heading: preset.name, text: preset.description };
}

/**
 * The explanation for a curve that is nobody's preset: someone's own edit, or a link they were
 * sent. Saying "every band at 0 dB" there, which is what the page ships with, would be describing
 * a different EQ from the one on screen.
 */
export function customNote(): BandNote {
  return {
    bandId: '',
    heading: 'Your own curve',
    text: 'This is your own curve rather than one of the presets. Move any band to find out what that part of the spectrum does, or load a starting point above.',
  };
}
