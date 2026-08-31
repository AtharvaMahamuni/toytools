---
name: next-tool
description: Recommend and justify the next ToyTools tool(s) to build using the Research Intelligence Engine. Use whenever asked what to build next, for new tool ideas/suggestions, to pick the highest-value gap, or "let's build the next tool" - runs the research pipeline, surfaces the top scored opportunities with full reasoning (demand, weak incumbents, why ToyTools can win, reusable engine, unlocked tools, guides, FAQs, internal links, SEO + maintenance estimate), then proceeds to implement via the add-tool skill.
---

# Next Tool (Research Intelligence Engine)

Evidence-driven tool selection. **Never** pick the next tool by intuition. This skill is the standing
path for "what should we build next?". It runs the Research Intelligence Engine (RIE), explains the
recommendation, and hands off to `add-tool` for implementation.

## When this triggers

Any of: "what should we build next", "suggest a new tool", "new tool idea", "pick the next tool",
"let's build the next tool", "what's the highest-value gap". For a periodic/offline research sweep,
the `research-intelligence` subagent (`.claude/agents/research-intelligence.md`) runs the same engine.

## The flow

0. **Check the reports on disk are still current. Always, before reading any of them:**
   ```sh
   npm run research:status     # prints FRESH or STALE, and why
   ```
   The reports are committed, and the catalog moves under them: a tool shipping is enough to make
   `next-build.md` recommend something that already exists, with no dataset edit and nothing on the
   page saying so. That is exactly what had happened on 2026-08-31, when the committed roadmap was
   computed two tools back. **On STALE, re-run the engine before reading anything.** A stale report
   is intuition wearing an evidence report's clothes, which is the one thing this skill exists to
   prevent.
1. **Run the engine** (validates first, then writes reports):
   ```sh
   npm run research:validate   # gate: datasets + registry + report integrity
   npm run research:next       # writes research/reports/next-build.md and prints it
   npm run research:report     # full bundle (roadmap.md, opportunities.json, craft-debt.json, ...)
   ```
2. **Read the evidence**: `research/reports/next-build.md` (the headline recommendation) and
   `research/reports/top-opportunities.json` (ranked alternatives + scores).
3. **Present the recommendation** with reasoning - cover all of:
   - why it matters (search demand, evergreen),
   - why existing search results are weak (`incumbentWeakness`),
   - why ToyTools can compete (`whyWeCanWin`: client-side/private, engine reuse, clean SERP),
   - the reusable engine and the additional tools it unlocks,
   - suggested guides, FAQs, internal links, and JSON-LD schema,
   - estimated effort, long-term SEO value, and maintenance cost,
   - **the craft hypothesis** (`craftHypothesis`): where this tool's users fail MID-TASK, and
     therefore what its one thoughtful touch could be. Never skip this, including when the answer
     is "no candidate": see below.
   - **any observed evidence** (`observedEvidence`): recorded engagement signals, which are the only
     inputs in the whole recommendation that we did not author ourselves. Present them as what they
     are - they raised confidence, not the score.
   - **the craft-risk flag**, when the recommendation carries `CRAFT RISK` in its reasons. It means
     no task-level failure is recorded, so this tool would reach the end of `add-tool` with nothing
     honest to declare and would drag the coverage ratchet down. Resolve it BEFORE scaffolding: add
     `userFailures` to the seed record and re-run, or state out loud that the tool ships craftless.
4. **Confirm scope** with the user if they have not already said "build it" (how many tools, which
   ones from the ranked list).
5. **Implement** via the **`add-tool`** skill / `npm run scaffold:tool` - the RIE only decides
   *what* and *why*; `add-tool` owns *how*. Each tool ships config + widget + guide + FAQ + knowledge
   + registry wiring + tests, then `npm run build` and `npm run test`.

## The craft hypothesis (do not hand a tool over without one)

