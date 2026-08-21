---
name: ui-design-system
description: The ToyTools design language and widget UI contract - page grammar and its three zones, the token system, ToolSplit and the layout widths, widget script rules and the ToyTools.* globals, CopyButton, BackButton, dark mode, empty/error/loading states, and the mobile-first and dark-mode validation checklists. Use when building or modifying any widget, layout or component, when adding UI to a tool page, when picking a colour, spacing value, breakpoint or component, or when reviewing UI for clutter. Read before writing widget markup or CSS.
---

# Skill: UI Design System

A comprehensive reference for building new UI in ToyTools. Use this when creating or modifying widgets, layouts, or components to ensure everything matches the existing aesthetic and patterns.

---

## Core principles

- **Static-first**: No client-side framework. Widgets are HTML + CSS + vanilla JS in `<script is:inline>`.
- **Mobile-first**: Design for a **393px** viewport (Pixel 5, the e2e gate), enhance upward. Canonical breakpoints are **1024 / 640 / 480px**; do not invent others.
- **Token-driven**: Every colour, spacing value, and font size comes from CSS custom properties. Never use raw hex values or hard-coded pixel values.
- **Warm Paper & Ink, single accent**: warm off-whites (`#FAF9F7` page, `#F4F2EE` panels) with soft-ink text; dark mode is warm graphite, not cool gray. One accent, a forest green `--color-accent`. The gold dot (`●` / `.gold-dot`) is the brand motif and the site mark, never an interactive element.
- **The tool leads, the platform signs**: a tool page is an application, not an article about an application. See "Page grammar" below, which is enforced by a test, not by taste.

---

## Page grammar (the rule that survives 5,000 tools)

A tool page has three zones with a **closed inventory**. Nothing outside a zone's inventory may
enter it. This is what stops the page slowly re-accreting furniture as the catalog grows.

```
Zone A  Do        ToolBar (mark + h1 + star + search + theme) | tagline | GroupSwitcher | widget | ToolActions
Zone B  Trust     ONE row: trust notice, install affordance, "Powered by ToyTools ●"
Zone C  Know      ONE row: drawer triggers, the guide, the category hub
```

- **Chrome belongs to whoever owns the page.** Platform pages render `Nav`; a tool page renders
  `ToolBar` through `BaseLayout`'s `header` slot, so a tool page opens with the tool's name and not
  the brand. Tool pages carry no visible breadcrumb (the JSON-LD still ships, and the category link
  lives on Zone C).
- **Never say the same thing twice on one page.** Zone C was 682px, 31% of the document, almost
  entirely because a related-tools list, a set of links pointing at content directly below them and
  a feedback invite each appeared twice. That is the failure mode this zone attracts.
- **Zone A is the only zone above the fold on a phone.** It ends in space, never a rule.
- **Zone C opens with the page's one and only hairline**, drawn by the lower section per the
  section-boundary recipe. Above the line is "do", below it is "understand".
- **The h1 is the tool's name, never the brand.** A tool h1 sits inside ToolBar at
  `--text-base`/`--text-lg`; a guide h1 stays
  `--text-4xl`. That size gap plus the guide's `TOYTOOLS ● GUIDE` eyebrow is the entire Tool Mode
  versus Reading Mode signal. Tool pages get no eyebrow; the absence is the other half of it.
- **`tagline` is the on-page line** (max 80 chars, a build error above that). `description` stays
  long: it is the meta description and one of four query-targeting slots, so never shorten it for
  layout.

### Enforced invariants

