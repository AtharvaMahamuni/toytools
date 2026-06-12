# SEO + GEO Research Engine

A local-first, free, deterministic research engine for generating structured SEO and GEO knowledge from the open web.

Built for ToyTools. Runs entirely on your machine. No paid APIs. No cloud. No AI frameworks.

---

## Purpose

ToyTools serves 5000+ tools. Great content requires knowing:

- What questions users ask about each tool
- What headings competitors use
- What topics competitors miss (content gaps)
- What entities and terms matter for each topic
- What a GEO-ready (AI-snippet-optimized) structure looks like

This engine collects that knowledge deterministically and stores it as `research.json` — a structured source of truth that future content generation (V3) can consume.

**Architecture principle:**

```
Tool Name
↓
Research Collection     ← seo:research   (SERP + competitor pages + Reddit posts)
↓
Knowledge Extraction    ← seo:extract    (entities, questions, gaps, Reddit signals)
↓
Research JSON           ← source of truth
↓
Validation              ← seo:validate
↓
Audit Report            ← seo:audit
↓
Content Generation      ← V3 (not yet implemented)
```

### Reddit Intelligence — intent discovery, not a content source

`seo:research` also collects Reddit **post titles** (via Reddit's public search
JSON, with a `site:reddit.com` SERP fallback) and `seo:extract` distils them into
research signals: real user questions, pain points, use cases, comparisons,
misconceptions, and terminology — each clustered and ranked by **frequency** and
**engagement** (score + comments).

**Hard rule:** Reddit is an *intent discovery* source. The engine never copies,
paraphrases, rewrites, or publishes Reddit text. Only classified, normalized
phrases and counts flow into `research.json`; downstream content must be written
as original prose. Raw titles persist only in the research tier (`research/reddit/`
and cluster `examples`) for transparency — never in generated `src/` content.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | All scripts |
| Node.js ≥ 22 | Runtime |
| Playwright | SERP scraping + page fetching |
| Cheerio | HTML parsing + extraction |
| `crypto` (built-in) | Cache key hashing |
| `fs` / `path` (built-in) | File I/O |

No LangChain. No vector databases. No paid APIs. No cloud services.

---

## Folder Structure

```
seo-engine/
├── cache/                          # Cached HTML pages (30-day TTL)
├── research/
│   ├── raw/<tool>/                 # SERP results + raw HTML
│   ├── reddit/<tool>-posts.json    # Collected Reddit posts (intent discovery)
│   ├── processed/<tool>/           # Extracted data + research.json
│   └── snapshots/                  # Future: versioned research diffs
├── output/
│   ├── tool/                       # Future: generated tool content
│   ├── guide/                      # Future: generated guides
│   └── faq/                        # Future: generated FAQs
├── reports/                        # audit.md + validation JSONs
├── templates/                      # Markdown scaffolds for V3
├── types/                          # TypeScript type definitions
└── scripts/                        # All pipeline scripts
    └── utils/                      # Shared utilities
```

---

## Setup

```sh
cd seo-engine
npm install
npx playwright install chromium
```

---

## Commands

All commands can be run from the **root** of the ToyTools repo:

```sh
npm run seo:research -- <tool-slug>   # discover + fetch competitor pages
npm run seo:fetch    -- <tool-slug>   # fetch from a curated search-results.json (no discovery)
npm run seo:extract  -- <tool-slug>
npm run seo:validate
npm run seo:audit
npm run seo:scaffold -- <tool-slug>   # turn the brief into content stubs for an agent
npm run seo:graph                     # snapshot src/ registries → cache/content-graph.json
npm run seo:doctor                    # assert engine/doc assumptions against the codebase
npm run seo:writing-tool -- <slug>    # audit a real tool's Guide.astro + faq.ts + config.ts
npm run seo:gate -- <slug>            # same audit in gate mode: exit 1 below the quality bar
```

### Audit, gate, and AI-tell detection

`seo:writing-tool` scores five weighted categories plus a Knowledge Sync section
(knowledge.ts commonQuestions must match faq.ts questions; commonMistakes and
realWorldUseCases must appear in the prose). Entities/intents come from a
derived per-tool profile with a fallback chain — `toolIntents` override in
`config/content-intelligence-rules.json` → the tool's knowledge.ts overlay →
config tags — so every tool gets a meaningful audit; the report names the tier.

The writing engine includes an `aiTells` metric: banned vocabulary (delve,
unlock, seamless, ...), the "not just X, it's Y" construction, rule-of-three
overuse, colon-heavy headings, uniform paragraph shapes, bold-spam, and
**em-dashes, which are banned outright on this project** (any count fails the
gate; rewrite with a period, comma, or colon).

`seo:gate -- <slug>` (alias for `seo:writing-tool -- <slug> --gate`) checks the
`gates` block in `content-intelligence-rules.json` (overall + per-category
minimums + zero high-impact actions + zero AI-tell phrases + zero em-dashes)
and exits 1 on failure — the objective stop condition for the agent's
write → audit → fix loop. Add `--json` (with `npm --silent`) for a parseable
score object on stdout; the same object is always written to
`reports/tool-content-intelligence-<slug>.json` including the `gate` result.

