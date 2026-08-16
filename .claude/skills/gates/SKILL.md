---
name: gates
description: The ToyTools verification contract and its five hard gates - npm run verify, the performance budget, query coverage, the fold ratchet, and tool craft. Use when a gate fails and you need the diagnosis playbook, when deciding whether a threshold may move, when changing scripts/verify.sh or .github/workflows/quality-guardian.yml, or when asked why a check exists. Read before touching any threshold, budget, ratchet floor or validator exemption.
---

# Gates

Five hard gates plus one verification runner. Four of them are **ratchets**: the number in the
script records what the catalog achieves today, and it moves in exactly one direction, in the same
commit as the change that earns it. The fifth, `seo:gate`, is a fixed bar rather than a ratchet —
its minimums live in `seo-engine/config/content-intelligence-rules.json` (`gates.overall` 75, plus
per-criterion minimums and `maxEmDashes: 0`) and the **`seo-content` skill** owns it.

**The rule that governs all of them: never weaken a check to get past it.** No raising a budget, no
lowering a floor, no deleting an assertion, no adding a validator exemption without saying so
explicitly in the PR and giving the reason. If you believe a threshold is genuinely wrong, say that
out loud and argue it; do not edit it quietly on the way to green.

## 1. `npm run verify` — the done-condition

**Any change to shipped code is finished when `npm run verify` exits 0, and not before.**

```sh
npm run verify        # the done-condition
npm run verify:fast   # everything except e2e. Inner loop only, NOT a done-condition.
```

Steps, in order, from `scripts/verify.sh`:

| # | step | needs `dist/` |
|---|---|---|
| 1 | unit tests (`npm run test`) | no |
| 2 | coverage thresholds (`npm run test:coverage`) | no |
| 3 | build with `KNOWLEDGE_REQUIRED=true` | builds it |
| 4 | platform health (`npm run health`) | yes |
| 5 | query coverage (`npm run check:queries`) | yes |
| 6 | tool craft (`npm run check:craft`) | yes |
| 7 | content graph (`npm run seo:graph`) | yes |
| 8 | Quality Guardian (`npm run quality:pr`) | yes |
| 9 | `seo:gate` per tool directory changed against `origin/main` | yes |
| 10 | e2e, chromium **and** pixel5 | yes |

Takes about three minutes.

**Steps 1, 2 and 9 onward run even after an earlier step fails, so one pass reports several
problems at once. Steps 4 to 8 do not: they read `dist/`, so a failed build skips all five** and the
run tells you so. A red build therefore hides five gates, and the first fix is always the build.

Step 7 exists because `seo:gate` scores `topicCluster` from `seo-engine/cache/content-graph.json`,
which is gitignored. Regenerating it here rather than trusting whatever a previous run left behind
is the point: a stale graph silently moves a tool's score, so a local pass meant nothing about CI
until this ran in both places.

### Why this exists

`build` + `test` + `test:e2e` is **not** the gate and never was: it skips the coverage thresholds,
the health check and Quality Guardian entirely. Work that passed those three still arrived as a red
PR (14 redirect stubs tripping the canonical validator, 2026-08-04).

A **Stop hook** (`.claude/hooks/verify-on-stop.sh`, wired in `.claude/settings.json`) runs `verify`
automatically whenever a turn ends having changed `src/`, `scripts/`, `tests/`, `public/`,
`quality-guardian/`, `seo-engine/`, `package.json`, `astro.config.mjs`, `tsconfig.json` or
`playwright.config.ts`, and blocks on failure. It never blocks twice in a row, so a genuinely stuck
run can still end and report honestly. Touch `.claude/.skip-verify` to opt a session out
deliberately.

### The local run and CI are not identical, and the difference is deliberate

`npm run verify` mirrors `.github/workflows/quality-guardian.yml` **with one intentional exception**:

| | local `verify` | PR CI | weekly CI |
|---|---|---|---|
| chromium e2e | yes | yes | yes |
| **pixel5 e2e** | **yes** | **no** | **yes** |

The PR job runs `npx playwright test --project=chromium` for speed. `verify.sh` says so in a comment
at its e2e step.

**Consequences you must know**, because two gates live behind that line:

- `tests/e2e/fold.spec.ts` starts with `test.skip(testInfo.project.name !== 'pixel5')`. **Every fold
  assertion is skipped on a PR.** The fold ratchet is enforced by the local run and the weekly
  audit, not by the PR.
- `tests/e2e/craft.spec.ts` runs on both projects, but its 48px touch-target assertion is inside an
  `if (testInfo.project.name === 'pixel5')` branch, so that half is PR-invisible too.

So a phone regression can merge green. Running `npm run verify` locally is the only thing standing
in front of it, which is why the Stop hook exists and why `verify:fast` is not a done-condition.

**If a step in the workflow changes, change `scripts/verify.sh` in the same commit, and the reverse.**
A check that only one of them runs is a check that catches nothing. The pixel5 row above is the one
sanctioned divergence; anything else is drift and should be fixed, not documented.

## 2. Performance budget

**Every page has a byte budget and `npm run build` fails when one is exceeded.** Not advisory.
`scripts/check-budget.ts` measures the built `dist/`: render-blocking stylesheets, all JS the page
fetches on load, and the HTML document, all gzipped. It resolves the *actual* lazy chunks a page
pulls (the engine in `<meta name="tt-engines">`, the model in `data-simulation-id`, the calculator
in `data-wellness`), so the numbers match a real browser trace rather than over- or under-counting.

```sh
npm run check:budget                              # runs last inside npm run build; needs dist/
npm run check:budget -- tool/text/word-counter    # print specific pages
```

Budgets live in `BUDGETS` in `scripts/check-budget.ts`. Read them from the script rather than from
any prose copy, including this one, because the script is the one that fails the build. As of
2026-08-16 they are:

| kind | sheets | CSS | JS | HTML | TOTAL |
|---|---|---|---|---|---|
| tool | 6 | 16 KB | 24 KB | 34 KB | **60 KB** |
| guide | 4 | 13 KB | 8 KB | 26 KB | 42 KB |
| category | 4 | 12 KB | 8 KB | 26 KB | 40 KB |
| page | 4 | 12 KB | 12 KB | 30 KB | 48 KB |

A typical new tool lands around **33 to 40 KB gzipped total**, so there is real headroom for
content. When a new tool blows the budget the cause is structural far more often than editorial:

- **JS over budget** → the tool's engine is pulling something it should not, or an engine got
  statically imported back into `src/lib/runtime/index.ts`. Engines must stay lazy (`ARCHITECTURE.md`
  → "Client Runtime"). A two-line static import regressed 134 pages when tested.
  A second shape: an engine whose runtime module imports its **whole processor registry**, so every
  new tool on that engine makes every existing page on it heavier. `wellness` hit its budget that way
  at eleven calculators and now loads exactly one, keyed by the widget's `data-wellness` attribute
  (`src/lib/engines/wellness/lazy.ts`). Prefer this the moment an engine passes a handful of
  processors.
- **Sheets/CSS over budget** → a route is globbing components outside its own segment, hoisting other
  tools' stylesheets onto the page. Never reintroduce a cross-segment widget glob.
- **HTML over budget** → the page emits far more markup than its siblings (runaway FAQ, duplicated
  JSON-LD, a widget rendering per-item DOM it could render on demand).

**Fix the cause; do not raise the budget.** Raising a number in `BUDGETS` spends every visitor's
bandwidth and needs a reason in the PR. `EXCEPTIONS` is for pages whose weight is inherent to what
they are (only `/architecture/`, which renders the Mermaid map) and still caps them.
Background: `docs/analysis/2026-07-31-critical-path-performance.md`.

## 3. Query coverage

`scripts/check-query-coverage.ts` asserts that a user's query reaches the tool that answers it.

```sh
npm run check:queries                 # the gate; needs dist/; runs inside npm run verify
npm run check:queries -- --report     # full per-query listing, never fails
npm run check:queries -- <slug>       # drill into one tool
```

It builds one corpus from evidence already in the repo (`searchQueries` in
`research/datasets/*.json`, `src/data/search-aliases.ts`, every `knowledge.ts` keyword and entity
alias) and checks three things:

- **retrieval** — the intended tool is in the top 3 of the real ranker (`src/lib/search/rank.ts`)
- **targeting** — the query's discriminating words appear in the built page's `<title>`, `<h1>`, an
  `<h2>` or the meta description. **Body prose does not count**, which is the whole point: the
  2026-08-04 slug rename stripped "simulator" from every simulation's URL, title and H1 in one
  commit, left the word only in body copy, and nothing noticed.
- **headings** — every tool page has an H2 that names a concept

All three are ratchets. Raise a floor after a real improvement, in the same commit. Never lower one,
and **never satisfy targeting by stuffing keywords into a title**: cover the intent instead.

It also writes `seo-engine/cache/query-coverage.json`, which is what `seo:gate` scores its
`queryTargeting` criterion from, so the corpus is defined exactly once. A tool that has never been
measured is reported as such and the criterion is skipped, because an unmeasured tool is not a
passing one.

Know its boundary: the corpus is assembled entirely from phrases **we** authored. A green run means
the catalog is internally consistent, not that it beats anything on a real SERP.
Background: `docs/analysis/2026-08-04-query-to-tool-matching-audit.md`.

## 4. The fold ratchet

`tests/e2e/fold.spec.ts` asserts on **Pixel 5, for every tool**, that the chrome above the tool stays
under `CHROME_LIMIT` of the viewport and that the first usable control stays under `FOLD_LIMIT`.
Both **only ever move down**, in the same commit as the change that earns it. A rise means a page
grew a masthead.

Remember from section 1 that this spec **skips entirely on a PR** and only really runs locally and
weekly.

Measured 2026-08-08 across all 119 tools then in the catalog, before and after the tool identity
work: chrome went from a median 59% of the phone's first screen to 34%, and tools with no usable
control on the first screen went from 30 to 6 (the remaining six are generators whose result panel
correctly sits above their controls).
Background: `docs/analysis/2026-08-08-tool-identity-architecture.md`.

The page grammar it protects (Zone A "do", Zone B trust, Zone C "know") is in `ARCHITECTURE.md` →
"Design Language" → "Page grammar", with two rules: **chrome belongs to whoever owns the page** (a
tool page renders `ToolBar`, not `Nav`, and carries no visible breadcrumb) and **the widget renders
the tool, the platform renders everything that is not the tool** (`validate-architecture` fails the
build if anything under `src/tools/` imports `CategoryDiscovery`).

## 5. Tool craft

```sh
npm run check:craft              # the gate; needs dist/; runs inside npm run verify
npm run check:craft -- --report  # per-tool listing + the backlog by engine, never fails
```

Three ratchets in `THRESHOLDS` in `scripts/check-craft.ts`, plus `tests/e2e/craft.spec.ts`:

| ratchet | direction | what a move means |
|---|---|---|
| `coverage` — **fraction** of non-sim tools declaring a craft | only **rises** | a drop means a tool shipped with nothing of its own |
| `boxesPerTool` — box-drawing rules in the worst single widget | only **falls** | a rise means craft was bought with clutter |
| `rawHex` — hardcoded colours in widget styles | only **falls** | every colour comes from a token |

Coverage is a ratio rather than a count deliberately: a count lets a new tool ship craftless without
moving the number, while a ratio falls as the catalog grows without craft, and nobody has to
maintain a list of what is new.

**Know how much this actually enforces before you rely on it.** As of 2026-08-16 coverage is
**5/107 (4.7%) against a floor of 4.6%**, so the gate tolerates roughly one new craftless tool
before it trips; two in a row fail it. It is a floor under a backlog, not proof that the catalog has
craft. 102 tools have none. Treat "every new tool carries a thoughtful touch" as a rule the
**`tool-craft` skill** enforces on you, and this gate as the coarse net underneath it.

Craft declaration itself (picking the kind, building it minimally, declaring it, proving it) belongs
to the **`tool-craft` skill**, not here. The one part that is a build gate: a `craft.id` declared in
`config.ts` whose `data-craft="<id>"` never reaches the DOM **fails the build**, which is what stops
the field becoming documentation that rots.

## When a gate and this document disagree

The script wins. Every threshold quoted here carries a date because it is a snapshot of a ratchet
that is supposed to move. Read the number out of the script before acting on it, and if the drift is
large enough to mislead, fix the prose in the same commit.
