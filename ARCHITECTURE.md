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
| FAQ redirect stub | `/faq/{category}/{slug}/` → tool page `#faq` (noindex, from `src/data/faq-redirects.ts`) |

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
- Two `IoPanel`s inside `ToolSplit` (`ratio="2-1"`, `stackOrder="output-first"`): a prose input
  panel ("Your text") left, a **result panel** right — header bar, hero numeral, then a ledger of
  hairline-separated label/value rows. Below 1024px it stacks **answer-first**
  (result → textarea → actions) so the result is visible while typing.
- `stats[0]` → `HeroMetric.astro` — `.tm-hero` block: large numeral,
  `clamp(--text-3xl, 6vw, --text-5xl)`, bold, mono, `tabular-nums`.
- `stats[1+]` → `StatGrid.astro` → `StatCard.astro` — `<dl class="tm-stats">` ledger rows
  (`dt` muted label left, `dd` mono tabular value right, hairline between rows).
- Empty state: the ledger is **hidden entirely** (not `0 0 0 0`); the hero fills the panel,
  centers, and shows the zero-format (`0` / `0 min`) plus "Paste or type text to begin."
- Hero value briefly pulses (`.is-updated`, color-only, `prefers-reduced-motion` guarded) on change.
- Panels are fixed-height with internal scroll (no auto-grow) and equalize on desktop — page
  geometry never changes while typing.
- Desktop autofocus; text persisted via `ToyTools.state` (restores on reload).

**Components used:**
- `src/tools/_shared/IoPanel.astro` — the framed panel primitive (see Design Language)
- `src/tools/_shared/ToolSplit.astro` — the canonical 2-column shell (see below)
- `src/components/tool/HeroMetric.astro` — primary metric display
- `src/components/tool/StatGrid.astro` → `StatCard.astro` — secondary metric ledger
- `src/components/tool/TrustNotice.astro` — privacy badge
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

- `ratio`: `'1-1' | '3-2' | '2-1' | '3-1'`. `stackOrder`: `'input-first' | 'output-first'` (mobile order).
- Breakpoint **1024px** — stacks to one column below it. `stickyOutput` pins the output column on
  desktop (now unused by the engine widgets: equalized `IoPanel` splits set `stickyOutput={false}`
  because both columns are always the same height — see Design Language).
- Used by: text metrics (2-1), text-processor tools (1-1, via `TextProcessorWidget`),
  percentage-calculator (3-2), encoding/hashing/structured-data (1-1), keep-screen-awake (1-1),
  pomodoro-timer (3-2). Single-column (no split): notepad, todo-list.
- Generalizes the former `CompareLayout`; transform tools use `input-first`, answer-first tools
  (metrics) use `output-first`.
- **Desktop height equalization** (in `tool-widget.css`): any split whose slots are `IoPanel`s
  stretches both columns to the same height — the naturally taller panel sets it, the other fills.

**Live tools:** text-processor tools (see Text Processor System below) and percentage-calculator
update on input/option change — no Convert/Calculate buttons. Keep Copy/Clear only.

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

### Tool-page guide/FAQ surface

The tool page is the **canonical home of FAQ content**. Below the widget,
`src/pages/tool/[category]/[slug].astro` renders `ToolNavRow` (Common Questions anchor + guide
teaser + related strip) followed by the `FaqAccordion` (`src/components/tool/FaqAccordion.astro`,
the shared `<details>` accordion) in a `<section id="faq">`, and emits `FAQPage` JSON-LD when the
tool has registered items. FAQ items come from `faqsByToolSlug` (`src/data/faq-registry.ts`) —
there is **no `faq` field on ToolConfig** and no standalone FAQ pages; the old `/faq/` URLs are
noindex redirect stubs generated from `src/data/faq-redirects.ts` (never add new entries).

**Registration-drift guard.** A tool can declare `guide:` in `config.ts` yet be missing from the
guide route's import map, rendering empty with no build error.
`src/data/guide-registry.ts` exports `registeredGuideSlugs` (a `.astro`-free slug list so `tsx` can
import it from the validator; the `guidesBySlug` component map in the guide route is typed
`Record<RegisteredGuideSlug, …>`, so TS catches drift between the two). `scripts/validate-registry.ts`
fails the build when a tool declares a guide but isn't registered in `guide-registry.ts`.

---

### Discovery surfaces (homepage directory + category sections)

Both discovery pages are compact, registry-derived indexes — no tile grids.

- **Homepage** (`src/pages/index.astro`): hero search, a localStorage-driven `Recent:` chip row,
  then `ToolDirectory.astro` — one column per category (4→2→1 responsive), header links to the
  category page, body is plain text links. Tool-group members collapse into one entry (the seven
  case converters render as a single "Case Converter" link); the entry carries
  `data-group-slugs` so the recent-chips script can resolve any visited member back to it.
- **Category pages** (`src/pages/category/[slug].astro` → `CategoryToolList.astro`): full-width
  rows (name + one-line description) grouped under section headings derived from
  `src/data/category-sections.ts` (declarative `pattern → {title, order}`; extend it when
  registering a new pattern in `engines.ts`). Headings render only when a category has more than
  one section. Tool-group rows collapse to one entry with a mode chip per member.
