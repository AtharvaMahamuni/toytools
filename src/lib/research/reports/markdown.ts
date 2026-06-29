// Markdown report renderers — roadmap.md and next-build.md. Pure functions returning strings, so the
// CLI just writes them. Deterministic. (Plain hyphens only, no em-dashes, to match house style.)

import type { ResearchReports } from '../models/report';
import type { NextBuild, RoadmapItem } from '../models/roadmap';

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