Every new tool must declare one thoughtful touch, and `check-craft.ts` holds coverage as a ratio, so
a tool built without one fails the build. That makes "does this tool have a craft?" a question to
answer **here**, before anything is scaffolded, not at the last step of `add-tool`.

`craftHypothesis` in `next-build.md` carries the evidence: the `userFailures` recorded for the tool,
which are task-level ("pastes a data URI and gets a correct rejection") and deliberately distinct
from `solutionWeaknesses`, which are market-level ("ad-supported", "dated UI"). The first says
whether the tool has anything of its own to offer; the second says whether the SERP is beatable. A
tool can have one without the other.

- **With a candidate:** present the failures, and name which of the five kinds fits (`recovery`,
  `verification`, `continuation`, `guardrail`, `orientation`). The engine deliberately does **not**
  guess the kind, because inferring it from free text would be guesswork dressed as a
  recommendation. That call is yours, and `.claude/skills/tool-craft/SKILL.md` is the playbook.
- **With no candidate:** say so out loud. It does not disqualify the tool, and it is not a gap to
  paper over. It means either the evidence is thin (add `userFailures` to the seed record and
  re-run) or the tool will genuinely ship with no craft, which has to be a stated decision rather
  than something discovered halfway through a build. **Never invent a touch to fill the slot.**

To record a failure, add `userFailures` to the tool's record in `research/datasets/<domain>.json`
and re-run. Like every other recommendation input, change the evidence, never the report.

## Craft debt: the same question asked backwards

```sh
npm run research:craft      # writes research/reports/craft-debt.json and prints the summary
```

`check:craft --report` lists the craftless backlog grouped by engine, which says where the tools
are and nothing about where the answers are. This joins that backlog against the `userFailures` in
the datasets and splits it in two:

- **ready to polish** - shipped, no `craft`, and a task-level failure already recorded. The touch was
  specified when the seed record was written and then never picked up, so these are the cheapest
  craft work in the catalog. Hand one to the `tool-crafter` agent with its recorded failure.
- **needs evidence** - shipped, no `craft`, no recorded failure. Not a build task: add `userFailures`
  first, or the craft will be invented, which is the failure the doctrine exists to prevent.

When asked what to polish (rather than what to build), this report is the answer, and it is ranked
by demand for the same reason the roadmap is.

## Recording engagement signals

An X probe that lands, a `/feedback/` message, a Search Console pattern - evidence from outside our
own desk research. It goes in as a structured signal, never as a nudge to `demand`:

```sh
npm run research:signal -- --tool <slug> --kind x-probe --strength 60 \
  --observation "what was actually seen, in words" [--url <link>]
npm run research:signal -- --tool <slug> --list
```

**Signals raise `confidence`, never `finalScore`.** A post doing well is not search volume, and one
probe is not a dataset. Say that plainly when presenting a recommendation that carries them, rather
than letting observed evidence read as demand.

## Rules

- The roadmap is generated from evidence (seed datasets in `research/datasets/`), never invented.
  If the recommendation looks wrong, fix the **data** (add/adjust a seed record) and re-run - do not
  hand-edit the report.
- Prefer the highest-scoring opportunities that **reuse an existing engine** (lowest implementation
  cost). New-engine clusters (e.g. CSV, Date & Time) are surfaced in `missing-engines.json` as the
  documented next step - building a new engine is a larger, separate decision (see `add-tool` →
  `references/add-engine.md`).
- To extend coverage, add evidence to `research/datasets/<domain>.json` (the seed-dataset provider
  picks it up automatically) or wire a live provider via the seam in
  `src/lib/research/providers/` (one import + one entry in `src/lib/research/registry.ts`).

## How the engine works (for deeper questions)

Full subsystem docs: `docs/research-intelligence.md`. Architecture, scoring weights
(`src/lib/research/config.ts`), the unified Opportunity model, engine detection, the problem graph,
and how to add a provider / analyzer / scorer / report.
