# ToyTools

Tiny tools for everyday problems.

Live at **[atharvamahamuni.github.io/toytools](https://atharvamahamuni.github.io/toytools)**

---

## Architecture

Static site built with [Astro](https://astro.build). Every page is pre-rendered at build time — no server, no database, no client-side framework.

```
src/
  tools/          # One directory per tool (config, Widget, faq, Guide)
    _shared/      # Reusable widget sub-components (ToolSection, ToolAction)
  components/     # Nav, SearchBar, ToolCard, BackButton, ToyToolsRuntime, ...
  data/           # registry.ts (single source of truth), categories.ts, types.ts
  layouts/        # BaseLayout, ToolLayout, FAQLayout, GuideLayout
  pages/          # index, tools/[category]/[slug], categories/[slug], faq/[...slug], guide/[...slug], 404
  styles/         # tokens.css, tool-widget.css, reset.css, global.css
  lib/            # withBase() path helper, storage.ts (docs)
```

Design system: CSS custom properties only. One `--color-accent` token controls all accent usage. Dark mode via `prefers-color-scheme` + a localStorage toggle. Zero JS frameworks shipped to the client.

---

## How It Works

### Adding a tool (2 steps)

1. Create `src/tools/<slug>/config.ts` and `Widget.astro` with the tool's metadata and UI
2. Add one import line and one array entry in `src/data/registry.ts`

The tool page, category listing, search, and homepage update automatically at build time.

### Removing a tool (2 steps)

1. Delete `src/tools/<slug>/`
2. Remove the import and array entry from `src/data/registry.ts`

### Adding a guide or FAQ

Set `guide:` or `faq:` in `config.ts`, then create `Guide.astro` or `faq.ts` in the tool directory.
- New FAQ: add an import to `src/data/faq-registry.ts`
- New guide: add a static import to `src/pages/guide/[...slug].astro`

### Routing

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/tools/[category]/[slug]` | `src/pages/tools/[category]/[slug].astro` (glob dispatcher) |
| `/categories/[slug]` | `src/pages/categories/[slug].astro` |
| `/faq/[...slug]` | `src/pages/faq/[...slug].astro` (dynamic, driven by registry) |
| `/guide/[...slug]` | `src/pages/guide/[...slug].astro` (dynamic, driven by registry) |
| `/search` | `src/pages/search.astro` |
| `/404` | `src/pages/404.astro` |

### Widget page flow

Each `Widget.astro` owns its own page flow (below the tool header rendered by `ToolLayout`). Shared sub-components in `src/tools/_shared/` provide common markup patterns.

### Shared client runtime

`ToyToolsRuntime.astro` is inlined once in `BaseLayout`. It exposes `window.ToyTools` for use in all Widget inline scripts:
- `ToyTools.toast(msg)` — global toast
- `ToyTools.storage.get/set/clear(key)` — localStorage helpers (50 KB cap)
- `ToyTools.copy(text)` — clipboard copy with toast feedback

---

## Project Vision

A platform for small, fast, focused utility tools. Each tool solves exactly one problem. No accounts. No tracking. No upsells.

Design principles (frozen):

- **Clarity over delight** — the interface disappears behind the tool
- **Mobile first** — thumb-reachable actions, 48px minimum touch targets, ← Back button on every screen
- **Performance is a feature** — HTML + CSS + minimal JS, no heavy bundles
- **Token-driven** — change one CSS variable to retheme the entire platform

---

## Development Setup

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # static output → dist/
npm run preview    # serve dist/ locally
```

**Building for GitHub Pages** (base path `/toytools`):

```sh
ASTRO_SITE=https://atharvamahamuni.github.io \
ASTRO_BASE_PATH=/toytools \
npm run build
```

Deployment is automatic via `.github/workflows/deploy.yml` on every push to `main`.

---

## Current Tools (7)

- Word Counter
- Case Converter
- Percentage Calculator
- Todo List
- Notepad
- Keep Screen Awake
- Base64 Encoder / Decoder

---

## Roadmap

**Planned**
- JSON Formatter
- URL Encoder / Decoder
- Markdown Preview
- Color Converter
- Unix Timestamp Converter
- Lorem Ipsum Generator
- Regex Tester
- Diff Checker
