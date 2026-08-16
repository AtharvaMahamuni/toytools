---
name: tool-ux-review
description: Evaluate the interaction quality of shipped ToyTools tools and return a ranked, evidence-backed findings list - what a real person hits mid-task on a phone, ordered by how many tools each fix reaches. Use when asked to review or audit a tool's UX, to find what is clunky or missing across the catalog, to check touch/keyboard/state handling, to decide which polish is worth doing next, or before a craft or UI batch to pick targets. Evaluates and ranks; it does not build. Pair with tool-craft to implement a finding.
---

# Tool UX Review

The catalog's UX is delivered in **layers**, and that single fact determines both how you measure it
and what a finding is worth.

```
src/styles/tool-widget.css   → every tool page          (121 tools)
src/tools/_shared/*.astro    → every tool on that engine (3 to 18 tools)
src/components/tool/*.astro  → every tool that composes it
src/tools/<seg>/<slug>/      → exactly one tool
```

So a UX finding has two numbers, not one: **how bad it is**, and **how many tools one fix reaches**.
A missing touch state in `tool-widget.css` outranks a genuinely awkward flow in a single bespoke
widget, because the first is one rule block for the whole catalog and the second is one page.

This skill finds and ranks. It does not implement. **`tool-craft`** implements a per-tool touch;
**`ui-design-system`** is the contract any fix must satisfy.

## The rule that makes this skill work

**Resolve the shared layer before declaring any per-tool gap.**

Grepping a tool's `Widget.astro` or its built HTML for an affordance produces false gaps at a very
high rate, because 77 of 107 widgets are thin wrappers that inherit everything from an engine widget,
and because shared styling arrives through a linked stylesheet the HTML never names. Two real
examples from the audit that produced this skill:

- "`bmi-calculator` has no Clear control" — false. `WellnessWidget.astro` renders
  `action-btn--clear`, labelled **Reset**, so a probe for the string `Clear` misses it.
- "`bmi-calculator` has no `tabular-nums`" — false. Its result carries `.hero-value`, which gets
  `font-variant-numeric: tabular-nums` from `tool-widget.css`. The class is on the page; the
  declaration is in a stylesheet.

Both would have been reported as 11-tool gaps. **Before you write a finding down, confirm it in the
file that would fix it**, not in the file where you noticed it.

## Step 1: fix the frame

Answer these before measuring, because they decide what counts as a defect:

1. **What is the tool's mid-task moment?** Not "converts hex to text" but "is staring at a decode
   that failed and cannot tell whether the input or the tool is wrong."
2. **Which layer owns each surface it shows?** Read `docs/code-map.json` for the engine, then read
   that engine's widget in `src/tools/_shared/`. This is the whole reason a per-tool review keeps
   finding platform-level answers.
3. **Is this a phone?** Assume yes. Most visits are mobile, every tool is installable, and the
   documented breakpoint to design against is ~390px.

## Step 2: the rubric

Six dimensions. Score each **present / partial / absent**, and for anything not "present", record
the file that would fix it and the tool count that file reaches.

### 1. First contact
Does the page tell you what to do with zero input? An empty tool showing an empty box is a dead end.
Look for: a sample/example control, placeholder text that shows *shape* rather than repeating the
label, an `EmptyState`.

### 2. Touch acknowledgement
**Every control needs a visible `:active` state, because phones have no hover.** This is a
documented non-negotiable in `CLAUDE.md`, it has no gate, and it is the single highest-reach thing
this skill tends to find. Check `src/styles/tool-widget.css` directly:

```sh
grep -nE ':hover|:active|:focus-visible' src/styles/tool-widget.css
```

A control class with a `:hover` rule and no `:active` rule is a finding. Also check touch targets
resolve to at least `var(--touch-target)` (48px), and that no affordance is hover-only.

### 3. Keyboard and input economy
Per field: does `inputmode`/`type` summon the right keyboard, does `enterkeyhint` label the return
key for what it actually does, and do code/token/hash fields carry
`autocapitalize="off" autocorrect="off" spellcheck="false"`? Does the font-size reach 16px so iOS
does not zoom? Is there a keyboard path for the primary action on desktop?

### 4. State and recovery
Does the input survive a reload (`ToyTools.storage`/`state`)? Is there a way back to empty? When the
input is the wrong shape, does the tool say *what* is wrong and offer the fix, or only refuse? That
last one is the `recovery` craft kind and belongs to `tool-craft`; note it here and hand it over.

### 5. Stillness
Nothing may move while a person is working. Auto-growing textareas are forbidden; panels are
fixed-height with internal scroll (`IoPanel`); live numerals carry `tabular-nums` so digits do not
jiggle as they update; wide content scrolls inside its own container and never the page body.

### 6. Calm
Count the bordered boxes. `check:craft` gates the worst single widget, so read the number rather
than estimating:

```sh
npm run check:craft -- --report
```

Ask of each box: does it separate two things a person actually treats separately? If not, it is
furniture. One row beats one section; `<details>` beats a permanent panel.

## Step 3: rank by reach, then severity

| tier | what it is | reach |
|---|---|---|
| **P1** | a defect in `tool-widget.css`, `global.css` or a `src/components/tool/` component | up to 121 tools |
| **P2** | a defect in one `src/tools/_shared/*Widget.astro` | every tool on that engine |
| **P3** | a defect in one tool's own widget | 1 tool |

Within a tier, order by whether it blocks the task, then whether it is silent (a person cannot tell
anything is wrong), then cosmetic. **A P1 that takes one rule block outranks a P3 that takes a
redesign, every time.** Say the tool count out loud in the finding; it is the number that decides
what gets done.

## Step 4: report

One table, most valuable first. Every row carries:

| field | why |
|---|---|
| finding | one sentence, the defect not the fix |
| the moment | when a person hits it |
| fix location | the file that would change |
| reach | how many tools that file serves |
| evidence | the command or file:line you confirmed it in |

State separately what you checked and found **healthy**, so the next person does not re-audit it.
The platform is better than a naive probe suggests, and an audit that only lists gaps will get the
same false positives rediscovered every quarter.

Do not implement from inside this skill. Hand each finding to `tool-craft` (per-tool touch) or a
plain UI change gated by `ui-design-system`, and remember that anything touching shipped code needs
`npm run verify` green plus a version bump and a `CHANGELOG.md` entry.

## Known-good baseline (2026-08-16)

Confirmed present, so start from here rather than re-measuring:

- Every tool page has an `aria-live` result region and a keyboard handler.
- The text-family engines (`text-processor`, `text-analysis`, `encoding`, `structured-data`,
  `hashing`, `csv`, `jwt`) ship paste, sample and clear controls.
- The number-family engines (`wellness`, `finance`, `calculator`, `units`, `color`, `physics`) ship
  `inputmode` and a Reset control, and their results render through `.hero-value` / `.tm-stat-value`,
  which carry `tabular-nums` from `tool-widget.css`.
- Input persistence via `ToyTools.storage`/`state` reaches 77 of 121 pages.

Open at the time of writing, both P1:

- `src/styles/tool-widget.css` defines **11 `:hover` rules and 0 `:active` rules**, so no tool
  control acknowledges a tap from that stylesheet. It also carries exactly one `:focus-visible`.
- `enterkeyhint` appears on **2 of 121** pages.
