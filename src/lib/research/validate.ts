// RIE validation — pure checks that return an error list (never throws). The CLI prints them and
// exits 1 when non-empty, mirroring scripts/validate-registry.ts. Validates seed datasets, the
// provider/analyzer/scorer registry, and a generated ResearchReports bundle (scores, schema,
// relationships, graph integrity) BEFORE any report is written.

import type { ResearchReports } from './models/report';
import type { SeedDataset } from './models/provider';
import { PROVIDERS, ANALYZERS, SCORERS } from './registry';
import { PROVIDER_IDS, INTENT_KINDS, DIFFICULTIES } from './constants';
import { jaccard } from './analyzers/similarity';

const inRange = (n: number, lo: number, hi: number) => typeof n === 'number' && !Number.isNaN(n) && n >= lo && n <= hi;

/** Validate the registry wiring (provider ids unique + known; analyzer/scorer lists non-empty). */
export function validateRegistry(): string[] {
  const errors: string[] = [];
  const ids = PROVIDERS.map(p => p.id);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`Duplicate provider id: ${id}`);
    seen.add(id);
    if (!PROVIDER_IDS.includes(id)) errors.push(`Unknown provider id (not in constants): ${id}`);
    const p = PROVIDERS.find(x => x.id === id)!;
    if (typeof p.discover !== 'function') errors.push(`Provider ${id} does not implement discover()`);
  }
  if (ANALYZERS.length === 0) errors.push('No analyzers registered');
  if (SCORERS.length === 0) errors.push('No scorers registered');
  return errors;
}

/** Validate raw seed datasets (shape + enum membership + valid JSON-derived numbers). */
export function validateDatasets(datasets: SeedDataset[]): string[] {
  const errors: string[] = [];
  const seenTools = new Set<string>();
  for (const ds of datasets) {
    if (!ds.domain) errors.push('Dataset missing "domain"');
    if (!Array.isArray(ds.records)) {
      errors.push(`Dataset ${ds.domain}: "records" is not an array`);
      continue;
    }
    for (const rec of ds.records) {
      const where = `${ds.domain}/${rec.proposedTool ?? '?'}`;
      for (const f of ['query', 'problem', 'transformation', 'proposedTool', 'proposedEngine'] as const) {
        if (!rec[f] || typeof rec[f] !== 'string') errors.push(`${where}: missing/invalid "${f}"`);
      }
      if (!INTENT_KINDS.includes(rec.intent)) errors.push(`${where}: invalid intent "${rec.intent}"`);
      if (!DIFFICULTIES.includes(rec.difficulty)) errors.push(`${where}: invalid difficulty "${rec.difficulty}"`);
      if (!inRange(rec.demand, 0, 100)) errors.push(`${where}: demand out of range`);
      if (!inRange(rec.competition, 0, 100)) errors.push(`${where}: competition out of range`);
      if (rec.algorithmicFit !== undefined && !inRange(rec.algorithmicFit, 0, 100))
        errors.push(`${where}: algorithmicFit out of range`);
      if (rec.authorityRequired !== undefined && !inRange(rec.authorityRequired, 0, 100))
        errors.push(`${where}: authorityRequired out of range`);
      if (!Array.isArray(rec.searchQueries) || rec.searchQueries.length === 0)
        errors.push(`${where}: searchQueries must be a non-empty array`);
      if (rec.latent !== undefined) {
        if (!rec.latent.whyUnnamed) errors.push(`${where}: latent.whyUnnamed is required`);
        if (!inRange(rec.latent.consequence, 0, 100)) errors.push(`${where}: latent.consequence out of range`);
        // A latent claim with no observed behaviour behind it is an opinion. The whole point of the
        // block is that behaviour stands in for the query that does not exist.
        if (!Array.isArray(rec.latent.observedBehaviour) || rec.latent.observedBehaviour.length === 0)
          errors.push(`${where}: latent.observedBehaviour must be a non-empty array`);
      }
      if (rec.proposedTool) {
        if (seenTools.has(rec.proposedTool)) errors.push(`Duplicate proposed tool across datasets: ${rec.proposedTool}`);
        seenTools.add(rec.proposedTool);
      }
    }
  }
  return errors;
}