### Content graph + doctor

The engine never imports `src/` TypeScript directly. `seo:graph` serializes the
live registries (tools, guide/FAQ/knowledge registration, tags, knowledge
overlay fields) to `cache/content-graph.json`; extraction uses it as a domain
allowlist for entity filtering, and `seo:doctor`/`seo:status` use it for
registration state. `seo:doctor` re-runs the export, then asserts everything
the docs and scaffold claim about the codebase (URL shape `/tool/…`, two-level
tool dirs, no `config.faq` field, guide-registry parity, exemplar guides intact,
every command referenced by the `seo-content` skill exists, every
`toolIntents` override key resolves). It exits nonzero on drift — run it first
whenever a pipeline command behaves unexpectedly.

### When discovery is blocked

`seo:research` discovers competitor URLs via DuckDuckGo (GET) with a Bing
fallback. Search engines aggressively bot-block datacenter/VPN IPs, so discovery
may return zero results in some environments. When that happens, curate the
competitor set by hand: write a `research/raw/<slug>/search-results.json` with a
`results` array of `{ "url": "..." }` objects, then run `seo:fetch -- <slug>`
to fetch and cache those pages. Continue with `seo:extract` as normal.

Or from inside `seo-engine/`:

```sh
npm run seo:research -- base64-encoder-decoder
npm run seo:extract  -- base64-encoder-decoder
npm run seo:validate
npm run seo:audit
```

---

## Research Flow

### Step 1: Generate Search Queries

Input `base64-encoder-decoder` → generates variants:

```
base64 encoder
base64 decoder
encode base64 online
base64 encoder decoder
base64 converter
what is base64
base64 encoder online
```

### Step 2: SERP Collection

Playwright visits DuckDuckGo HTML endpoint (no bot detection, no JS required).
Collects top 10 organic results per query. Deduplicates by URL.

Output: `research/raw/base64-encoder-decoder/search-results.json`

### Step 3: Fetch Competitor Pages

Playwright fetches each competitor page. Cache-first (30-day TTL). Stores raw HTML.

Output: `research/raw/base64-encoder-decoder/result-1.html` … `result-N.html`

### Step 3b: Reddit Collection (intent discovery)

Generates Reddit-specific queries (`base64`, `base64 vs`, `base64 problem`, …),
fetches `reddit.com/search.json` per query (falling back to `site:reddit.com`
SERP if Reddit blocks), filters out deleted/removed/NSFW/spam posts, and keeps
the **top 20 by engagement**. Non-fatal: a blocked Reddit run never breaks the
rest of research.

Output: `research/reddit/base64-encoder-decoder-posts.json`

---

## Extraction Flow

### Step 4: HTML Extraction

Cheerio parses each HTML file. Extracts:

- `title`, `description`
- `h1[]`, `h2[]`, `h3[]`
- `tables` count, `lists` count
- `faqQuestions[]` (from headings + JSON-LD FAQPage schema)
- `wordCount`
- `schemaTypes[]`

Output: `research/processed/base64-encoder-decoder/competitors.json`

### Step 5: Entity Extraction (deterministic)

Pools heading text + title + description. Frequency-weighted scoring:
- h1 weight: 3×
- h2 weight: 2×
- h3 weight: 1.5×
- title weight: 2.5×

Stop words removed. Bigrams and single terms ranked. Top 20 returned.

### Step 6: Question Extraction

Scans h2, h3, and FAQ sections. Matches:
- Strings ending with `?`
- Strings starting with: What, Why, How, When, Where, Can, Should, Does, Is, Are, Do, Which, Who

### Step 7: Intent Detection (keyword rules)

Primary intent signals: `tool`, `converter`, `generator`, `calculator`, `encoder`, `decoder`, ...
Secondary intent signals: `what is`, `guide`, `how does`, `tutorial`, `overview`, ...

### Step 8: Content Gap Detection

Builds heading frequency map across all competitor pages.
- Appears in ≥ 70% of pages → `competitorHeadings` (must-have)
- Appears in < 30% of pages → `contentGaps` (opportunity)
- Appears in ≥ 2 pages but < 70% → `relatedTopics`

### Step 9: Reddit Signal Extraction + Research JSON

Reads `research/reddit/<tool>-posts.json` and classifies each title into six
buckets — questions, pain points, use cases, comparisons, misconceptions,
terminology. Near-duplicate phrasings are **clustered** (so "what is base64" and
"what exactly is base64" merge), then ranked by engagement and frequency.
Questions are tagged with a category (definition / comparison / troubleshooting /
security / example / usage / implementation). Validated Reddit terminology is
**injected into the entity list** so the brief reflects real user vocabulary.

Composite metrics are added: `redditIntentScore` (5-axis, +20 each), a blended
`redditDemandScore`, ranked `contentOpportunities` (frequency + engagement +
competitor-gap bonus), `subredditBreakdown`, inferred `audienceTypes`, and a
`dataConfidence` that scales with sample size (halved on the SERP fallback path).

Output: `research/processed/base64-encoder-decoder/research.json`

