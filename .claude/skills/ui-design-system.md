# Skill: UI Design System

A comprehensive reference for building new UI in ToyTools. Use this when creating or modifying widgets, layouts, or components to ensure everything matches the existing aesthetic and patterns.

---

## Core principles

- **Static-first**: No client-side framework. Widgets are HTML + CSS + vanilla JS in `<script is:inline>`.
- **Mobile-first**: Design for 375px width, enhance upward. Test touch targets at mobile size.
- **Token-driven**: Every colour, spacing value, and font size comes from CSS custom properties. Never use raw hex values or hard-coded pixel values.
- **Grayscale base, single accent**: The entire palette is grayscale with one accent colour (`--color-accent`). The gold dot (`●` / `.gold-dot`) is a secondary decorative token, not for interactive elements.

---

## Design tokens

All defined in `src/styles/tokens.css`. Reference only via `var(--token-name)`.

### Colours
```css
--color-accent          /* Primary action colour — buttons, links, highlights */
--color-text            /* Primary body text */
--color-text-muted      /* Secondary text, descriptions */
--color-text-subtle     /* Tertiary — labels, meta, captions */
--color-text-inverse    /* Text on dark/accent backgrounds */
--color-bg              /* Page background */
--color-bg-secondary    /* Slightly elevated — cards, panels */
--color-bg-elevated     /* Further elevated — dropdowns, modals */
--color-bg-tertiary     /* Headers of collapsible sections, TOC summaries */
--color-border          /* Default border */
--color-border-strong   /* Emphasized border */
--color-gold            /* Gold accent for decorative dots and TOC highlights */
```

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
`Esc` blur, `Ctrl/Cmd+Shift+C/X` copy/clear. `CategoryDiscovery.astro` cross-links each output to its
category. See `ARCHITECTURE.md` for the full reference.

### Interaction
```css
--touch-target    /* 48px minimum — all clickable elements */
--radius-sm
--radius-md
--radius-lg

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

The tool must remain above the fold on mobile (375px viewport).

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

Every new widget must be verified at approximately **375px width** before shipping.

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

---

## Design Review Checklist

Before merging any new tool or UI change:

- [ ] Uses shared CSS tokens (no hardcoded values)
- [ ] Uses shared components where applicable
- [ ] Passes mobile validation (375px, one-hand usable)
- [ ] Passes accessibility checklist (keyboard, labels, contrast)
- [ ] Passes dark mode validation (light + dark + OS)
- [ ] Meets performance budget (JS < 10 KB, CSS < 5 KB, zero deps)
- [ ] Contains no unnecessary UI elements (Golden Rule applied)
- [ ] Follows ToyTools philosophy (utility-first, no accounts/dashboards/onboarding)

A tool that fails any checklist item should be revised before release.
