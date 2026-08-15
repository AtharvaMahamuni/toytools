// Markdown report renderers — roadmap.md and next-build.md. Pure functions returning strings, so the
// CLI just writes them. Deterministic. (Plain hyphens only, no em-dashes, to match house style.)

import type { ResearchReports } from '../models/report';
import type { NextBuild, RoadmapItem } from '../models/roadmap';
import type { LatentCandidate } from '../models/latent';
import { LATENT_THRESHOLDS } from '../config';

function itemLine(i: RoadmapItem): string {
  const eng = i.engineExists ? `reuses ${i.engine}` : `new ${i.engine} engine`;
  return `- **${i.title}** (\`${i.proposedTool}\`) - score ${i.finalScore}, ${eng}. ${i.reasons.join('; ')}.`;
}

export function renderRoadmap(r: ResearchReports): string {
  const L: string[] = [];
  L.push('# ToyTools Research Roadmap');
  L.push('');
  L.push(`Generated: ${r.generatedAt}`);
  L.push('');
  L.push(
    `Discovered ${r.summary.discovered} signals -> ${r.summary.deduped} unique opportunities ` +
      `(${r.summary.recommended} recommended, ${r.summary.alreadyExists} already shipped). ` +
      `Top score ${r.summary.topScore}. Missing-engine candidates: ${r.summary.missingEngines}.`,
  );
  L.push('');

  L.push('## Immediate builds (top tier)');
  L.push(r.roadmap.immediate.length ? r.roadmap.immediate.map(itemLine).join('\n') : '_None above the immediate bar._');
  L.push('');

  L.push('## Quick wins (low effort, recommended)');
  L.push(r.roadmap.quickWins.length ? r.roadmap.quickWins.map(itemLine).join('\n') : '_None._');
  L.push('');

  L.push('## Missing engines (new reusable engines this evidence justifies)');
  const missing = r.engines.filter(e => !e.exists);
  if (missing.length) {
    for (const e of missing) {
      L.push(`### ${e.engine} (confidence ${e.confidence}) - unlocks ${e.unlocksTools.length}`);
      L.push(e.rationale.map(x => `- ${x}`).join('\n'));
      L.push(`- Tools: ${e.unlocksTools.join(', ')}`);
      L.push('');
    }
  } else {
    L.push('_No new-engine clusters._');
    L.push('');
  }

  L.push('## Topic clusters');
  for (const c of r.clusters) {
    L.push(`- **${c.transformation}** (${c.engine}) - ${c.size} tool(s), mean score ${c.meanScore}.`);
  }
  L.push('');

  L.push('## Emerging trends (by transformation)');
  for (const t of r.trends.slice(0, 10)) {
    L.push(`- ${t.transformation}: ${t.count} signal(s), mean demand ${t.meanDemand}, mean score ${t.meanScore}.`);
  }
  L.push('');

  return L.join('\n');
}

/**
 * latent.md - the second-order demand report.
 *
 * Structured deliberately so the DERIVED half comes first. The signals are what the catalog says
 * about itself with nobody having proposed anything; the candidates are proposals answering them.
 * Reading it the other way round invites treating a well-argued proposal as evidence for itself,
 * which is the failure mode this whole analyzer is built to avoid.
 */
export function renderLatent(r: ResearchReports): string {
  const L: string[] = [];
  const l = r.latent;

  L.push('# Latent Demand: what nobody is searching for');
  L.push('');
  L.push(`Generated: ${r.generatedAt}`);
  L.push('');
  L.push(
    'The roadmap ranks needs by how loudly they are already being asked for. This report ranks needs ' +
      'that produce no query at all, because the person does not yet have a word for the thing or does ' +
      'not yet know the failure is possible. The two scores are not comparable and are never merged.',
  );
  L.push('');
  L.push(
    `${l.summary.signals} structural silence(s) derived from the catalog; ${l.summary.considered} ` +
      `proposal(s) considered, ${l.summary.anchored} anchored, ${l.summary.unanchored} unanchored. ` +
      `Top latent score ${l.summary.topScore}.`,
  );
  L.push('');

  L.push('## Derived silences (from the catalog alone, nobody proposed these)');
  L.push('');
  if (!l.signals.length) {
    L.push('_No structural silences found._');
    L.push('');
  }
  for (const s of l.signals) {
    L.push(`### \`${s.id}\` (weight ${s.weight})`);
    L.push(`- **Observed:** ${s.observation}`);
    L.push(`- **Therefore:** ${s.implication}`);
    L.push(`- **Evidence:** ${s.evidence.join(', ')}`);
    L.push('');
  }

  L.push('## Anchored candidates');
  L.push('');
  if (!l.candidates.length) {
    L.push('_No proposal matched a derived silence._');
    L.push('');
  }
  for (const c of l.candidates) L.push(...candidateBlock(c));

  L.push('## Unanchored proposals (reported, not recommended)');
  L.push('');
  L.push(
    'These were proposed as latent needs and matched no structural silence. They are kept visible ' +
      'because a proposal with no evidence behind it is a finding too - it is the thing this report ' +
      'is designed not to recommend.',
  );
  L.push('');
  if (!l.unanchored.length) L.push('_None._');
  for (const c of l.unanchored) L.push(`- **${c.title}** (\`${c.proposedTool}\`) - ${c.note ?? 'unanchored'}`);
  L.push('');

  return L.join('\n');
}

