// The band set and the spectrum regions. Data, not logic: a different band count is a different
// EqDefinition in the registry, never a change to the widget.

import type { EqBand, EqRegion, EqRegionId } from './types';

/**
 * Seven bands, the layout most consumer players and headphone apps offer.
 *
 * They are spaced by roughly the same ratio each step (60 -> 150 -> 400 -> 1k -> 2.4k -> 6k -> 15k
 * is about 1.3 octaves apart throughout), which is why the widget can place them at even x
 * intervals and still be drawing a true logarithmic frequency axis. Change one frequency and that
 * stops being true, so keep the ratios even if you retune the set.
 */
export const DEFAULT_BANDS: EqBand[] = [
  {
    id: 'hz60',
    frequency: 60,
    label: '60 Hz',
    region: 'bass',
    boost: 'more low-end weight, the part of a kick drum or a bass line you feel as much as hear',
    cut: 'a lighter, tighter low end, which can help on speakers that are already boomy',
  },
  {
    id: 'hz150',
    frequency: 150,
    label: '150 Hz',
    region: 'body',
    boost: 'more fullness and warmth, though too much can start to sound thick',
    cut: 'less thickness, the usual first move when a mix feels muddy',
  },
  {
    id: 'hz400',
    frequency: 400,
    label: '400 Hz',
    region: 'body',
    boost: 'more body, and often the first place a mix starts to sound boxy',
    cut: 'less low-mid congestion, which can make everything above it feel clearer',
  },
  {
    id: 'hz1000',
    frequency: 1000,
    label: '1 kHz',
    region: 'mid',
    boost: 'more midrange, where most instruments and the core of a voice sit',
    cut: 'a scooped, more recessed midrange, which can also make vocals sit further back',
  },
  {
    id: 'hz2400',
    frequency: 2400,
    label: '2.4 kHz',
    region: 'presence',
    boost: 'vocals and lead instruments pushed forward, though this is also where harshness lives',
    cut: 'a softer, less forward sound, useful when a track feels aggressive',
  },
  {
    id: 'hz6000',
    frequency: 6000,
    label: '6 kHz',
    region: 'presence',
    boost: 'more edge and bite, and more sibilance on vocals',
    cut: 'less sharpness on consonants and cymbals',
  },
  {
    id: 'hz15000',
    frequency: 15000,
    label: '15 kHz',
    region: 'air',
    boost: 'more perceived sparkle and air, if your headphones and the recording reach up here',
    cut: 'a darker, more relaxed top end',
  },
];

/** The five regions, in spectrum order, for the explorer and the guide. */
export const EQ_REGIONS: EqRegion[] = [
  {
    id: 'bass',
    name: 'Bass',
    range: '20-100 Hz',
    summary: 'Weight and low-end impact. Kick drums and bass instruments often carry important energy here, and small speakers may not reproduce the bottom of it at all.',
  },
  {
    id: 'body',
    name: 'Body',
    range: '100-500 Hz',
    summary: 'Fullness and warmth. Too much can make music sound thick or muddy, which is why a small cut here is the usual fix for a congested mix.',
  },
  {
    id: 'mid',
    name: 'Mids',
    range: '500 Hz - 2 kHz',
    summary: 'Where most instruments and the core of a voice live. Cutting the mids scoops a mix out and tends to push vocals into the background.',
  },
  {
    id: 'presence',
    name: 'Presence',
    range: '2-6 kHz',
    summary: 'Forwardness and clarity. Raising this area can make vocals and lead instruments feel closer, and it is also the range that turns harsh first.',
  },
  {
    id: 'air',
    name: 'Air',
    range: '8-15 kHz',
    summary: 'Sparkle and perceived detail. How much of it you hear depends heavily on your headphones and on your own hearing.',
  },
];

const REGION_BY_ID = new Map<EqRegionId, EqRegion>(EQ_REGIONS.map((r) => [r.id, r]));

export function regionOf(band: EqBand): EqRegion | undefined {
  return REGION_BY_ID.get(band.region);
}