```json
{
  "tool": "base64-encoder-decoder",
  "primaryIntent": "tool usage",
  "secondaryIntent": "learning",
  "entities": ["Base64", "ASCII", "UTF-8", "Binary Data", "RFC 4648"],
  "questions": ["What is Base64?", "How does Base64 encoding work?", ...],
  "contentGaps": ["URL-safe Base64", "Base64 padding explained", ...],
  "competitorHeadings": ["How Base64 Works", "Examples", ...],
  "competitorFaqs": ["Is Base64 encryption?", ...],
  "relatedTopics": ["Base64 vs Hex", "Binary encoding formats", ...],

  "redditQuestions": [{ "topic": "Is Base64 encryption", "frequency": 7, "engagement": 412, "examples": ["..."], "category": "security" }],
  "redditPainPoints": [{ "topic": "Base64 invalid padding error", "frequency": 5, "engagement": 230, "examples": ["..."] }],
  "redditUseCases": [{ "topic": "Base64 in JWT tokens", "frequency": 3, "engagement": 88, "examples": ["..."] }],
  "redditComparisons": [{ "topic": "Base64 vs Hex", "frequency": 4, "engagement": 150, "examples": ["..."] }],
  "redditTerminology": [{ "topic": "Jwt", "frequency": 6, "engagement": 300, "examples": [] }],
  "redditMisconceptions": [{ "topic": "Can Base64 secure passwords", "frequency": 4, "engagement": 510, "examples": ["..."] }],
  "subredditBreakdown": { "programming": 8, "webdev": 5, "learnprogramming": 4 },
  "audienceTypes": ["developer", "student"],
  "redditDemandScore": 78,
  "contentOpportunities": [{ "topic": "Base64 vs Encryption", "score": 94 }],
  "sampleSize": 20,
  "dataConfidence": 1,
  "redditIntentScore": 100,

  "generatedAt": "2026-06-06T..."
}
```

---

## Validation

```sh
npm run seo:validate
```

### SEO Score (0–100)

| Check | Points |
|-------|--------|
| entities ≥ 5 | 20 |
| entities ≥ 10 | +10 |
| questions ≥ 10 | 20 |
| questions ≥ 20 | +10 |
| contentGaps ≥ 3 | 15 |
| competitorHeadings ≥ 5 | 15 |
| competitorFaqs ≥ 3 | 10 |
| primaryIntent set | 10 |
| secondaryIntent set | 5 |

### GEO Score (0–100)

LLM snippet readiness — can an AI extract a useful answer from this research?

| Check | Points |
|-------|--------|
| Definition question exists (What is...) | 20 |
| Comparison question exists (vs / difference) | 20 |
| Troubleshooting question exists (error / fix) | 15 |
| entities ≥ 5 | 20 |
| competitorFaqs ≥ 3 | 15 |
| relatedTopics set | 10 |
| Reddit demand blend (scaled from `redditDemandScore`) | up to +10 |

The Reddit blend rewards pages backed by real user intent the competitor set
under-serves, capped so tools without Reddit data don't regress.

---

## Audit

```sh
npm run seo:audit
```

Reads all `research/processed/*/research.json`, calculates scores, writes `reports/audit.md`.

Example output:

```markdown
# SEO Audit — 2026-06-06

## Base64 Encoder Decoder

**SEO Score:** 88/100
**GEO Score:** 82/100

### Issues
- No comparison-style questions found

### Recommendations
- Add comparison coverage: X vs Y, difference between X and Y
- Add section: URL-safe Base64

### Content Gaps
- URL-Safe Base64
- Base64 Padding Explained

### Must-Have Sections (Competitor Consensus)
- How Base64 Works
- Examples
- Use Cases
```

---

## Cache System

Fetched pages are cached at `cache/<sha256-of-url>.json`.

```json
{
  "url": "https://example.com/base64",
  "fetchedAt": "2026-06-06T10:00:00.000Z",
  "html": "<!DOCTYPE html>..."
}
```

TTL: **30 days**. If cached and fresh, Playwright is not launched. Re-running the pipeline is fast.

---

## Future Roadmap

### V2 — Richer Signal Collection

- Google Suggestions (autocomplete API)
- Related Searches extraction
- People Also Ask scraping
- Reddit subreddit-targeted search (`r/<sub>/search.json`) + top-comment mining
- StackOverflow question extraction
- GitHub README analysis for technical tools

### V3 — Content Generation

- Ollama integration (local LLM, e.g. Llama 3, Mistral)
- Tool description generation from research.json
- Guide generation using `templates/guide.template.md`
- FAQ generation using `templates/faq.template.md`
- GEO-optimized content structuring

---

## Principles

**Lightweight** — No heavy frameworks. Scripts are standalone and fast.

**Private** — Everything stays on your machine. No data leaves.

**Free** — No paid APIs. Uses DuckDuckGo HTML (free, no key required).

**Deterministic** — Same input → same output. No randomness, no AI nondeterminism.

**File-based** — All state is plain JSON/HTML/Markdown. Git-friendly.

**Scalable** — Designed for 5000+ tools. Cache prevents redundant fetches.