| invariant | where | what it means |
|---|---|---|
| **Fold ratchet** | `tests/e2e/fold.spec.ts`, Pixel 5, all tools | chrome above the tool must stay under `CHROME_LIMIT` of the viewport. Ratchets down only, never up. A rise means a page grew a masthead. |
| **Concept headings** | `THRESHOLDS.conceptHeadings` in `check-query-coverage.ts` | every tool page carries an H2 naming a concept, not a page part. Held at 1.0 by the knowledge drawers. |
| **Craft coverage** | `THRESHOLDS.coverage` in `check-craft.ts` | the fraction of tools declaring one thoughtful touch. Ratchets up only. A ratio, not a count, so adding a tool with nothing of its own fails the gate. |
| **Clutter ceilings** | `THRESHOLDS.boxesPerTool` / `rawHex` in `check-craft.ts` | the worst single widget's bordered-card count, and hardcoded colours in widget styles. Both ratchet down only. |
| **No separator rules** | `THRESHOLDS.dividers` in `check-craft.ts` | a `border-top`/`border-bottom` in any widget, per-tool **or** `_shared`. Fixed at **0** — space separates, lines do not. |

### The anti-clutter rules (they are half of the craft doctrine)

Craft and clutter arrived together: measured 2026-08-11, the 25 tools carrying a tool-specific
affordance were also the most box-heavy pages in the catalog, because the only pattern anyone
reached for when adding something was "put it in a box". So restraint is gated alongside coverage,
not left to taste.

- **No new boxes.** A tool-specific affordance may not introduce a filled, bordered card. Prefer,
  in order: text in a slot that already exists, a line under the control it modifies, a
  `<details>` drawer, and only then anything with an edge. A page with two panels does not need a
  third rectangle to hold one sentence.
- **One row, not one section.** The natural size is a control plus a label, inline. Needing a
  heading is a signal it is more than one affordance.
- **Silent until relevant**, and always pair the `hidden` attribute with an explicit
  `[hidden] { display: none }` for your element. Any `display` rule silently overrides `[hidden]`,
  which has now shipped as a visible bug twice (`InstallButton`, then `RecoveryOffer`).
- **Every value is a token.** If the palette lacks the colour a state wants, the state is usually
  the thing to remove: word-counter's "nearly at goal" amber was a hardcoded `#d97706` signalling
  nothing its progress bar was not already showing, and deleting it was the right fix.

Full doctrine, taxonomy and method: `.claude/skills/tool-craft/SKILL.md`.

### Layering rule

> The widget renders the tool. The platform renders everything that is not the tool.

A widget that knows about the catalog, the brand, installation or trust is a layering error.
`validate-architecture` fails the build if anything under `src/tools/` imports `CategoryDiscovery`,
because the failure mode is copying an existing widget as a template.

---

## Design tokens

All defined in `src/styles/tokens.css`. Reference only via `var(--token-name)`.

### Colours
```css
--color-accent          /* Forest green — buttons, links, focus. Single retheme point */
--color-accent-subtle   /* Accent tint background */
--color-accent-strong   /* Accent text on accent-subtle (AA) */
--color-text            /* Primary body text — soft ink, not #111 */
--color-text-muted      /* Secondary text, descriptions */
--color-text-subtle     /* Tertiary — labels, meta, captions */
--color-text-inverse    /* Text on dark/accent backgrounds */
--color-bg              /* Page background — warm off-white */
--color-surface         /* Panels, cards */
--color-surface-hover   /* Hover pair with --color-border-strong */
--color-bg-tertiary     /* Headers of collapsible sections, TOC summaries */
--color-border          /* Default border */
--color-border-strong   /* Emphasized border */
--color-gold            /* Gold brand motif — the dot and the site mark */
--color-success(-bg)    /* Transient state ONLY (copy confirm, valid). Never links or focus */
--color-danger(-bg)     /* Destructive confirmation */
--color-overlay-*       /* Theme-invariant immersive surfaces (always dark) */
```

**There is no `--color-bg-secondary`, `--color-bg-elevated` or `--radius-lg`.** This file listed
all three until 2026-08-08; CSS referencing a custom property that does not exist is invalid at
computed-value time and silently does nothing, so check `src/styles/tokens.css` before reaching for
a token you half-remember. Surfaces are `--color-surface`; radii are `--radius-sm` and
`--radius-md`.

