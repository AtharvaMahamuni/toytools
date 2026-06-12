# Pipeline reference

All commands run from the project root. `seo:status` decides which one is next;
this file explains what each does.

| Command | What it does | Output |
|---------|--------------|--------|
| `npm run seo:status -- <slug> [--json]` | Pipeline state + verbatim next command | stdout |
| `npm run seo:research -- <slug>` | SERP discovery (DuckDuckGo, Bing fallback) + fetch top competitor pages + collect Reddit posts | `seo-engine/research/raw/<slug>/`, `seo-engine/research/reddit/<slug>-posts.json` |
| `npm run seo:fetch -- <slug>` | Fetch pages from a hand-curated URL list (see below) | `seo-engine/research/raw/<slug>/result-N.html` |
| `npm run seo:extract -- <slug>` | Parse HTML into entities/questions/gaps + merge Reddit signals | `seo-engine/research/processed/<slug>/research.json` |
| `npm run seo:validate` | SEO/GEO scores for all research files | console + `seo-engine/reports/` |
| `npm run seo:audit` | Cross-tool audit report | `seo-engine/reports/audit.md` |
| `npm run seo:scaffold -- <slug>` | research.json into the self-contained authoring brief + stubs | `seo-engine/output/<slug>/{PROMPT.md, faq.draft.ts, knowledge.draft.ts, guide.outline.md}` |
| `npm run seo:writing-tool -- <slug>` | Audit the real Guide.astro/faq.ts/config.ts | `seo-engine/reports/tool-content-intelligence-<slug>.{md,json}` |
| `npm run seo:gate -- <slug>` | Same audit, exits 1 below the quality bar | exit code |
| `npm run seo:graph` | Snapshot src/ registries for the engine | `seo-engine/cache/content-graph.json` |
| `npm run seo:doctor` | Assert engine/doc assumptions against the codebase | exit code + named failures |

For parseable stdout (`--json` flags), invoke npm with `--silent`:
`npm run --silent seo:status -- <slug> --json`. The audit always writes the same
object to `seo-engine/reports/tool-content-intelligence-<slug>.json`, so reading
that file is equally good.

## When SERP discovery is blocked

Search engines bot-block datacenter and VPN IPs. If `seo:research` fetches zero
pages (status detects this and says so):

1. Pick 5-10 strong competitor pages for the tool's main query yourself.
2. Write them to `seo-engine/research/raw/<slug>/search-results.json`:
   `{ "results": [{ "url": "https://..." }, ...] }`
3. Run `npm run seo:fetch -- <slug>`, then continue with `seo:extract` as normal.

A zero-result research run is not a failure state; the pipeline continues from
curated URLs.

## Reddit signals

`research.json` carries six classified buckets (questions, pain points, use
cases, comparisons, misconceptions, terminology) plus `redditDemandScore`,
`redditIntentScore`, and `dataConfidence` (1.0 = full JSON with engagement,
~0.5 = title-only SERP fallback, 0 = none collected and that is fine).

Map signals to content: questions become FAQ items; pain points become
troubleshooting/common-mistake coverage; use cases feed examples; comparisons
become "X vs Y" sentences; misconceptions become myth-correcting ReferenceBlocks
(prime answer-engine material); terminology feeds natural entity mentions.

**Hard rule:** Reddit is intent discovery only. Never copy, paraphrase, or
rephrase Reddit titles, posts, or comments into published content.
