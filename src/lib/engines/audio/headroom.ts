// Headroom: the one thing an EQ preset can cost you that nothing on the page would otherwise say.
//
// Boosting a band raises the signal. Enough boost and the player's output clips, which is heard as
// crackle or distortion on the loudest parts and is almost always blamed on the headphones. The
// fix is a preamp cut of the same size, and every player that offers boosts has one, usually one
// screen away and unlabelled as the thing that fixes this.
//
// This is a heuristic about the SETTINGS, not an analysis of audio. No signal has been measured,
// so nothing here says clipping WILL happen: it says how much boost is in the curve and what the
// matching preamp cut would be.

import type { EqHeadroom } from './types';

/** Below this a boost is small enough that headroom is not worth a sentence. */
const QUIET = 3;
/** At or above this, the boost is large enough to be worth naming as a risk. */
const LOUD = 7;

export function headroom(gains: number[]): EqHeadroom {
  const peak = gains.reduce((m, g) => (g > m ? g : m), 0);
  const preamp = -peak;

  if (peak < QUIET) {
    return {
      peak,
      preamp,
      level: peak <= 0 ? 'flat' : 'moderate',
      label: peak <= 0 ? 'No boost' : 'Small boost',
      advice: '',
    };
  }

  if (peak < LOUD) {
    return {
      peak,
      preamp,
      level: 'moderate',
      label: 'Moderate boost',
      advice: `Peak boost is +${peak} dB. If your player has a preamp, ${preamp} dB there keeps the same balance with room to spare.`,
    };
  }

  return {
    peak,
    preamp,
    level: 'high',
    label: 'High boost',
    advice: `Peak boost is +${peak} dB, which is enough to push some players into clipping. Set the preamp to ${preamp} dB, or trim the boosts.`,
  };
}

/**
 * Scale every gain so the largest boost lands on `ceiling`, keeping the shape of the curve.
 *
 * Proportional rather than subtractive on purpose: subtracting the excess from every band would
 * turn cuts into deeper cuts and change what the preset was for. Scaling keeps the same balance at
 * a safer level, which is what someone means by "same sound, less boost".
 */
export function trimBoosts(gains: number[], ceiling = 6): number[] {
  const peak = gains.reduce((m, g) => (g > m ? g : m), 0);
  if (peak <= ceiling || peak <= 0) return gains.slice();
  const factor = ceiling / peak;
  return gains.map((g) => Math.round(g * factor));
}