### Spacing
Spacing scale uses `--space-{n}` where n is 1–16. Common values:
- `--space-2` ≈ 8px (tight gaps)
- `--space-3` ≈ 12px (small gaps)
- `--space-4` ≈ 16px (standard gap)
- `--space-5` ≈ 20px (medium gap)
- `--space-6` ≈ 24px (section padding)
- `--space-8` ≈ 32px (large gap)
- `--space-12` ≈ 48px (section separation)

### Typography
```css
--text-xs      /* Smallest — labels, meta */
--text-sm      /* Small — secondary text, TOC */
--text-base    /* Body text */
--text-lg      /* Slightly larger body */
--text-xl      /* Lead paragraph size */
--text-2xl     /* Sub-heading */
--text-3xl     /* Heading */
--text-4xl     /* Large heading (h1 on guide pages) */

--font-weight-normal
--font-weight-medium
--font-weight-semibold
--font-weight-bold

--font-mono    /* Monospace — code, keyboard shortcuts */

--leading-relaxed   /* Line height for body text */
```

**Gotcha: `global.css` caps every `<p>` at `max-width: 65ch`.** That is right for prose and wrong
for anything else that happens to be a paragraph. Because 65ch is measured in the element's *own*
font, it bites unevenly: in the simulator's formula panel it caught the worked line at `--text-lg`
mono and not the expression above it at `--text-xl`, centring two stacked formulas on axes 14px
apart. A `<p>` that is display maths, a metric, or a centred caption sets `max-width: none`.

### Layout widths
```css
--width-shell     /* 1440px — chrome (nav/footer), home, category, <main> ceiling */
--width-content   /* 1100px — tool pages and 2-column splits */
--width-prose     /* 72ch  — guide reading measure */
--width-tool      /* 820px  — FAQ pages and narrow forms */
--width-category  /* alias of --width-shell (legacy) */
--width-nav       /* alias of --width-shell (chrome) */
```

Set via `maxWidth` prop on `BaseLayout` (`'shell' | 'content' | 'tool' | 'full'`; `'category'` aliases shell):
```astro
<BaseLayout maxWidth="shell">    <!-- 1440px — home, category, chrome -->
<BaseLayout maxWidth="content">  <!-- 1100px — tool pages, guides -->
<BaseLayout maxWidth="tool">     <!-- 820px  — FAQ, narrow forms -->
```

**Wide ≠ unreadable:** the shell widens to fill side gutters, but prose stays at `--width-prose`
(~72ch) and `p { max-width: 65ch }` caps raw text. Only the *interactive* surface uses full width.

### Two-column tools (`ToolSplit`)
`src/tools/_shared/ToolSplit.astro` — desktop input-left / output-right, sticky output, stacks at
**1024px**. Props `ratio` (`1-1|3-2|3-1`), `stackOrder` (`input-first|output-first`), `stickyOutput`.
Answer-first tools (text metrics) stack output-first on mobile; transform tools stack input-first.
Live tools (case, percentage) update on input — no submit button.

### Action buttons & state colour
All tool buttons (`.action-btn`, defined in `tool-widget.css`) are transparent utility controls.
Colour communicates **state only**: Copy → `--color-success(-bg)` "✓ Copied" (2s); Clear → two-click
`--color-danger(-bg)` "Confirm Clear" (3s auto-revert). Never fill a button with accent for emphasis.

### Persistence & platform globals
`ToyTools.state.save/load/clear(toolId, data)` — versioned `toytools:{toolId}` JSON, never throws,
restore on load. `ToyTools.recordRecent/getRecent` — recent-tools list. Global shortcuts: `/` search,
`Esc` blur, `Ctrl/Cmd+Shift+C/X` copy/clear. See `ARCHITECTURE.md` for the full reference.

`CategoryDiscovery.astro` is rendered **once by `ToolPage`**, in Zone C. It used to be imported by
32 widget files; never import it from a widget (`validate-architecture` fails the build if you do).
Same for trust, install and the brand signature: those are `ToolSignature`, also platform-rendered.

