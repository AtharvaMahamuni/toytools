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
Research Collection     ← seo:research
↓
Knowledge Extraction    ← seo:extract
↓
Research JSON           ← source of truth
↓
Validation              ← seo:validate
↓
Audit Report            ← seo:audit
↓
Content Generation      ← V3 (not yet implemented)
```

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
```

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

### Step 9: Research JSON

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
- Reddit thread analysis (`site:reddit.com <tool>`)
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