- `ToolCard.astro` remains in use by the search page; `CategoryCard.astro` is currently unused by
  the homepage.

Coverage is pinned by `tests/e2e/discovery.spec.ts` (directory entry count, group collapse,
recent chips, section titles).

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
| Accent | `--color-accent` (forest green, single retheme point), `--color-accent-subtle`, `--color-accent-strong` (accent text on accent-subtle, AA) |
| Semantic | `--color-success(-bg)` (brighter/cooler than the accent — transient state only, never links/focus), `--color-danger(-bg)` |
| Gold brand | `--color-gold`, `--color-gold-highlight`, `--color-gold-subtle` |
| Surfaces | `--color-bg`, `--color-surface`, `--color-surface-hover` — "Warm Paper" off-whites light / "warm graphite" dark |
| Text | `--color-text` (soft ink), `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse` |
| Overlay | `--color-overlay-bg/-text/-muted/-border` — theme-invariant immersive fullscreen surfaces (keep-awake, pomodoro) |
| Focus | `--focus-ring`, `--focus-ring-offset` — one ring, applied by the global `:focus-visible` rule |
| Typography | `--text-xs` → `--text-5xl` (3rem); `--font-sans`, `--font-mono` |
| Spacing | `--space-1` (4px) → `--space-20` (80px) |
| Touch | `--touch-target` (48px minimum) |
| Widths | `--width-shell` (1440 — chrome/home/category), `--width-content` (1100 — tool pages/splits), `--width-prose` (72ch — guides), `--width-tool` (820 — FAQ/narrow). `--width-nav`/`--width-category` alias `--width-shell`. |

`BaseLayout` `maxWidth` prop: `'shell' | 'content' | 'tool' | 'full'` (`'category'` kept as a shell alias).

Dark mode: both `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]` override the same tokens — keep the two blocks mirrored.

---

## Design Language

**Palette — "Warm Paper & Ink".** Warm off-whites (`#FAF9F7` page / `#F4F2EE` panels) with soft-ink
text instead of stark `#fff`/`#111`; dark mode is a warm graphite, not a cool gray. The accent is a
forest green (`#2F6B4F` / `#84C2A3`) — a deliberate "library hardcover" pairing with the cream paper
and the gold brand dot. Success stays a brighter, cooler green and tints transient state only
(copy confirmation, valid status); links and focus rings are always the accent.

**Section-boundary recipe.** A boundary between two page sections is **one hairline with symmetric
breathing room**: the *lower* section draws it — `margin-top: var(--space-8); border-top: var(--border);
padding-top: var(--space-8);` (guide pages use `--space-12`). The upper section ends flush; sections
never own a `border-bottom`. Stated in `tool-widget.css`; applied by ToolNavRow, CategoryDiscovery,
the FAQ section, `.content-section`, the homepage ecosystem row, and the guide kg-group.

**IoPanel vocabulary.** Every tool widget is built from `src/tools/_shared/IoPanel.astro` — the
*only* place `.io-panel`/`.io-header` markup exists. Props: `label` (+ optional `labelFor` for a11y),
`variant` (`mono` for developer tools, `prose` for text tools), `result` (mobile content-hug +
empty-state hero centering), `copyTargetId` (header CopyButton + `data-copy-bar`), `header-end` slot
(e.g. the encode/decode mode select), `data-*` passthrough. **New widgets must compose `IoPanel`;
hand-writing panel markup is an architecture failure.** Panel headers use the uppercase
letter-spaced `.io-label` micro-label voice — the same voice as `.dir-heading`,
`.cat-section-heading`, and the ToolNavRow "Related" label. Panels are fixed-height
(min 280px desktop) with internal scroll; auto-growing textareas are forbidden (page geometry must
not change while typing). `.io-body` is the padded flex body for form-style panels
(percentage-calculator).

**Control states.** One global `:focus-visible` ring (`--focus-ring` + offset in `global.css`);
opt out only where a container draws its own focus treatment (gold search `focus-within`). Hover
pair everywhere: `--color-surface-hover` background + `--color-border-strong` border (action
buttons, group pills, directory rows). Numerals that update live use `font-variant-numeric:
tabular-nums`.

**Tool descriptions** should run 56–110 characters so they wrap to exactly 2 lines at the 55ch
measure — `.tool-description` reserves `2lh` on desktop so the widget and GroupSwitcher land at the
same Y on every sibling page (pointer stability when clicking through pills).

---

## Text Processor System

The transform/cleanup engine — the processor equivalent of the text-analysis engine behind the
metric tools. **Engine first, tool second:** every transform/cleanup tool is the same
`text → process(text) → text` shape with identical UI, so they share **one** widget and a single
processor registry. Adding a tool is a processor file + a config + a 3-line wrapper — never a widget,
runtime, or routing edit.

**Flow:**

```
Text → Processor Registry → Processor → Output → Shared Widget
        (src/lib/text/processors/registry.ts)      (TextProcessorWidget.astro)
```