### Interaction
```css
--touch-target    /* 48px minimum — all clickable elements */
--radius-sm       /* 4px */
--radius-md       /* 6px */

--transition-color   /* transition: color, background-color, border-color 150ms */
--duration-fast      /* 150ms */
--duration-normal    /* 200ms */
--ease-default
```

**Transitions rule**: only ever transition `color`, `background-color`, or `border-color`. Never `transition: all`. Never transition layout properties (width, height, padding).

---

## Widget development rules

### Script rules
Widget scripts live inside `<script is:inline>` in `Widget.astro`:
- No TypeScript — plain JavaScript only
- No ES module imports — no `import` statements
- No `import.meta.env` — not available in inline scripts
- Access Astro component variables via interpolation BEFORE the script: `const slug = '${config.slug}';`

### Global helpers (available via `ToyTools.*`)
Injected by `ToyToolsRuntime.astro` in `BaseLayout`:
```js
ToyTools.toast('Message')              // Show toast notification
ToyTools.copy('text to copy')          // Copy to clipboard + show toast
ToyTools.storage.get('key')            // Read from localStorage (50 KB cap)
ToyTools.storage.set('key', value)     // Write to localStorage
ToyTools.storage.clear('key')          // Remove from localStorage
```

**localStorage key convention**: `toytools.{slug}.{field}` — e.g. `toytools.notepad.content`

---

## Shared widget components

Located in `src/tools/_shared/`:

### `ToolSection.astro`
Card-style wrapper for a logical section of a widget (input area, output area, settings).
```astro
<ToolSection heading="Input">
  <!-- content -->
</ToolSection>
```

### `ToolAction.astro`
A button row inside a ToolSection (typically at the bottom).
```astro
<ToolAction>
  <button class="btn-primary">Convert</button>
  <button class="btn-secondary">Clear</button>
</ToolAction>
```

---

## Shared widget CSS

Defined in `src/styles/tool-widget.css`, imported globally. Available classes:

- `.btn-primary` — accent background button
- `.btn-secondary` — bordered secondary button
- `.btn-ghost` — minimal no-border button
- `.input-group` — wrapper for label + input pairs
- `.textarea-panel` — full-width textarea with consistent styling
- `.output-panel` — read-only output area, supports `data-empty` and `data-error` states
- `.copy-bar` — panel header with copy button; add `data-copy-bar` to turn green on copy

### CopyButton protocol
Add these data attributes to the output element for correct CopyButton behaviour:
- `data-empty` — present (no value needed) when output is in placeholder/empty state → shows "Nothing to copy!" toast
- `data-error="message"` — present when output is an error → shows error message as toast, blocks copy

---

## Layout patterns

### Tool page layout
```astro
<!-- In Widget.astro -->
<ToolSection heading="Input">...</ToolSection>
<ToolSection heading="Output">...</ToolSection>
```

### Internal links
Always wrap in `withBase()`:
```ts
import { withBase } from '@lib/paths';
// correct
<a href={withBase(`/tools/${category.segment}/${config.slug}/`)}>
// wrong — breaks on GitHub Pages
<a href={`/tools/${category.segment}/${config.slug}/`}>
```
`withBase` is a build-time server function. Do not call it inside `<script is:inline>`.

---

## Dark mode

Uses two layers in `src/styles/tokens.css`:
1. `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])` — OS preference
2. `:root[data-theme="dark"]` — user override

**Rule**: always use CSS token variables. A component that uses `var(--color-bg)` automatically works in dark mode. A component that uses `#ffffff` does not.

---

## BackButton

`src/components/BackButton.astro` renders a mobile-only ← Back button (hidden above 640px).
It is **automatically included** in `ToolLayout`, `FAQLayout`, and `GuideLayout`.
**Do not add it manually** in widgets or guide content.

---

## What to avoid

