// Algorithmic-fit scorer — "should this be an algorithm at all?" For every candidate tool the RIE
// asks whether a deterministic algorithm genuinely solves the need better than AI would. High fit
// (exact math, conversions, encodings, simulations) is ToyTools' home turf: client-side, private,
// instant, exactly right every time. Low fit (prose generation, judgment, summarization) is a
// double penalty: the architecture cannot serve it well (no server, no model), and those queries
// are being absorbed by AI chatbots, so their long-term SERP value is decaying.

import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

/** 0–1 signal straight from the evidence record (100 = purely algorithmic problem). */
export function scoreAlgorithmicFit(raw: RawOpportunity): number {
  return clamp01(raw.algorithmicFit / 100);
}
