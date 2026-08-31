// Goal and vibe presets. Data only: the widget never knows what "more bass" means, it just loads
// the gains and prints the description.
//
// Every one of these is a STARTING POINT. What a boost at 60 Hz actually does depends on the
// recording, the headphones and the room, so the descriptions say "tends to" and "can", and the
// tool says so on the page too. None of these is claimed to be optimal for anything.

import type { EqPreset } from './types';

/** Gains are dB per band in DEFAULT_BANDS order: 60, 150, 400, 1k, 2.4k, 6k, 15k. */
export const DEFAULT_PRESETS: EqPreset[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    persona: 'Flat',
    kind: 'goal',
    description: 'Every band at 0 dB, which is your player untouched. Start here when you want to hear what a change actually did.',
    gains: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: 'more-bass',
    name: 'More Bass',
    persona: 'The Basshead',
    kind: 'goal',
    description: 'A firm lift at 60 Hz for low-end weight, a smaller one at 150 Hz to keep it from sounding hollow, and a slight cut at 400 Hz so the extra bass reads as depth rather than mud.',
    gains: [6, 3, -1, 0, 0, 0, 1],
  },
  {
    id: 'clear-vocals',
    name: 'Clear Vocals',
    persona: 'Front Row',
    kind: 'goal',
    description: 'Presence raised at 2.4 kHz, where a voice is most forward, with the low mids pulled back to get the instruments out of its way. Vocals tend to move closer without the whole track getting louder.',
    gains: [-1, -2, -2, 1, 3, 2, 1],
  },
  {
    id: 'more-punch',
    name: 'More Punch',
    persona: 'Impact',
    kind: 'goal',
    description: 'Weight at 60 Hz paired with a lift at 2.4 kHz, so a kick has both its body and its click. The 400 Hz cut is what keeps the two ends distinct instead of blurred together.',
    gains: [4, 1, -2, 0, 2, 1, 0],
  },
  {
    id: 'more-detail',
    name: 'More Detail',
    persona: 'Crystal',
    kind: 'goal',
    description: 'The top two bands raised for perceived sparkle and air. How much of this you hear depends a lot on your headphones, and it can also bring out sibilance the recording already had.',
    gains: [0, -1, -1, 0, 1, 3, 4],
  },
  {
    id: 'warmer',
    name: 'Warmer',
    persona: 'Warm & Smooth',
    kind: 'goal',
    description: 'Lows and low mids up, highs gently down. A softer, rounder sound that suits bright recordings and long listening sessions, at the cost of some edge and detail.',
    gains: [3, 3, 1, 0, -1, -2, -2],
  },
  {
    id: 'less-harsh',
    name: 'Less Harsh',
    persona: 'Easy Listening',
    kind: 'goal',
    description: 'Cuts only, centred on 6 kHz where harshness and sibilance usually sit. Nothing is boosted, so this is the one preset that cannot cost you any headroom.',
    gains: [0, 0, 0, 0, -3, -4, -1],
  },
  {
    id: 'more-energy',
    name: 'More Energy',
    persona: 'Energy',
    kind: 'goal',
    description: 'Both ends lifted and the low mids trimmed, the classic smile curve. It is exciting on a first listen and tiring on a long one, so treat the boosts as a ceiling rather than a target.',
    gains: [4, 1, -1, 0, 3, 2, 2],
  },
  {
    id: 'instrument-focus',
    name: 'Instrument Focus',
    persona: 'In the Room',
    kind: 'vibe',
    description: 'The midrange brought up and the extremes eased back, which tends to favour guitars, piano and strings over the low end. A reasonable starting point for acoustic and live recordings.',
    gains: [-2, -1, 1, 3, 2, 0, -1],
  },
  {
    id: 'late-night',
    name: 'Late Night',
    persona: 'Late Night',
    kind: 'vibe',
    description: 'Warm and quiet-friendly. Ears hear less bass and less treble at low volume, so the bottom is lifted a little and the top pulled down to keep things from sounding thin and sharp at 11pm.',
    gains: [2, 2, 0, 1, 0, -2, -3],
  },
];

export function presetById(presets: EqPreset[], id: string): EqPreset | undefined {
  return presets.find((p) => p.id === id);
}

/**
 * The preset whose gains match these exactly, if any.
 *
 * Used to answer "am I still on a preset, or is this mine now?" without a second piece of state:
 * one array of gains stays the single source of truth.
 */
export function matchPreset(presets: EqPreset[], gains: number[]): EqPreset | undefined {
  return presets.find((p) => p.gains.length === gains.length && p.gains.every((g, i) => g === gains[i]));
}
