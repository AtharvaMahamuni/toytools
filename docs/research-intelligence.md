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
        └── roadmap            → tiers + the next-build recommendation
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
  config.ts        SCORE_WEIGHTS, THRESHOLDS, REPORT_PATHS
  constants.ts     ProviderId / IntentKind / OpportunityStatus / Difficulty / GapKind / RoadmapTier
  types.ts         ResearchInputs, CatalogRef
  registry.ts      PROVIDERS[] + ANALYZERS/SCORERS metadata
  taxonomy.ts      RESEARCH_TAXONOMY (domain → transformation → expected[])
  validate.ts      validateRegistry / validateDatasets / validateReports / validateAll
  fixtures.ts      test fixtures (raw(), makeInputs(), ...)
  models/          opportunity, provider, problem, engine, cluster, roadmap, report
  providers/       seed-dataset/ (real) + 15 live seams + _stub.ts
  analyzers/       deduplicate, intent, transformation, workflow, similarity, related-tools,
                   opportunity-score, cluster, engine-match, missing-engine, topic-cluster,
                   gaps, trend, guide-generator, faq-generator, roadmap
  scorers/         demand, competition, evergreen, implementation, engine-reuse, seo,
                   localization, algorithmic-fit, confidence
  reports/         markdown, json, csv

research/
  datasets/        text.json developer.json datetime.json   (committed evidence)
  reports/         generated bundle + snapshots/             (committed)
  cache/           gitignored

scripts/research.ts, scripts/validate-research.ts, scripts/research-lib.ts
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