| Avoid | Use instead |
|---|---|
| Raw hex colours (`#6366F1`) | `var(--color-accent)` |
| Hard-coded px values in CSS | `var(--space-{n})` or `var(--text-{size})` |
| `transition: all` | `transition: var(--transition-color)` |
| Transitioning layout properties | Only transition colour properties |
| `var(--color-accent)` for decorative elements | `var(--color-gold)` for the gold dot; `var(--color-text-muted)` for secondary text |
| Inline styles (except `max-width` in BaseLayout) | CSS classes with token values |
| React, Vue, Svelte components | Plain HTML + `<script is:inline>` |
| `import.meta.env` in `<script is:inline>` | Pass values via Astro interpolation before the script |
| Adding BackButton manually | It's already in ToolLayout/FAQLayout/GuideLayout |
| Absolute pixel widths on widgets | Use `--width-tool` or `100%` |

---

## File locations quick reference

```
src/
├── styles/
│   ├── tokens.css          # All design tokens
│   ├── global.css          # Global styles, imports tool-widget.css
│   └── tool-widget.css     # Shared widget classes (btn-*, input-group, etc.)
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── BackButton.astro    # Auto-included — do not add manually
│   ├── CopyButton.astro
│   ├── ReferenceBlock.astro
│   ├── FAQPreview.astro
│   └── EcosystemLinks.astro
├── layouts/
│   ├── BaseLayout.astro    # maxWidth prop: 'tool' | 'category' | 'full'
│   ├── ToolLayout.astro
│   ├── GuideLayout.astro
│   └── FAQLayout.astro
└── tools/
    ├── _shared/
    │   ├── ToolSection.astro
    │   └── ToolAction.astro
    └── {slug}/
        ├── config.ts
        ├── Widget.astro
        ├── Guide.astro     (optional)
        └── faq.ts          (optional)
```

---

## ToyTools Golden Rule

The fastest interface is the one that does not exist.

Before adding any new UI element, ask:

1. Does this help the user complete the task faster?
2. Can the same outcome be achieved with fewer controls?
3. Can the same outcome be achieved with plain text?
4. Can the same outcome be achieved without JavaScript?
5. Would removing this element make the tool worse?

If the answer to #5 is **no**, do not add the element.

---

## UI Decision Framework

Before creating new UI, follow this order:

1. Reuse an existing shared component.
2. Reuse an existing layout pattern.
3. Extend a shared component.
4. Create a new component only if all previous options fail.

Favor consistency over creativity. Users should learn ToyTools once.

---

## Performance Budget

Strict per-tool targets:

- **JavaScript:** under 10 KB (inline script content)
- **CSS:** under 5 KB (tool-scoped styles)
- **Runtime dependencies:** zero
- **External UI libraries:** none
- **Framework hydration:** none
- **Blocking requests:** none

Performance is a feature. Prefer deleting code over adding code.

---

## Accessibility Standards

Every widget must:

- Be fully keyboard accessible
- Have visible focus states
- Meet WCAG AA contrast requirements
- Provide labels for all form controls
- Avoid color-only communication
- Respect minimum touch target size (`var(--touch-target)` = 48px)
- Support screen readers

**Required checklist before shipping:**

- [ ] Tab navigation works end-to-end
- [ ] Focus order is logical
- [ ] All inputs have visible labels or `aria-label`
- [ ] All buttons have accessible names
- [ ] No interaction relies on color alone

---

## Empty State Standards

Empty states should:

- Explain what to do
- Explain what happens next
- Be concise
- Avoid humor
- Avoid illustrations

**Good:** "Enter text above to generate output."

**Bad:** "Oops! Nothing here yet."

---

## Error Message Standards

Use a consistent three-part format:

1. **Problem** — what went wrong
2. **Reason** — why it happened
3. **Fix** — what the user should do

**Example:**
```
Invalid date
The date format could not be parsed.
Use YYYY-MM-DD.
```

Avoid vague errors: "Something went wrong." tells the user nothing actionable.

---

## Loading State Standards