**Processor interface** (`src/lib/text/processors/types.ts`):

```ts
export interface TextProcessor {
  id: string;                       // lookup id, referenced by a config's processorId
  family: 'transform' | 'cleanup';  // grouping for future discovery systems
  process(text: string): string;    // pure, synchronous, O(n) where possible, no deps
}
```

**Registry as single source of truth** (`src/lib/text/processors/registry.ts`): imports every
processor into `PROCESSORS` (keyed by id, holding the rich object so metadata like `title`/
`description` can be added later without changing the API) and exposes
`runProcessor(id, text)` — which resolves the processor and runs it, returning the input unchanged
(with a `console.warn`) for an unknown id. It **never throws**.

**Runtime exposure:** `ToyToolsRuntime.astro` bundles the registry and attaches
`ToyTools.process = runProcessor` — exactly how `ToyTools.analyze` is bundled from the text-analysis
engine. Widget inline scripts (which cannot import TS) call `ToyTools.process(processorId, text)`.

**Shared widget** (`src/tools/_shared/TextProcessorWidget.astro`, `pattern: 'text-processor'`):
generic input → output. `ToolSplit ratio="1-1"` (50/50 desktop, stacks <1024px), live update on
input, `ToolActions` (paste/clear/copy) + `CategoryDiscovery`, state via `ToyTools.state`
(group-shared key when the config declares a `toolGroup`). It reads `processorId` from a data
attribute and **never names a processor** — no `switch`, no `if/else`. The per-tool `Widget.astro`
is only a 3-line wrapper:

```astro
---
import TextProcessorWidget from '@tools/_shared/TextProcessorWidget.astro';
import { config } from './config';
---
<TextProcessorWidget slug={config.slug} processorId={config.processorId!} config={config} />
```

**Tool config metadata:** `engine: 'text-processor'`, `family: 'transform' | 'cleanup'`,
`processorId`. Mirrors `engine: 'text-analysis'` on the metric tools, so discovery systems can query
by engine + family + category with no parallel metadata.

**Adding a processor tool** — and nothing else is required:

1. Create the processor file in `transform/` or `cleanup/`.
2. Register it in `registry.ts` (one import + one `PROCESSORS` entry).
3. Add `config.ts` (`engine: 'text-processor'`, `family`, `processorId`) + the 3-line `Widget.astro`.
4. Optional: `Guide.astro` (+ static import in the guide route) and `faq.ts` (+ entry in
   `faq-registry.ts`).

`validate-registry.ts` enforces that every `text-processor` tool has a `processorId` that resolves
in the registry.

**Future families** (`extract/`, `compare/`, `validate/`, `format/`) register the same way — same
interface, same registry, same widget, same `ToyTools.process`. The widget must never learn family
names. **If a new family requires editing the widget, the architecture has failed.**

**Current processors** — transform: `uppercase`, `lowercase`, `titleCase`, `sentenceCase`,
`camelCase`, `snakeCase`, `kebabCase`; cleanup: `removeExtraSpaces`, `removeBlankLines`,
`removeDuplicateLines`, `trimLines`, `normalizeWhitespace`, `removeTabs`. (The former multi-mode
`case-converter` was retired in favor of single-purpose transform tools.)

---

## Tool Groups (`src/data/tool-groups.ts`)

A **tool group** turns a set of sibling tools sharing one engine + experience into a unified
workspace, without sacrificing per-tool SEO. The pilot group is `case-converters` (the 7 case
tools). Architecture: `Tool → Engine → Experience → Content` — the engine converts, the shared
widget renders, per-tool content ranks, and the group makes them feel like one tool.

**What stays per-tool (SEO surface, never merged):** URL, `seoTitle`, meta description, canonical,
JSON-LD, guide, FAQ, sitemap entry. Do **not** create a merged `/case-converter/` URL.

**What the group adds:**

- **Manifest** — `src/data/tool-groups.ts` declares `{ id, name, members: [{ slug, label }] }`;
  member order defines switcher order, `label` is the short mode name (`camelCase`, `snake_case`).
  Each member's `config.ts` declares `toolGroup: '<id>'` back.
- **`GroupSwitcher.astro`** (`src/components/tool/`) — pill-row `<nav>` of real `<a>` links rendered
  above the widget by the tool page when `tool.toolGroup` is set. Active pill = `aria-current="page"`.
  Real links = crawlable internal links with exact-match anchors (the switcher doubles as the
  "related variants" block; the tool page filters group siblings out of the Related strip to avoid
  duplication). Sibling pages get body-level `<link rel="prefetch">`.
