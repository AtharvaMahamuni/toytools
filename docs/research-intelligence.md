# Research Intelligence Engine (RIE)

A permanent ToyTools subsystem that answers **"What should we build next, why, and how?"** from
evidence rather than intuition. It sits alongside the Registry, Content Intelligence, Knowledge
Graph, and SEO Engine, and is the engine behind the `next-tool` skill and the `research-intelligence`
subagent.

The RIE deliberately mirrors the **Content Intelligence** layer (`src/lib/content-intelligence/`):
every analyzer is a pure function over one injected inputs bundle, it reads the real registries, it
never throws, and it is fully deterministic so reports are diffable and testable.

> Content Intelligence answers "where are the gaps in our *current* content?" (supply side). The RIE
> adds the *demand* side: what real users repeatedly need, scored into build recommendations.

## Commands

```sh
npm run research            # run pipeline, validate, write the full report bundle (default: report)
npm run research:report     # same as above (explicit)
npm run research:roadmap    # write roadmap.md + next-build.md
npm run research:next       # write + print next-build.md (the headline recommendation)
npm run research:clusters   # write clusters.json
npm run research:gaps       # print gap classification + write missing-engines.json
npm run research:latent     # write + print latent.md + latent.json (second-order demand)
npm run research:craft      # write + print craft-debt.json (shipped tools with no thoughtful touch)
npm run research:status     # is the report bundle on disk still current? FRESH / STALE
npm run research:signal     # record one observed engagement signal into a seed record
npm run research:validate   # CI gate: validate datasets + registry + report integrity (exit 1 on error)
```

On-demand only - **never wired into `npm run build`** (like `intel` and `health`).
`research:validate` is safe to run in CI. Set `RESEARCH_NOW=<iso>` to pin the timestamp for
byte-stable output.

## Data flow

```
research/datasets/*.json
        │  (CLI loads + JSON-parses)
        ▼
Providers.discover(ctx)  ── seed-dataset (real) + 15 live-API seams (return [])
        ▼  RawOpportunity[]
deduplicate → opportunity-score (normalize + scorers) → Opportunity[]
        ├── cluster            → topic clusters
        ├── engine-match       → engine recommendations + missing engines
        ├── gaps               → gap classification vs the catalog
        ├── trend              → demand by transformation
        ├── topic-cluster      → problem graph (nodes/edges/adjacency)
        ├── roadmap            → tiers + the next-build recommendation
        ├── craft-debt         → craft declarations x recorded failures (the catalog, backwards)
        └── latent-demand      → derived silences + anchored latent candidates (separate ranking)
        ▼
reports/{markdown,json,csv}  →  research/reports/*  (+ dated snapshot)
```

All of this is pure (`src/lib/research/pipeline.ts`). The CLI (`scripts/research.ts`) is the only
part that touches the filesystem.

## Folder map

```
src/lib/research/
  index.ts         catalogInputs() + defaultInputs() + runResearchIntelligence()  (wires registries)
  pipeline.ts      runPipeline() - the pure orchestrator
  config.ts        SCORE_WEIGHTS, LATENT_WEIGHTS, THRESHOLDS, LATENT_THRESHOLDS, REPORT_PATHS
  fingerprint.ts   inputs hash, so a committed report can say what it was generated FROM
  constants.ts     ProviderId / IntentKind / OpportunityStatus / Difficulty / GapKind / RoadmapTier
                   / LatentSignalKind / LatentStatus
  types.ts         ResearchInputs, CatalogRef
  registry.ts      PROVIDERS[] + ANALYZERS/SCORERS metadata
  taxonomy.ts      RESEARCH_TAXONOMY (domain → transformation → expected[])
  validate.ts      validateRegistry / validateDatasets / validateReports / validateAll
  fixtures.ts      test fixtures (raw(), makeInputs(), ...)
  models/          opportunity, provider, problem, engine, cluster, roadmap, latent, report
  providers/       seed-dataset/ (real) + 15 live seams + _stub.ts
  analyzers/       deduplicate, intent, transformation, workflow, similarity, related-tools,
                   opportunity-score, cluster, engine-match, missing-engine, topic-cluster,
                   gaps, trend, guide-generator, faq-generator, roadmap, craft-debt,
                   io-graph, latent-demand
  scorers/         demand, competition, evergreen, implementation, engine-reuse, seo,
                   localization, algorithmic-fit, corroboration, confidence
  reports/         markdown, json, csv

research/
  datasets/        text.json developer.json datetime.json sysadmin.json ...  (committed evidence)
  reports/         generated bundle + snapshots/             (committed)
  cache/           gitignored

scripts/research.ts, scripts/research-signal.ts, scripts/validate-research.ts, scripts/research-lib.ts
```

## Provider lifecycle