Most ToyTools operations are instant. If loading is required:

- Prefer text indicators (`"Generating output..."`)
- Avoid spinners when possible
- Never block the entire interface during loading
- Keep all controls visible and interactive

Do not use a fullscreen loader for any operation.

---

## Information Hierarchy Rules

Every tool page should immediately answer:

1. What is this?
2. What can I do here?
3. Where do I start?
4. What happened? (after user action)
5. What should I do next?

UI should communicate this order visually. Avoid explanatory clutter — if the interface requires a paragraph of instructions, simplify the interface first.

---

## SEO-Aware Layout Rules

Tool pages are utility pages, not landing pages.

**Preferred content order:**

1. Tool (interactive widget)
2. Short explanation
3. Guide
4. FAQ
5. Related tools
6. Related guides

**Avoid:**

- Hero banners
- Marketing copy sections
- Large decorative elements
- Excessive introductory text

The tool must remain above the fold on mobile (393px, the Pixel 5 e2e gate), and `tests/e2e/fold.spec.ts` enforces it.

---

## AI Agent Rules

When generating or modifying UI for a new tool:

- Use existing shared components from `src/tools/_shared/`
- Use existing CSS tokens from `src/styles/tokens.css`
- Use existing layout patterns from `ToolLayout`, `GuideLayout`, `FAQLayout`
- Do not invent new spacing values — use `var(--space-N)`
- Do not invent new colors — use `var(--color-*)`
- Do not create new button styles — use existing `.btn-*` classes
- Do not create new interaction patterns without checking if one exists

If unsure between two approaches: choose the simpler one.

---

## Component Creation Policy

Creating a new shared component requires:

- Clear reuse potential across **multiple** (3+) tools
- A measurable benefit over composing existing components
- No functional overlap with any existing shared component

Do not create shared components for one-off use cases. Inline the markup instead.

---

## Interaction Philosophy

ToyTools is utility-first. Interactions should be:

- **Predictable** — no surprises
- **Fast** — respond instantly or near-instantly
- **Lightweight** — minimal JavaScript
- **Optional** — the tool should degrade gracefully without JS where possible

Avoid:

- Animations used purely for decoration
- Complex multi-step transitions
- Multi-step workflows (prefer single-screen tools)
- Controls hidden behind hover or other indirect triggers

---

## Mobile-First Validation Checklist

Every new widget must be verified at **393px width** (Pixel 5, the e2e gate) before shipping.

- [ ] No horizontal scrolling
- [ ] All touch targets are at least 48px
- [ ] Primary action remains visible without scrolling
- [ ] Tool is usable with one hand
- [ ] No overlapping or clipped controls

Mobile is the primary experience. Desktop is the enhanced experience.

---

## Dark Mode Validation Checklist

Every component must be tested in three states:

- [ ] Light mode (explicit `data-theme="light"`)
- [ ] Dark mode (explicit `data-theme="dark"`)
- [ ] OS preference mode (no `data-theme` attribute)

Rules:

- No hardcoded hex or RGB color values in widget CSS
- All colors must come from `var(--color-*)` tokens
- Check both text contrast and border/background contrast

---

## ToyTools Smell Test

If a proposed feature introduces any of the following, stop and re-evaluate:

- User accounts or authentication
- Teams or workspaces
- Dashboards or analytics views
- Notification systems
- Onboarding flows or tutorials
- Multi-page workflows
- Persistent server-side state

ToyTools exists to help users complete a task and leave. Complexity must justify itself against this purpose. If it cannot, remove it.

---

## Visual Density Guidelines

Prefer:

- More whitespace between elements
- Fewer borders (use spacing to separate, not lines)
- Fewer visual layers (flat over nested)

Avoid:

- Card inside card inside card
- Heavy drop shadows on interactive elements
- Decorative horizontal rules or separators
- Multiple competing visual focal points on one screen

Visual simplicity improves usability and reduces cognitive load.

### Taking a border away is only half the job

