# ToyTools Architecture

System-level patterns and conventions. Reference this when adding new tools, widgets, or UI patterns.

---

## Tool Directory Convention

Tools live under `src/tools/{url-segment}/{slug}/`, where the segment matches the URL and the category's `segment` field in `categories.ts`.

```
src/tools/text/word-counter/
src/tools/number/percentage-calculator/
src/tools/developer/base64-encoder-decoder/
src/tools/productivity/todo-list/
```

Each tool directory contains:
```
config.ts      ← ToolConfig (required)
Widget.astro   ← Self-contained UI (required)
Guide.astro    ← Educational content (optional)
faq.ts         ← FAQ items (optional)
```

Relative imports within a tool (`./config`, `./faq`) are unchanged by category nesting.

---

## URL Structure

All URLs are **singular** (not plural):

| Route | URL pattern |
|-------|-------------|
| Tool page | `/tool/{segment}/{slug}/` |
| Category page | `/category/{slug}/` |
| Guide page | `/guide/{category}/{slug}/` |
| FAQ page | `/faq/{category}/{slug}/` |

Always use `withBase()` from `src/lib/paths.ts` for internal hrefs.

---

## Widget Patterns

### text-metric pattern

Used by: word-counter, character-counter, sentence-counter, paragraph-counter, reading-time-calculator

Component: `src/tools/_shared/TextMetricWidget.astro`

```astro
<TextMetricWidget
  slug="word-counter"
  stats={[
    { metric: 'words',     label: 'Words',     formatter: 'integer' }, // stats[0] → hero
    { metric: 'characters', label: 'Characters' },                      // stats[1+] → secondary
    { metric: 'sentences', label: 'Sentences' },
  ]}
/>
```

**Layout (2-column on desktop):**
- Wrapped in `ToolSplit` (`ratio="3-1"`, `stackOrder="output-first"`). Desktop ≥1024px: textarea
  left, hero + secondary metrics in the **sticky** right column. Below 1024px it stacks
  **answer-first** (metrics → textarea → actions) so the result is visible while typing.
- `stats[0]` → `HeroMetric.astro` — large numeral, `clamp(--text-3xl, 6vw, --text-5xl)`, bold, mono.
- `stats[1+]` → `StatGrid.astro` — symmetrical grid of boxed stat cards (2-up; a lone trailing card spans the row).
- Empty state: secondary metrics are **hidden entirely** (not `0 0 0 0`); hero shows the zero-format
  (`0` / `0 min`) plus the hint "Paste or type text to begin." (direction-neutral).
- Hero value briefly pulses (`.is-updated`, color-only, `prefers-reduced-motion` guarded) on change.
- Desktop autofocus; text persisted via `ToyTools.state` (restores on reload).

**Components used:**
- `src/tools/_shared/ToolSplit.astro` — the canonical 2-column shell (see below)
- `src/components/tool/HeroMetric.astro` — primary metric display
- `src/components/tool/StatGrid.astro` → `StatCard.astro` — secondary metrics
- `src/components/tool/TrustNotice.astro` — privacy badge
- `src/components/tool/TextareaInput.astro` — auto-height textarea
- `src/components/tool/ToolActions.astro` — Paste + Copy + Clear (all transparent utility buttons)
- `src/components/tool/CategoryDiscovery.astro` — "more in this category" cross-link below the output

---

### ToolSplit — canonical 2-column layout

Component: `src/tools/_shared/ToolSplit.astro`. Named slots `input` (left) and `output` (right).

```astro
<ToolSplit ratio="3-1" stackOrder="output-first" stickyOutput={true}>
  <div slot="input">…controls / textarea…</div>
  <div slot="output">…result / metrics…</div>
</ToolSplit>
```

- `ratio`: `'1-1' | '3-2' | '3-1'`. `stackOrder`: `'input-first' | 'output-first'` (mobile order).
- Breakpoint **1024px** — stacks to one column below it. `stickyOutput` pins the output column on desktop.
- Used by: text metrics (3-1), case-converter (1-1), percentage-calculator (3-2), base64 (1-1),
  keep-screen-awake (1-1), pomodoro-timer (3-2). Single-column (no split): notepad, todo-list.
- Generalizes the former `CompareLayout`; transform tools use `input-first`, answer-first tools
  (metrics) use `output-first`.

**Live tools:** case-converter and percentage-calculator update on input/option change — no
Convert/Calculate buttons. Keep Copy/Clear only.

---

### Tool action buttons (`ToolActions.astro`)

All actions are **transparent utility controls** by default (`1px` border, no fill, no accent).
State is communicated only by subtle tints. Button styles are global (`.action-btn` in
`tool-widget.css`) so any widget can reuse them. Props: `copyTarget`, `clearTarget`, `pasteTarget`,
`downloadFilename`.