Every provider implements the same interface and is pure/deterministic:

```ts
interface Provider { id: ProviderId; discover(ctx: ProviderContext): RawOpportunity[]; }
```

- A provider never calls another provider and never writes reports - it only collects evidence.
- The **seed-dataset** provider is the only one with data: it normalizes curated records from
  `research/datasets/*.json` (handed in via `ctx.datasets`) into `RawOpportunity[]`. The CLI reads
  the files; the library never touches the filesystem, so it is browser/test safe.
- The other 15 providers (`reddit`, `github`, `autocomplete`, ...) are **live-API seams**: stubs
  built by `providers/_stub.ts` that return `[]`. Wiring a real source is purely additive (implement
  `discover()`, keep network/secret access inside the method) with **no** change to any existing
  provider, analyzer, or to the registry shape.

### Add a provider

1. Create `src/lib/research/providers/<id>/index.ts` exporting a `Provider`.
2. Add one import + one array entry in `src/lib/research/registry.ts`.
3. Add the id to `PROVIDER_IDS` in `constants.ts` if it is new.
   That is the only wiring - `defaultInputs()` runs every registered provider automatically.

## Analyzer lifecycle

Analyzers are pure functions composed in order by `pipeline.ts`. Each takes typed inputs and returns
a typed report fragment; none reads module globals. The most important one is **transformation**: it
treats problems as reusable, engine-agnostic *transformations* ("CSV Diff", "Diacritic Removal") so
the engine/cluster analyzers can group them - the system thinks in transformations and engines, not
one-off tools.

### Add an analyzer

Add `analyzers/<name>.ts` (a pure function), call it from `pipeline.ts`, extend the report model in
`models/report.ts` if it produces a new artifact, and add its name to `ANALYZERS` in `registry.ts`.

## Opportunity model

`models/opportunity.ts` is the single normalized schema every provider funnels into - no
provider-specific fields survive past normalization. `id` is derived deterministically from
`proposedTool` (stable across runs → dedup + stable tests). It carries evidence (problem,
existingSolutions, solutionWeaknesses, searchQueries), the ten 0..1 signal scores, `confidence`,
the `finalScore` (0..100), the catalog `gap` classification, and `status`.

## Scoring methodology

Each signal is a dedicated pure scorer in `scorers/` returning 0..1. `finalScore` is their
sum-normalized weighted blend (`SCORE_WEIGHTS` in `config.ts`), scaled to 0..100:

| Signal | Meaning (1 = best) | Source |
|--------|--------------------|--------|
| searchDemand | search volume proxy | `demand` |
| competition | openness (weak/few incumbents) | `competition` |
| evergreen | durable need | `evergreen` |
| implementationCost | ease to build (cheap) | `implementation` |
| engineReuse | reuses an existing engine | `engine-reuse` |
| seoPotential | query breadth + demand | `seo` |
| topicClusterPotential | siblings sharing the transformation | computed in `opportunity-score` |
| commercialPotential | transactional intent + demand | computed in `opportunity-score` |
| localizationPotential | language independence | `localization` |
| algorithmicFit | a deterministic algorithm (not AI) solves the need exactly | `algorithmic-fit` |

`algorithmicFit` is the standing AI-vs-algorithm check: every candidate is scored on whether an
exact client-side algorithm genuinely beats an AI answer (math, conversions, simulations = 100).
AI-shaped needs (generation, judgment, summarization) score low, because they mismatch the
static-site architecture and their queries are being absorbed by chatbots; the roadmap adds a
CAUTION reason below 50. Set it per record in `research/datasets/*.json` (omitted = 85).

`confidence` is the fraction of independent evidence signals that fired, boosted by corroborating
providers. Tuning is data: edit `SCORE_WEIGHTS` / `THRESHOLDS`, never the analyzer logic.

### Add a scoring metric

Add `scorers/<name>.ts`, call it in `analyzers/opportunity-score.ts`, add a field to
`OpportunityScores`/`Opportunity` and a weight in `SCORE_WEIGHTS`, and add the name to `SCORERS`.

## Latent demand (second-order): what nobody is searching for

`finalScore` ranks needs by how loudly they are already being asked for. `searchDemand` is its
heaviest single weight and `scoreConfidence` treats `demand < 60` as a signal that did not fire, so a
need with **no query behind it** is structurally invisible to it, at any weighting. That is correct
for the question it answers and useless for "what do people need that they would never think to
search for", because having a query requires having a name for the thing.

`analyzers/latent-demand.ts` answers the second question, and shares none of the first one's axes. It
runs alongside the roadmap rather than feeding it: **the two scores are not comparable and are never
merged.** It works in two halves.

**1. Derived silences (`latent.signals`) - nobody proposed these.** Read out of the registry alone
via the engine IO graph in `analyzers/io-graph.ts`:

| kind | what it finds | why it is latent |
|---|---|---|
| `asymmetry` | an engine that produces artifacts and has no tool that checks any of them | you cannot search for a checker while you still believe your output is right |
| `dead-end` | a non-terminal format the catalog emits and nothing consumes | the step after ours happens off-site, by hand, unseen |
| `handoff` | a converter whose output another engine consumes, with no tool spanning the join | a workflow done in two tabs has no name, so it has no query |
| `unserved-failure` | recorded `userFailures` on a tool the demand ranking left below the recommend bar | people are observed failing; the only thing keeping it off the roadmap is silence |

Run it against today's catalog and the headline is that **the catalog can produce artifacts on eight
engines and check exactly one of them** (`json-validator`).

**2. Anchored candidates (`latent.candidates`).** A seed record may carry a `latent` block
(`whyUnnamed`, `consequence` 0-100, `observedBehaviour[]`). Those, and only those, are scored on
`LATENT_WEIGHTS`:

| Signal | Meaning (1 = best) |
|--------|--------------------|
| anchorStrength | how many independent **kinds** of derived silence it fills, plus their evidence mass |
| consequence | what the unmet need costs when it fails silently (latent tools earn their build here, not on traffic) |
| reachability | catalog tools it bridges - its distribution, since search will not deliver anyone |
| namelessness | inverted demand: the absence of a query is **evidence** here, not the absence of it |
| algorithmicFit | the same AI-vs-algorithm check the main engine runs |

**The anchor gate is the whole design.** `namelessness` rewards the absence of a search term, and a
tool nobody wants is also missing a search term. So a proposal that matches **no** derived silence is
reported under `unanchored` with a stated reason instead of being scored: *"nothing structural argues
for it, so it is not a latent-demand finding - do not build it on this report's authority."*
`validate.ts` asserts that gate on every run, because its failure mode is confident and silent.

Roughly half of `latent-demand.test.ts` asserts **silence** for the same reason: an engine that
already has a verifier, a terminal format, a covered seam, a proposal with no anchor. A suite that
only tested the positives could not tell a working gate from a broken one.

Adding evidence is data, as everywhere else in the RIE: add a `latent` block to a record in
`research/datasets/*.json` and re-run. Never hand-edit `latent.md`.

## Engagement signals: the loop back in

Every number in a seed record is a claim **we** authored after research. `demand: 78` is our
estimate, not a measurement, which is the RIE's standing blind spot: green means internally
consistent, not externally true (`docs/analysis/2026-08-16-seo-ranking-gaps.md`).

`signals[]` on a `SeedRecord` is the one field carrying evidence from outside that loop - an X probe
that landed, a `/feedback/` message, a Search Console pattern, somebody working around the missing
tool in public. Each entry records `kind`, `date`, `observation`, `strength` (0-100) and an optional
`url`, and `validate.ts` rejects one that is not auditable: an unknown kind, a malformed date, an
out-of-range strength, or an "observation" too short to say what was seen. An unauditable signal is
worse than none, because it reads as external corroboration while being indistinguishable from a
hunch.

Record one with the CLI rather than by hand, so the shape stays valid and the provenance complete:

```sh
npm run research:signal -- --tool csv-diff --kind x-probe --strength 60 \
  --observation "Three replies described diffing semicolon exports by eye." --url https://x.com/...
npm run research:signal -- --tool csv-diff --list
```

**Signals feed `confidence`, never `finalScore`.** `scorers/corroboration.ts` scores independent
*kinds* above repeats (the same shape as `anchorStrength`: five replies to one post are one
observation seen five times), and `scoreConfidence` caps the observed contribution at 0.2 so it can
never carry confidence on its own. The separation is load-bearing: `searchDemand` measures how
loudly a need is already being asked for in search, and a post doing well is a different fact.
Blending them would let one probe reorder the roadmap - the failure the `x-content` skill names as
"one probe is not a dataset". `next-build.md` reports them under their own **Observed evidence**
heading, stating that they raised confidence and not the score, so a reader can always tell which
half of a recommendation we asserted and which half somebody outside this repo did.

The alternative this replaces is nudging `demand` by hand. A raised number carries no date, no words
and no link, so a month later it is indistinguishable from research.

## Craft debt: the catalog read backwards

`analyzers/craft-debt.ts` joins the `craft` declarations in the registry (via `craftSlugs` in
`ResearchInputs`) against the `userFailures` evidence in the datasets, and reports where the two
disagree. `check:craft --report` can only group the craftless backlog by engine, which says where
the tools are and nothing about where the answers are.