Once a group has no edge, **the space around it is the only thing saying where it ends**, so that
space has to beat the space inside it. Removing the lines and leaving the gaps alone does not read
as calm, it reads as undifferentiated.

> **Between-group space must clearly exceed within-group space.** Aim for roughly 2-4x. A label
> sits `--space-2` from the content it names; the next group starts `--space-8` away.

The simulator dashboard is the worked example (2026-08-20). Its tiles had a `--space-3` row gap and
each tile put `--space-3` between its own label and its content, so once the tile borders came off,
nothing marked a boundary at all: every gap on the page was 12px. Tiles went to `--space-8`, labels
to `--space-2`, and the same markup became legible at a glance.

Two rules that fall out of the same idea:

- **If the container draws no edge, its contents must not draw one either.** A bordered card inside
  a borderless tile is the box-in-a-box the anti-clutter rules forbid, just inverted, and it is
  what you get by flattening the outside and forgetting the inside.
- **Never buy the gap back by reserving hidden space.** Revealing a detail on `:focus-within`
  avoids a layout shift only if the space stays reserved, and reserved-but-empty space is a band of
  dead air where a row of text used to be. If a detail is not worth its space, delete it; if it is,
  show it. (Tried and reverted on the sliders' min/max captions; the presets already named the
  interesting values.)

### Which lines survive

**This is a gate, not a preference.** `check:craft` holds `THRESHOLDS.dividers` at 0 across every
widget, per-tool and `_shared`, so a `border-top` or `border-bottom` fails the build. It counts only
top and bottom because those divide stacked things; a `border-left` is an indent guide (the JSON
tree) or an accent stripe (the insight callout), which marks rather than divides. That is a
structural distinction, so it does not rot the way a path allowlist does. All-round borders stay
uncounted by it: an edge round a control is affordance, and a metric that rose with control density
would just punish tools for having buttons.

Applied across the catalog on 2026-08-20. The test is what a line is *for*, not where it is:

| a line that... | verdict | because |
|---|---|---|
| bounds an interactive control (input, select, button, tab, stepper) | **keep** | the edge is the affordance: it says "operate me" |
| bounds a colour swatch or sample | **keep** | a near-white value has no other edge and vanishes without it |
| marks a fixed layer over scrolling content (the sticky mobile `.tool-action` bar) | **keep** | it says "this floats", which space cannot say |
| opens Zone C (`.content-section`) | **keep** | the page's one deliberate hairline, per the page grammar |
| frames a container, panel or card | **remove** | the contents already have edges; the frame is the outer half of a box-in-a-box |
| separates rows in a ledger, cells in a grid, a header from its body | **remove** | that is decoration doing what padding should do |

**Outlined becomes filled, not bare.** A container that loses its frame but still needs to read as
a distinct surface takes `background: var(--color-surface)`. That is how `.io-panel` works now: the
frame and the rule under its label are gone, and the *field* carries the fill, so the one edge left
is the one that was doing real work. Focus moved with it, from the frame to the field, which is
also where a focus ring belongs.

**Removing a frame usually orphans a padding.** `.io-body`, `.tm-hero` and `.tm-stats` all carried
insets that existed to hold content off a frame's edge; with the frame gone they only pushed content
away from the label naming it. Whenever you drop a container's border, drop the padding that
existed to clear it, or the group loses its shared left edge.

### A `var()` with no fallback is a silent no-op

CSS drops a declaration whose custom property does not resolve, and **one bad value voids the whole
shorthand**. Nothing warns you; the rule just never applies. Two of these had been shipping:
`--radius-lg` (no such token) left three tracker panels square-cornered, and `--space-10` (also not
a token until 2026-08-20) meant `padding: var(--space-10) 0 var(--space-12)` gave `/about/`,
`/privacy/`, `/changelog/` and `/settings/` **no block padding at all**.