function candidateBlock(c: LatentCandidate): string[] {
  const L: string[] = [];
  const verdict = c.latentScore >= LATENT_THRESHOLDS.promote ? 'build-worthy' : 'below the promote bar';
  L.push(`### ${c.title}  (\`${c.proposedTool}\`)`);
  L.push('');
  L.push(`**Latent score:** ${c.latentScore} / 100 (${verdict})`);
  L.push('');
  L.push(`- **The need, as behaviour:** ${c.need}`);
  L.push(`- **Why there is no query for it:** ${c.whyUnnamed}`);
  if (c.consequenceOf.length) L.push(`- **What it costs when unmet:** ${c.consequenceOf.join('; ')}`);
  L.push(`- **Engine:** \`${c.proposedEngine}\` (${c.engineExists ? 'existing' : 'NEW - a caller-level decision'})`);
  if (c.bridges.length) L.push(`- **Reachable from:** ${c.bridges.join(', ')}`);
  L.push('');
  L.push('**Anchored to:**');
  for (const a of c.anchors) L.push(`- \`${a.signalId}\` - ${a.because}`);
  L.push('');
  L.push(
    `**Signals:** anchorStrength ${c.anchorStrength}, consequence ${c.consequence}, ` +
      `reachability ${c.reachability}, namelessness ${c.namelessness}, algorithmicFit ${c.algorithmicFit}.`,
  );
  L.push('');
  return L;
}

export function renderNextBuild(nb: NextBuild | null, generatedAt: string): string {
  const L: string[] = [];
  L.push('# Recommended Next Build');
  L.push('');
  L.push(`Generated: ${generatedAt}`);
  L.push('');
  if (!nb) {
    L.push('_No buildable opportunity found in the current dataset._');
    return L.join('\n');
  }
  L.push(`## ${nb.title}  (\`${nb.proposedTool}\`)`);
  L.push('');
  L.push(`**Opportunity score:** ${nb.finalScore} / 100`);
  L.push('');
  L.push('### Why build it');
  L.push(nb.reason.map(x => `- ${x}`).join('\n'));
  L.push('');
  L.push('### Why incumbents are weak');
  L.push(nb.incumbentWeakness.map(x => `- ${x}`).join('\n'));
  L.push('');
  L.push('### Why ToyTools can win');
  L.push(nb.whyWeCanWin.map(x => `- ${x}`).join('\n'));
  L.push('');
  // Answered here, before anything is scaffolded, because a tool with demand and no craft is a
  // tool that will reach the last step of add-tool with nothing honest to declare.
  L.push('### Craft hypothesis (where its users actually fail)');
  if (nb.craftHypothesis.hasCandidate) {
    L.push(nb.craftHypothesis.userFailures.map(x => `- ${x}`).join('\n'));
  } else {
    L.push('- **No craft candidate from evidence.**');
  }
  L.push('');
  L.push(nb.craftHypothesis.note);
  L.push('');
  L.push('### Engine');
  L.push(`- ${nb.engineExists ? 'Reuses existing engine' : 'Anchors a NEW engine'}: \`${nb.engine}\``);
  if (nb.unlocksTools.length) L.push(`- Future tools this unlocks: ${nb.unlocksTools.join(', ')}`);
  L.push('');
  L.push('### Estimates');
  L.push(`- Implementation effort: **${nb.estimatedEffort}**`);
  L.push(`- Long-term SEO value: **${nb.estimatedSeoValue}**`);
  L.push(`- Maintenance cost: **${nb.estimatedMaintenance}**`);
  L.push('');
  L.push('### Suggested supporting content');
  if (nb.content.guides.length) L.push(`- Guides: ${nb.content.guides.join('; ')}`);
  if (nb.content.faqs.length) L.push(`- FAQs: ${nb.content.faqs.join('; ')}`);
  if (nb.relatedTools.length) L.push(`- Internal links / related tools: ${nb.relatedTools.join(', ')}`);
  L.push(`- Schema: ${nb.content.schema.join(', ')}`);
  L.push('');
  return L.join('\n');
}
