# Audit loop reference

## The loop

```sh
npm run seo:gate -- <slug>     # exit 0 = done, exit 1 = fix and repeat
```

On failure, read `seo-engine/reports/tool-content-intelligence-<slug>.json`:

- `gate.criteria` names exactly which thresholds failed (`overall`,
  per-category minimums, `highImpactActions`, `aiTellPhrases`, `emDashes`).
- `actions` is the prioritized fix list: `{ impact, file, issue, suggestion,
  scoreGain }`. Apply all High Impact actions first, then Medium where the
  change clearly preserves meaning. Skip actions that would require inventing
  facts; never fabricate a comparison or statistic to satisfy a check.
- **Maximum 3 fix iterations.** Still failing after 3: stop and report the
  remaining actions and scores instead of looping.

The human-readable version of the same report is the `.md` next to it,
including First Principles, Search Intent, Entity Coverage, Topic Cluster,
and Knowledge Sync sections. The report header names the entity/intent
profile tier (`override` / `knowledge` / `config`); `config` is the
lowest-confidence tier, so treat entity-coverage misses there as suggestions,
not gospel.

## Anti-AI writing rules (what the aiTells metric checks)

- **Em-dashes: zero, anywhere.** Rewrite with a period, comma, colon, or
  parentheses. This is a project-wide hard ban.
- "Not just X, it's Y" / "not only ... but": zero occurrences.
- Banned vocabulary: delve, dive into, deep dive, unlock, elevate, seamless,
  effortless, game-changer, supercharge, revolutionize, "in the world of",
  "when it comes to", "whether you're a", "say goodbye to", "harness the
  power", "treasure trove", "embark on", "a testament to", "to the next
  level", plethora, myriad, boasts (full list:
  `seo-engine/config/writing-rules.json` `aiTellPhrases`).
- Rule-of-three ("fast, simple, and private") in at most a quarter of sentences.
- Vary paragraph shapes; six paragraphs with identical sentence counts is a tell.
- Bold sparingly (at most ~2 bold runs per 100 words).
- Colon headings ("X: Why Y Matters") in at most 30% of headings.

## Edit guardrails for existing content

Apply mechanical fixes freely: jargon replacements, em-dash removal, hedging
removal where the claim is factual, passive-to-active where the subject is
obvious, thin-phrase replacement with specific facts. Use judgment before
restructuring: keep "may/might" for genuine uncertainty, keep passive voice
for natural idiom ("Base64 was defined in RFC 1341"), and surface big
restructures as suggestions instead of doing them unasked. Never touch section
ids, h2 text, ReferenceBlock structure, frontmatter, Astro expressions,
`<code>` content, CTA hrefs, FAQ ids/questions, or `<style>` blocks.

## Calibration note

Gate thresholds live in `seo-engine/config/content-intelligence-rules.json`
(`gates`). If a threshold seems wrong across many tools, raise it with the
user; do not silently edit the gates to make content pass.
