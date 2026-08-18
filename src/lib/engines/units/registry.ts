// CSS unit engine runtime namespace, attached to ToyTools.units. Bespoke unit widgets call these
// pure helpers. Safe under Node (no browser globals) so the colocated tests and SSR import cleanly.

import { unitHint, nearestEvenPair } from './hints';
import { pxToCss, cssToPx, dpToPxBuckets, pxToDp, ptToPxIos, simplifyRatio, solveAspect, DENSITY_BUCKETS } from './convert';

export const units = {
  pxToCss,
  cssToPx,
  dpToPxBuckets,
  pxToDp,
  ptToPxIos,
  simplifyRatio,
  aspect: solveAspect,
  buckets: DENSITY_BUCKETS,
  hint: unitHint,
  evenPair: nearestEvenPair,
};

export type UnitsRuntime = typeof units;
