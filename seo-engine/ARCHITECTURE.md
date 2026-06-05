# SEO Engine — Architecture

This document describes *how* the engine is built — the modules, the data flow,
the contracts between stages, and the known gaps. For *how to run* it, see
[`README.md`](./README.md).

The engine is a local-first, deterministic research pipeline. Given a tool slug,
it scrapes the open web, distills competitor content into a structured
`research.json`, scores that document for SEO and GEO readiness, and emits a
human-readable audit. It has no server, no database, and no paid APIs.

---

## Pipeline at a glance

```
tool-slug
   │  generateQueries()                         scripts/utils/queries.ts
   ▼
search queries  ──────────────────────────────────────────────────────┐
   │  fetchSerpResults()  (DuckDuckGo HTML, cached)   scripts/utils/scraper.ts
   ▼                                                                    │
SERP results  ──────────────────────────────────────────────────────┐ │
   │  fetchPage()  (Playwright, cached)               scripts/utils/scraper.ts
   ▼                                                                  │ │
raw HTML  ──►  research/raw/<slug>/result-N.html                      │ │   ◄── seo:research
   │  extractCompetitorPage()  (Cheerio)             scripts/utils/extractor.ts
   ▼
CompetitorPage[]  ──►  research/processed/<slug>/competitors.json
   │  entity / question / intent / gap extraction    scripts/extract.ts
   ▼
ResearchDocument  ──►  research/processed/<slug>/research.json         ◄── seo:extract
   │  calculateSeoScore() / calculateGeoScore()      scripts/utils/scoring.ts
   ▼
ValidationResult  ──►  reports/validation-<slug>.json                  ◄── seo:validate
   │  audit rendering                                scripts/audit.ts
   ▼
audit.md  ──►  reports/audit.md                                        ◄── seo:audit

(content generation — seo:generate — is a stub; see "Known gaps")
```

Each `seo:*` command is one stage. Stages communicate only through files on
disk, so any stage can be re-run independently as long as its inputs exist.

---

## Module map

### Entry points — `scripts/`

| File | Command | Responsibility |
|------|---------|----------------|
| `research.ts` | `seo:research <slug>` | Generate queries → collect SERP (DuckDuckGo GET → Bing fallback) → fetch top-N competitor pages. Opens one shared browser and closes it via `closeBrowser()`. |
| `fetch.ts` | `seo:fetch <slug>` | Fetch competitor pages from a hand-curated `search-results.json`, skipping discovery. The reliable path when search engines bot-block the host. |
| `extract.ts` | `seo:extract <slug>` | Parse cached HTML, derive entities/questions/intents/gaps, write `research.json`. |
| `validate.ts` | `seo:validate` | Score every `research.json`, write per-tool `validation-<slug>.json`. |
| `audit.ts` | `seo:audit` | Render all research into a single `reports/audit.md`. |
| `generate.ts` | `seo:generate` | **Stub** — V3 content generation, not yet implemented. |

### Shared utilities — `scripts/utils/`

| File | Exports | Notes |
|------|---------|-------|
| `config.ts` | TTL, caps, thresholds, entity weights | Single home for every tunable. Change behaviour here, not in the scripts. |
| `queries.ts` | `generateQueries()` | Deterministic slug → query variants (capped at `MAX_QUERIES`). |
| `scraper.ts` | `fetchSerpResults()`, `fetchPage()`, `closeBrowser()` | Lazily-opened singleton Playwright browser reused across all fetches; SERP results and pages are both cache-first. |
| `cache.ts` | `getCached()`/`setCached()` (pages), `getCachedData()`/`setCachedData()` (generic) | SHA-256-keyed JSON files under `cache/`, TTL from config. |
| `text.ts` | `normalizeHeading()`, `isJunkHeading()`, `titleCase()` | Heading hygiene: strips enumerators/articles, drops UI-chrome headings, so consensus compares like with like. |
| `extractor.ts` | `extractCompetitorPage()` | Cheerio HTML → `CompetitorPage`. Strips nav/footer/ads + sidebars/related blocks; flattens JSON-LD (`@graph` aware). |
| `scoring.ts` | `calculateSeoScore()`, `calculateGeoScore()` | Pure functions over a `ResearchDocument`. |

### Types — `types/`

`index.ts` re-exports everything. `competitor.ts` → `CompetitorPage`;
`research.ts` → `ResearchDocument`, `SearchResult`, `CachedPage`;
`score.ts` → `SeoScore`, `GeoScore`, `ValidationResult`.