- **Shared input state** — every engine widget (`TextProcessorWidget`, `TextMetricWidget`,
  `ConverterWidget`, `StructuredDataWidget`) derives its persistence key from the config:
  `group:{toolGroup}` instead of the slug (old per-slug state is read once as a migration fallback).
  Typing on one member and clicking another restores the same input and recomputes in the new mode.
  Tool-specific state stays per-slug (ConverterWidget's conversion direction, character-counter's
  active limit, word-counter's goal) so one member's mode never bleeds into another.
- **Instant feel without a router** — navigation stays MPA (every URL self-consistent, zero
  pushState/JS routing). `global.css` opts into CSS cross-document View Transitions
  (`@view-transition { navigation: auto; }`, disabled under `prefers-reduced-motion`) so supported
  browsers cross-fade; prefetch makes the swap near-instant.

**Validation** (`validate-registry.ts`): a `toolGroup` must resolve in the manifest; membership is
bidirectional (manifest ↔ config); members are unique; all members share the same `engine` +
`pattern` (a group is one experience). `src/data/tool-groups.test.ts` mirrors these as unit tests;
`tests/e2e/group-switcher.spec.ts` covers the cross-page input-preservation flow on both viewports.

**Adding a group:** define it in `tool-groups.ts`, add `toolGroup` to each member config — done.
The switcher, shared state, prefetch, and validation all derive from the manifest.

---

## Developer Engines (`src/lib/engines/`)

The Developer category is built from three more engines, each following the *same* pattern as the
Text Processor System — `types.ts` + a never-throwing `registry.ts` resolver + per-impl files +
colocated `*.test.ts` — bundled into `ToyToolsRuntime` and consumed by **one generic widget per
engine**. New engines live under `src/lib/engines/`; the original two text engines remain under
`src/lib/text/` (relocating them would break many imports for no functional gain).

Each engine has a distinct runtime signature; the widgets stay generic over them:

| Engine | Lib | Runtime global | Signature | Widget | Tools |
|--------|-----|----------------|-----------|--------|-------|
| Encoding | `engines/encoding/` | `ToyTools.runEncoding(id, mode, text)` | → `{ ok, output, error }` (decode can fail) | `ConverterWidget.astro` (reversible: mode/swap/sample) | base64, url, html-entity, hex, binary, punycode |
| Hashing | `engines/hashing/` | `ToyTools.runHash(id, text)` | → `Promise<string>` (async; SHA via `crypto.subtle`, MD5/CRC32 pure-JS) | `ConverterWidget.astro` (one-way: live digest, awaits) | md5, sha1, sha256, sha512, crc32 |
| Structured-Data | `engines/structured-data/` | `ToyTools.runStructuredData(id, input)` | → `{ ok, output, error }` (✓/✗ status line) | `StructuredDataWidget.astro` | json-formatter/minifier/validator, JSON↔CSV, JSON↔YAML |

(The engine → shared-widget mapping is data in `src/data/engines.ts` and mirrored into
`docs/code-map.json`.)

Every resolver **never throws** on an unknown id (encoding passes input through; hashing returns `''`;
structured-data returns a result error). Browser-only APIs (`btoa`/`atob`/`crypto.subtle`) stay
*inside* methods so importing a registry under `tsx`/vitest is side-effect-free. The universal
config→engine lookup key is `processorId`. base64 was migrated from a bespoke widget onto the encoding
engine with byte-parity and a one-time fallback from its legacy `toytools.base64.input` storage key.

**Shared widget conventions.** All engine widgets compose the `IoPanel` primitive
(`src/tools/_shared/IoPanel.astro` — see Design Language); the `.io-*` styles live in
`src/styles/tool-widget.css` (one source of truth — never re-declare per widget). All updates are
**live on input** (no Generate/Convert button), matching percentage-calculator and the text tools;
hashing runs `await ToyTools.runHash` race-guarded by a monotonic token so out-of-order async
results can't clobber a newer one. The Encode/Decode select goes in `IoPanel`'s `header-end` slot;
Swap/Sample go in the **single** `.tool-actions` row via `<ToolActions>`'s trailing `<slot/>`, so
paste/clear/swap/sample share one aligned row driven by `ToolActions`' delegated `[data-action]` handler.

**Adding a tool to an existing engine:** impl file + one `registry.ts` entry + `config.ts`
(`engine`/`pattern`/`family`/`processorId`) + a 3-line `Widget.astro` wrapping the engine widget +
optional guide/faq. `validate-registry.ts` enforces that the `processorId` resolves in the matching
registry. **Tests target the engine, not the tool** (`encoding.test.ts`, `hashing.test.ts`,
`structured-data.test.ts`) — tools are configuration, engines are behavior.

> **Date Engine (planned).** The Date & Time category follows this same engine-first shape — a
> primitive-first pure engine (`src/lib/engines/date/`) behind a single `ToyTools.runDateTool`
> resolver, driven by a descriptor-driven generic widget. See `docs/date-time-engine.md` for the
> full Phase F1 design.

## Simulation Platform (`src/lib/simulation/`)

The Physics Playground is a **domain-neutral simulation engine** designed to scale to thousands of
interactive simulators. It inverts the usual tool authoring flow: a simulator is **one declarative
manifest + one pure model** (+ optional custom renderer), and *every* site surface it needs
(`ToolConfig`, knowledge, FAQ, guide, SEO, relationships) is **derived at build time** from the
manifest. There are **no per-simulation `config.ts`/`knowledge.ts`/`faq.ts`/`Guide.astro`/
`Widget.astro` files** — generic components render any sim from its manifest.

**The two authored artifacts per sim** (under `src/lib/simulation/simulations/`):

- **`<id>.ts`** — the `SimulationDef` (pure model): `params`, `presets`, `init`/`step`,
  `measurements`, `formula`, `graph`, `observations`, `explanation`, `pointer`, and a `draw` imported
  from the sibling `<id>.draw.ts`. Models stay DOM-free (unit-testable); `*.draw.ts` owns all canvas
  work and is excluded from coverage. Register the model in `src/lib/simulation/plugins/physics/index.ts`.
- **`<id>.manifest.ts`** — the `SimulationManifest` (declarative content): metadata, concepts,
  equations, `educational` (intents/mistakes/use-cases), `seo`, `presentation`, `examples`, `faq`,
  `guide` (sections + mistakes), `relationships`; it spreads `params/presets/formula/paramBehavior/
  aspect` from the model. Register it in `src/lib/simulation/manifests.ts` (`MANIFESTS`).

**Derivation (no codegen, no generated files).** `src/lib/simulation/derived.ts` computes
`simulationTools`/`simulationKnowledge`/`simulationFaqsBySlug`/`simulationGuideSlugs` from
`MANIFESTS` at build time, the same way `categories.ts` derives its surfaces. These are **spread**
into `src/data/registry.ts`, `src/lib/knowledge/registry.ts`, `src/data/faq-registry.ts`, and
`guide-registry.ts`'s `registeredGuideSlugSet` (sims are **not** in the typed guide tuple, so the
guide-route drift check stays scoped to statically imported guides). The tool route renders
`SimulationWidget.astro` and the guide route renders `SimulationGuide.astro` for any tool whose slug
has a manifest.

