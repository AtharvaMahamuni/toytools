// Latent-demand analyzer — "what do people need that they would never think to search for?"
//
// This is a different question from the one the rest of the RIE answers, not a re-weighting of it.
// `opportunity-score.ts` ranks needs by how loudly they are already being asked for: searchDemand is
// its heaviest single weight, and `scoreConfidence` treats demand < 60 as a signal that did not
// fire. A need with no name produces no query, so that machinery cannot see one however it is tuned.
//
// So this analyzer never looks at queries. It works in two halves:
//
//   deriveSignals()    reads the CATALOG ALONE and reports structural silences - producers with no
//                      verifier, formats we emit and never consume, joins between engines that
//                      nothing spans. Nobody has to have thought of a tool for these to appear;
//                      they fall out of the registry the moment it is inspected this way.
//
//   scoreCandidates()  scores proposed tools against those silences, and a proposal that matches
//                      none of them is reported as `unanchored` rather than scored.
//
// That gate is the whole design. `namelessness` rewards the absence of a search term, and absence of
// a search term is also what a tool nobody wants looks like. The anchor requirement is what
// separates "nameless because it has no name yet" from "nameless because there is nothing there".
//
// Pure and deterministic: same inputs -> byte-identical output.

import type { Opportunity } from '../models/opportunity';
import type { LatentAnchor, LatentCandidate, LatentReport, LatentSignal } from '../models/latent';
import type { ResearchInputs } from '../types';
import { LATENT_WEIGHTS, LATENT_WEIGHT_SUM, LATENT_THRESHOLDS, THRESHOLDS, resolveSlugAlias } from '../config';
import {
  ENGINE_IO,
  FORMATS,
  formatLabel,
  activeEngines,
  toolsByEngine,
  seamIsCovered,
  isConverter,
  isProducing,
  isVerifying,
} from './io-graph';
import { clamp01 } from '../scorers/demand';

export function analyzeLatentDemand(opportunities: Opportunity[], inputs: ResearchInputs): LatentReport {
  const signals = deriveSignals(opportunities, inputs);
  const scored = scoreCandidates(opportunities, signals, inputs);

  const candidates = scored
    .filter(c => c.status === 'candidate')
    .sort((a, b) => b.latentScore - a.latentScore || a.id.localeCompare(b.id));
  const unanchored = scored
    .filter(c => c.status === 'unanchored')
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    signals,
    candidates,
    unanchored,
    summary: {
      signals: signals.length,
      considered: scored.length,
      anchored: candidates.length,
      unanchored: unanchored.length,
      topScore: candidates[0]?.latentScore ?? 0,
    },
  };
}

/* ------------------------------------------------------------------ derived signals (no evidence) */

/** Read the catalog structurally and report every silence in it. */
export function deriveSignals(opportunities: Opportunity[], inputs: ResearchInputs): LatentSignal[] {
  return [
    ...asymmetrySignals(inputs),
    ...deadEndSignals(inputs),
    ...handoffSignals(inputs),
    ...unservedFailureSignals(opportunities, inputs),
  ].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));
}

/**
 * Producers with no verifier. The purest latent need in the catalog: you cannot search for something
 * to check your output while you still believe the output is right, so the demand for a checker is
 * real and permanently invisible to any query-based ranking.
 */
function asymmetrySignals(inputs: ResearchInputs): LatentSignal[] {
  const byEngine = toolsByEngine(inputs.catalog);
  const total = Math.max(inputs.catalog.length, 1);
  const out: LatentSignal[] = [];

  for (const [engine, tools] of [...byEngine].sort((a, b) => a[0].localeCompare(b[0]))) {
    const producers = tools.filter(t => isProducing(t.pattern, t.family));
    const verifiers = tools.filter(t => isVerifying(t.pattern, t.family));
    if (producers.length === 0 || verifiers.length > 0) continue;

    const artifact = formatLabel(ENGINE_IO[engine]?.out ?? 'output');
    out.push({
      kind: 'asymmetry',
      id: `asymmetry:${engine}`,
      observation: `The "${engine}" engine has ${producers.length} tool(s) that produce ${artifact} and none that check it.`,
      implication:
        `Someone holding ${artifact} this engine produced has no way to find out it is wrong. They ` +
        `will not search for a checker, because the reason to want one is knowledge they do not have.`,
      evidence: producers.map(p => p.slug),
      engines: [engine],
      weight: round2(clamp01(producers.length / total + 0.25)),
    });
  }
  return out.slice(0, LATENT_THRESHOLDS.signalsPerKind);
}

