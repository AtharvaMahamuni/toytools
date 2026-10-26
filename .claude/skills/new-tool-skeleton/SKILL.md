---
name: new-tool-skeleton
description: Identify, conceptualise and skeleton a new ToyTools tool before any code is written. Use when someone brings a tool idea and asks whether it fits, how it should work, or what files it needs, or before running scaffold:tool. Produces a filled-in spec (template.md) that a coding agent then builds with the add-tool skill. Does not write the tool.
---

# New Tool Skeleton

Three phases, in order, ending in one artifact: a copy of `template.md` with every field filled in.
The **`add-tool`** skill owns *how* to build (the scaffold, hard rules, engine types, the file
checklist in `add-tool/references/add-tool.md`). This skill owns *what* and *whether*, so the build
starts with no open questions. Do not repeat add-tool here; link to it.

If the idea came from the research engine, the **`next-tool`** skill has already done part of
phase 1. Carry its seed record and reasoning into the spec.

## Phase 1: Identify

ToyTools is "the simplest place on the internet to get things done": lightweight, private, free,
fast, static-first, mobile-first, engine-first, with no accounts and no backend.

1. **The job and the substitution test.** Write the `userJob` sentence and run the test in
   `docs/tool-design.md`. When a chat answer is the whole product, stop and report that.
2. **Fit.** Reject the idea, and say why, if it needs a server, an account, a third-party upload,
   live data the site cannot ship statically, or a runtime CDN.
3. **Overlap.** Search the real catalog before naming anything:
   ```sh
   rg -n "slug: '" src/data/categories.ts            # every category
   ls src/tools/*/                                    # every tool directory
   rg -n -i "<idea words>" src/tools/*/*/config.ts src/data/search-aliases.ts
   rg -n -i "<idea words>" research/datasets/*.json   # seed records and proposedTool slugs
   npm run research:next                              # if the idea may already be ranked
   ```
   `docs/code-map.json` answers "where does X live". If an existing tool already does the job,
   the answer is the **`improve-tool`** skill, not a new page.
4. **Category, slug, name.** Pick an existing category from `src/data/categories.ts`. A new
   category is a major bump (CLAUDE.md:123-135, "Versioning & changelog") and a decision for Atharva,
   not for the agent. The slug is kebab-case and permanent (a rename is a redirect and a minor
   bump). The em dash ban covers every piece of text
   the tool ships and everything around it: name, title, tagline, description, FAQ, guide,
   knowledge, aliases, code comments, commit messages, the CHANGELOG and the PR body.
   Tool and category names use "and", never "&" ("Date and Time", not "Date & Time"; Atharva,
   26 Oct 2026). `scripts/scaffold-tool.ts` refuses a name with "&" and the registry check
   fails on one (`scripts/validate-registry.ts`, run by `npm run build`); the few older names that still have "&" are grandfathered in that script, so do
   not copy them.

## Phase 2: Conceptualise

1. **One-line job, inputs, outputs.** Inputs with units and ranges; outputs with precision.
2. **Engine API first, UI second.** Name the engine (`src/data/engines.ts`,
   `add-tool/references/tool-classification.md`) and write the pure function signature: plain
   data in, plain data out, no DOM, testable in Vitest. Reuse an existing engine whenever one fits;
   a new engine is `add-tool/references/add-engine.md` and a major bump.
3. **Interaction.** Pick the pattern from `docs/interaction-patterns.md`. A bespoke widget is
   only for a job the shared widgets cannot express.
4. **Edge cases.** Empty input, zero, negative, huge values, invalid formats, locale and time
   zone, leap years, rounding to the cent, and what the page says in each case.
5. **Privacy.** Nothing is saved by default.
   - `keepInput` (`src/data/types.ts`) is only for work-in-progress inputs people come back to
     on a `private` page.
   - URL sync follows `src/lib/url-state.ts`: `off` for secrets, `manual` for personal or pasted
     content, `auto` only for short impersonal values. The mode is derived from engine and
     pattern, so check which one the tool lands in.
   - Never store a Wi-Fi password or any credential (see `src/lib/privacy/legacy-storage.ts`,
     which strips `wifiPassword` from QR state).