| bucket | what it is | what to do |
|---|---|---|
| `readyToPolish` | shipped, no `craft`, and a task-level failure already recorded | the touch is already specified; build it (7 tools on 2026-08-31) |
| `needsEvidence` | shipped, no `craft`, no recorded failure | add `userFailures` first, or the craft gets invented |
| `atRisk` | buildable, no recorded failure (`Opportunity.craftRisk`) | resolve before scaffolding, not after |

`atRisk` is a **flag and never a score penalty**, and that is deliberate. Scoring a tool down for
missing evidence would measure how completely we have written up our notes rather than how good the
tool is, and would quietly couple the demand ranking to our own note-taking. Instead the roadmap
adds a `CRAFT RISK` line to that opportunity's reasons, which reaches the builder at the only moment
it can act on it: before anything is scaffolded. The coverage ratchet in `check:craft` catches the
same failure, but only once the work is already done.

## Report freshness

The report bundle is **committed**, and the catalog moves under it. A tool shipping is enough to make
`next-build.md` recommend something that already exists, with no dataset edit involved - which is
exactly what had happened by 2026-08-31, when the committed roadmap had been computed two tools
back and nothing on the page said so.

`fingerprint.ts` hashes everything a run depends on: every dataset record (key-sorted, so
reformatting is not a change), the catalog slugs, the engine ids and the craft declarations, plus
the schema version. `now` is deliberately excluded, or "is this current?" degenerates into "was this
generated recently?". The hash is stamped into `index.json` and footed onto `roadmap.md` and
`next-build.md`, and `npm run research:status` compares it against freshly computed inputs:

```
[research] FRESH - reports match the current datasets and catalog (fingerprint e3dd6507, ...)
[research] STALE - the reports were generated from different inputs.
```

It is FNV-1a rather than `node:crypto` on purpose: every file under `src/lib/research` is pure and
browser-safe, and this detects change rather than defending against forgery.

`status` exits 0 either way. Staleness is not a build error - it only misleads someone reading the
report to decide what to build, so the hard requirement lives in the `next-tool` skill, which checks
it before reading anything. Blocking unrelated PRs on report regeneration would be enforcing
bookkeeping rather than correctness.

## Engine detection

`analyzers/engine-match.ts` groups opportunities by their proposed engine. If the engine is already
registered (`src/data/engines.ts`) it is a **reuse** recommendation (confidence 1). If not, and the
cluster clears `THRESHOLDS.newEngineCluster`, it becomes a **new-engine** recommendation that lists
the tools it would unlock (e.g. "these 8 CSV opportunities → one CSV engine"). This is how the RIE
stays engine-first: it recommends reusable engines, not isolated tools.

## Problem graph

`analyzers/topic-cluster.ts` builds a graph (nodes + edges + adjacency, same shape as the knowledge
graph) over opportunities and the existing catalog tools they link to. Edges: `same-transformation`,
`shares-engine`, `related-problem`, `links-to-tool`. This graph powers internal-linking suggestions
and is exported as `research/reports/graph.json`.

## Roadmap generation

`analyzers/roadmap.ts` ranks buildable opportunities (excludes already-shipped) into
`immediate` / `quick-win` / `long-term` tiers and emits one fully-reasoned `NextBuild`: why to build
it, why incumbents are weak, why ToyTools can win, the reusable engine + unlocked tools, suggested
guides/FAQs/links/schema, and effort/SEO/maintenance estimates. Rendered to
`research/reports/next-build.md`.

## Validation system

`validate.ts` (run by `scripts/validate-research.ts` and before every report write) collects errors
and exits 1 - it never throws. It fails on: duplicate opportunity ids / proposed tools / engines;
out-of-range scores; malformed seed records (shape + enum membership + invalid JSON); near-duplicate
problems that escaped dedup; roadmap/next-build referencing unknown opportunities; broken
problem-graph edges; and a broken provider/analyzer/scorer registry. Everything validates before
reports are generated.

## Integration with the rest of ToyTools

- **Registry / engines** (`@data/registry`, `@data/engines`) - "already exists" and engine reuse are
  exact, read from the real catalog via `catalogInputs()`.
- **Knowledge Graph** (`@lib/knowledge/*`) - the gap classifier uses knowledge/guide/FAQ presence;
  the problem graph mirrors the knowledge-graph shape and links into real tools.
- **Content Intelligence** - complementary: supply-side gaps there, demand-side evidence here.
- **SEO Engine** - the SEO scorer and guide/FAQ suggestions line up with the `seo-content` pipeline,
  so a recommended tool flows straight into authoring and then `add-tool` implementation.

## Extending coverage

Add or edit evidence in `research/datasets/<domain>.json` (the seed-dataset provider picks it up
automatically) and re-run `npm run research`. Record longer-horizon engine hypotheses in
`taxonomy.ts` (`RESEARCH_TAXONOMY`). To pull in real external demand, implement one of the provider
seams in `src/lib/research/providers/`.
