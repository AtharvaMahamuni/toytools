---
name: improve-tool
description: Turn one thin ToyTools tool into a stronger instrument for a job it already has. Use when asked to improve, redesign, or deepen an existing tool, or after audit-tool returns Improve. Follows tool-design, interaction-patterns, ui-design-system, and tool-craft. Does not invent a new engine or a new page.
---

# Improve Tool

One shipped tool, made to fit the job it already has. Use this after `audit-tool` returns Improve, or when the caller names the job and the missing interaction.

## Steps

1. Read `docs/tool-design.md` and the audit if one exists. Restate `userJob` in one sentence. If you cannot name the job, stop and run `audit-tool`.
2. List the rows from `docs/interaction-patterns.md` this job needs, and the rows it does not. The second list is what keeps extra chrome off the page. A control whose only purpose is to look unlike a chat answer does not qualify (`docs/tool-design.md`).
3. Stay on the tool's engine. Read `docs/code-map.json` and one sibling widget before writing. A second engine is `add-tool` → `references/add-engine.md`, and it is a major version bump. A simulation stays a model on the existing simulation engine.
4. Build the interaction with `ui-design-system`. One thoughtful touch, when the job has an honest failure to resolve, follows `tool-craft`. Phone behavior follows the widget rules in `CLAUDE.md`.
5. When the slug is on `src/lib/tools/job-backlog.ts` and the job is now real, set `job` and remove the slug in the same change. A half-written `userJob` fails `isDeclaredJob()`.
6. Guide, FAQ, and knowledge edits follow `seo-content`. Declaring `job` does not require a content rewrite.
7. Shipped code is done when `npm run verify` exits 0 (`gates`).
8. Report: the job, which interaction was added, which engine and components were reused, and what was verified.

Removing a tool, merging two URLs, or scaffolding a replacement is `audit-tool`'s verdict handed back to the caller, then `add-tool` and the redirect rules in `CLAUDE.md`. This skill does not do those.