---

## Data contracts

### `CompetitorPage` (per fetched page, from `extractor.ts`)

| Field | Source |
|-------|--------|
| `url`, `title`, `description` | `<title>`, `<meta name=description>` |
| `h1` / `h2` / `h3` | heading text (post nav/footer strip) |
| `tables`, `lists` | element counts |
| `faqQuestions` | question-shaped headings + JSON-LD `FAQPage.mainEntity` + `.faq`/`.accordion` blocks |
| `wordCount` | body text word count |
| `schemaTypes` | all `@type` values across JSON-LD (incl. `@graph`) |

### `ResearchDocument` (per tool, from `extract.ts`)

| Field | How it's derived |
|-------|------------------|
| `primaryIntent` / `secondaryIntent` | keyword signals over headings + slug tokens (slug wins for primary) |
| `entities` | frequency-weighted single terms + bigrams; SEO-junk filtered; bigram-subsumed singles dropped; top `ENTITY_COUNT` |
| `questions` | question-shaped headings + FAQs, deduped case-insensitively, capped at `LIMITS.questions` |
| `competitorHeadings` | headings on ≥ `mustHave` share of pages (consensus must-haves) |
| `contentGaps` | headings on < `gap` share of pages (opportunities) |
| `relatedTopics` | headings between the two thresholds, seen on ≥ 2 pages |
| `competitorFaqs` | union of all pages' `faqQuestions` |

---

## Scoring model

Both scores are 0–100, computed by pure functions in `scoring.ts`. These mirror
the tables in `README.md` — that file is the canonical rubric reference.

- **SEO** rewards breadth of structured signal: entity count, question count,
  content gaps, competitor headings, competitor FAQs, and detected intents.
- **GEO** (Generative Engine Optimization) rewards AI-snippet extractability:
  presence of definition / comparison / troubleshooting questions, entity
  coverage, FAQ density, and related-topic context.

Issues collected during scoring drive the recommendations rendered by `audit.ts`.

---

## Determinism & caching

The pipeline is built to produce the **same output for the same input**:

- No randomness influences output (the random delay in the scraper is only
  request pacing — it never affects parsed data).
- Extraction, scoring, and query generation are pure transforms over inputs.
- Fetches are **cache-first**. Pages and SERP results are stored as
  SHA-256-keyed JSON under `cache/` with a TTL (`CACHE_TTL_MS`, 30 days). A
  re-run inside the TTL touches the network zero times and is near-instant.

This makes runs reproducible, cheap to repeat, and friendly to version control
(all intermediate state is plain JSON/HTML/Markdown).

---

## Known gaps & roadmap

These are deliberate current limitations, not bugs:

- **The pipeline is a dead end.** `research.json` is the stated "source of
  truth," but nothing in the ToyTools site (`src/`) consumes it yet, and
  `seo:generate` (V3) is a stub. Wiring research into generated tool/guide/FAQ
  content (into `src/tools/<slug>/`) is the next major milestone.
- **Heading consensus needs similar pages.** `competitorHeadings` requires a
  heading to appear (after normalization) on ≥70% of pages. Across a
  heterogeneous mix — a few tool pages, Wikipedia, two blog guides — almost no
  heading is shared that widely, so the consensus list often comes back empty
  even though each page is individually relevant. Robust consensus needs either
  more same-type competitors or semantic (embedding) grouping, which is out of
  scope for the deterministic, no-AI design. Entity extraction is also still
  frequency-based and will surface the occasional generic word.
- **SERP discovery is IP-sensitive.** Discovery uses DuckDuckGo (GET) with a
  Bing fallback, but both engines bot-block datacenter/VPN IPs (DDG returns a
  `202` "anomaly" challenge; Bing serves a captcha), so discovery can return
  zero results depending on where it runs. The reliable workaround is
  `seo:fetch` over a hand-curated `search-results.json`. Richer multi-source
  collection (Google Suggest, People Also Ask, Reddit/StackOverflow) is on the
  V2 roadmap.
- **Sequential fetches.** Pages are fetched one at a time. The shared browser
  now makes concurrent contexts cheap; batched fetching is a straightforward
  future optimization.
- **`research/snapshots/` is unused.** Versioned research diffing is planned but
  not implemented.

See `README.md` → "Future Roadmap" for the full V2/V3 wishlist.