/** Validate a generated report bundle. */
export function validateReports(r: ResearchReports): string[] {
  const errors: string[] = [];

  // Duplicate opportunity ids / proposed tools.
  const ids = new Set<string>();
  const tools = new Set<string>();
  for (const o of r.opportunities) {
    if (ids.has(o.id)) errors.push(`Duplicate opportunity id: ${o.id}`);
    ids.add(o.id);
    if (tools.has(o.proposedTool)) errors.push(`Duplicate proposed tool: ${o.proposedTool}`);
    tools.add(o.proposedTool);

    // Required metadata.
    if (!o.title || !o.problem || !o.transformation) errors.push(`Opportunity ${o.id}: missing required metadata`);

    // Score ranges.
    const unit: Array<[string, number]> = [
      ['searchDemand', o.searchDemand],
      ['competitionScore', o.competitionScore],
      ['evergreenScore', o.evergreenScore],
      ['implementationCost', o.implementationCost],
      ['engineReuse', o.engineReuse],
      ['seoPotential', o.seoPotential],
      ['topicClusterPotential', o.topicClusterPotential],
      ['commercialPotential', o.commercialPotential],
      ['localizationPotential', o.localizationPotential],
      ['algorithmicFit', o.algorithmicFit],
      ['confidence', o.confidence],
    ];
    for (const [name, v] of unit) if (!inRange(v, 0, 1)) errors.push(`Opportunity ${o.id}: ${name} out of 0..1 (${v})`);
    if (!inRange(o.finalScore, 0, 100)) errors.push(`Opportunity ${o.id}: finalScore out of 0..100 (${o.finalScore})`);
  }

  // Near-duplicate problems that escaped dedup (different ids, same engine, very similar text).
  for (let i = 0; i < r.opportunities.length; i++) {
    for (let j = i + 1; j < r.opportunities.length; j++) {
      const a = r.opportunities[i];
      const b = r.opportunities[j];
      if (a.proposedEngine === b.proposedEngine && jaccard(a.problem, b.problem) >= 0.85) {
        errors.push(`Near-duplicate problems not merged: ${a.id} ~ ${b.id}`);
      }
    }
  }

  // Duplicate engine recommendations.
  const engines = new Set<string>();
  for (const e of r.engines) {
    if (engines.has(e.engine)) errors.push(`Duplicate engine recommendation: ${e.engine}`);
    engines.add(e.engine);
    if (!inRange(e.confidence, 0, 1)) errors.push(`Engine ${e.engine}: confidence out of 0..1`);
  }

  // Roadmap + nextBuild reference real opportunities.
  for (const item of r.roadmap.all) {
    if (!ids.has(item.id)) errors.push(`Roadmap item references unknown opportunity: ${item.id}`);
  }
  if (r.roadmap.nextBuild && !ids.has(r.roadmap.nextBuild.id))
    errors.push(`nextBuild references unknown opportunity: ${r.roadmap.nextBuild.id}`);

  // Latent report integrity. The anchor gate is the analyzer's entire guardrail, so it is asserted
  // here as well: a candidate that reached the report with no anchors means the gate stopped working,
  // and the failure is silent and confident, which is the worst shape for a suggestion engine.
  const signalIds = new Set(r.latent.signals.map(s => s.id));
  for (const s of r.latent.signals) {
    if (!inRange(s.weight, 0, 1)) errors.push(`Latent signal ${s.id}: weight out of 0..1 (${s.weight})`);
    if (!s.observation || !s.implication) errors.push(`Latent signal ${s.id}: missing observation/implication`);
  }
  for (const c of [...r.latent.candidates, ...r.latent.unanchored]) {
    const unit: Array<[string, number]> = [
      ['anchorStrength', c.anchorStrength],
      ['consequence', c.consequence],
      ['reachability', c.reachability],
      ['namelessness', c.namelessness],
      ['algorithmicFit', c.algorithmicFit],
    ];
    for (const [name, v] of unit) if (!inRange(v, 0, 1)) errors.push(`Latent ${c.id}: ${name} out of 0..1 (${v})`);
    if (!inRange(c.latentScore, 0, 100)) errors.push(`Latent ${c.id}: latentScore out of 0..100`);
    if (!c.whyUnnamed) errors.push(`Latent ${c.id}: missing whyUnnamed`);
    for (const a of c.anchors) {
      if (!signalIds.has(a.signalId)) errors.push(`Latent ${c.id}: anchor references unknown signal ${a.signalId}`);
    }
  }
  for (const c of r.latent.candidates) {
    if (c.anchors.length === 0) errors.push(`Latent ${c.id}: promoted to candidate with zero anchors`);
  }
  for (const c of r.latent.unanchored) {
    if (c.anchors.length > 0) errors.push(`Latent ${c.id}: listed as unanchored but carries anchors`);
    if (!c.note) errors.push(`Latent ${c.id}: unanchored without a stated reason`);
  }

  // Graph edges resolve to nodes.
  const nodeIds = new Set(r.graph.nodes.map(n => n.id));
  for (const e of r.graph.edges) {
    if (!nodeIds.has(e.from)) errors.push(`Graph edge from unknown node: ${e.from}`);
    if (!nodeIds.has(e.to)) errors.push(`Graph edge to unknown node: ${e.to}`);
  }

  return errors;
}

/** Run every validation pass. */
export function validateAll(datasets: SeedDataset[], reports: ResearchReports): string[] {
  return [...validateRegistry(), ...validateDatasets(datasets), ...validateReports(reports)];
}
