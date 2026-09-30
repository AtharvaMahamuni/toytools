# ToyTools tool design

ToyTools is a utility platform. A person opens a tool to do a job, on their own device, and leave with a result.

A page exists because a user job exists. Search demand is evidence for what to consider (`next-tool`). It is not, by itself, a reason to add a page.

Make the tool useful. A chat model changes what useful means: a one-shot answer is often enough, and a page earns its place when interaction, repetition, local processing, or an artifact still matters. Do not brand the site as a refuge from AI, and do not add controls whose only purpose is to look unlike a chat answer.

## Before a tool is implemented

Write `userJob` first. One sentence, the job a person is hiring the page to do.

A title is not a job. "Percentage Calculator" names a page. "Calculate a percentage change from an old value and a new value, on this device." names a job.

Then run the substitution test:

1. Write the chat answer a person would get for this job, in one sentence.
2. Name the interaction, the local processing, or the artifact that still makes this page worth opening.
3. When that second sentence is empty, stop. Report that the tool should not be implemented.

The build records the outcome on the tool as `job` (`ToolJob` in `src/data/types.ts`). A new tool sets it on `config.ts`. A new simulation sets it on its manifest. `scripts/validate-registry.ts` fails a tool that is not on `src/lib/tools/job-backlog.ts` without a usable job. The shape check is `isDeclaredJob()` in `src/lib/tools/job.ts`.

`job` is machine-readable and internal. It is not rendered, and it is not a public score.

## What each field is for

| field | records |
|---|---|
| `intent` | the kind of work, from the closed `ToolIntent` list in `src/data/types.ts` |
| `userJob` | the sentence above |
| `repeatability` | whether someone comes back with new inputs (`low` once, `medium` now and then, `high` as a habit) |
| `interactionDepth` | how much they operate the tool (`low` read one number, `medium` a live breakdown or a second case, `high` they manipulate a model) |
| `privacyValue` | whether the input is something they would keep off a chat box (`low` impersonal figures, `high` private text or records) |
| `aiSubstitutability` | how completely a one-shot chat answer replaces the page (`high` means the chat is the whole product) |
| `browserOnly` | `true` when the work happens in the page. `false` when the browser calls out, as a lookup does. ToyTools still has no server of its own |

`aiSubstitutability: "high"` is a legal value. It is also the usual reason to stop at the substitution test. Record it honestly when a tool ships anyway, so a later audit can see the judgment.

Short input and output descriptors stay on `ToolConfig.inputs` and `ToolConfig.outputs`. The sentences assistants read stay on `knowledge.ts`. `toolFacts()` in `src/lib/llms/facts.ts` is the projection that feeds `llms.txt`, `llms-full.txt`, and the JSON-LD abstract. Do not author a second description for each of those surfaces. `citation.problem` is the public "when to send someone here" sentence and may match `userJob`. `tagline` is the line under the title. `description` is the meta description.

## The scorecard

Internal. One tool at a time. No total, no badge, no page.

1. Is there a real user job?
2. Is repeated interaction useful?
3. Is manipulation required?
4. Is privacy valuable?
5. Is immediate feedback useful?
6. Does the tool produce an artifact or a result someone keeps?
7. Can it work entirely in the browser?
8. What would make someone open this instead of asking a chat model?

Questions 1, 2, 3, 4, 7, and 8 are the `job` fields. Questions 5 and 6 are answered in the audit and are not stored. The procedure and the five verdicts (keep, improve, merge, replace, remove) are the `audit-tool` skill.

## How the page behaves

Choose the interaction from the job. A calculator that only shows `A`, `B`, and a result is the right page when that is the whole job. When the job is a change, a comparison, or a check, the page grows the pieces that job needs: a live result, a breakdown, a second case, the formula, a validation, a picture, a copy, or a link.

The inventory of what already exists, and the instruction to compose it, is `docs/interaction-patterns.md`. A new visual pattern is a design-system change (`ui-design-system`), not a folder invented for one tool.

## Simulations

Educational simulations are allowed when they provide a useful interactive experiment. ToyTools stays a utility platform. Prefer a small simulation that solves one conceptual or calculation task.

A simulation is one model on the existing simulation engine (`ARCHITECTURE.md` → "Simulation Platform"): parameters, derived values, the shared renderer, and the shared controls. Register the model in the domain plugin for that subject (`src/lib/simulation/plugins/<domain>/`). Physics, applied math, and chemistry already have plugins. A new subject is a plugin plus an engine row, not a new app and not a new page framework.

## What to prefer, and what to leave

Prefer a tool that performs an action, transforms data, analyzes data, validates data, compares scenarios, or runs a focused experiment, in the browser, and produces a result someone can copy, export, compare, or check again.

Leave a page whose purpose is a static answer, arithmetic someone does once and never repeats, an explanation with nothing to operate, or a keyword with no job behind it.

## Where the work goes

| you are... | follow |
|---|---|
| adding a tool or an engine | `add-tool` |
| deciding what to build next | `next-tool`, then the substitution test on this page |
| auditing a shipped tool | `audit-tool` |
| deepening a thin tool | `improve-tool` |
| writing a guide, FAQ, or knowledge file | `seo-content` |
| proving the change | `gates` (`npm run verify`) |

The shift this sits inside, including families, discoverability, and the order of the migration, is `docs/ai-era-strategy.md`.
