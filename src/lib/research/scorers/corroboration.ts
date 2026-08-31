// Corroboration scorer — how much OBSERVED evidence backs an opportunity, as opposed to the desk
// research we authored ourselves. 0–1. Pure.
//
// This is the only scorer whose input did not come from us. Every other number in a seed record is
// our own estimate, which is the RIE's standing blind spot: green means internally consistent, not
// externally true (docs/analysis/2026-08-16-seo-ranking-gaps.md). A recorded signal is the first
// input that can disagree with us.
//
// It feeds `confidence` and NOT `finalScore`, deliberately. `searchDemand` measures how loudly a
// need is already being asked for in search; a post doing well is a different fact, and blending
// them would let one probe reorder the roadmap — the failure `x-content` names as "one probe is
// not a dataset". Raising confidence is the claim the evidence actually supports: we are more sure
// this need is real, not that more people are searching for it.
//
// Independent KINDS beat repeats, the same shape as `anchorStrength` in latent-demand. Five replies
// to one post are one observation seen five times; a reply plus a Search Console pattern plus a
// feedback message are three things failing to be a coincidence. A scorer that just summed
// strengths would rank a single well-performing post above that, which is exactly backwards.

import type { EngagementSignal } from '../models/provider';
import { clamp01 } from './demand';

/** Distinct kinds at which the independence term saturates. Three is already a strong claim. */
const KIND_SATURATION = 3;

export function scoreCorroboration(signals: EngagementSignal[]): number {
  if (signals.length === 0) return 0;

  // Independence: how many different kinds of observation fired.
  const kinds = new Set(signals.map(s => s.kind));
  const independence = Math.min(kinds.size, KIND_SATURATION) / KIND_SATURATION;

  // Weight: the strongest signal of each kind, averaged. Taking the max per kind rather than the
  // mean of everything stops a burst of weak repeats diluting one strong observation, and stops it
  // inflating one either.
  const strongestPerKind = new Map<string, number>();
  for (const s of signals) {
    const prior = strongestPerKind.get(s.kind) ?? 0;
    if (s.strength > prior) strongestPerKind.set(s.kind, s.strength);
  }
  const weight =
    [...strongestPerKind.values()].reduce((a, b) => a + b, 0) / strongestPerKind.size / 100;

  return clamp01(independence * 0.5 + clamp01(weight) * 0.5);
}
