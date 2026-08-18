# The internal link graph, measured

**2026-08-18.** Prompted by asking what to do after craft coverage passed half the catalog. The
honest answer was that everything measured so far is measured against ourselves: query coverage
scores us on phrases we authored, `seo:gate` scores our prose against our own rules, craft coverage
is a ratio we chose. Link structure is different. It is what a crawler actually traverses, and
nothing had ever counted it.

## What the count said

| | before | after |
|---|---|---|
| indexable tool pages with **zero** outbound links to another tool | **47 of 121** | 0 |
| median outbound tool links per tool page | 4 | 7 |
| total outbound tool links across tool pages | ~470 | 821 |
| tools whose related set is a single-family bubble | 42 | 7, all structurally exempt |
| cross-family links in the derived graph | 306 | 341 |

The median of 4 is worse than it looks: every one of those four was a **tool-group pill**, which
points at a near-identical sibling by construction. A page with four links to its own group and
nothing else is, topically, still a dead end.

## Two causes, both invisible because nothing counted

### 1. The derivation could not produce a diverse answer

`getRelatedTools` is a four-tier cascade (same pattern+engine → same engine → same family → same
category) with a `slice` on the end. **Any engine larger than the slot count never gets past tier
one.** All eighteen `text-processor` tools share a pattern and an engine, so each one recommended
five more `text-processor` tools, forever.

This had been reported for months as a *content* problem: `validate-knowledge` warned "related tools
are all family X — consider a complementary or adjacent-workflow tool". No amount of authoring could
have changed it. The warning asked a person to fix something only the derivation could.

**Fix:** one slot goes to the nearest tool from another family, as a **floor**, not a rewrite. A set
that already reaches outside its family is left exactly as the tiers ranked it. Reserving two fixes
nothing further, so one is the whole win and four of five slots keep the closest siblings.

**The 7 that remain** are all `number-utilities`, where every tool is family `arithmetic`. That is a
fact about the catalog. `isSingleFamilyBubble` now takes the candidate pool and stays quiet when no
other family was available, which is a structural exemption rather than a list of slugs. With the
false positives gone the check became a build **error**.

### 2. The block never rendered on tool pages

The derived related list renders on **guide** pages. Tool pages get the group switcher and nothing
else, and `RelatedTools.astro` is imported by nothing at all.

This was deliberate. The note in `KnowledgeDrawers.astro` records why: four stacked blocks, 682px,
31% of the document, mostly repetition, and

> Related tools collapse into the category link (the catalog is one click away either way).

**The clutter half of that argument was right. The link half was wrong**, and it is worth being
precise about how. One click is the same for a reader. It is not the same for a crawler: a category
link hands authority to a hub that then splits it across up to eighteen tools, while a tool-to-tool
link is a topical signal between two specific pages. The note treats those as equivalent and they
are not.

**Fix:** the links come back without the 682px. Five text links inside a `<details>` that is closed
by default, in the Zone C row that already exists. Crawlers read closed `<details>` content; a
reader sees one more chip. Cost: **0.2KB gzipped** on the worst tool page, against 3.2KB of headroom.
Group members are excluded because `GroupSwitcher` already shows them.

## The gate

`platform-health` now fails when any indexable tool page links to no other tool. It is a **floor**:
one link is enough, and the derivation decides how many there really are.

Verified the only way a gate should be: the drawer was disabled and the check named all 47 pages.
Redirect stubs are excluded by detecting their `<meta http-equiv="refresh">`, never by a path list,
for the reason Quality Guardian's canonical validator learned the same lesson — a hardcoded prefix
list went stale the first time a tool slug was renamed.

## What this does not claim

It does not claim a ranking improvement. Internal linking is one input among many, and **we still
cannot see the output**: `GSC_SITE_URL` and `GSC_SA_KEY_JSON` are unset, so `check:indexing` skips
and nobody can tell an outranked page from an unindexed one. That remains the single highest-value
open item, and it is a repository-owner action.

What it does claim is narrower and checkable: **no page on this site is a dead end any more**, and a
gate now says so on every build.
