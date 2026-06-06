# Skill: SEO Engine

Documents the full ToyTools SEO/GEO pipeline and when to run each step. Use this skill whenever asked to research a tool, improve content, or run any `seo:*` command.

## When to use

Invoke when the user asks to:
- "research [tool]" / "run SEO research on [tool]"
- "run the full SEO pipeline" / "improve [tool]'s SEO"
- "test the reddit workflow" / "run seo:research"
- "audit all tools" / "check SEO scores"
- "scaffold content for [tool]"
- Any `seo:*` command question

---

## Pipeline Overview

```
seo:research  →  seo:extract  →  seo:validate  →  seo:audit
                                                         ↓
                                               seo:scaffold (content stubs)
                                                         ↓
                                           write-guide / write-faq skills
                                                         ↓
                                               seo:writing-tool  →  writing-audit skill
```

All commands run from the **project root**:

| Command | What it does | Input | Output |
|---------|-------------|-------|--------|
| `npm run seo:research -- <slug>` | Fetch SERP + competitor pages + Reddit signals | tool slug | `research/raw/<slug>/`, `research/reddit/<slug>-posts.json` |
| `npm run seo:extract -- <slug>` | Parse HTML → entities/questions/gaps, merge Reddit | raw HTML files | `research/<slug>.json` |
| `npm run seo:validate` | Score all research.json files | all research JSONs | validation output |
| `npm run seo:audit` | Render full audit report | all research JSONs | `reports/audit.md` |
| `npm run seo:scaffold -- <slug>` | Convert research.json → agent-ready stubs | `research/<slug>.json` | `faq.draft.ts`, `guide.outline.md`, `PROMPT.md` |
| `npm --prefix seo-engine run seo:writing-tool -- <slug>` | Audit real source files | Guide.astro, faq.ts, config.ts | `reports/tool-content-intelligence-<slug>.md/.json` |
| `npm --prefix seo-engine run seo:writing -- <slug>` | Writing quality analysis | Guide.astro content | score report |

---

## Quick Workflows

### 1. New tool: full pipeline

Run when adding a brand-new tool with no guide/FAQ yet:

```bash
npm run seo:research -- <slug>      # collect SERP + Reddit
npm run seo:extract -- <slug>       # parse into research.json
npm run seo:validate                # confirm scores
npm run seo:scaffold -- <slug>      # generate content stubs
# → then use write-guide skill to write Guide.astro from guide.outline.md
# → then use write-faq skill to write faq.ts from faq.draft.ts
npm --prefix seo-engine run seo:writing-tool -- <slug>   # baseline audit
# → then use writing-audit skill to apply High Impact actions
npm run build                       # verify
```

### 2. Existing tool improvement (fast path)

Run when a tool already has a guide and FAQ but scores are low:

```bash
npm --prefix seo-engine run seo:writing-tool -- <slug>   # get audit scores
# → read reports/tool-content-intelligence-<slug>.md
# → use writing-audit skill to apply High/Medium Impact actions
npm run build
```

### 3. Full audit of all tools

Run periodically or before a content sprint:

```bash
# Run in parallel or sequentially:
for slug in word-counter case-converter percentage-calculator base64-encoder-decoder todo-list notepad keep-screen-awake pomodoro-timer; do
  npm --prefix seo-engine run seo:writing-tool -- $slug
done

# Read reports/tool-content-intelligence-*.md and triage:
# Priority order = lowest Overall score first
# Then apply writing-audit skill per tool, lowest score first
npm run build
```

---

## Score Interpretation

### Overall Score bands

| Score | Interpretation |
|-------|---------------|
| 80–100 | Strong — minor improvements only |
| 70–79 | Good — 1–2 high-impact gaps |
| 60–69 | Needs work — multiple first-principle gaps |
| < 60 | Significant gaps — prioritize immediately |

### Category weights

| Category | Weight | What low score means |
|----------|--------|---------------------|
| Usefulness | 30% | Missing Examples, How it Works, or Common Mistakes |
| Writing Quality | 20% | High hedging, passive voice, jargon, or thin content |
| SEO Completeness | 20% | Missing search intent coverage or entities |
| Topic Cluster | 15% | No related tools link or FAQ preview missing |
| ToyTools Style | 15% | ReferenceBlocks absent, thin descriptions, no CTA |

### First Principles — what each means