**Auto-derived relationships.** `relations.ts` derives each sim's `usedWith`/`nextSteps` (and thus
`config.relatedTools`) from what manifests actually **share** — concepts, exposed quantities (param +
equation-variable labels), and family — with `nextSteps` following the difficulty progression and a
same-category fallback so no sim derives an empty list. `derived.ts` resolves these once across all
manifests; a manifest may still set an explicit `relationships` overlay to override. This is why the
manifests carry no hand-authored related-tool lists.

**Reusable libraries** (so sim #N reuses, never copy-pastes): `render/` (math, vector, angle, units
incl. `GAS_CONSTANT_R`, physics kernels `resolveCollision1D`/`kineticEnergy`/`springPotential`),
`graphs/` (`streamGraph`/`snapshotGraph`/`singleStream`/`singleSnapshot` builders), and `canvas.ts`
(`clear`/`drawGrid`/`drawArrow`/`drawLabel`). `contract.ts`'s `expectSimulation(def)` is run over the
whole registry by `contract.test.ts`, so a new sim is covered automatically; per-sim `<id>.test.ts`
holds only its numeric assertions.

**Plugin seam.** `SIMULATIONS` is composed from domain plugins (`composeDomains(DOMAINS)` in
`simulations/registry.ts`); physics is the first `SimulationDomain`. A second subject (chemistry,
electronics, ...) is a new `plugins/<domain>/` bundle added to `DOMAINS` with no engine changes.

**seo:gate for sims.** The seo-engine sidecar reads Guide/faq/config prose from disk, so
`scripts/emit-sim-seo-content.ts` renders synthetic content from each manifest into
`seo-engine/.sim-content/<slug>/` (gitignored) and `findToolDir` falls back there. Gate a sim with
`npm run seo:gate:sim -- <slug>` (emits + refreshes the content graph + gates). The gate's
intent/entity coverage is **lexical** (all declared key terms must appear as substrings), so manifest
prose must literally contain them.

**Adding a simulation:** author `<id>.ts` + `<id>.draw.ts` + `<id>.manifest.ts` (+ `<id>.test.ts`);
register the model in the physics plugin and the manifest in `MANIFESTS`; add the slug to the
`tests/e2e/physics.spec.ts` boot list; then `npm run map:generate`, `npm run seo:gate:sim -- <slug>`,
`npm run build`, `npm run test:e2e -- physics.spec.ts`. **Zero edits** to `registry.ts`/knowledge/faq/
guide registries. `family` is a free-form string (e.g. `electricity`); the `simulate` pattern already
has a category-section row.

## Platform Metadata & Manifests

- **Engine manifest** (`src/data/engines.ts`) — `engineRegistry` is the platform-level list of every
  engine: declared `patterns` (the authoritative allow-list) plus `supportedFamilies`/`toolCount`
  derived from the registry. `validate-registry` derives its KNOWN engines/patterns from here; a
  category's `engines` are derived from it too. Categories own engines; engines own tools.
- **Metadata contract** (`src/data/metadata.ts`) — `BaseToolMetadata` is the engine-agnostic view of
  a tool. `getToolMetadata()` **derives** it from `ToolConfig` (mapping `categorySlug → category`,
  `guide?.slug → guideSlug`, etc.) so configs are never rewritten and there is no second metadata
  system. Every tool — including the legacy productivity/calculator tools — exposes the full contract.
