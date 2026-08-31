// Craft-debt analyzer — joins the craft declarations in the registry against the task-level failure
// evidence in the datasets, and reports where the two disagree. Pure, deterministic.
//
// Two directions, and they are different questions:
//
//   BACKWARD (shipped tools).  A tool that shipped without a craft, whose seed record records a
//   `userFailures` entry, is a polish job whose touch was specified before the tool was even built
//   and then never picked up. `check:craft --report` cannot see these: it groups the craftless
//   backlog by engine, which says where the tools are, not where the answers are.
//
//   FORWARD (buildable opportunities).  An opportunity with no recorded failure would reach the end
//   of add-tool with nothing honest to declare, and the coverage ratchet would catch it only after
//   the work was done. Flagging it here moves that discovery to before anything is scaffolded.
//
// The forward half is a FLAG and never a score penalty. Ranking a tool down for missing evidence
// would measure how completely we have written up our notes rather than how good the tool is, and
// would make the demand ranking quietly dependent on our own note-taking.

import type { Opportunity } from '../models/opportunity';
import type { CraftDebtReport, CraftDebtItem } from '../models/craft-debt';
import type { ResearchInputs } from '../types';
import { resolveSlugAlias } from '../config';

export function analyzeCraftDebt(opportunities: Opportunity[], inputs: ResearchInputs): CraftDebtReport {
  const readyToPolish: CraftDebtItem[] = [];
  const needsEvidence: CraftDebtItem[] = [];
  const atRisk: CraftDebtReport['atRisk'] = [];
  let shippedCovered = 0;

  for (const o of opportunities) {
    if (o.status === 'already-exists') {
      const slug = resolveSlugAlias(o.proposedTool);
      shippedCovered++;
      // A declared craft settles it: the tool has something of its own and there is no debt,
      // whether or not the datasets happen to record why.
      if (inputs.craftSlugs.has(slug)) continue;
      const item: CraftDebtItem = {
        slug,
        kind: o.userFailures.length ? 'ready-to-polish' : 'needs-evidence',
        userFailures: o.userFailures,
        engine: o.proposedEngine,
        demand: Math.round(o.searchDemand * 100),
      };
      (item.kind === 'ready-to-polish' ? readyToPolish : needsEvidence).push(item);
      continue;
    }
    if (o.craftRisk) {
      atRisk.push({ id: o.id, proposedTool: o.proposedTool, finalScore: o.finalScore, engine: o.proposedEngine });
    }
  }

  // Highest demand first within each kind, slug as the stable tiebreak so output is byte-stable.
  const byDemand = (a: CraftDebtItem, b: CraftDebtItem) => b.demand - a.demand || a.slug.localeCompare(b.slug);
  readyToPolish.sort(byDemand);
  needsEvidence.sort(byDemand);
  // atRisk keeps roadmap order: opportunities arrive ranked, so the flag reads in build order.

  return {
    readyToPolish,
    needsEvidence,
    atRisk,
    summary: {
      shippedCovered,
      readyToPolish: readyToPolish.length,
      needsEvidence: needsEvidence.length,
      atRisk: atRisk.length,
    },
  };
}
