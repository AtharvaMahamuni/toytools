// The craft hypothesis: the seam between "what should we build" and "does it have a reason to
// exist beyond its engine".
//
// Both branches matter equally. A recommendation that carries the evidence lets a builder pick a
// craft kind before scaffolding anything; a recommendation that HONESTLY REPORTS having none is
// what stops a builder inventing one at the last step, which is the failure the whole craft
// doctrine exists to prevent. Silence on the second branch would make the field decorative.
//
// See docs/analysis/2026-08-11-tool-craft.md and .claude/skills/tool-craft/SKILL.md.

import { describe, it, expect } from 'vitest';
import { defaultInputs, runResearchIntelligence } from './index';
import type { SeedDataset } from './models/provider';

const FAILURE = 'A semicolon-delimited export parses as one column and every row reads as changed.';

function datasets(userFailures?: string[]): SeedDataset[] {
  return [
    {
      domain: 'test',
      records: [
        {
          query: 'csv diff',
          problem: 'compare two CSV exports and see what changed',
          intent: 'transactional',
          transformation: 'CSV Diff',
          proposedTool: 'test-csv-diff-tool',
          proposedEngine: 'csv',
          searchQueries: ['csv diff', 'compare csv files'],
          demand: 90,
          competition: 30,
          difficulty: 'low',
          ...(userFailures ? { userFailures } : {}),
        },
      ],
    },
  ];
}

// Goes in through defaultInputs so the seed-dataset provider's mapping is covered too: the field
// has to survive record -> provider -> scorer -> opportunity -> roadmap, and a break anywhere in
// that chain is the same silent failure as never adding it.
function nextBuild(userFailures?: string[]) {
  const out = runResearchIntelligence(defaultInputs(datasets(userFailures), '2026-01-01T00:00:00.000Z'));
  return out.roadmap.nextBuild;
}

describe('craft hypothesis in the next-build recommendation', () => {
  it('carries the task-level failures when the evidence records them', () => {
    const nb = nextBuild([FAILURE]);
    expect(nb).not.toBeNull();
    expect(nb!.craftHypothesis.hasCandidate).toBe(true);
    expect(nb!.craftHypothesis.userFailures).toEqual([FAILURE]);
    // The note points at the five kinds rather than guessing one: picking the kind is a judgement.
    expect(nb!.craftHypothesis.note).toMatch(/recovery|verification|continuation|guardrail|orientation/);
  });

  it('says so plainly when there is no craft candidate, instead of staying quiet', () => {
    const nb = nextBuild();
    expect(nb).not.toBeNull();
    expect(nb!.craftHypothesis.hasCandidate).toBe(false);
    expect(nb!.craftHypothesis.userFailures).toEqual([]);
    expect(nb!.craftHypothesis.note).toMatch(/[Nn]ever invent/);
  });

  it('keeps task failures separate from market weaknesses', () => {
    // The two are easy to conflate and answer different questions: incumbentWeakness is about
    // whether the SERP is beatable, craftHypothesis is about whether the tool has anything of its
    // own once someone is using it. A recommendation can have one without the other.
    const nb = nextBuild([FAILURE]);
    expect(nb!.incumbentWeakness).not.toContain(FAILURE);
    expect(nb!.craftHypothesis.userFailures).toContain(FAILURE);
  });
});