- **Content manifest** (`src/lib/content/manifest.ts`) — `buildContentManifest()` is the canonical
  registry-derived list of every indexable surface (home/tool/guide/faq/category/language). It is the
  single source the sitemap derives from; search and related-content can derive from it next.
- **Search prep** (`src/lib/search/`) — `buildSearchIndex()` produces a serializable index from the
  metadata contract. Architecture only; no UI yet.
- **Analytics contract** (`src/lib/analytics/events.ts`) — a frozen `AnalyticsEvents` vocabulary so
  engine interactions share event names instead of fragmenting per tool.

## Knowledge Graph & Relationship Engine (`src/lib/knowledge/`)

Phase D. A build-time relationship layer that lets every content item know what it relates to,
what it's used with, what comes next, and what alternatives exist — and auto-generates internal-
linking sections with zero per-page wiring. Built **on top of** the metadata contract and the
proven `getRelatedTools()` algorithm, not a second system.

- **Schema** (`types.ts`) — the `Knowledge` interface. Relationships are typed
  `RelationshipReference` objects (`slug` + optional `reason` + `strength`/`priority`), never bare
  slugs, so each edge carries a human reason (UI + semantic SEO) and a ranking weight. Concepts split
  into `primaryConcepts`/`secondaryConcepts`; `ContentType`/`RelationType` are **open** string models
  (constants, not closed unions) so new node/relation types need no code change; each tool declares a
  `workflowStage`. Every file carries `schemaVersion` (`KNOWLEDGE_SCHEMA_VERSION`) so V1/V2 coexist.
- **Co-located source** — each tool's `knowledge.ts` sits beside its `config.ts` and exports
  `const knowledge: Knowledge`. `src/lib/knowledge/registry.ts` is the explicit-import hub (mirrors
  `data/registry.ts`; not `import.meta.glob`, so tsx scripts + vitest + Astro all consume it).
- **Derive + overlay** (`graph.ts`) — `buildGraph()` produces tool/guide/faq/category nodes and edges.
  `relatedTools/Guides/Faqs` are **derived** from engine→pattern→family→category (reusing
  `getRelatedTools` + new `getRelatedGuides`/`getRelatedFaqs` in `src/lib/tools/related.ts`) with
  tier-based strength. `usedWith`/`alternatives`/`nextSteps` are **overlaid** from the knowledge file
  with their reason/strength/priority. So a new tool gets related content for free; authors add only
  the curated, non-derivable workflow edges.
- **Query APIs** (`queries.ts`) — `getKnowledgeFor`, `getRelatedTools|Guides|Faqs`, `getUsedWith`,
  `getAlternatives`, `getNextSteps`, `getTopicCluster`, `getWorkflow`. O(1) over a prebuilt adjacency
  map; sort = priority asc → strength desc → declared order; unknown slug → empty (never throws).
- **EntityMatcher** (`entity-matcher.ts`) — config-driven surface-form index (no hardcoded keyword
  lists) from primaryConcepts (100) / secondary+aliases (60) / name (80) / keywords (40).
  `getEntityMatches()` uses `\b` token-boundary matching with longest-match-then-highest-score
  disambiguation. **Returns matches only** — inline prose rewriting is deferred to Phase E.
- **Recommendations** (`recommendations.ts`) — task-oriented You-May-Also-Need / Next-Steps /
  Alternatives blocks from the overlay edges, with reason subtitles.
- **Components** (`src/components/knowledge/`) — `RelatedContent` (derived tools), `YouMayAlsoNeed`
  (curated workflow, only when a knowledge file exists), `ContinueLearning` (derived guides + FAQs).
  Wired once into `GuideLayout`/`FAQLayout`; they self-resolve from `toolSlug`. Id-less `<section>`s
  stay out of the guide TOC. Typography-first, capped, accessible — no cards/sidebars/spam.
- **Validation** (`scripts/validate-knowledge.ts`, in the build after `validate-registry`) — ERRORs
  on invalid shape, `schemaVersion` mismatch, slug/category mismatch, unresolved relationship target,
  or duplicate slug. WARNs on missing knowledge file (→ ERROR when `KNOWLEDGE_REQUIRED=true`), empty
  workflow links, and single-family recommendation bubbles (`diversity.ts`).
- **Diagnostics** — `scripts/knowledge-diagnostics.ts` writes `dist/knowledge-graph.json`
  (nodes/edges/coverage/density/orphans/brokenLinks) after build — "Search Console for the internal
  graph". `npm run health` prints a knowledge-coverage line.
- **Reserved Phase E (Semantic Discovery Engine)** — search suggestions, related searches, Typical
  Workflow blocks, topic hubs, collections, popular paths, and the deferred inline prose auto-linking
  will consume this layer with no schema migration.

## Content Intelligence Layer (`src/lib/content-intelligence/`)

