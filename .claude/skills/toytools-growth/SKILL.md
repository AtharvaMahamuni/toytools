---
name: toytools-growth
description: Prioritize existing ToyTools tools and identify new ones using a quality-first checklist. Score for niche value and distinctive interaction, reject thin or low-effort content, and hand approved work to the existing seo-content pipeline. Use when auditing tools, deciding what to improve or build, filtering new tool ideas, ensuring no page feels thin or low-value, or when the user runs /toytools-growth.
---

# ToyTools Growth & Content Quality

Every tool page must feel complete, useful, and high-effort. Google should have no reason to treat it as thin or low-value content. This skill decides what is worth building or improving and sets the quality floor. It hands high-priority work to the existing seo-content skill for research, writing, and the quality gate.

## Non-negotiable quality floor

From now on, no new or significantly updated tool page ships if it feels thin or low-effort.

A page fails the quality floor if any of the following are true:
- The surrounding text is mostly generic filler that could apply to any similar tool.
- Uses, Pitfalls, or FAQs do not reference the actual controls or behavior of this tool.
- There are fewer than 5 substantive FAQs or the answers are one-sentence restatements of the formula.
- Common mistakes are obvious or missing.
- Real-world examples lack concrete numbers or specific scenarios.
- The page would still make sense if the interactive tool were removed.
- It relies on the linked guide to supply the only real explanation.

Passing the quality floor requires:
- Content that teaches or clarifies something the interactive tool itself demonstrates.
- Explicit references to the tool’s controls (sliders, presets, drag actions, live readouts, etc.).
- Genuine pitfalls that real users hit.
- Concrete examples with numbers or clear before/after scenarios.
- Enough depth that a reader learns something even before using the tool.
- Original prose only. Never copy or closely paraphrase competitor or Reddit text.

The existing seo:gate and AI-tell rules still apply (no em-dashes, no banned vocabulary, varied sentence length, etc.). This skill adds the “does not feel thin” requirement on top.

## Core principle

Significant investment is justified only when a tool scores high on both:
1. Niche topic with specific search demand and weak interactive competition.
2. Distinctive client-side interaction most other pages lack.

Even then, the supporting content must clear the quality floor above. A rare interaction with thin text is still low-effort in Google’s eyes.

## Scoring checklist (0–2 each)

| Factor | 0 | 1 | 2 |
|--------|---|---|---|
| Niche + Competition | Crowded (many strong tools) | Mixed | Specific queries, weak interactive competitors |
| Distinctive Interaction | Plain calculator | Some visualization | Rare interactive capability (live visualization, drag exploration, trade-off display, etc.) |
| Intent Match | Generic title | Partial | Exact query match in title/H1 |
| Content Reinforces Tool | Generic or thin | Some references | FAQs/examples explicitly use the controls |
| Pitfalls & Depth | Missing or shallow | Basic | Real mistakes + concrete numbers + practical or exam value |
| Performance Signal (bonus) | No impressions | Impressions, poor position/CTR | Impressions + decent position or CTR |

**Priority bands**
- 10–12: High. Must clear quality floor. Run full seo-content pipeline.
- 7–9: Medium. Only improve if the result will clear the quality floor. Otherwise leave.
- ≤6: Low. Do not expand into a thin page. Leave, consolidate, or noindex if it adds no unique value.
- Soft redirects / old URLs: Cleanup only. This host cannot emit a 301. Retired URLs stay noindex meta-refresh stubs (`src/data/tool-redirects.ts`, `src/data/guide-redirects.ts`).

## What a strong tool and page look like

**Strong tool characteristics**
- The interaction is uncommon. Users can explore a relationship, trade-off, or visual behavior that most competing pages only describe in text or static images.
- The topic is specific enough that search demand exists, yet few polished interactive tools already rank.
- The page title and main heading closely match the queries people actually type.
- Supporting sections (Uses, Pitfalls, Real-world examples, FAQs) repeatedly point back to the actual controls and live behavior.
- Examples include concrete numbers or clear scenarios.
- Pitfalls describe real mistakes users make, not obvious ones.
- A reader can learn something useful from the text alone, and the tool makes that learning concrete.

**Strong content characteristics**
- Answers start with a direct statement, then explain with a concrete detail.
- FAQs and examples say things like “move this control and watch the readout” or “set this preset to see the difference.”
- Numbers, units, and specific cases appear where they help understanding.
- The writing stays short and practical. It does not pad length for its own sake.
- Nothing reads as generic filler that could be copied to another tool.

**Weak tool and content characteristics**
- The core function is a common calculation or conversion already available on many sites.
- The interaction is limited to typing values and seeing an output.
- Supporting text could apply to almost any similar tool.
- FAQs restate the formula without adding insight.
- Pitfalls are obvious or missing.
- The page gains little if the interactive element is removed.
- Expanding the text would mainly add length without adding unique value.

## Where the scores come from

The checklist does not replace the SEO pipeline. It decides whether a tool deserves that pipeline. Load the `seo-content` skill for commands. The Reddit block is `extractRedditResearch` in `seo-engine/scripts/reddit.ts`, written into `seo-engine/research/processed/<slug>/research.json` by `npm run seo:extract -- <slug>`.