- **What it is**: Opening section clearly defines the concept
- **Why it matters**: Explains the value/benefit to users
- **How it works**: Explains the mechanism (the "how", not just "what")
- **Examples**: Concrete real-world instances (not just abstract descriptions)
- **Common Mistakes**: ReferenceBlock `type="common-mistake"` sections
- **Comparisons**: Compares to alternatives or related approaches

---

## Reddit Workflow

Reddit signals flow through `seo:research` and populate `research/reddit/<slug>-posts.json`. After `seo:extract`, they merge into `research/<slug>.json` under these keys:

| Signal bucket | → Content action |
|--------------|-----------------|
| `redditQuestions` | Add as FAQ items (question → answer) |
| `redditPainPoints` | Add "Common Mistakes" ReferenceBlock or FAQ troubleshooting |
| `redditUseCases` | Add to Guide examples section or h3-based real-world scenarios |
| `redditComparisons` | Add comparison sentence to guide or "X vs Y" FAQ item |
| `redditMisconceptions` | Add myth-busting ReferenceBlock or FAQ answer dispelling the myth |
| `redditTerminology` | Inject as entities into guide prose (entity coverage score) |

### Reddit quality signals

- **`redditDemandScore`** (0–100): High = many discussions, high engagement, broad subreddit spread. Prioritize this tool's content investment.
- **`redditIntentScore`** (0–100): +20 per non-empty intent bucket. Score of 100 = all 5 axes populated.
- **`dataConfidence`** (0–1): 1.0 = full JSON data with engagement. ~0.5 = SERP fallback (titles only, no engagement). 0 = no data collected.
- **`contentOpportunities`**: Ranked list of gaps with `competitorGapBonus` — prioritize items not covered by competitor pages.

### Hard rules

- Reddit is **intent discovery only** — never publish, paraphrase, or reproduce raw post titles or content
- Only classified/normalized signals flow downstream (normalized question clusters, frequency counts, entity nouns)
- `dataConfidence` of 0 is not a failure — the pipeline completes gracefully; run research again later when network is available

---

## Output Files Reference

```
seo-engine/
├── research/
│   ├── raw/<slug>/               # raw HTML from competitor pages
│   │   └── search-results.json  # SERP results list
│   ├── reddit/
│   │   └── <slug>-posts.json    # raw Reddit posts (research tier only)
│   └── <slug>.json              # extracted research: entities, questions, intents, reddit signals
├── reports/
│   ├── audit.md                 # full cross-tool audit report
│   ├── tool-content-intelligence-<slug>.md   # human-readable audit per tool
│   └── tool-content-intelligence-<slug>.json # structured actions per tool
└── cache/                       # 30-day cached page fetches (SHA-256 keyed)
```

### Key fields in `research/<slug>.json`

```json
{
  "entities": [...],           // technical terms found across competitor pages
  "questions": [...],          // questions headings and FAQ-style queries
  "intents": [...],            // classified search intent clusters
  "gaps": [...],               // topics in competitors not in existing content
  "redditQuestions": [...],    // classified question clusters from Reddit
  "redditPainPoints": [...],   // problem/error discussions
  "redditUseCases": [...],     // real-world usage scenarios
  "redditComparisons": [...],  // vs/alternative discussions
  "redditMisconceptions": [...], // myths and false premises
  "redditTerminology": [...],  // recurring meaningful nouns (entity injection candidates)
  "redditDemandScore": 0-100,
  "redditIntentScore": 0-100,
  "dataConfidence": 0-1
}
```

---

## Writing Guardrails (always enforced)

These apply to every content edit made via this pipeline:

**Never touch:**
- `<ReferenceBlock>` `type`, `heading`, or structure
- Section `id` attributes (URL anchors)
- `<h2>` heading text
- Astro frontmatter (`---...---`)
- `<code>` inline elements
- CTA link text and `href={toolHref}` expressions
- FAQ `id:` and `question:` fields — only `answer:` may be edited
- `withBase()`, `{faqHref &&...}`, or Astro `{...}` expressions
- The `<style>` block

**Jargon to replace** (from `seo-engine/config/writing-rules.json`):
- utilize → use
- leverage → use
- facilitate → help
- optimize → improve (when used generically)
- streamline → simplify

**Hedging to remove when the claim is a documented fact:**
- generally, typically, usually, often, may, might, perhaps, can sometimes, in many cases

---

## Available tool slugs

```
word-counter
case-converter
percentage-calculator
base64-encoder-decoder
todo-list
notepad
keep-screen-awake
pomodoro-timer
```

Add new slugs under `toolIntents` in `seo-engine/config/content-intelligence-rules.json` to enable tool-specific entity and intent scoring.