Phase E1. Build-time, registry-driven analysis of the **whole content ecosystem** — coverage
gaps, category health, engine expansion opportunities, topic clusters, and a ranked roadmap. No
Search Console / Analytics / external APIs / UI; output is a set of generated JSON reports. Run
on demand via **`npm run intel`** (NOT in `npm run build`, so builds stay fast at scale).

- **Pure, injectable analyzers** — every analyzer is `fn(inputs: AnalyzerInputs)`, never reading
  module globals (same discipline as `buildGraph()`). `AnalyzerInputs` bundles tools, categories,
  engines, the knowledge graph, knowledge map, and the expansion taxonomy — plus an optional
  **`signals?: ExternalSignals`** seam (undefined in E1) so Search Console / Analytics can plug in
  later with no redesign. `index.ts` `defaultInputs()` wires the real registries; tests pass fixtures.
- **Expansion taxonomy** (`taxonomy.ts`) — the ONLY place tools are named: a hierarchical
  `engine → family → expected[]` registry. Analyzers derive `missing = expected − existing`; the
  analyzer logic itself is topic-agnostic ("no hardcoded topics"). Editing it is pure data work.
- **Analyzers** — `coverage.ts` (per-topic tool/guide/faq/related), `gaps.ts` (missing pieces +
  taxonomy missing-tools + category-missing-engine), `category-health.ts` (counts, avg
  relationships, 0–100 score), `engine-opportunities.ts` (taxonomy missing members + structural
  signals with no taxonomy), `clusters.ts` (cluster size, related topics, missing/non-reciprocal
  connections), `priorities.ts` (weighted `score` + `confidence` + machine `reasons[]` + human
  `explanation[]`), `ecosystem-health.ts` (platform-wide `ecosystemScore`).
- **Reports** → `dist/content-intelligence/latest/*.json` (gitignored, regenerated) + a versioned
  `index.json` (`INTELLIGENCE_SCHEMA_VERSION`) + a dated `snapshots/<YYYY-MM-DD>.json` for trend
  analysis. `scripts/content-intelligence.ts` is the writer (mirrors `knowledge-diagnostics.ts`).
- **Reserved Phase E2** — feed `ExternalSignals` (impressions/clicks/CTR/position) into
  `priorities.ts`; the branch already exists, dormant.

## Research Intelligence Engine (`src/lib/research/`)

Phase G. The **demand-side** counterpart to Content Intelligence: it discovers what real users
repeatedly need, scores those opportunities, detects the reusable engines that would serve them, and
emits a ranked roadmap + a fully-reasoned "next build" recommendation. Same discipline as
content-intelligence — pure analyzers over an injected `ResearchInputs`, registry-driven, never-throw,
deterministic. On demand via **`npm run research`** (NOT in `npm run build`). Full docs:
`docs/research-intelligence.md`; it powers the **`next-tool` skill** and the
**`research-intelligence` subagent**.

- **Providers** (`providers/`) — uniform `discover(ctx) → RawOpportunity[]`. The **seed-dataset**
  provider reads curated evidence from `research/datasets/*.json` (the CLI loads files; the library
  is filesystem-free). The other 15 (`reddit`, `github`, `autocomplete`, `mdn`, ...) are live-API
  **seams** that return `[]`; adding a real one is one import + one entry in `registry.ts`.
- **Unified Opportunity model** (`models/opportunity.ts`) — every provider normalizes into one schema;
  `id` is derived from `proposedTool` (deterministic). Eight 0..1 signal scorers (`scorers/`) blend
  into `finalScore` (0..100) via weights in `config.ts`.
- **Analyzers** (`analyzers/`) — `deduplicate` (Jaccard), `transformation` (the core: problems →
  reusable engine-agnostic transformations), `opportunity-score` (normalize + score), `engine-match`
  /`missing-engine` (reuse vs new-engine clusters), `cluster`, `topic-cluster` (the problem graph),
  `gaps` (classification vs the catalog), `trend`, `roadmap` (tiers + next-build). Pipeline in
  `pipeline.ts`; `index.ts` `defaultInputs()` wires the real registries, tests pass fixtures.
- **Taxonomy** (`taxonomy.ts`) — declarative `domain → transformation → expected[]` engine
  hypotheses (CSV, Date & Time), edited as data.
- **Reports** → `research/reports/*` (committed): `roadmap.md`, `next-build.md`, `opportunities.json`,
  `top-opportunities.json`, `missing-engines.json`, `clusters.json`, `trends.json`, `graph.json`,
  `opportunities.csv`, `index.json` + dated `snapshots/`. Validated by `validate.ts` before any write.
- **Standing rule** — "what should we build next?" always routes through the RIE (see `CLAUDE.md`).

## Sitemap (`src/lib/sitemap/` + `src/pages/sitemaps/`)

Registry-driven, not `@astrojs/sitemap`. `src/pages/sitemap-index.xml.ts` emits a sitemap **index**
(filename preserved so `robots.txt`, the astro.config `seoValidator`, and quality-guardian
build-integrity keep working), referencing five semantic buckets under `src/pages/sitemaps/`:
`tools.xml`, `guides.xml`, `faqs.xml`, `categories.xml` (+ home), `languages.xml`. Each endpoint
filters `buildContentManifest()` by type and renders via `src/lib/sitemap/render.ts`, building
absolute, trailing-slashed `<loc>`s as `new URL(withBase(path), Astro.site)`. `quality-guardian`'s
sitemap validator scans `dist/sitemaps/` for route coverage. New tools/guides/faqs appear in the
sitemap automatically — no sitemap edits.

