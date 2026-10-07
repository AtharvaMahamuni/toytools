---
name: code-review
description: >-
  ToyTools pre-push code review. Four fresh-context reviewers, one per parameter
  (correctness, product contract, content, architecture and gates), then a single
  merged report. Use when asked to review a change, do a code review, review
  before push, or run /code-review. A GitHub pending review of one PR stays on
  the bundled review skill.
---

# Code review

Review the change with four reviewers who do not share a context and do not see the session that wrote the code. Merge their notes. Fix bugs before the push. Leave suggestions in the report.

This is the ToyTools pass. A single GitHub review comment thread is the bundled `review` skill (`/review --pr`). Do not post to GitHub from here.

## The four parameters

Each reviewer owns one parameter and ignores the others. The rules live in the skill named in the last column. Do not copy those rules into the reviewer prompt. Point at the files.

| Parameter | Question | Read | Rules live in |
|---|---|---|---|
| correctness | Do the new functions return the right value on the edges the tests skip? | Engine modules, their tests, and any number a guide quotes | the engine file and its colocated test |
| product contract | Does the page do the job, and does the craft stay silent when the failure is absent? | `config.ts`, `Widget.astro`, the shared widget it wraps | `docs/tool-design.md`, `tool-craft`, `ui-design-system` |
| content | Does the guide, FAQ, and citation match the engine, with no em dash and no raw URL? | `Guide.astro`, `faq.ts`, `knowledge.ts`, the new changelog section | `seo-content` |
| architecture | Did registration, the version, and the ratchets move the legal way? | generated barrels, `version.ts`, `CHANGELOG.md`, the threshold the diff touches | `gates`, `CLAUDE.md` versioning |

A fifth reviewer is a new parameter only when the diff is outside those four (a workflow, a skill, a dataset). Name the question in the same shape. Do not split one parameter into two reviewers.

## Run

1. Collect one diff of the whole change, including untracked files, into a scratch file. For a dirty tree use `review/scripts/collect_local_diff.py` from the bundled review skill. For a clean branch, `git diff --merge-base origin/main` with color off. Hand every reviewer that path and the file list. Do not paste the diff into the prompt.
2. Spawn the four reviewers in parallel. Each prompt is self-contained: the parameter, the file list to open, the output path, and the instruction not to edit the repo. Prefix the description with `[reviewer]`.
3. Each reviewer writes this file and nothing else:

```markdown
## Summary

## Issues

### Issue 1 -- Severity: bug
- File: path:LINE
- Description:
- Suggestion:
- Status: open
```

Severity is `bug`, `suggestion`, or `nit`. An empty Issues section is a valid review. A reviewer who cannot verify a count says so as a suggestion, not a bug.

4. Merge. A bug is fixed in this session, then `npm run verify` if the fix touches shipped code. A suggestion or a nit is reported and left. Two reviewers filing the same bug become one item, credited to both parameters.
5. The report to the user is the merged list: parameter, severity, file:line, and whether it was fixed. Do not paste the four raw files.

## Stop

- No reviewer edits source, and none of them sees the others' notes before the merge.
- Do not lower a ratchet, delete an assertion, or rewrite a guide sentence to satisfy a reviewer who did not show the engine is wrong.
- Do not open a PR from this skill. Push only when the user asked for a push, on the feature branch, after verify is green.
