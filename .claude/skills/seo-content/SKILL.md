---
name: seo-content
description: Research, write, audit, and improve ToyTools tool content (guides, FAQs, knowledge files). Use when asked to research a tool's SEO, write or improve a guide/FAQ/knowledge.ts, run any seo:* command, audit content quality, raise audit scores, or fix AI-sounding writing. Covers the full pipeline from SERP research to the quality gate.
---

# SEO Content Pipeline

One workflow, one entry point. All commands run from the project root.

## Hard rules

1. **Always start with status.** Run it first, every time, and execute its
   `nextActions` in order. Do not guess the pipeline stage from memory.

   ```sh
   npm run --silent seo:status -- <slug> --json    # machine-readable
   npm run seo:status -- <slug>                    # human-readable
   npm run seo:status                              # all tools: slug × state × score
   ```

2. **When writing content, the generated brief is authoritative.**
   `seo-engine/output/<slug>/PROMPT.md` (created by `npm run seo:scaffold -- <slug>`)
   contains the style contract, file specs, exact registration snippets for that
   slug, and acceptance commands. It overrides this skill and CLAUDE.md on any
   detail where they disagree. Imitate the two exemplar guides it names.

3. **You are not done until both pass:**

   ```sh
   npm run seo:gate -- <slug>     # quality gate, exits 0 only at the bar — the inner loop
   npm run verify                 # the done-condition: the PR gate in one command
   ```

   `verify` is what catches everything the gate does not: content changes still move a page's HTML
   weight against the per-page budget, and Quality Guardian's metadata and canonical validators run
   there, not in `npm run build`.

   Gate failing: read `seo-engine/reports/tool-content-intelligence-<slug>.json`,
   apply the High Impact actions, re-run. Maximum 3 fix iterations, then stop
   and report the remaining actions instead of looping.

4. **If any seo:* command behaves unexpectedly, run `npm run seo:doctor`.**
   It verifies the engine's assumptions against the codebase and names exactly
   what drifted. Fix what it reports before continuing.

## The pipeline (status walks you through it)

```
needs-research      npm run seo:research -- <slug>     (SERP + Reddit collection)
needs-extract       npm run seo:extract -- <slug>      (HTML → research.json)
needs-scaffold      npm run seo:scaffold -- <slug>     (research → PROMPT.md brief)
needs-writing       follow seo-engine/output/<slug>/PROMPT.md
needs-registration  apply PROMPT.md section 7 snippets, then npm run build
needs-audit         npm run seo:gate -- <slug>
failing-gate        apply actions from the report JSON, re-gate
done                stop
```

Existing tools with a guide and FAQ skip the research stages; status routes
them straight to the knowledge/audit loop. Research is only required to write
new content.

## Reference files (read on demand, not upfront)

| File | When |
|------|------|
| `references/pipeline.md` | command details, SERP-blocked fallback (`seo:fetch`), Reddit signal rules |
| `references/write-guide.md` | Guide.astro structure: GuideLayout, sections, ReferenceBlock, CTA |
| `references/write-faq.md` | faq.ts shape and registration |
| `references/write-knowledge.md` | knowledge.ts overlay fields, sync rules, registration |
| `references/audit-loop.md` | reading the audit JSON, anti-AI writing rules, gate criteria |

## Non-negotiable writing rules (full list lives in the generated brief)

- **No em-dashes, ever.** One em-dash fails the gate. Use a period, comma, colon, or parentheses.
- No "not just X, it's Y" framing. No delve/unlock/seamless/elevate vocabulary.
- Sentences average 10-18 words; paragraphs max 4 sentences; vary both.
- Concrete examples with real values; question headings answered directly in the first sentence.
- Reddit research is intent discovery only: never reproduce or paraphrase post text into content.

## Concept headings feed targeting (2026-08-08)

A tool page's H2s are generated from `knowledge.primaryConcepts[0]` by `KnowledgeDrawers`, so that
field is no longer just metadata: it is one of the four slots `check-query-coverage` scores query
targeting against. If a tool's targeting is low, check that concept reads like something a person
would type before rewriting prose.