/** Formats the catalog can emit that nothing anywhere can take back in. */
function deadEndSignals(inputs: ResearchInputs): LatentSignal[] {
  const engines = activeEngines(inputs.catalog).filter(e => ENGINE_IO[e]);
  const consumed = new Set(engines.map(e => ENGINE_IO[e]!.in));
  const byEngine = toolsByEngine(inputs.catalog);
  const out: LatentSignal[] = [];

  const producedBy = new Map<string, string[]>();
  for (const e of engines) {
    const f = ENGINE_IO[e]!.out;
    producedBy.set(f, [...(producedBy.get(f) ?? []), e]);
  }

  for (const [format, sources] of [...producedBy].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (FORMATS[format]?.terminal !== false) continue; // terminal formats are meant to be read, not reused
    if (consumed.has(format)) continue;

    const tools = sources.flatMap(e => byEngine.get(e) ?? []).map(t => t.slug).sort();
    out.push({
      kind: 'dead-end',
      id: `dead-end:${format}`,
      observation: `${cap(formatLabel(format))} is produced by ${sources.join(', ')} and consumed by no engine in the catalog.`,
      implication:
        `Whatever a visitor does with ${formatLabel(format)} next, they do off-site. The step after ` +
        `ours is the one we cannot see, and it is the one they are still doing by hand.`,
      evidence: tools,
      engines: sources,
      weight: round2(clamp01(tools.length / Math.max(inputs.catalog.length, 1) + 0.2)),
    });
  }
  return out.slice(0, LATENT_THRESHOLDS.signalsPerKind);
}

/** Joins where one engine's output is another's input, with nothing spanning them. */
function handoffSignals(inputs: ResearchInputs): LatentSignal[] {
  const engines = activeEngines(inputs.catalog).filter(e => ENGINE_IO[e]);
  const byEngine = toolsByEngine(inputs.catalog);
  const out: LatentSignal[] = [];

  for (const a of engines) {
    for (const b of engines) {
      if (a === b) continue;
      const from = ENGINE_IO[a]!.out;
      const to = ENGINE_IO[b]!.in;
      if (from !== to) continue;
      if (FORMATS[from]?.terminal !== false) continue;
      // Only report a join where the producing engine actually CREATED this format from something
      // else. Two engines passing text to each other is a pipeline, not a missing tool.
      if (!isConverter(a)) continue;
      if (seamIsCovered(inputs.catalog, from, to, a)) continue;

      const left = byEngine.get(a) ?? [];
      const right = byEngine.get(b) ?? [];
      out.push({
        kind: 'handoff',
        id: `handoff:${a}->${b}`,
        observation:
          `The "${a}" engine emits ${formatLabel(from)} and "${b}" consumes it, across ` +
          `${left.length + right.length} tools, with no tool spanning the join.`,
        implication:
          `The join is currently the clipboard. A workflow people perform in two tabs has no name, ` +
          `so it has no query - and it is still the thing they came to do.`,
        evidence: [...left.slice(0, 3).map(t => t.slug), ...right.slice(0, 3).map(t => t.slug)],
        engines: [a, b],
        weight: round2(clamp01((left.length + right.length) / Math.max(inputs.catalog.length, 1) + 0.15)),
      });
    }
  }
  return out.sort((x, y) => y.weight - x.weight || x.id.localeCompare(y.id)).slice(0, LATENT_THRESHOLDS.signalsPerKind);
}

/**
 * Recorded mid-task failures that nothing shipped or recommended addresses.
 *
 * `userFailures` is authored as craft evidence for the tool it sits on, but a failure recorded
 * against a tool the demand ranking pushed BELOW the recommend bar is a different fact: people are
 * observed failing at something, and the reason it is not being built is that nobody is searching
 * for it. That is the exact population this analyzer exists to rescue.
 */
function unservedFailureSignals(opportunities: Opportunity[], inputs: ResearchInputs): LatentSignal[] {
  const out: LatentSignal[] = [];
  for (const o of opportunities) {
    if (o.userFailures.length === 0) continue;
    if (inputs.existingSlugs.has(resolveSlugAlias(o.proposedTool))) continue;
    if (o.finalScore >= THRESHOLDS.recommend) continue; // the demand engine already has this one

    out.push({
      kind: 'unserved-failure',
      id: `unserved-failure:${o.id}`,
      observation:
        `${o.title} carries ${o.userFailures.length} recorded task-level failure(s) but scores ` +
        `${o.finalScore} on demand, below the ${THRESHOLDS.recommend} bar.`,
      implication:
        `People are observed failing at this. The only thing keeping it off the roadmap is that ` +
        `nobody types it into a search box, which is the definition of the need being latent.`,
      evidence: o.userFailures,
      engines: [o.proposedEngine],
      weight: round2(clamp01(o.userFailures.length / 4 + 0.2)),
    });
  }
  return out
    .sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id))
    .slice(0, LATENT_THRESHOLDS.signalsPerKind);
}