6. **Craft.** The one thoughtful touch, from the **`tool-craft`** skill: a real user failure the
   engine alone does not catch. If there is none, say so in the spec.
7. **Size budget.** Every limit below is gzipped and comes from `scripts/check-budget.ts`
   (`BUDGETS.tool`, `BUDGETS.page` and `INTERACTION_ASSETS`), which `npm run build` runs.
   1 KB there is 1,024 B.

   | Budget | Limit | Source |
   |---|---|---|
   | Tool page JS (entry, static deps and its engine chunk) | 24,576 B (`jsKb: 24`) | `BUDGETS.tool` |
   | Tool page CSS | 18,432 B (`cssKb: 18`), at most 6 stylesheets | `BUDGETS.tool` |
   | Tool page HTML | 34,816 B (`htmlKb: 34`) | `BUDGETS.tool` |
   | Tool page total | 62,464 B (`totalKb: 61`) | `BUDGETS.tool` |
   | `/search/` HTML (one card per tool, so every new tool grows it) | 31,744 B (`htmlKb: 31`) | `BUDGETS.page` |
   | `search-terms.json` (aliases and tags, fetched on search) | 10,240 B (`maxKb: 10`) | `INTERACTION_ASSETS` |
   | `search-index.json` | 12,288 B (`maxKb: 12`) | `INTERACTION_ASSETS` |

   Headroom measured with Node `gzipSync` (the same call `check-budget.ts` makes):
   `search-terms.json` 10,042 B, so **198 B** left. `/search/` HTML was 31,632 B (**112 B**
   left) in the 2026-10-25 build of main and 31,519 B (225 B left) on 2026-10-26, because every
   card carrying a New badge (`addedOn` within five days) costs bytes until the badge expires.
   Plan against the smaller figure. Every new tool adds a search card and its aliases, so measure
   both before and after the tool lands.

   When a new tool trips one, trim or isolate. Never raise it. Trim means shorter aliases and
   tags, leaner widget CSS or a shorter description. Isolate means moving a heavy library behind
   a dynamic `import()` fired by user action, keeping engine runtimes lazy through
   `src/lib/runtime/loaders.ts`, or splitting shared CSS. Budgets only fall (CLAUDE.md, "The six
   hard gates"). Raising one is Atharva's decision, with the reason recorded in a comment in
   `check-budget.ts`, never an agent's.

## Phase 3: Skeleton

The pattern below is taken from the three newest tool PRs: #265 (loan-calculator on `finance`,
image-palette-extractor on `color`, pregnancy-due-date-calculator and ovulation-calculator on
`datetime`), #259 (connect-4, chess-tac-toe, quantum-tic-tac-toe) and #256. Read
`git show --stat 3336600c` for the full file list of #265.

Generate the tool directory with the scaffold (`--dry-run` first), never by hand:
```sh
npm run scaffold:tool -- --slug <slug> --name "<Name>" --category <category> \
  --engine <engine> --pattern <pattern> --family <family> --processor-id <id> \
  --description "<meta description>" --faq --guide --dry-run
```

