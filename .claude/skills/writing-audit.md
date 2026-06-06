# Skill: Content Intelligence Audit

Runs a full content intelligence audit on a ToyTools tool, shows scores across writing quality, usefulness, SEO completeness, topic cluster, and ToyTools style — then applies the high-confidence improvements directly to `Guide.astro` and `faq.ts`.

## When to use

Invoke when the user asks to:
- "audit [tool]" / "run writing audit on [tool]"
- "improve the content for [tool]"
- "check [tool] quality" / "score [tool]"
- "apply writing improvements to [tool]"

The slug is the tool directory name under `src/tools/` (e.g. `base64-encoder-decoder`, `case-converter`).

---

## Step 1 — Run the analysis

```bash
cd seo-engine && npm run seo:writing-tool -- <slug>
```

This reads `src/tools/<slug>/Guide.astro`, `faq.ts`, and `config.ts` from the project root, then writes:
- `seo-engine/reports/tool-content-intelligence-<slug>.md` — human-readable audit
- `seo-engine/reports/tool-content-intelligence-<slug>.json` — structured actions

---

## Step 2 — Show the report to the user

Read `seo-engine/reports/tool-content-intelligence-<slug>.md` and display:
- Overall Score
- Category breakdown table
- First Principles Coverage
- Search Intent Coverage
- Entity Coverage
- Topic Cluster status
- Actions list (High / Medium / Low)

Tell the user you are about to apply the High Impact actions, then proceed.

---

## Step 3 — Apply High Impact actions to Guide.astro

File: `src/tools/<slug>/Guide.astro`

Read the JSON report at `seo-engine/reports/tool-content-intelligence-<slug>.json` and process each `"high"` impact action where `file === "Guide.astro"`.

**Specific improvement types and how to apply them:**

### Missing entity mention
Find the most relevant existing section and add a natural mention of the entity within existing prose. Do not create a new section. Example: if "UTF-8" is missing, add it to the sentence that already discusses character encoding.

### Missing search intent / first principle
Find the section most closely related to the intent and add a sentence or short paragraph that directly answers it. If comparisons are missing, add a sentence like "Unlike X, Base64 does Y" to the relevant section.

### Jargon replacement
Replace each jargon word using the replacements map in `seo-engine/config/writing-rules.json`:
- utilize → use
- leverage → use
- facilitate → help
- streamline → simplify

### Thin content phrases
Remove generic filler phrases and replace with specific factual statements. Example:
- Before: "This tool helps you encode text."
- After: "Base64 encoding converts text to a 64-character ASCII representation."

### Hedging language (if score < 70)
Replace hedging words (generally, typically, usually, often, may, might) with direct statements where the claim is factual.
- Before: "Base64 is generally used for encoding binary data."
- After: "Base64 encodes binary data as printable ASCII text."

### Passive voice (if passiveVoiceCount > 5)
Convert passive constructions to active voice where the subject is clear.
- Before: "The data is encoded by the algorithm."
- After: "The algorithm encodes the data."

---

## Step 4 — Apply High Impact actions to faq.ts

File: `src/tools/<slug>/faq.ts`

Process each `"high"` impact action where `file === "faq.ts"`.

**Rules:**
- Only edit `answer:` string values — never change `id:` or `question:` fields
- Keep answers between 40–80 words
- Replace jargon, remove hedging, convert passive voice
- Do not add or remove FAQ items

---

## Step 5 — Apply Medium Impact actions (with judgment)

Process `"medium"` impact actions from the JSON report.

Apply only when the change clearly preserves meaning:
- Passive voice → active voice (apply if the subject is obvious)
- Hedging removal (apply only if the statement is objectively true — leave "may" when genuinely uncertain)
- Transition words (add to Guide.astro prose where flow feels abrupt)
- Topic cluster gaps (add FAQPreview if missing, note related tools if they exist)

Skip medium actions that would require restructuring sections or adding significant new content — surface those as suggestions instead.

---

## Step 6 — Verify the build

```bash
npm run build
```

Must complete with no TypeScript errors and no Astro build errors. If errors occur, diagnose and fix before reporting the task as complete.

---

## What to change (clear wins — always apply)

- Jargon replacements from `writing-rules.json`
- Thin content phrase removal + replacement with specific prose
- Missing entity mentions (add inline within existing sentences)
- Hedging removal where the claim is a documented fact
- Passive voice where the active subject is unambiguous

## What requires judgment (apply only if meaning is fully preserved)

- Sentence splits — only split if both halves are grammatically complete thoughts
- Hedging removal — leave "may" / "might" when the statement is genuinely uncertain
- Passive voice — leave it when the passive form is the natural idiom (e.g. "was defined in RFC 1341")
- Comparison additions — only add if a real comparison exists in the content; don't invent one
- Topic cluster gaps — only add FAQPreview if `faqHref` is already available in the component

## Style guardrails — never touch these

- `<ReferenceBlock>` component: do not change `type`, `heading`, or structure
- Section `id` attributes: do not rename (they are URL anchors)
- `<h2>` heading text: do not rephrase (affects page structure and SEO)
- Astro frontmatter (`---...---`): imports, interface, const declarations — do not change
- `<code>` inline elements and their content: technical values must stay exact
- CTA link text and `href={toolHref}` expressions: do not modify
- FAQ `id:` and `question:` fields: only `answer:` may be edited
- Any `withBase()`, `{faqHref &&...}`, or Astro `{...}` expressions
- The `<style>` block: do not add, remove, or modify CSS rules

---

## Reference: tool slugs

Available tools: `base64-encoder-decoder`, `case-converter`, `word-counter`, `percentage-calculator`, `notepad`, `pomodoro-timer`, `todo-list`, `keep-screen-awake`

Add new slugs to `seo-engine/config/content-intelligence-rules.json` under `toolIntents` to get tool-specific entity and intent coverage scoring.
