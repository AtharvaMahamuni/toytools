---
name: tool-craft
description: Give one ToyTools tool its distinct identity - the single thoughtful touch that solves a real user problem its engine cannot, plus the minimal-UI pass that keeps the page calm. Use when asked to make a tool special/distinct/more useful, to add a thoughtful touch or small addition to a tool, to polish or declutter a tool's UI, to reduce boxes and visual noise, or to fill the craft backlog. Required for every new tool.
---

# Tool Craft

Three quarters of this catalog is a single self-closing tag. `base64-encoder-decoder`,
`hex-encoder-decoder` and `url-encoder-decoder` differ by one `processorId` string. The engines are
good and uniform, which is the achievement and also the ceiling: a tool that gets only what its
engine gives everyone has no reason to be preferred over its sibling.

This skill adds the thing that makes one tool worth choosing, and does it without turning the page
into a control panel.

> **The definition.** A tool's craft is the **one** affordance that comes from knowing what this
> specific tool's users are actually doing, which its engine cannot know on their behalf.

Full analysis and measurements: `docs/analysis/2026-08-11-tool-craft.md`.

## Before you touch anything

```sh
npm run check:craft -- --report   # who has craft, of what kind, and the backlog by engine
```

Read the tool's `knowledge.ts` (`realWorldUseCases`, `commonMistakes`) and its
`research/datasets/*.json` entry if one exists. Both were authored from evidence and both describe
users failing at this exact tool. That is the raw material; do not start from a blank page.

## Step 1: analyse the tool, in this order

Every step before the last is about the user. The last one is the only one about UI. Reversing the
order produces a feature looking for a problem.

1. **What does it solve?** The job, not the mechanism. Not "converts text to Base64" but "gets
   binary-unsafe data through a text-only channel".
2. **Who arrives, and from where?** A JWT decoder gets people debugging a 401. A tip calculator gets
   people at a table with the bill. Context bounds what help is even possible.
3. **How is it solved elsewhere, and badly?** The CLI, the IDE extension, the incumbent site. Weak
   incumbents are already recorded per tool in the research datasets.
4. **Where do they fail?** The concrete list. Prefer failures the code can **already detect**: those
   are one step from resolved, and they are the highest-value craft in the catalog.
5. **What is the single highest-value touch?** One, from the taxonomy below. Name the kind.
6. **What is the least UI that delivers it?** Step 3 of this skill.

Write steps 1 to 5 out before writing code. If step 4 produces only vague answers, **stop and report
that the tool needs no craft yet**. An invented touch is worse than an absent one: it ships to every
visitor forever.

## Step 2: pick the kind (a closed list of five)

| kind | the user problem | shape |
|---|---|---|
| **recovery** | their input is predictably the wrong shape, and the tool already knows why | one-tap fix offered where the error is reported |
| **verification** | their next move is "is this actually right?" | compare against what they expected |
| **continuation** | the real task does not end at the output | the next fact they need, computed |
| **guardrail** | a mistake here has real cost and is easy to make | an option that prevents it |
| **orientation** | something true about their input they cannot see | one line of fact |

The list is closed. If a proposed touch does not fit one of the five, it is decoration, and the
answer is to ship nothing. `CraftKind` in `src/data/types.ts` is a union, so an invented sixth kind
fails to compile.

**Four tests it must pass, all four:**

1. **Sibling test.** Would the tool next door on the same engine want it too? If yes it is an engine
   feature, and it belongs in the shared widget where every tool on that engine gets it.
2. **Ten-second test.** Does it serve the ten seconds *after* the output appears, or the ten seconds
   *before* they got a usable one? Craft lives at those two edges.
3. **Failure test.** Can you name the concrete way a real person fails today? "It could be more
   helpful" is not an answer.
4. **Silence test.** When it is not needed, is it invisible?

**One per tool, and that is a ceiling.** The cap forces the question "what is the single most
valuable thing these users are missing", which has a defensible answer, instead of "what could we
add", which does not.

## Step 3: build it, minimally

The rules, in `docs/analysis/2026-08-11-tool-craft.md` section 4:

- **R1. Compose from what exists.** `IoPanel`, `ToolActions`, `StatCard`, `HeroMetric`, the status
  line, `<details>`. A touch that needs a new visual component is a redesign in disguise.
