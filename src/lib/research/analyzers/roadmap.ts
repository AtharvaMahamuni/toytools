// Roadmap analyzer — ranks buildable opportunities into tiers (immediate / quick-win / long-term)
// and emits a single fully-reasoned next-build recommendation: why it matters, why incumbents are
// weak, why ToyTools can win, the reusable engine + what it unlocks, and effort/SEO/maintenance
// estimates with suggested guides/FAQs/links/schema. Pure, deterministic.

import type { Opportunity } from '../models/opportunity';
import type { EngineRecommendations } from '../models/engine';
import type { Roadmap, RoadmapItem, NextBuild } from '../models/roadmap';
import type { RoadmapTier } from '../constants';
import { THRESHOLDS } from '../config';
import { suggestGuides, type ContentInput } from './guide-generator';
import { suggestFaqs } from './faq-generator';

/** Buildable = not already in the catalog. */
function buildable(o: Opportunity): boolean {
  return o.status !== 'already-exists';
}

function tierOf(o: Opportunity): RoadmapTier {
  if (o.finalScore >= THRESHOLDS.immediate) return 'immediate';
  if (o.finalScore >= THRESHOLDS.recommend && o.implementationCost >= THRESHOLDS.quickWinEase) return 'quick-win';
  if (o.finalScore >= THRESHOLDS.recommend) return 'roadmap';
  return 'long-term';
}

function reasonsFor(o: Opportunity): string[] {
  const r: string[] = [];
  if (o.searchDemand >= 0.75) r.push('High search demand');
  if (o.competitionScore >= 0.6) r.push('Weak / incomplete incumbents');
  if (o.engineExists) r.push(`Reuses the existing ${o.proposedEngine} engine`);
  else r.push(`Implies a new ${o.proposedEngine} engine`);
  if (o.implementationCost >= THRESHOLDS.quickWinEase) r.push('Low implementation cost');
  if (o.topicClusterPotential >= 0.4) r.push('Strong topic-cluster potential');
  if (o.relatedTools.length >= 2) r.push(`Creates ${o.relatedTools.length} internal links`);
  // The AI-vs-algorithm verdict: deterministic problems are the platform's home turf; AI-shaped
  // needs are an architecture mismatch and their queries are being absorbed by chatbots.
  if (o.algorithmicFit >= 0.9) r.push('Deterministic algorithm solves this exactly (AI adds nothing)');
  else if (o.algorithmicFit < 0.5) r.push('CAUTION: AI-shaped need - a client-side algorithm may underserve it');
  // Said here, in the reasons a builder reads before scaffolding, because the coverage ratchet only
  // catches a craftless tool once the work is done. It is a flag and never a score penalty: see
  // Opportunity.craftRisk.
  if (o.craftRisk) r.push('CRAFT RISK: no task-level failure recorded - this would ship with no thoughtful touch');
  return r;
}

function toItem(o: Opportunity): RoadmapItem {
  return {
    id: o.id,
    proposedTool: o.proposedTool,
    title: o.title,
    finalScore: o.finalScore,
    tier: tierOf(o),
    engine: o.proposedEngine,
    engineExists: o.engineExists,
    reasons: reasonsFor(o),
  };
}

function band(n: number, hi: number, mid: number): 'low' | 'medium' | 'high' {
  return n >= hi ? 'high' : n >= mid ? 'medium' : 'low';
}

/** Effort is the inverse of implementation EASE (high ease → low effort). */
function effortBand(ease: number): 'low' | 'medium' | 'high' {
  return ease >= 0.8 ? 'low' : ease >= 0.5 ? 'medium' : 'high';
}

function contentInput(o: Opportunity): ContentInput {
  return {
    transformation: o.transformation,
    name: o.title,
    intent: o.userIntent,
    existingSolutions: o.existingSolutions,
    solutionWeaknesses: o.solutionWeaknesses,
  };
}

function makeNextBuild(o: Opportunity, engines: EngineRecommendations): NextBuild {
  const engineRec = engines.find(e => e.engine === o.proposedEngine);
  const unlocks = (engineRec?.unlocksTools ?? []).filter(id => id !== o.id);

  const whyWeCanWin: string[] = [];
  if (o.engineExists) whyWeCanWin.push(`Ships on the proven ${o.proposedEngine} engine - consistent UX, fast to build.`);
  else whyWeCanWin.push(`Anchors a new ${o.proposedEngine} engine that unlocks ${unlocks.length + 1} tools.`);
  whyWeCanWin.push('Runs fully client-side - private, offline-capable, no upload (a core ToyTools advantage).');
  if (o.competitionScore >= 0.6) whyWeCanWin.push('Incumbents are ad-heavy or paywalled; a clean free tool can win the SERP.');
  if (o.algorithmicFit >= 0.9) whyWeCanWin.push('The need is exactly algorithmic: a deterministic tool beats an AI answer on speed, precision, and trust.');

  const schema = ['SoftwareApplication', 'FAQPage'];
  if (o.userIntent === 'howTo') schema.push('HowTo');

  return {
    id: o.id,
    proposedTool: o.proposedTool,
    title: o.title,
    finalScore: o.finalScore,
    reason: reasonsFor(o),
    incumbentWeakness: o.solutionWeaknesses.length ? o.solutionWeaknesses : ['No strong, focused free tool for this exact task.'],
    whyWeCanWin,
    craftHypothesis: {
      userFailures: o.userFailures,
      hasCandidate: o.userFailures.length > 0,
      note: o.userFailures.length
        ? 'Pick ONE of these and match it to a craft kind (recovery, verification, continuation, guardrail, orientation). See .claude/skills/tool-craft/SKILL.md.'
        : 'No task-level failure recorded for this tool, so there is no craft candidate from evidence. Add userFailures to the seed record if you know one, or accept that this tool ships with no craft and say so explicitly. Never invent one.',
    },
    observedEvidence: o.signals,
    engine: o.proposedEngine,
    engineExists: o.engineExists,
    unlocksTools: unlocks,
    estimatedEffort: effortBand(o.implementationCost),
    estimatedSeoValue: band(o.seoPotential, 0.66, 0.4),
    estimatedMaintenance: o.engineExists ? 'low' : 'medium',
    content: {
      guides: suggestGuides(contentInput(o)),
      faqs: suggestFaqs(contentInput(o)),
      internalLinks: o.relatedTools,
      schema,
    },
    relatedTools: o.relatedTools,
    relatedGuides: o.relatedGuides,
    relatedFaqs: o.relatedFaqs,
  };
}

export function buildRoadmap(opportunities: Opportunity[], engines: EngineRecommendations): Roadmap {
  // opportunities arrive ranked desc by finalScore.
  const builds = opportunities.filter(buildable);
  const items = builds.map(toItem);

  const immediate = items.filter(i => i.tier === 'immediate').slice(0, THRESHOLDS.immediateCount);
  const quickWins = items.filter(i => i.tier === 'quick-win').slice(0, THRESHOLDS.quickWinCount);
  const longTerm = items.filter(i => i.tier === 'long-term');
  const all = items.slice(0, THRESHOLDS.roadmapCount);

  const nextBuild = builds.length ? makeNextBuild(builds[0], engines) : null;
  return { immediate, quickWins, longTerm, all, nextBuild };
}