## Architecture Diagram (`/architecture/`)

`src/pages/architecture.astro` is a deployed, **registry-derived** interactive map of the whole
platform — built entirely at build time from `categories`, `engineRegistry`, `tools`, and the
knowledge `graph`, so adding a tool or engine updates it with **zero hand-maintenance** (same ethos
as the sitemap). The canvas is a clean overview (Platform → Categories → Engines, plus the
cross-cutting layers Registry / Runtime / Knowledge Graph / Content Intelligence / Sitemap); the
dotted **engine↔engine links are aggregated from the knowledge-graph edges** (a tool in one engine
referencing a tool in another). Per-tool detail is intentionally kept off the canvas and surfaced in
a click-to-reveal side panel (description, source path, patterns/families, tools, related engines).

- Rendered client-side with **Mermaid** (a dependency, bundled only on this page — no runtime CDN),
  `securityLevel: 'loose'` so `click <node> call archClick(...)` drives the panel. The diagram source
  and a `nodeInfo` JSON payload are embedded in the page; the script re-renders on dark-mode toggle.
- `noindex,follow`, `maxWidth="full"`, mobile-first (panel stacks below the canvas under 1024px),
  token-driven. Not in the nav or sitemap (internal overview, reached by URL) — same posture as
  `/search`. Mermaid class names must stay hyphen-free (category slugs are mapped via `catClass()`).

---

## Registration Pattern

Every tool requires exactly two registration steps:

1. **`src/data/registry.ts`** — one import + one array entry
2. **`src/pages/tool/[category]/[slug].astro`** — already glob-based (`../../../tools/*/*/Widget.astro`), no change needed for new tools

For guides: add a static import in `src/pages/guide/[...slug].astro`.
For FAQs: add an import in `src/data/faq-registry.ts`.
For knowledge: add `knowledge.ts` beside `config.ts` and one import + entry in
`src/lib/knowledge/registry.ts`. Derived related tools/guides/FAQs are automatic; author only the
overlay fields (`usedWith`/`alternatives`/`nextSteps`, concepts, `workflowStage`). Missing knowledge
WARNs; invalid knowledge fails the build.

---

## Build & Verification

```sh
npm run build    # validate-registry (metadata + reference integrity) + Astro + TS strict — must pass before any PR
npm run health   # post-build platform integrity superset (metadata, manifests, search index, sitemap output)
npm run test     # vitest — engine-level tests (encoding/hashing/structured-data/manifest/metadata/search/sitemap)
npm run dev      # dev server at localhost:4321
```

No separate lint or test command. The build is the single verification step.

## E2E Testing (`tests/e2e/`)

Browser-level verification with **Playwright Test** (`@playwright/test`). This is a
**unified, registry-driven platform framework**, not a per-tool script — the developer
tools are the pilot deep suite, and every current and future tool gets generic smoke
coverage for free. E2E is a local/CI layer, deliberately **not** wired into `npm run build`.

```sh
npm run test:e2e          # headless; webServer builds + serves dist, runs all projects
npm run test:e2e:headed   # watch the real browser run
npm run test:e2e:ui       # interactive time-travel dashboard (pick/step tests)
npm run test:e2e:report   # open the saved interactive HTML report (with traces)
```

- **Config** (`playwright.config.ts`): `webServer` runs `npm run build && npm run preview`
  and waits, so the command is turnkey. Two projects — **chromium** (Desktop Chrome) and
  **pixel5** (Pixel 5); ToyTools is mobile-first, so every spec runs on both. Reporters:
  `html` (interactive dashboard) + `list` (console) + `json` (`playwright-report/results.json`,
  archivable). `trace: 'retain-on-failure'` → replay failures in the Trace Viewer.
- **Helpers** (`tests/e2e/helpers/tools.ts`): `toolPaths()` reads the **built** sitemap
  (`dist/sitemaps/tools.xml`) for every tool's path — decoupling tests from source path-aliases
  (`@tools`) so coverage tracks the registry automatically. `DevTool` is a viewport-agnostic
  page object (locates by role/label/id) for the developer-engine widgets.
- **Specs**: `smoke.spec.ts` (every tool — render + accessibility + interaction + console/page-error
  hardening), `dev-tools.spec.ts` (the 9 developer tools — functional assertions), `performance.spec.ts`
  (navigation-timing guardrails), `integrity.spec.ts` (registry/sitemap structural integrity).
- **Non-goals**: no screenshot/visual-regression/pixel-diff tooling (Percy/Chromatic/image-snapshot) —
  behavior, accessibility, and metadata integrity deliver higher ROI at this scale.

Chromium is already cached locally, so no `npx playwright install` browser download is needed.
