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
--width-tool      /* 800px — tool and FAQ pages */
--width-category  /* 1200px — category pages, homepage */
--width-nav       /* Navigation max-width */
```

Set via `maxWidth` prop on `BaseLayout`:
```astro
<BaseLayout maxWidth="tool">    <!-- 800px -->
<BaseLayout maxWidth="category"> <!-- 1200px -->
```

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