Before using a token, confirm it exists in `src/styles/tokens.css`. The spacing scale is
1-6, 8, 10, 12, 16, 20; radii are `--radius-sm` and `--radius-md` only. `git grep` for a token name
that returns hits only outside tokens.css means everyone using it is getting nothing.

### Two ways content runs off a phone

Both were found by driving all 121 tools at 393px and 360px, and neither shows up on a desktop.

**A grid or flex item will not shrink below its own content.** `min-width` defaults to `auto`, so a
pane containing anything wide (a long mono value, a row of controls) grows past its track instead of
letting the content wrap or scroll in place. At 360px this pushed `ToolSplit`'s pane to 348px inside
a 328px column, and the tracker's two-up stats 14px past the screen. **Any grid or flex item that
holds arbitrary content sets `min-width: 0`**; wide content then scrolls in its own container, per
the mobile rules.

**A scroller with a hidden scrollbar must say it scrolls.** `.group-switcher` hides the bar
(`scrollbar-width: none`) and pills at the edge were sliced mid-word on 61 of 121 tools, which reads
as a broken page rather than as "there is more". Its trailing edge is now faded with `mask-image`.
Reach for this whenever `overflow-x: auto` meets a hidden scrollbar. Two things to know: a
background gradient will not do it, because content paints on top of backgrounds, so it must be a
mask; and a mask cannot be made conditional on scroll position in CSS, so the fade is always drawn
and the last item keeps a soft edge at the end of the scroll. Wrapping instead of scrolling is the
obvious alternative and is usually wrong here: the largest group is 11 pills, and four rows of them
would push the answer past the fold that `health.spec.ts` pins.

### Section captions: micro-caps, not small text

A caption that names a slot ("Controls", "Graph", "Live measurements") is not a heading and should
not read as one. The house recipe, already used by the guide eyebrow, the knowledge blocks,
`ToolSignature`, `ReferenceBlock` and the category lists:

```css
font-size: var(--text-xs);        /* --text-sm in roomier, prose-side contexts */
font-weight: var(--font-weight-semibold);
text-transform: uppercase;
letter-spacing: 0.06em;           /* 0.05em at --text-sm */
color: var(--color-text-muted);
```

Uppercase at this size reads as a *label* rather than as one more line of prose, which is what lets
the eye skip the captions and land on the content. Keep the element an `<h2>` for the outline and
screen-reader navigation; this is a paint change, not a semantic one.

**One real heading per widget.** The captions name slots; the heading names the thing. Give it
`--text-base`/semibold, normal case, and `--color-text`, and remember to reset `text-transform`
and `letter-spacing` if it shares a class with the captions.

### Media that sizes itself

A `<canvas>` (or any element whose box JS computes) must declare its box in **CSS**, from a
build-time value, not by having a script set `style.width`/`maxWidth` after load. The simulator
capped its canvas in `boot.ts`, so every page painted a full-width 150px-tall canvas and then
snapped to its real size once the module loaded. `aspect-ratio` plus a `max-width` custom property
emitted by the component reserves the exact box on first paint, and the script then computes the
same number and has nothing to reflow.

**If you cap one element, cap what lines up with it.** A capped-and-centred canvas left its own
Play button under empty space and its speed buttons hanging past its right edge. Whatever sits
directly above or below a capped element (its playback row, its graph strip) takes the same
`max-width`, so the column has one left edge and one right edge.

---

## Design Review Checklist

Before merging any new tool or UI change:

- [ ] Uses shared CSS tokens (no hardcoded values)
- [ ] Uses shared components where applicable
- [ ] Passes mobile validation (393px, one-hand usable)
- [ ] Passes accessibility checklist (keyboard, labels, contrast)
- [ ] Passes dark mode validation (light + dark + OS)
- [ ] Meets performance budget (JS < 10 KB, CSS < 5 KB, zero deps)
- [ ] Contains no unnecessary UI elements (Golden Rule applied)
- [ ] Follows ToyTools philosophy (utility-first, no accounts/dashboards/onboarding)

A tool that fails any checklist item should be revised before release.
