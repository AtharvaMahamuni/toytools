# AI-era strategy

ToyTools stays a static, private, client-side utility platform. The framework is already registry, config, engine, page. This document is the product shift on top of that framework: generate many useful instruments, each one a configuration of an engine that already exists.

The rules for a single tool are `docs/tool-design.md`. This page is why those rules exist, and in what order the catalog moves.

## The line

Make ToyTools useful.

Five years ago a calculator was useful because it was the way to get the number. Today a one-shot answer is often a chat message. Tomorrow the page that is still worth opening is the one that stays live: scenarios, a breakdown, a comparison, a picture, a copy, a file, a private record. A JSON formatter earns the same way when it also validates, diffs, and keeps the document on the device. A physics explanation is a chat answer. A physics experiment can be a ToyTools page when someone learns by moving the model.

That is the whole pivot. The site does not become an "AI-resistant tools" brand. AI is the reason the bar for useful moved.

## From a keyword to a job

```
user job
  → tool definition (job on ToolConfig, or on the simulation manifest)
  → an existing engine
  → interaction that engine and the design system already render
  → the tool page
       guide, FAQ, related tools, JSON-LD, llms.txt
```

Related tools, guides, FAQs, structured data, and the llms files are projections. `toolFacts()` (`src/lib/llms/facts.ts`) is the per-tool projection. HTML metadata, the knowledge graph, and the sitemap are the others. Author a fact once, on the config, the knowledge file, or the manifest. Do not keep a sixth handwritten description in sync by hand.

`job` is the new fact. It is not rendered yet. When a surface needs it, read it through `toolFacts()` in the same change. Do not start a parallel `llms` paragraph per tool.

## Families

Think in engines, then configurations. `src/data/engines.ts` is the closed list of engines and patterns. `family` groups tools inside an engine. `toolGroup` is the rarer case where several tools share one workspace and one input. `processorId` is the implementation.

A new SIP-style calculator joins the finance engine beside the calculators already there. A new counter joins text analysis. A new codec joins encoding. A new simulation joins the simulation engine as a model. The aim is a few hundred engines at the far end, and many configurations of each. A new engine is a major version bump and a separate decision (`add-tool` → `references/add-engine.md`).

## The catalog we already have

Do not open the next hundred tools as the first move. The tools already shipped are the first wave.

`audit-tool` reads one tool against the scorecard in `docs/tool-design.md` and returns one verdict: keep, improve, merge, replace, or remove. The verdict is a report. It is not stored on the tool and it is not shown to visitors.

`src/lib/tools/job-backlog.ts` is the queue of tools that have no `job` yet. It only shrinks, and only when that tool's job is actually declared. Declaring the field is not the same as redesigning the widget. An audit that says "keep" can record the job and stop. An audit that says "improve" hands the widget to `improve-tool`.

Some tools stay because they are useful even when a chat can approximate them: the person repeats the task, the input is private, or the result is something they copy. That is a keep, stated out loud.

## What this repo already was

The proposal that prompted this document described a new source tree (`src/tool-model/`, `src/interaction-patterns/`, `src/engines/` at the top). Those directories are not how ToyTools is laid out, and they were not added.

| idea | where it actually lives |
|---|---|
| tool registry | `src/data/registry.ts`, derived from the tool directory |
| engines | `src/data/engines.ts` and `src/lib/engines/` |
| tool job | `ToolJob` in `src/data/types.ts`, checked by `src/lib/tools/job.ts` |
| interaction | `docs/interaction-patterns.md`, pointing at widgets that already exist |
| experiment engine | `src/lib/simulation/` |
| page content | `src/tools/<segment>/<slug>/` and, for simulations, the manifest |
| agent procedures | `.claude/skills/` |

Skills describe procedures. The constitution stays in `docs/tool-design.md`. The skills that already covered part of this work kept their names: `add-tool` (create a tool or an engine), `seo-content` (guide, FAQ, knowledge, content audit), `gates` (the verification run), `tool-craft`, `tool-ux-review`, `next-tool`, `ui-design-system`. The two procedures that were missing are `audit-tool` and `improve-tool`.
