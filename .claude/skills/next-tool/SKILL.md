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

1. **Run the engine** (validates first, then writes reports):
   ```sh
   npm run research:validate   # gate: datasets + registry + report integrity
   npm run research:next       # writes research/reports/next-build.md and prints it
   npm run research:report     # full bundle (roadmap.md, opportunities.json, missing-engines.json, ...)
   ```
2. **Read the evidence**: `research/reports/next-build.md` (the headline recommendation) and
   `research/reports/top-opportunities.json` (ranked alternatives + scores).
3. **Present the recommendation** with reasoning - cover all of:
   - why it matters (search demand, evergreen),
   - why existing search results are weak (`incumbentWeakness`),
   - why ToyTools can compete (`whyWeCanWin`: client-side/private, engine reuse, clean SERP),
   - the reusable engine and the additional tools it unlocks,
   - suggested guides, FAQs, internal links, and JSON-LD schema,
   - estimated effort, long-term SEO value, and maintenance cost.
4. **Confirm scope** with the user if they have not already said "build it" (how many tools, which
   ones from the ranked list).
5. **Implement** via the **`add-tool`** skill / `npm run scaffold:tool` - the RIE only decides
   *what* and *why*; `add-tool` owns *how*. Each tool ships config + widget + guide + FAQ + knowledge
   + registry wiring + tests, then `npm run build` and `npm run test`.

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