There is no Search Console export in the repo, and `GSC_SA_KEY_JSON` is unset, so the Performance Signal column stays 0 until the user supplies a real Pages + Queries export. Do not treat `redditDemandScore` as impressions.

| Checklist factor | Read this | Do not |
|---|---|---|
| Niche + Competition | `contentGaps` and `competitorHeadings` for how crowded the SERP is. `redditDemandScore` (volume, engagement, breadth, pain) only when `dataConfidence` is at least 0.5 | Treat an empty `seo-engine/research/reddit/<slug>-posts.json` as low demand. Collection often fails (HTTP 403). `redditIntentScore` 0 then means "not collected" |
| Distinctive Interaction | The widget. Rare means live visualization, drag, or a trade-off the page demonstrates | Score this from Reddit or from `seo:gate`. Neither sees the interaction |
| Intent Match | `primaryIntent`, `secondaryIntent`, and `redditQuestions` topics against the title and H1 | Copy a Reddit title into the title |
| Content Reinforces Tool | The guide, FAQ, and `knowledge.ts` against the real controls. `contentOpportunities` names topics competitors do not already cover | Add a control mention that the widget does not have |
| Pitfalls & Depth | `redditPainPoints` for mistakes, `redditMisconceptions` for myths, `redditUseCases` for scenarios. The page still has to supply the numbers | Invent a comparison or troubleshooting FAQ because that axis is empty. Intent is +20 per non-empty axis (questions, pain, use cases, comparisons, misconceptions), capped at 100. An empty axis is a finding, not a writing assignment |
| Performance Signal | A user-supplied GSC export only | Fill this from `redditDemandScore`. GEO adds at most +10 from that score (`seo-engine/scripts/utils/scoring.ts`). That bonus is not the checklist column |

`seo:gate` still judges prose (overall 75, writing, usefulness, completeness, style, query targeting, no em-dashes). A passing gate can still fail this quality floor. A failing gate is not a reason to expand a tool this checklist scored 6 or below.

Reddit text is intent discovery only. Never copy or paraphrase a title, post, or comment. The query generator searches the first slug token, so a token like `newman` or `spinner` is a bad query, not evidence about the tool.

For "what to build next", demand order still comes from `next-tool` (`npm run research:status`, then `npm run research:next`). This checklist accepts or rejects that candidate. Do not blend its total with `finalScore`.

## Workflow

### Auditing existing tools
1. Run `npm run seo:status -- <slug>` and follow its next command. If `research.json` is missing, status will say whether the next step is `seo:research` then `seo:extract`. Simulations are gated with `npm run seo:gate:sim -- <slug>`. Do not run `seo:research` on a simulation slug. The collector searches a truncated token.
2. Read the research file's Reddit block and the tool's guide, FAQ, knowledge, and widget.
3. Score each factor from the table above. Leave Performance at 0 unless a GSC export was provided.
4. Apply the quality floor.
5. Assign priority (High / Medium / Low / Cleanup).
6. Output a prioritized table and recommended actions.

### Identifying new tools
Sources:
- A GSC query export, when the user provides one, that has impressions and no strong matching tool page
- `contentGaps`, `contentOpportunities`, and People Also Ask style questions already in a neighbor tool's `research.json`
- School, exam, or practical topics where interactive tools are still rare
- Natural extensions of existing engines where a distinctive interaction is possible
- Direct suggestions
- A `next-tool` candidate, accepted or rejected with this checklist

Filtering:
1. Run the full scoring checklist.
2. Confirm it can be built client-side on an existing engine (no backend, no model calls).
3. Reject if the topic is crowded, the interaction would be plain, or the page would be hard to make non-thin.
4. Approve only if it scores high on niche + distinctive interaction and can clearly clear the quality floor.

Output for new ideas:
- Approved ideas (with score and why they fit)
- Rejected ideas (with the specific reason)
- Ranked shortlist of the best 1–3 ideas to consider next

### Decision rules
- Never ship or expand a page that would feel thin or low-effort.
- Content must reference the actual tool. Generic text fails.
- Prefer one excellent high-scoring tool over many mediocre expansions.
- Indexing problems on low-scoring tools are usually caused by low uniqueness, not missing technical fixes.
- Reddit and competitor research (already in seo-engine) are for intent discovery only. Original prose only.
- Keep all ToyTools constraints: client-side, no backend, no model calls from the tool, offline-capable after load, single purpose.

## Output format for audits

Markdown table:

Tool | Niche | Interaction | Intent | Content | Depth | Perf | Total | Priority | Quality Floor | Action

Then list:
- Top 1–3 tools that should enter the seo-content pipeline
- Any tools that must not be expanded because they would remain thin
- Cleanup items (redirects, etc.)
- For new-idea requests: approved / rejected list with reasons

## Handoff

When a tool or idea is approved:
- Confirm it can clear the quality floor.
- Tell the agent to load the seo-content skill.
- Start with `npm run seo:status -- <slug>` (for existing tools) or the normal tool-creation process (for new tools).
- Require the final page to pass both seo:gate and the quality floor defined here.

## Trigger examples
- “Audit the latest GSC export with the growth skill”
- “Score these tools and tell me what to improve”
- “Find new tool ideas that match the checklist”
- “Evaluate this tool idea for X”
- “Which existing tools are worth running through the SEO pipeline?”
- “Review whether this page feels thin”