- **Paste** — `navigator.clipboard.readText()` into the target (hidden if unsupported).
- **Copy** — copies the target's value; shows "✓ Copied" with `--color-success` / `--color-success-bg`
  tint for 2s, then reverts.
- **Clear** — two-click confirm: click 1 swaps the label to "Confirm Clear" with `--color-danger` /
  `--color-danger-bg` tint and auto-reverts after 3s; click 2 clears the target. Disarms on outside click.

No overlays or modals. The original label is stored in `data-label`; timers reset on re-click.

CSS tokens: `--color-success(-bg)`, `--color-danger(-bg)`.

---

### CategoryDiscovery — contextual cross-linking

Component: `src/components/tool/CategoryDiscovery.astro` (props `{ toolSlug }`). Rendered below a
tool's output and near the end of guide/FAQ content. Fully data-driven from the registry +
`categories.ts`: "Looking for more? Browse all N {Category} →" plus 2–3 sibling quick-links (from
`getRelatedTools`). Subtle, text-only, category accent shown only as a small dot. Hidden when the
category has a single tool. The bottom `RelatedTools` grid carries a matching "See all {Category} →"
heading.

---

### Platform foundation (persistence, continuity, scalability)

- **Persistence** — `ToyTools.state.save/load/clear(toolId, data)` (on the runtime global in
  `ToyToolsRuntime.astro`). Versioned envelope `{ v: 1, data }` under `toytools:{toolId}`; never
  throws; version mismatch → null (defaults). Tools restore on load. Pomodoro persists prefs only
  (never a running session); keep-screen-awake never restores an active wake lock. (Some complex
  tools still use their own `STORAGE_KEY`; the unified API is the default for new tools.)
- **Recent tools** — `ToyTools.recordRecent(slug, segment)` (called by `ToolLayout`), read via
  `ToyTools.getRecent()`. Deduped, most-recent-first, capped at 10. Homepage shows up to 5 by cloning
  the matching `ToolCard` nodes; the section renders only when data exists.
- **Keyboard shortcuts** (desktop, never hijack typing): `/` focus search, `Esc` blur field,
  `Ctrl/Cmd+Shift+C` copy, `Ctrl/Cmd+Shift+X` clear. Tool-specific: Pomodoro `Space`, Notepad
  `Ctrl/Cmd+S` export.
- **ResultPanel** — `src/components/tool/ResultPanel.astro` standardizes labelled output + actions
  header (adopt where practical; not for custom outputs like the timer ring).
- **Metadata** — `ToolConfig` carries `engine/pattern/family` (+ optional `keywords/inputs/outputs`),
  driving related tools, search, and future discovery. Search index covers name/description/tags/
  keywords/family/category (command-palette ready; no palette UI yet).
- **Tool health** — `src/lib/tools/health.ts` reports `{hasTool,hasGuide,hasFAQ,hasRelatedTools,
  hasMetadata,hasStructuredData}`. Infra only — no UI.

---

## CSS Token System

All design values in `src/styles/tokens.css`. Never hardcode colors or sizes.

| Token group | Key tokens |
|-------------|-----------|
| Accent | `--color-accent` (single retheme point) |
| Semantic | `--color-success(-bg)`, `--color-danger(-bg)` |
| Gold brand | `--color-gold`, `--color-gold-highlight`, `--color-gold-subtle` |
| Surfaces | `--color-bg`, `--color-surface`, `--color-surface-hover` |
| Text | `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse` |
| Typography | `--text-xs` → `--text-5xl` (3rem); `--font-sans`, `--font-mono` |
| Spacing | `--space-1` (4px) → `--space-20` (80px) |
| Touch | `--touch-target` (48px minimum) |
| Widths | `--width-shell` (1440 — chrome/home/category), `--width-content` (1100 — tool pages/splits), `--width-prose` (72ch — guides), `--width-tool` (820 — FAQ/narrow). `--width-nav`/`--width-category` alias `--width-shell`. |

`BaseLayout` `maxWidth` prop: `'shell' | 'content' | 'tool' | 'full'` (`'category'` kept as a shell alias).

Dark mode: both `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]` override the same tokens.

---

## Registration Pattern

Every tool requires exactly two registration steps:

1. **`src/data/registry.ts`** — one import + one array entry
2. **`src/pages/tool/[category]/[slug].astro`** — already glob-based (`../../../tools/*/*/Widget.astro`), no change needed for new tools

For guides: add a static import in `src/pages/guide/[...slug].astro`.
For FAQs: add an import in `src/data/faq-registry.ts`.

---

## Build & Verification

```sh
npm run build    # Astro + TypeScript strict — must pass before any PR
npm run dev      # dev server at localhost:4321
```

No separate lint or test command. The build is the single verification step.