/* --------------------------------------------------------------------------- candidate scoring */

export function scoreCandidates(
  opportunities: Opportunity[],
  signals: LatentSignal[],
  inputs: ResearchInputs,
): LatentCandidate[] {
  return opportunities.filter(o => o.latent).map(o => scoreOne(o, signals, inputs));
}

function scoreOne(o: Opportunity, signals: LatentSignal[], inputs: ResearchInputs): LatentCandidate {
  const latent = o.latent!;
  const anchors = matchAnchors(o, signals);
  const exists = inputs.existingSlugs.has(resolveSlugAlias(o.proposedTool));

  // Independent KINDS of structural evidence count for more than a pile of one kind: three
  // different silences pointing at the same hole is a much stronger claim than one silence
  // mentioning it three times.
  const distinctKinds = new Set(anchors.map(a => a.kind)).size;
  const evidenceMass = anchors.reduce((n, a) => n + (signals.find(s => s.id === a.signalId)?.evidence.length ?? 0), 0);
  const anchorStrength = clamp01(
    0.6 * clamp01(distinctKinds / 3) + 0.4 * clamp01(evidenceMass / LATENT_THRESHOLDS.anchorSaturation),
  );

  const consequence = clamp01(latent.consequence / 100);
  const reachability = clamp01(o.relatedTools.length / LATENT_THRESHOLDS.reachabilitySaturation);
  const namelessness = clamp01(1 - o.searchDemand);
  const algorithmicFit = clamp01(o.algorithmicFit);

  const latentScore = round1(
    ((LATENT_WEIGHTS.anchorStrength * anchorStrength +
      LATENT_WEIGHTS.consequence * consequence +
      LATENT_WEIGHTS.reachability * reachability +
      LATENT_WEIGHTS.namelessness * namelessness +
      LATENT_WEIGHTS.algorithmicFit * algorithmicFit) /
      LATENT_WEIGHT_SUM) *
      100,
  );

  const status = exists
    ? 'already-exists'
    : anchors.length < LATENT_THRESHOLDS.minAnchors
      ? 'unanchored'
      : 'candidate';

  const note =
    status === 'unanchored'
      ? 'No derived silence in the catalog matches this proposal. It may still be a good tool, but ' +
        'nothing structural argues for it, so it is not a latent-demand finding - do not build it on ' +
        'this report\'s authority.'
      : status === 'already-exists'
        ? 'Already shipped.'
        : undefined;

  return {
    id: o.id,
    title: o.title,
    proposedTool: o.proposedTool,
    proposedEngine: o.proposedEngine,
    engineExists: o.engineExists,
    need: latent.observedBehaviour.length ? latent.observedBehaviour[0] : o.problem,
    whyUnnamed: latent.whyUnnamed,
    consequenceOf: o.userFailures,
    anchors,
    bridges: o.relatedTools,
    anchorStrength: round2(anchorStrength),
    consequence: round2(consequence),
    reachability: round2(reachability),
    namelessness: round2(namelessness),
    algorithmicFit: round2(algorithmicFit),
    latentScore,
    status,
    ...(note ? { note } : {}),
  };
}

/** Match a proposal to the derived silences it fills. Structural only - no text similarity. */
function matchAnchors(o: Opportunity, signals: LatentSignal[]): LatentAnchor[] {
  const io = ENGINE_IO[o.proposedEngine];
  const anchors: LatentAnchor[] = [];

  for (const s of signals) {
    switch (s.kind) {
      case 'asymmetry':
        if (s.engines.includes(o.proposedEngine)) {
          anchors.push({
            signalId: s.id,
            kind: s.kind,
            because: `Sits on "${o.proposedEngine}", which can produce but cannot check.`,
          });
        }
        break;
      case 'dead-end': {
        const format = s.id.slice('dead-end:'.length);
        if (io && (io.in === format || io.out === format)) {
          anchors.push({
            signalId: s.id,
            kind: s.kind,
            because: `Touches ${formatLabel(format)}, which nothing in the catalog consumes today.`,
          });
        }
        break;
      }
      case 'handoff':
        if (s.engines.includes(o.proposedEngine)) {
          anchors.push({
            signalId: s.id,
            kind: s.kind,
            because: `Spans the ${s.engines.join(' -> ')} join that people currently bridge by hand.`,
          });
        }
        break;
      case 'unserved-failure':
        if (s.id === `unserved-failure:${o.id}`) {
          anchors.push({
            signalId: s.id,
            kind: s.kind,
            because: 'Recorded task-level failures for this exact need, with no tool serving it.',
          });
        }
        break;
    }
  }
  return anchors;
}

/* ------------------------------------------------------------------------------------- helpers */

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