| Part | Files (from #265) | Notes |
|---|---|---|
| Engine logic | Follow the engine's own layout, since there is no single path. Calculator engines (`finance`, `datetime`, `math`, `network`, `wellness`) use `src/lib/engines/<engine>/calculators/<id>.ts`, and their `registry.ts`. A `lazy.ts` per-calculator loader exists only where importing the whole registry would make every page heavier (`finance`, `datetime`, `wellness`); `math` and `network` have none, so do not add one for a light calculator. Flat engines (`color`, `units`, `audio`, `hashing`) use `src/lib/engines/<engine>/<name>.ts`; a heavy one adds a `<name>-lazy.ts` (`color/palette-lazy.ts`). `board-game` keeps its rules in `rules/`. | Pure. Unit tests go next to the engine (`finance.test.ts`, `datetime.test.ts`, `palette.test.ts`). Anything lazily loaded also gets a lazy-load test: `finance/lazy.test.ts`, `datetime/lazy.test.ts`, `color/palette-lazy.test.ts` |
| Engine runtime | `src/lib/runtime/engines/<engine>.ts` | Only if the engine surface grows; keep it lazy |
| Tool directory | `src/tools/<segment>/<slug>/config.ts`, `Widget.astro`, `faq.ts`, `Guide.astro`, `knowledge.ts` | Nothing else goes in the folder (add-tool hard rule 3) |
| Config fields | `job`, `tagline` (80 chars max), `description`, `tags`, `craft`, `citation` with a specific `nonGoal`, `methodology`, `trustVariant`, `addedOn` (the ship day, `YYYY-MM-DD`; it drives the New badge for five UTC days, see `src/lib/tools/freshness.ts`). `scaffold:tool` stamps the India-time (IST) day it runs (`indiaDay()` in `scripts/scaffold-tool.ts`), so re-stamp it if the tool ships on a later day | `loan-calculator/config.ts` is a complete example |
| FAQ and JSON-LD | `faq.ts` | The platform renders the schema, so never add JSON-LD by hand. FAQPage comes from `src/components/tool/ToolPage.astro`, and Article comes from `src/layouts/GuideLayout.astro` |
| Guide | `Guide.astro`, plus the ship day in `src/data/guide-published.ts` | validate-registry fails a guide with no entry |
| Knowledge | `knowledge.ts` | `primaryConcepts[0]` heads the page H2s, so it drives query targeting |
| Search terms | `src/data/search-aliases.ts`, `tags` | Phrases are unique across the file. `search-terms.json` is capped at 10,240 B gz and `/search/` HTML at 31,744 B (see Phase 2, step 7); measure both |
| Icon | a unique glyph in `src/lib/icons/glyphs.ts` and `SLUG_GLYPH` in `src/lib/icons/tool-icon.ts`, then `npm run icons:generate` | Commit the `public/icons/tool/<slug>-192.png` and `-512.png` it writes |
| Generated files | `src/data/registry.generated.ts`, `faq-registry.generated.ts`, `guide-registry.generated.ts`, `src/lib/knowledge/registry.generated.ts`, `docs/code-map.json` | Only through `npm run registries:generate` and `npm run map:generate`. Never hand-edit `*.generated.ts` |
| Research seed | a record in `research/datasets/<domain>.json` with `proposedTool: <slug>` and real `searchQueries` | `npm run research:validate`, then regenerate reports with the research scripts |
| Query coverage | every seed query's words in the title, description, H1 or an H2 | `npm run check:queries -- <slug>` must keep targeting at 100% |
| Unit tests | engine tests next to the engine | Coverage thresholds run in verify |
| e2e | `tests/e2e/<slug>.spec.ts`, plus `fold.spec.ts` on Pixel 5 | `discovery.spec.ts` may need the new tool |
| Render unit | the widget renders the tool only | Tool Render Unit contract in `ARCHITECTURE.md`: one `[data-tool=<slug>]` root, no shell, catalog or brand markup, so it stays embed-ready (`src/data/embeddable.ts`) |
| llms files | `citation.nonGoal`, `tagline`, and `CORE_TOOL_SLUGS` or `PREP_HIGHLIGHT_SLUGS` in `src/lib/llms/render.ts` if it joins a list | Read `dist/llms.txt` and `dist/llms-full.txt`, then `npm run llms:golden` and commit the golden diff |
| Prep category | only if the tool prepares text for an AI model (`prep` in `categories.ts`) | Keep the category's "ToyTools does not run a model" promise |

## PR checklist (copy into the spec)

- Version per CLAUDE.md:123-135, "Versioning & changelog": a new tool is a **minor** bump, a new
  category or engine is **major**; `npm run version:bump` plus a hand-written CHANGELOG entry.
- PR body line: `llms files: updated` or `llms files: no change needed`, with one reason.
- `npm run check:queries` at 100% targeting, `npm run check:craft`, `npm run check:budget`.
- `npm run verify` run alone, exit 0, then push; CI green on Content Gate, E2E (chromium),
  E2E (pixel5), PR Quality Check and GitGuardian.

## Output

Copy `template.md` from this directory into the task or PR description and fill in every field.
A field that cannot be filled is an open question for Atharva, listed at the end, not a guess.
Hand the finished spec to the **`add-tool`** skill to build.