- **R2. No new boxes.** No filled, bordered card. Prefer, in order: text in a slot that exists, a
  line under the control it modifies, a `<details>` drawer, and only then anything with an edge.
  The inverted form counts too: **if the container round your touch draws no edge, your touch must
  not draw one either.** Flattening a panel and leaving its contents bordered is still box-in-box.
- **R3. Silent until relevant.** Hidden by default via the `hidden` attribute. **Also write
  `[hidden] { display: none }`** for your element: any `display` rule silently overrides `[hidden]`,
  and this has now shipped as a bug twice. Hiding something that is *always* there, on hover or
  focus, is a different move and usually the wrong one: keeping its space reserved (so revealing it
  does not shift the layout under a thumb) leaves a band of dead air, and not reserving it shifts
  the layout. If a detail cannot earn its space, delete it.
- **R4. Every value is a token.** No raw hex, no bare pixels. If the palette lacks the colour you
  want, the state probably should not exist.
- **R5. One row, not one section.** A control plus a label, inline. Needing a heading is a signal
  it is more than one affordance.
- **R6. It is a control.** 48px touch target, a visible `:active` state (phones have no hover), the
  right `inputmode`, and it must not push the first control further down the phone screen.

### Prefer a shared seam over a bespoke widget

Craft goes **through** the shared widget, not around it. Rewriting a wrapper as a bespoke widget
deletes the engine architecture and multiplies CSS on every page in the segment.

The pattern, as shipped for the encoding engine:

1. Add an optional verb to the engine's contract (`recover` in
   `src/lib/engines/transform/types.ts`).
2. The **processor** supplies the domain knowledge (`src/lib/engines/encoding/base64.ts`), and
   returns null when it has none. Declining is a legitimate answer: hex does not guess which end of
   an odd-length string lost a nibble.
3. The **shared widget** renders the affordance once for every tool on the engine
   (`src/tools/_shared/converter/RecoveryOffer.astro`).
4. Each tool's `config.ts` declares the craft.

One seam gave 13 tools the mechanism while each keeps its own knowledge. That is what "independent
tools, unified infrastructure" means at this layer.

## Step 4: declare it

In the tool's `config.ts`:

```ts
craft: {
  id: 'b64-recover',          // MUST appear as data-craft on the affordance's root element
  kind: 'recovery',
  solves: 'Real Base64 arrives as a data URI, a base64url token or a value with its padding stripped, and all three currently get a correct rejection instead of the decode the user came for.',
},
```

`solves` names the concrete failure, in the user's terms. Under 40 characters fails the gate, and so
does anything that describes the feature instead of the failure.

Then render `data-craft="<id>"` on the affordance's root element. The build fails if the declaration
never reaches the DOM, which is what stops this field becoming documentation that rots.

## Step 5: prove it

```sh
npm run build                 # validators + the byte budget
npm run check:craft           # coverage ratio, wiring, and the clutter ceilings
npm run test                  # unit-test the domain logic, including that it stays SILENT
npx playwright test craft.spec.ts   # presence, phone-reachability, and that applying it works
npm run verify                # the done-condition
```

Add unit tests for both properties, weighted equally: that it **fires** on the real malformed input
it exists for, and that it **stays silent** otherwise. The silence half is the one that gets lost,
and its absence is invisible in a suite that only checks the happy path. See
`src/lib/engines/encoding/recover.test.ts` as the reference.

Raise `THRESHOLDS.coverage` in `scripts/check-craft.ts` in the **same commit**, to what you just
earned. Never lower a threshold to get past the gate.

## The backlog

`npm run check:craft -- --report` lists every tool without craft, by engine. The ranked shortlist,
each with the concrete failure it resolves, is section 8 of
`docs/analysis/2026-08-11-tool-craft.md`. Start there rather than re-deriving it.

## What this skill is not for

- **Content.** Guides, FAQs and knowledge files go through `seo-content`. Craft is behaviour.
- **Per-tool themes.** No colours, typefaces or marks per tool. The derived icon is the visual
  identity and it is already free.
- **Filling the cap.** A tool with no honest answer to the failure test declares no craft and waits.
