// Authority scorer — returns WINNABILITY (1 = ranking here is decided by tool quality, 0 = decided
// by who published it).
//
// Every other scorer asks whether the tool is worth building. This one asks whether we could rank
// for it if we did, which is a separate question and the one the engine was missing: `competition`
// already models how many incumbents there are and how weak they are, but a SERP can be wide open on
// both counts and still be unreachable, because on some query classes Google weights site-level
// trust above everything a page does. A brand-new domain with no citations and no named author does
// not enter a medical SERP by writing a better calculator.
//
// Without this the engine recommended pregnancy-due-date (vs mayoclinic.org), ovulation
// (vs flo.health) and blood-pressure (vs heart.org) as its top picks, scoring them on demand and
// build cost while the one factor that decides the outcome went unmodelled.
//
// The signal is EVIDENCE, not a topic list in this file: a seed record states `authorityRequired`
// for its own query class, the same way it states `demand` and `competition`. When a record does not
// say, the fallback reads the incumbents it does list, by TLD rule rather than by domain name, so it
// cannot go stale the way an allow-list of health sites would.
//
// Pure and deterministic.
import type { RawOpportunity } from '../models/provider';
import { clamp01 } from './demand';

/**
 * TLDs whose registration is itself a trust credential: restricted registries that verify the
 * registrant is a government body, an accredited institution, or a treaty organisation. A rule over
 * the suffix, never a list of sites — `who.int` and `cdc.gov` are caught by what they are, not by
 * being named here, so a health SERP we have never seen scores the same as one we have.
 */
const INSTITUTIONAL_TLDS = ['.gov', '.edu', '.int', '.mil'];

/**
 * `.org` is the ambiguous case and is deliberately weighted at half. It carries real institutional
 * mass on exactly the query classes that matter here (heart.org, sleepfoundation.org, who.int's
 * siblings) while also being the TLD of every hobby project, so counting it whole would overstate
 * the gate and counting it zero would miss the incumbents that actually hold those SERPs.
 */
const AMBIGUOUS_TLD_WEIGHT = 0.5;

/**
 * What an unstated record falls back to when it lists no incumbents at all. Deliberately optimistic:
 * absence of recorded incumbents is absence of evidence, and penalising it would quietly suppress
 * every under-researched record rather than surfacing it for research.
 */
const UNKNOWN_AUTHORITY_GATE = 0;

/** 0–1 share of the listed incumbents that hold a trust credential rather than just a domain. */
export function institutionalShare(existingSolutions: string[]): number {
  if (existingSolutions.length === 0) return 0;
  let mass = 0;
  for (const s of existingSolutions) {
    const d = s.trim().toLowerCase();
    if (INSTITUTIONAL_TLDS.some(t => d.endsWith(t) || d.includes(`${t}/`))) mass += 1;
    else if (d.endsWith('.org') || d.includes('.org/')) mass += AMBIGUOUS_TLD_WEIGHT;
  }
  return clamp01(mass / existingSolutions.length);
}

/**
 * How strongly site-level trust gates this SERP, 0–1. Stated evidence wins; otherwise derived from
 * the incumbents the record already records.
 */
export function authorityGate(raw: RawOpportunity): number {
  if (raw.authorityRequired !== undefined) return clamp01(raw.authorityRequired / 100);
  if (raw.existingSolutions.length === 0) return UNKNOWN_AUTHORITY_GATE;
  return institutionalShare(raw.existingSolutions);
}

/** Winnability: 1 = tool quality decides the ranking, 0 = the publisher's identity does. */
export function scoreAuthority(raw: RawOpportunity): number {
  return clamp01(1 - authorityGate(raw));
}
