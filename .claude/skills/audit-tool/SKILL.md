---
name: audit-tool
description: Internal audit of one shipped ToyTools tool against the job it exists to do. Use when asked to audit a tool, decide keep, improve, merge, replace, or remove, or ask why someone would open this instead of asking a chat model. Reports a verdict. Does not edit the tool, does not publish a score, and does not replace tool-ux-review or tool-craft.
---

# Audit Tool

One shipped tool, one report. The product rules are `docs/tool-design.md`. This skill is the procedure.

The verdict is internal. It is not a field on the config, not a badge, and not a public score. Phone and keyboard quality is `tool-ux-review`. The one thoughtful touch is `tool-craft`. Content quality is `seo-content`. Do not restate those rubrics here.

## Steps

1. Read `docs/code-map.json` for the slug, then the config (or the simulation manifest), the widget, and the engine it calls. Open the guide only to see what the page claims.
2. If `job` is set, start from it. If the slug is in `src/lib/tools/job-backlog.ts`, the job was never declared. Write the job you observe from the widget, and label it observed.
3. Answer the eight scorecard questions in `docs/tool-design.md`. Each answer is one sentence of evidence from the widget, plus `low`, `medium`, or `high` where the question has a scale. No numeric total.
4. Pick one verdict.
   - **Keep.** The job is real and the page already does it. The follow-up is to set `job` and remove the slug from the backlog, when the caller asks for that edit.
   - **Improve.** The job is real, and a missing interaction would make this the page someone opens. Name the rows in `docs/interaction-patterns.md` the job needs. Hand the build to `improve-tool`.
   - **Merge.** Two tools perform one job. Name both slugs and which URL should remain. A merge is a redirect (`CLAUDE.md`, rename a tool). Do not merge URLs in this skill.
   - **Replace.** The job is real and this page cannot do it on its current engine. Name the replacement job and the engine that already fits. Do not scaffold until the caller asks.
   - **Remove.** There is no job, or a chat answer is the whole product and no interaction, privacy stake, or artifact would change that. Say so. Do not delete the tool in this skill.
5. Report: the tool, the authored or observed `userJob`, the eight answers, the verdict, and the smallest next change. Stop.

Audit the catalog one tool at a time. A batch is a list of these reports, not a rewrite.
